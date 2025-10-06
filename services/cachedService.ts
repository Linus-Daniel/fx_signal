// File: src/services/cache/CacheService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  prefix?: string;
  maxSize?: number; // Maximum cache size in bytes
  enableOffline?: boolean;
}

class CacheService {
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private prefix = "@forex_cache_";
  private maxCacheSize = 10 * 1024 * 1024; // 10MB
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private isOnline = true;

  constructor(options?: CacheOptions) {
    if (options?.ttl) this.defaultTTL = options.ttl;
    if (options?.prefix) this.prefix = options.prefix;
    if (options?.maxSize) this.maxCacheSize = options.maxSize;

    if (options?.enableOffline) {
      this.initNetworkListener();
    }
  }

  private initNetworkListener() {
    NetInfo.addEventListener((state) => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  private getCacheKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.getCacheKey(key);

    // Check memory cache first
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && this.isValidEntry(memoryEntry)) {
      return memoryEntry.data;
    }

    try {
      // Check persistent storage
      const stored = await AsyncStorage.getItem(cacheKey);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);

      if (this.isValidEntry(entry)) {
        // Update memory cache
        this.memoryCache.set(cacheKey, entry);
        return entry.data;
      }

      // Clean up expired entry
      await this.remove(key);
      return null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    const expiry = ttl || this.defaultTTL;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + expiry,
    };

    // Update memory cache
    this.memoryCache.set(cacheKey, entry);

    try {
      // Check cache size before storing
      await this.manageCacheSize();

      // Store in persistent storage
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error("Cache set error:", error);
      // Remove from memory cache if persistent storage fails
      this.memoryCache.delete(cacheKey);
    }
  }

  async remove(key: string): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    this.memoryCache.delete(cacheKey);

    try {
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error("Cache remove error:", error);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();

    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  async clearExpired(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      for (const key of cacheKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const entry = JSON.parse(stored);
          if (!this.isValidEntry(entry)) {
            await AsyncStorage.removeItem(key);
            this.memoryCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error("Clear expired error:", error);
    }
  }

  private isValidEntry(entry: CacheEntry<any>): boolean {
    return entry.expiresAt > Date.now();
  }

  private async manageCacheSize(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(this.prefix));

      if (cacheKeys.length === 0) return;

      // Get all cache entries with their sizes
      const entries = await Promise.all(
        cacheKeys.map(async (key) => {
          const value = await AsyncStorage.getItem(key);
          return {
            key,
            size: value ? value.length * 2 : 0, // Rough estimate (2 bytes per char)
            timestamp: value ? JSON.parse(value).timestamp : 0,
          };
        })
      );

      // Calculate total size
      const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);

      if (totalSize > this.maxCacheSize) {
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest entries until under limit
        let currentSize = totalSize;
        for (const entry of entries) {
          if (currentSize <= this.maxCacheSize * 0.8) break; // Keep 80% of max

          await AsyncStorage.removeItem(entry.key);
          this.memoryCache.delete(entry.key);
          currentSize -= entry.size;
        }
      }
    } catch (error) {
      console.error("Manage cache size error:", error);
    }
  }

  async getWithFallback<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { ttl?: number; forceRefresh?: boolean }
  ): Promise<T> {
    // If offline, always try cache first
    if (!this.isOnline && !options?.forceRefresh) {
      const cached = await this.get<T>(key);
      if (cached) return cached;
      throw new Error("No cached data available offline");
    }

    // If force refresh, skip cache
    if (options?.forceRefresh) {
      const fresh = await fetcher();
      await this.set(key, fresh, options.ttl);
      return fresh;
    }

    // Try cache first
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Fetch fresh data
    try {
      const fresh = await fetcher();
      await this.set(key, fresh, options?.ttl);
      return fresh;
    } catch (error) {
      // If fetch fails and we have expired cache, return it
      const expiredCache = await this.getExpired<T>(key);
      if (expiredCache) {
        console.warn("Using expired cache due to fetch error");
        return expiredCache;
      }
      throw error;
    }
  }

  private async getExpired<T>(key: string): Promise<T | null> {
    const cacheKey = this.getCacheKey(key);

    try {
      const stored = await AsyncStorage.getItem(cacheKey);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);
      return entry.data;
    } catch (error) {
      return null;
    }
  }

  // Batch operations for performance
  async getBatch<T>(keys: string[]): Promise<(T | null)[]> {
    const cacheKeys = keys.map((key) => this.getCacheKey(key));

    try {
      const results = await AsyncStorage.multiGet(cacheKeys);
      return results.map(([_, value]) => {
        if (!value) return null;

        const entry: CacheEntry<T> = JSON.parse(value);
        if (this.isValidEntry(entry)) {
          return entry.data;
        }
        return null;
      });
    } catch (error) {
      console.error("Batch get error:", error);
      return keys.map(() => null);
    }
  }

  async setBatch<T>(
    items: Array<{ key: string; data: T; ttl?: number }>
  ): Promise<void> {
    const entries = items.map(({ key, data, ttl }) => {
      const cacheKey = this.getCacheKey(key);
      const expiry = ttl || this.defaultTTL;

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + expiry,
      };

      // Update memory cache
      this.memoryCache.set(cacheKey, entry);

      return [cacheKey, JSON.stringify(entry)] as [string, string];
    });

    try {
      await AsyncStorage.multiSet(entries);
    } catch (error) {
      console.error("Batch set error:", error);
      // Remove from memory cache on error
      entries.forEach(([key]) => this.memoryCache.delete(key));
    }
  }
}

// Create singleton instance
export const cacheService = new CacheService({
  ttl: 5 * 60 * 1000, // 5 minutes default
  prefix: "@forex_news_",
  maxSize: 10 * 1024 * 1024, // 10MB
  enableOffline: true,
});
