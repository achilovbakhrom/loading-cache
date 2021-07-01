import { LoadingCache } from "../abstract/LoadingCache";
export declare class PromisedCache<K, V> extends LoadingCache<K, Promise<V>> {
    set(key: K, value: Promise<V>): Promise<V>;
}
