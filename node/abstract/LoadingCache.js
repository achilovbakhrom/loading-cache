"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collections_1 = require("@umidbekkarimov/collections");
class LoadingCache {
    constructor(options) {
        this.options = options;
        const { keyHasher } = options;
        if (typeof options.loader !== "function") {
            throw new TypeError("LoadingCache: `loader` expected to be a `function`");
        }
        const cacheOptions = {
            ticker: options.ticker,
            maxSize: options.maxSize,
            expireAfterAccess: options.expireAfterAccess,
            expireAfterWrite: options.expireAfterWrite,
            onRemove: (entry, cause) => {
                if (cause !== collections_1.REMOVAL_CAUSE_EXPLICIT) {
                    this.onRemove(entry, cause);
                }
            }
        };
        if (keyHasher) {
            this.cache = new collections_1.HashCache(Object.assign({ keyHasher }, cacheOptions));
        }
        else {
            this.cache = new collections_1.KeyedCache(cacheOptions);
        }
    }
    /**
     * Returns the approximate number of entries in this cache.
     */
    get size() {
        return this.cache.size;
    }
    get maxSize() {
        return this.cache.maxSize;
    }
    get expireAfterAccess() {
        return this.cache.expireAfterAccess;
    }
    get expireAfterWrite() {
        return this.cache.expireAfterWrite;
    }
    /**
     * Returns a boolean asserting whether a value has been associated to the `key` in this cache or not.
     */
    has(key) {
        return this.cache.has(key);
    }
    /**
     * Returns the `value` associated with `key` in this cache, first loading that value if necessary.
     */
    get(key) {
        return this.cache.has(key)
            ? this.cache.get(key)
            : this.set(key, this.options.loader(key));
    }
    /**
     * Loads a new value for key `key`.
     */
    refresh(key) {
        if (this.has(key)) {
            const value = this.cache.peek(key);
            this.cache.delete(key);
            this.onRemove([key, value], collections_1.REMOVAL_CAUSE_REPLACED);
        }
        return this.get(key);
    }
    /**
     * Returns the `value` associated with `key` in this cache, or `undefined` if there is no cached value for `key`.
     */
    getIfPresent(key) {
        return this.has(key) ? this.get(key) : undefined;
    }
    /**
     * Removes any value associated to the `key` and returns the value that `LoadingCache#has(key)`
     * would have previously returned. `LoadingCache#has(key)` will return false afterwards.
     */
    delete(key) {
        const value = this.cache.peek(key);
        if (!value) {
            return false;
        }
        this.cache.delete(key);
        this.onRemove([key, value], collections_1.REMOVAL_CAUSE_EXPLICIT);
        return true;
    }
    /**
     * Removes any values associated to the `keys`.
     */
    deleteAll(keys) {
        for (const key of keys) {
            this.delete(key);
        }
    }
    /**
     * Removes all key/value pairs from this cache.
     */
    clear() {
        const entries = Array.from(this.entries());
        this.cache.clear();
        entries.forEach(entry => {
            this.onRemove(entry, collections_1.REMOVAL_CAUSE_EXPLICIT);
        });
    }
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    entries() {
        return this.cache.entries();
    }
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    [Symbol.iterator]() {
        return this.entries();
    }
    onRemove(entry, cause) {
        if (this.options.onRemove) {
            this.options.onRemove(entry, cause);
        }
    }
}
exports.LoadingCache = LoadingCache;
//# sourceMappingURL=LoadingCache.js.map