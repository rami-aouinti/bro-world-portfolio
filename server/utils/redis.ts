import Redis from "ioredis";
import { useRuntimeConfig } from "#imports";

const DEFAULT_CACHE_TTL = 60 * 15; // 15 minutes

type RuntimeConfig = ReturnType<typeof useRuntimeConfig>;

function getRuntimeConfig(): Partial<RuntimeConfig> {
  try {
    return useRuntimeConfig();
  } catch {
    return {};
  }
}

let cachedClient: Redis | null = null;
let isDisabled = false;

function resolveRedisUrl(): string | null {
  const { redis } = getRuntimeConfig();
  const url = typeof redis?.url === "string" ? redis.url.trim() : "";
  return url.length > 0 ? url : null;
}

function resolveRedisTtl(): number {
  const { redis } = getRuntimeConfig();
  const ttlValue = redis?.ttl;

  if (typeof ttlValue === "number" && Number.isFinite(ttlValue) && ttlValue > 0) {
    return ttlValue;
  }

  if (typeof ttlValue === "string") {
    const parsed = Number.parseInt(ttlValue, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return DEFAULT_CACHE_TTL;
}

export function useRedisClient(): Redis | null {
  if (isDisabled) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  const url = resolveRedisUrl();

  if (!url) {
    isDisabled = true;
    return null;
  }

  try {
    cachedClient = new Redis(url, {
      enableAutoPipelining: true,
      maxRetriesPerRequest: null,
    });

    cachedClient.on("error", (error) => {
      console.error("[redis] Connection error", error);
    });
  } catch (error) {
    console.error("[redis] Failed to initialize client", error);
    cachedClient = null;
    isDisabled = true;
  }

  return cachedClient;
}

export function getRedisCacheTtl(): number {
  return resolveRedisTtl();
}
