import { promises as fs, type Dirent } from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

import tailwindcss from "@tailwindcss/vite";
import { normalizePath, type PluginOption, type ResolvedConfig } from "vite";
import compression from "vite-plugin-compression";
import vuetify from "vite-plugin-vuetify";

const require = createRequire(import.meta.url);
const dayjsEsmIndexPath = normalizePath(require.resolve("dayjs/esm/index.js"));
const dayjsEsmDir = path.dirname(dayjsEsmIndexPath);

function resolvePath(...segments: string[]): string {
  return path.resolve(...segments);
}

const CLASS_ATTRIBUTE_REGEX = /class(?:Name)?\s*=\s*(["'`])([^"'`]*?)\1/g;
const DYNAMIC_CLASS_OBJECT_REGEX = /['"`]([^'"`{}]+?)['"`]\s*:/g;
const ARRAY_CLASS_REGEX = /['"`]([^'"`\s]+?)['"`]/g;

function extractClassCandidates(source: string): string[] {
  const candidates = new Set<string>();

  let attributeMatch: RegExpExecArray | null;
  while ((attributeMatch = CLASS_ATTRIBUTE_REGEX.exec(source)) !== null) {
    for (const token of attributeMatch[2].split(/\s+/g)) {
      const normalized = normalizeCandidate(token);
      if (normalized) {
        candidates.add(normalized);
        candidates.add(unescapeCandidate(normalized));
      }
    }
  }

  let objectMatch: RegExpExecArray | null;
  while ((objectMatch = DYNAMIC_CLASS_OBJECT_REGEX.exec(source)) !== null) {
    const normalized = normalizeCandidate(objectMatch[1]);
    if (normalized) {
      candidates.add(normalized);
      candidates.add(unescapeCandidate(normalized));
    }
  }

  let arrayMatch: RegExpExecArray | null;
  while ((arrayMatch = ARRAY_CLASS_REGEX.exec(source)) !== null) {
    const normalized = normalizeCandidate(arrayMatch[1]);
    if (normalized) {
      candidates.add(normalized);
      candidates.add(unescapeCandidate(normalized));
    }
  }

  return Array.from(candidates);
}

function normalizeCandidate(candidate: string): string | null {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  const sanitized = trimmed.replace(/^['"`]|['"`]$/g, "");

  if (!sanitized) {
    return null;
  }

  return sanitized;
}

function unescapeCandidate(candidate: string): string {
  return candidate.replace(/\\:/g, ":").replace(/\\\//g, "/");
}

function purgeCss(css: string, usedClasses: Set<string>, selectorSafelist: RegExp[]): string {
  let result = "";
  let index = 0;

  while (index < css.length) {
    const openBrace = css.indexOf("{", index);
    if (openBrace === -1) {
      result += css.slice(index);
      break;
    }

    const selector = css.slice(index, openBrace).trim();
    const closeBrace = findMatchingBrace(css, openBrace);
    if (closeBrace === -1) {
      result += css.slice(index);
      break;
    }

    const blockContent = css.slice(openBrace + 1, closeBrace);

    if (selector.startsWith("@")) {
      const purgedBlock = purgeCss(blockContent, usedClasses, selectorSafelist);
      if (purgedBlock.trim().length > 0 || !selector.startsWith("@media")) {
        result += `${selector}{${purgedBlock}}`;
      }
    } else if (shouldKeepRule(selector, usedClasses, selectorSafelist)) {
      result += `${selector}{${blockContent}}`;
    }

    index = closeBrace + 1;
  }

  return result;
}

function shouldKeepRule(
  selector: string,
  usedClasses: Set<string>,
  selectorSafelist: RegExp[],
): boolean {
  const selectors = selector
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!selectors.length) {
    return false;
  }

  return selectors.some((singleSelector) => {
    if (selectorSafelist.some((pattern) => pattern.test(singleSelector))) {
      return true;
    }

    const classMatches = singleSelector.match(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g);

    if (!classMatches) {
      return true;
    }

    return classMatches.some((match) => {
      const className = match.slice(1);
      const normalized = unescapeCandidate(className);
      return usedClasses.has(className) || usedClasses.has(normalized);
    });
  });
}

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    const character = source[index];
    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

async function expandGlobs(patterns: string[], rootDir: string): Promise<string[]> {
  const files = new Set<string>();

  for (const pattern of patterns) {
    if (!pattern.includes("*")) {
      const absolutePath = path.resolve(rootDir, pattern);
      try {
        const stats = await fs.stat(absolutePath);
        if (stats.isFile()) {
          files.add(absolutePath);
        }
      } catch {
        // Ignore missing files
      }
      continue;
    }

    const parsedPattern = parseGlobPattern(pattern);
    if (!parsedPattern) {
      continue;
    }

    const { baseDir, extensions } = parsedPattern;
    try {
      const absoluteBase = path.resolve(rootDir, baseDir);
      const stats = await fs.stat(absoluteBase);
      if (!stats.isDirectory()) {
        continue;
      }

      await walkDirectory(absoluteBase, extensions, files);
    } catch {
      // Ignore directories that cannot be read
    }
  }

  return Array.from(files);
}

function parseGlobPattern(pattern: string): {
  baseDir: string;
  extensions: Set<string> | null;
} | null {
  const normalizedPattern = pattern.replace(/\\/g, "/");
  const splitIndex = normalizedPattern.indexOf("**/");

  if (splitIndex === -1) {
    return null;
  }

  const baseDir = normalizedPattern.slice(0, splitIndex).replace(/\/$/, "") || ".";
  const filePattern = normalizedPattern.slice(splitIndex + 3);

  if (!filePattern || filePattern === "*") {
    return { baseDir, extensions: null };
  }

  if (filePattern.startsWith("*.")) {
    const extensionPart = filePattern.slice(2);
    if (extensionPart.startsWith("{") && extensionPart.endsWith("}")) {
      const extensions = extensionPart
        .slice(1, -1)
        .split(",")
        .map((value) => value.trim().replace(/^[.]/, ""))
        .filter(Boolean);
      return { baseDir, extensions: new Set(extensions) };
    }

    return { baseDir, extensions: new Set([extensionPart.replace(/^[.]/, "")]) };
  }

  return { baseDir, extensions: null };
}

async function walkDirectory(
  directory: string,
  extensions: Set<string> | null,
  files: Set<string>,
): Promise<void> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walkDirectory(fullPath, extensions, files);
      } else if (entry.isFile()) {
        const extension = getExtension(entry.name);
        if (!extensions || extensions.has(extension)) {
          files.add(fullPath);
        }
      }
    }),
  );
}

function getExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }

  return filename.slice(dotIndex + 1);
}

type SafelistEntry = string | RegExp;
const vuetifyPlugin = vuetify({
  autoImport: false,
  styles: {
    configFile: "assets/styles/settings.scss",
  },
}) as PluginOption | PluginOption[];
function createDayjsEsmResolver(): PluginOption {
  function stripJsExtension(specifier: string): string {
    return specifier.replace(/\.(?:mjs|cjs|js)$/i, "");
  }

  return {
    name: "dayjs-esm-resolver",
    enforce: "pre",
    resolveId(source) {
      if (source === "dayjs" || source === "dayjs/esm" || source === "dayjs/esm/index.js") {
        return dayjsEsmIndexPath;
      }

      if (source.startsWith("dayjs/plugin/")) {
        const pluginName = stripJsExtension(source.slice("dayjs/plugin/".length));
        return normalizePath(resolvePath(dayjsEsmDir, "plugin", pluginName, "index.js"));
      }

      if (source.startsWith("dayjs/locale/")) {
        const localeName = stripJsExtension(source.slice("dayjs/locale/".length));
        return normalizePath(resolvePath(dayjsEsmDir, "locale", `${localeName}.js`));
      }

      return null;
    },
  };
}

export function simplePurgeCssPlugin(options: SimplePurgeCssOptions): PluginOption {
  const { content, safelist = {}, include = /material-dashboard/i } = options;
  const usedClasses = new Set<string>();
  const selectorSafelist: RegExp[] = [];
  const normalizedStandard = new Set<string>();

  for (const entry of safelist.standard ?? []) {
    if (typeof entry === "string") {
      normalizedStandard.add(entry);
      normalizedStandard.add(entry.replace(/\\:/g, ":").replace(/\\\//g, "/"));
    } else {
      selectorSafelist.push(entry);
    }
  }

  for (const entry of safelist.deep ?? []) {
    selectorSafelist.push(entry);
  }

  for (const entry of safelist.greedy ?? []) {
    selectorSafelist.push(entry);
  }

  let resolvedConfig: ResolvedConfig | null = null;

  return {
    name: "vite-plugin-simple-purgecss",
    apply: "build",
    configResolved(config) {
      resolvedConfig = config;
    },
    async buildStart() {
      if (!content.length) {
        return;
      }

      const rootDir = resolvedConfig?.root ?? process.cwd();
      const files = await expandGlobs(content, rootDir);

      await Promise.all(
        files.map(async (file) => {
          try {
            const source = await fs.readFile(file, "utf8");
            for (const token of extractClassCandidates(source)) {
              usedClasses.add(token);
            }
          } catch (error) {
            this.warn(
              `simple-purgecss: unable to read ${path.relative(rootDir, file)} - ${(error as Error).message}`,
            );
          }
        }),
      );

      for (const entry of normalizedStandard) {
        usedClasses.add(entry);
      }
    },
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "asset" || typeof chunk.source === "undefined") {
          continue;
        }

        if (typeof chunk.source !== "string" && !(chunk.source instanceof Uint8Array)) {
          continue;
        }

        if (!chunk.fileName.endsWith(".css")) {
          continue;
        }

        const rawSource =
          typeof chunk.source === "string"
            ? chunk.source
            : Buffer.from(chunk.source).toString("utf8");
        if (!include.test(chunk.fileName) && !/Vuetify Material Dashboard/i.test(rawSource)) {
          continue;
        }

        const purged = purgeCss(rawSource, usedClasses, selectorSafelist);
        chunk.source = purged;
      }
    },
  };
}

export interface SimplePurgeCssOptions {
  content: string[];
  safelist?: {
    standard?: SafelistEntry[];
    deep?: RegExp[];
    greedy?: RegExp[];
  };
  include?: RegExp;
}

// https://nuxt.com/docs/api/configuration/nuxt-config
const sessionCookieName = process.env.SESSION_COOKIE_NAME || "bro_world_session";
const csrfCookieName = process.env.CSRF_COOKIE_NAME || "bro_world_csrf";

export default defineNuxtConfig({
  compatibilityDate: "2025-10-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "nuxt-gtag",
    "@nuxt/ui",
    "shadcn-nuxt",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "motion-v/nuxt",
    "lenis/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "nuxt-llms",
  ],
  plugins: ["~/plugins/vuetify"],

  css: [
    "vuetify/styles",
    "~/assets/styles/flag-icons.scss",
    "~/assets/styles/material-dashboard.scss",
    "~/assets/styles/index.css",
  ],

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [
      createDayjsEsmResolver(),
      ...(Array.isArray(vuetifyPlugin) ? vuetifyPlugin : [vuetifyPlugin]),
      tailwindcss(),
      simplePurgeCssPlugin({
        content: [
          "app.vue",
          "app.config.ts",
          "components/**/*.{vue,js,ts}",
          "layouts/**/*.vue",
          "pages/**/*.vue",
          "composables/**/*.{js,ts}",
          "content/**/*.{md,mdx,json,yml,yaml}",
          "lib/**/*.{js,ts,vue}",
          "plugins/**/*.{js,ts}",
          "stores/**/*.{js,ts}",
        ],
        safelist: {
          standard: ["dark", "rtl", "ltr", "text-align-auto", "nuxt-loading-indicator"],
          deep: [
            /^v-/, // Vuetify utility classes
            /^d-/, // display utilities
            /^pa[trblxy]?-/,
            /^ma[trblxy]?-/,
            /^ga-/, // gap utilities
            /^text-/, // typography utilities
            /^bg-/, // background helpers
            /^elevation-/,
            /^rounded/,
            /^border-/,
            /-enter$/, // transition classes
            /-leave$/,
            /-leave-active$/,
            /-move$/,
            /^col-/,
            /^row-/,
            /^order-/,
            /^offset-/,
            /^justify-/,
            /^items-/,
            /^content-/,
            /^flex-/,
            /^grid-/,
            /^gap-/,
            /^min-/,
            /^max-/,
            /^w-/,
            /^h-/,
            /^z-/,
            /^shadow-/,
            /^opacity-/,
            /^transition-/,
            /^duration-/,
            /^ease-/,
            /^delay-/,
            /^animate-/,
          ],
          greedy: [
            /\\:/, // Tailwind responsive prefixes (sm:, md:, ...)
            /\\\//, // Fraction based utilities (w-1\/2, etc.)
          ],
        },
      }),
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
        threshold: 1024,
        deleteOriginFile: false,
      }),
      compression({
        algorithm: "gzip",
        ext: ".gz",
        threshold: 1024,
        deleteOriginFile: false,
      }),
    ],
    build: {
      optimizeCSS: true,
      target: "es2022",
      splitChunks: {
        layouts: true,
        pages: true,
        commons: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vuetify: ["vuetify"],
            vendor: ["vue", "vue-router", "pinia"],
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
  },
  googleFonts: {
    families: {
      Poppins: [400, 600, 700],
    },
    subsets: ["latin"],
    display: "swap",
    download: true,
    preload: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },

  app: {
    head: {
      title: "Mohamed Rami Aouinti | Backend & DevOps Engineer (PHP, Symfony, Shopware)",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          key: "description",
          name: "description",
          content:
            "Portfolio of Mohamed Rami Aouinti, a backend & DevOps engineer building resilient Symfony, Shopware, and API Platform solutions.",
        },
        {
          key: "og:description",
          property: "og:description",
          content:
            "Portfolio of Mohamed Rami Aouinti, a backend & DevOps engineer building resilient Symfony, Shopware, and API Platform solutions.",
        },
        {
          key: "twitter:description",
          name: "twitter:description",
          content:
            "Portfolio of Mohamed Rami Aouinti, a backend & DevOps engineer building resilient Symfony, Shopware, and API Platform solutions.",
        },
        {
          name: "google-adsense-account",
          content: process.env.NUXT_ADSENSE_ACCOUNT,
        },
      ],
    },
    baseURL: process.env.NODE_ENV === "development" ? "/" : "/docs/",
  },
  i18n: {
    lazy: true,
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      // Ensure the language selected by the user is kept when navigating
      // across the app by avoiding repeated locale re-detections.
      alwaysRedirect: false,
      fallbackLocale: "en",
    },
    locales: [
      { code: "en", name: "English", iso: "en-US", icon: "fi-gb gb", file: "en.json" },
      { code: "de", name: "Deutsch", iso: "de-DE", icon: "fi-de de", file: "de.json" },
      { code: "fr", name: "Frensh", iso: "fr-FR", icon: "fi-fr fr", file: "fr.json" },
      { code: "ar", name: "Arabic", iso: "tn-TN", icon: "fi-tn tn", file: "ar.json" },
      { code: "it", name: "Italian", iso: "it-IT", icon: "fi-it it", file: "it.json" },
      { code: "es", name: "Spanish", iso: "es-ES", icon: "fi-es es", file: "es.json" },
      { code: "ru", name: "Russian", iso: "ru-RU", icon: "fi-ru ru", file: "ru.json" },
    ],
    baseUrl: "https://rami.aouinti.com",
    bundle: {
      optimizeTranslationDirective: false,
    },
    vueI18n: "./i18n/i18n.config.ts",
  },

  runtimeConfig: {
    auth: {
      sessionCookieName,
      csrfCookieName,
      sessionMaxAge: Number.parseInt(process.env.SESSION_MAX_AGE ?? "", 10) || 60 * 60 * 24,
    },
    githubToken: process.env.GITHUB_TOKEN,
    admin: {
      defaultEmail: process.env.ADMIN_EMAIL || "admin@example.com",
      defaultPassword: process.env.ADMIN_PASSWORD || "ChangeMe123!",
    },
    redis: {
      url: process.env.REDIS_URL,
      ttl: Number.parseInt(process.env.REDIS_CACHE_TTL ?? "", 10) || 60 * 15,
    },
    workflow: {
      endpoint: process.env.WORKFLOW_ENDPOINT,
      apiKey: process.env.WORKFLOW_API_KEY,
    },
    public: {
      auth: {
        csrfCookieName,
      },
      githubUsername: process.env.GITHUB_USERNAME || "rami-aouinti",
    },
  },
  nitro: {
    routeRules: {
      "/_vercel/image/**": {
        headers: {
          "cache-control": [
            "public",
            "max-age=31536000",
            "s-maxage=31536000",
            "stale-while-revalidate=86400",
            "immutable",
          ].join(", "),
        },
      },
    },
  },
});
