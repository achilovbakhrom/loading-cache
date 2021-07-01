import { CacheCollection, CacheRemovalCause, KeyedCacheOptions } from "@umidbekkarimov/collections";
export interface LoadingCacheOptions<K, V> extends KeyedCacheOptions<K, V> {
    loader: (key: K) => V;
    keyHasher?: (key: K) => string | number;
}
export declare abstract class LoadingCache<K, V> {
    protected options: LoadingCacheOptions<K, V>;
    protected cache: CacheCollection<K, V>;
    constructor(options: LoadingCacheOptions<K, V>);
    /**
     * Returns the approximate number of entries in this cache.
     */
    readonly size: number;
    readonly maxSize: number | undefined;
    readonly expireAfterAccess: number;
    readonly expireAfterWrite: number;
    /**
     * Sets the `value` for `the` key in this `cache`. Returns `value` or it's wrapped presentation.
     */
    abstract set(key: K, value: V): V;
    /**
     * Returns a boolean asserting whether a value has been associated to the `key` in this cache or not.
     */
    has(key: K): boolean;
    /**
     * Returns the `value` associated with `key` in this cache, first loading that value if necessary.
     */
    get(key: K): V;
    /**
     * Loads a new value for key `key`.
     */
    refresh(key: K): V;
    /**
     * Returns the `value` associated with `key` in this cache, or `undefined` if there is no cached value for `key`.
     */
    getIfPresent(key: K): V | undefined;
    /**
     * Removes any value associated to the `key` and returns the value that `LoadingCache#has(key)`
     * would have previously returned. `LoadingCache#has(key)` will return false afterwards.
     */
    delete(key: K): boolean;
    /**
     * Removes any values associated to the `keys`.
     */
    deleteAll(keys: Iterable<K>): void;
    /**
     * Removes all key/value pairs from this cache.
     */
    clear(): void;
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    entries(): IterableIterator<[K, V]>;
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    [Symbol.iterator](): IterableIterator<[K, V]>;
    protected onRemove(entry: [K, V], cause: CacheRemovalCause): void;
}
