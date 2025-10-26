export default defineNuxtPlugin(async () => {
  if (!process.server) {
    return;
  }

  const globalObject = globalThis as typeof globalThis & { AsyncLocalStorage?: unknown };

  if (globalObject.AsyncLocalStorage) {
    return;
  }

  try {
    const { AsyncLocalStorage } = await import('node:async_hooks');
    globalObject.AsyncLocalStorage = AsyncLocalStorage;
  } catch (error) {
    console.warn('[async-local-storage] Failed to provide AsyncLocalStorage polyfill.', error);
  }
});
