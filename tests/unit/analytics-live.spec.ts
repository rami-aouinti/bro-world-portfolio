import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const mockStorage = () => {
  const map = new Map<string, any>();
  return {
    async getItem(key: string) {
      return map.get(key);
    },
    async setItem(key: string, value: any) {
      map.set(key, value);
    },
  };
};

vi.mock("h3", () => ({
  defineEventHandler: (handler: any) => handler,
  getQuery: (event: { node?: { req?: { url?: string } } }) => {
    const url = event?.node?.req?.url ?? "";
    const queryString = url.split("?")[1] ?? "";
    return Object.fromEntries(new URLSearchParams(queryString));
  },
}));

describe("GET /api/analytics/live", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("useRuntimeConfig", () => ({
      analytics: {
        cacheTtl: 30,
        vercel: { token: "token", projectId: "project" },
        speedInsights: { token: "token", projectId: "project" },
      },
    }));
    const storage = mockStorage();
    vi.stubGlobal("useStorage", () => storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.fetch = originalFetch;
  });

  it("returns mock data when upstream requests fail", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    globalThis.fetch = fetchMock as typeof globalThis.fetch;

    const handler = (await import("~/server/api/analytics/live.get"))?.default;

    const event = {
      node: {
        req: {
          url: "/api/analytics/live?range=30d",
          headers: {},
        },
      },
    } as any;

    const result = await handler(event);

    expect(result.range).toBe("30d");
    expect(result.series.length).toBeGreaterThan(0);
    expect(result.totals.visitors.current).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const cached = await handler(event);
    expect(cached).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
