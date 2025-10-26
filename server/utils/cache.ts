import { getRedisCacheTtl, useRedisClient } from "./redis";

export async function getCachedValue<T>(key: string): Promise<T | null> {
  const client = useRedisClient();
  if (!client) {
    return null;
  }

  try {
    const value = await client.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[cache] Failed to read key ${key}`, error);
    return null;
  }
}

export async function setCachedValue<T>(key: string, value: T, ttl = getRedisCacheTtl()) {
  const client = useRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.error(`[cache] Failed to set key ${key}`, error);
  }
}

export async function deleteCachedValue(keys: string | string[]) {
  const client = useRedisClient();
  if (!client) {
    return;
  }

  const keyList = Array.isArray(keys) ? keys : [keys];

  if (keyList.length === 0) {
    return;
  }

  try {
    await client.del(...keyList);
  } catch (error) {
    console.error(`[cache] Failed to delete keys ${keyList.join(", ")}`, error);
  }
}
