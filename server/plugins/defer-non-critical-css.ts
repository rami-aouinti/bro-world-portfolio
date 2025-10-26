import { defineNitroPlugin } from "#imports";
import type { NitroRenderHtmlContext } from "nitropack";

const LINK_TAG_REGEX = /^<link\b/i;
const REL_STYLESHEET_REGEX = /\brel=(?:"|')stylesheet(?:"|')/i;
const HREF_REGEX = /\bhref=("|')([^"']+)(\1)/i;
const CRITICAL_MARKER_REGEX = /data-(?:nuxt-)?critical/i;
const ENTRY_STYLESHEET_REGEX = /\/entry\.[^/]+\.css$/i;

function parseAttributes(tag: string): Map<string, string> {
  const attributes = new Map<string, string>();
  const ATTRIBUTE_REGEX = /([\w:-]+)=("|')([^"']*)(\2)/g;
  let match: RegExpExecArray | null;

  while ((match = ATTRIBUTE_REGEX.exec(tag)) !== null) {
    const [, name, , value] = match;
    attributes.set(name, value);
  }

  return attributes;
}

function serializeAttributes(attributes: Map<string, string>): string {
  return Array.from(attributes.entries())
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

function isStylesheetLinkTag(tag: string): boolean {
  return LINK_TAG_REGEX.test(tag) && REL_STYLESHEET_REGEX.test(tag);
}

function isCriticalStylesheet(tag: string, href: string | null): boolean {
  if (!href) {
    return true;
  }

  if (CRITICAL_MARKER_REGEX.test(tag)) {
    return true;
  }

  if (!href.startsWith("/_nuxt/")) {
    return true;
  }

  if (ENTRY_STYLESHEET_REGEX.test(href)) {
    return true;
  }

  return false;
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html: NitroRenderHtmlContext) => {
    const transformedHead: string[] = [];

    for (const element of html.head) {
      if (!isStylesheetLinkTag(element)) {
        transformedHead.push(element);
        continue;
      }

      const hrefMatch = element.match(HREF_REGEX);
      const href = hrefMatch ? hrefMatch[2] : null;

      if (isCriticalStylesheet(element, href)) {
        transformedHead.push(element);
        continue;
      }

      if (!href) {
        transformedHead.push(element);
        continue;
      }

      const attributes = parseAttributes(element);
      attributes.delete("rel");
      attributes.delete("as");
      attributes.delete("onload");

      const serializedAttributes = serializeAttributes(attributes);
      const attributeString = serializedAttributes.length > 0 ? ` ${serializedAttributes}` : "";

      const preloadTag = `<link rel="preload" as="style"${attributeString} onload="this.onload=null;this.rel='stylesheet'" data-deferred-style="true" />`;
      const noscriptTag = `<noscript><link rel="stylesheet"${attributeString} data-deferred-style="true" /></noscript>`;

      transformedHead.push(preloadTag, noscriptTag);
    }

    html.head = transformedHead;
  });
});
