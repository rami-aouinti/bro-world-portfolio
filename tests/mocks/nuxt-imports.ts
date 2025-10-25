type StoredValue = unknown;

class MemoryStorage {
  private data = new Map<string, StoredValue>();

  async getItem<T = StoredValue>(key: string) {
    return this.data.has(key) ? (this.data.get(key) as T) : null;
  }

  async setItem<T = StoredValue>(key: string, value: T) {
    this.data.set(key, value);
  }

  async removeItem(key: string) {
    this.data.delete(key);
  }

  async clear() {
    this.data.clear();
  }
}

const storages = new Map<string, MemoryStorage>();

export function useStorage(name: string) {
  if (!storages.has(name)) {
    storages.set(name, new MemoryStorage());
  }

  return storages.get(name) as MemoryStorage;
}

export function __resetStorages() {
  storages.clear();
}
