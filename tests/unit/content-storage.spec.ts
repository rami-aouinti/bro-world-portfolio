import { beforeEach, describe, expect, it, vi } from "vitest";
import { readContent } from "~/server/utils/content-storage";
import { DEFAULT_CONTENT } from "~/utils/content";
import { DEFAULT_LOCALE } from "~/utils/i18n/locales";
import { __resetStorages, useStorage } from "#imports";

describe("readContent", () => {
  const slug = "work";
  const locale = DEFAULT_LOCALE;
  const key = `${locale}/${slug}.json`;

  beforeEach(async () => {
    __resetStorages();
  });

  it("repairs invalid stored data", async () => {
    const storage = useStorage("content");
    await storage.setItem(key, { invalid: "data" });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const data = await readContent(slug, locale);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Impossible de valider le bloc “${slug}”.`,
      expect.anything(),
    );
    expect(data).toEqual(DEFAULT_CONTENT[locale][slug]);
    expect(await storage.getItem(key)).toEqual(DEFAULT_CONTENT[locale][slug]);

    consoleSpy.mockRestore();
  });
});
