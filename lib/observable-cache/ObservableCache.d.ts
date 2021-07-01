import { KeyedCacheOptions } from "@umidbekkarimov/collections";
import { Observable } from "rxjs/Observable";
import { IScheduler } from "rxjs/Scheduler";
import { LoadingCache } from "../abstract/LoadingCache";
export interface ObservableCacheOptions<K, V> extends KeyedCacheOptions<K, Observable<V>> {
    ticker?: IScheduler;
    keyHasher?: (key: K) => string | number;
    loader: (key: K) => Promise<V> | Observable<V>;
}
export declare class ObservableCache<K, V> extends LoadingCache<K, Observable<V>> {
    private repeatSubject;
    private observers;
    private ticker?;
    constructor(options: ObservableCacheOptions<K, V>);
    set(key: K, value: Observable<V>): Observable<V>;
    get(key: K): Observable<V>;
    refresh(key: K): Observable<V>;
    getObserver(key: K): Observable<V>;
}
