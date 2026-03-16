class LRUCache {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number) {
    if (!this.cache.has(key)) {
      return null;
    }

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: number, value: number) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldKey = this.cache.keys().next().value;
      if (oldKey) {
        this.cache.delete(oldKey);
      }
    }

    this.cache.set(key, value);
  }
}
