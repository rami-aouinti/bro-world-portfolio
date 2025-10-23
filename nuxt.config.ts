import type { PluginOption, ResolvedConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import vuetify from "vite-plugin-vuetify";
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
    selectorSafelist.push(entry);
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
      const files = await fg(content, { cwd: rootDir, absolute: true });

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
export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Mohamed Rami Aouinti | Backend Developer (PHP & Symfony)'
    }
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    "@nuxt/image",
    "nuxt-gtag",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "motion-v/nuxt",
    "lenis/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "nuxt-llms",
  ],
  plugins: [
    "~/plugins/vuetify",
  ],

  css: [
    "vuetify/styles",
    "~/assets/styles/flag-icons.scss",
    "~/assets/styles/material-dashboard.scss",
    "~/assets/styles/index.css",
  ],

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
      Poppins: [300, 400, 500, 600, 700], 
    },
    display: 'swap', 
  },

  routeRules: {
    "/": { isr: 60 },
    "/about": { isr: 300 },
    "/contact": { isr: 300 },
    "/help": { isr: 300 },
    "/api/auth/**": {
      // Auth endpoints need to write cookies, avoid SWR background cache.
      cache: false,
    },
    "/api/**": { swr: 60 },
    "/_nuxt/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/_ipx/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/img/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/icons/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/scripts/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/*.{png,svg,webp,ico}": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  },

  ui: {
    icons: ["heroicons", "lucide"],
    safelistColors: ["primary", "red", "orange", "green"],
  },

  experimental: {
    typedPages: true,
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  typescript: {
    shim: false,
    strict: true,
  },

  vue: {
    propsDestructure: true,
  },

  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
        prefersColorScheme: true,
        prefersColorSchemeOptions: {},
        reloadOnFirstRequest: true,
      },
    },
  },

  image: {
    format: ["webp", "avif"],
    dir: "public",
    domains: [
      "images.unsplash.com",
      "bro-world-space.com",
      "bro-world.org",
      "avatars.githubusercontent.com",
    ],
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
    },
    quality: 80,
    ipx: {
      dir: "public",
      allowFiles: true,
      domains: [
        "images.unsplash.com",
        "bro-world-space.com",
        "bro-world.org",
        "avatars.githubusercontent.com",
      ],
    },
    presets: {
      lcp: {
        modifiers: {
          format: "webp",
          quality: 80,
        },
      },
    },
  },

  ignore: ["components/**/index.ts", "components/**/shaders.ts", "components/**/types.ts"],


  eslint: {
    config: {
      standalone: false,
    },
  },

  llms: {
    domain: "https://broworld.com/",
    title: "BroWorld",
    description:
        "BroWorld is a free and open-source Vue.js component library that provides a collection of beautiful and customizable components for building modern web applications.",
    full: {
      title: "BroWorld Documentation",
      description: "The complete BroWorld documentation.",
    },
  },
  gtag: {
    initMode: "manual",
    loadingStrategy: "defer",
  },
  fonts: {
    defaults: {
      preload: true,
      styles: ["normal"],
      subsets: ["latin"],
      weights: [400, 600],
    },
    families: [
      {
        name: "Plus Jakarta Sans",
        provider: "google",
      },
      {
        name: "Space Grotesk",
        provider: "google",
      },
      {
        name: "JetBrains Mono",
        provider: "google",
      },
    ],
    provider: "google",
    providers: {
      bunny: false,
      fontshare: false,
      fontsource: false,
      googleicons: false,
    },
  },
})