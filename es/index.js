import { __assign, __extends, __values } from 'tslib';
import { HashCache, KeyedCache, REMOVAL_CAUSE_EXPLICIT, REMOVAL_CAUSE_REPLACED } from '@umidbekkarimov/collections';
import { DeferObservable as DeferObservable$1 } from 'rxjs/_esm5/observable/DeferObservable';
import { ErrorObservable as ErrorObservable$1 } from 'rxjs/_esm5/observable/ErrorObservable';
import { IntervalObservable as IntervalObservable$1 } from 'rxjs/_esm5/observable/IntervalObservable';
import { catchError as catchError$1 } from 'rxjs/_esm5/operators/catchError';
import { filter as filter$1 } from 'rxjs/_esm5/operators/filter';
import { finalize as finalize$1 } from 'rxjs/_esm5/operators/finalize';
import { mergeStatic } from 'rxjs/_esm5/operators/merge';
import { publishReplay as publishReplay$1 } from 'rxjs/_esm5/operators/publishReplay';
import { refCount as refCount$1 } from 'rxjs/_esm5/operators/refCount';
import { repeatWhen as repeatWhen$1 } from 'rxjs/_esm5/operators/repeatWhen';
import { share as share$1 } from 'rxjs/_esm5/operators/share';
import { Subject as Subject$1 } from 'rxjs/_esm5/Subject';

var LoadingCache = /** @class */ (function () {
    function LoadingCache(options) {
        var _this = this;
        this.options = options;
        var keyHasher = options.keyHasher;
        if (typeof options.loader !== "function") {
            throw new TypeError("LoadingCache: `loader` expected to be a `function`");
        }
        var cacheOptions = {
            ticker: options.ticker,
            maxSize: options.maxSize,
            expireAfterAccess: options.expireAfterAccess,
            expireAfterWrite: options.expireAfterWrite,
            onRemove: function (entry, cause) {
                if (cause !== REMOVAL_CAUSE_EXPLICIT) {
                    _this.onRemove(entry, cause);
                }
            }
        };
        if (keyHasher) {
            this.cache = new HashCache(__assign({ keyHasher: keyHasher }, cacheOptions));
        }
        else {
            this.cache = new KeyedCache(cacheOptions);
        }
    }
    Object.defineProperty(LoadingCache.prototype, "size", {
        /**
         * Returns the approximate number of entries in this cache.
         */
        get: function () {
            return this.cache.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingCache.prototype, "maxSize", {
        get: function () {
            return this.cache.maxSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingCache.prototype, "expireAfterAccess", {
        get: function () {
            return this.cache.expireAfterAccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingCache.prototype, "expireAfterWrite", {
        get: function () {
            return this.cache.expireAfterWrite;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a boolean asserting whether a value has been associated to the `key` in this cache or not.
     */
    LoadingCache.prototype.has = function (key) {
        return this.cache.has(key);
    };
    /**
     * Returns the `value` associated with `key` in this cache, first loading that value if necessary.
     */
    LoadingCache.prototype.get = function (key) {
        return this.cache.has(key)
            ? this.cache.get(key)
            : this.set(key, this.options.loader(key));
    };
    /**
     * Loads a new value for key `key`.
     */
    LoadingCache.prototype.refresh = function (key) {
        if (this.has(key)) {
            var value = this.cache.peek(key);
            this.cache.delete(key);
            this.onRemove([key, value], REMOVAL_CAUSE_REPLACED);
        }
        return this.get(key);
    };
    /**
     * Returns the `value` associated with `key` in this cache, or `undefined` if there is no cached value for `key`.
     */
    LoadingCache.prototype.getIfPresent = function (key) {
        return this.has(key) ? this.get(key) : undefined;
    };
    /**
     * Removes any value associated to the `key` and returns the value that `LoadingCache#has(key)`
     * would have previously returned. `LoadingCache#has(key)` will return false afterwards.
     */
    LoadingCache.prototype.delete = function (key) {
        var value = this.cache.peek(key);
        if (!value) {
            return false;
        }
        this.cache.delete(key);
        this.onRemove([key, value], REMOVAL_CAUSE_EXPLICIT);
        return true;
    };
    /**
     * Removes any values associated to the `keys`.
     */
    LoadingCache.prototype.deleteAll = function (keys) {
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                this.delete(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    /**
     * Removes all key/value pairs from this cache.
     */
    LoadingCache.prototype.clear = function () {
        var _this = this;
        var entries = Array.from(this.entries());
        this.cache.clear();
        entries.forEach(function (entry) {
            _this.onRemove(entry, REMOVAL_CAUSE_EXPLICIT);
        });
    };
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    LoadingCache.prototype.entries = function () {
        return this.cache.entries();
    };
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
     */
    LoadingCache.prototype[Symbol.iterator] = function () {
        return this.entries();
    };
    LoadingCache.prototype.onRemove = function (entry, cause) {
        if (this.options.onRemove) {
            this.options.onRemove(entry, cause);
        }
    };
    return LoadingCache;
}());

var PromisedCache = /** @class */ (function (_super) {
    __extends(PromisedCache, _super);
    function PromisedCache() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PromisedCache.prototype.set = function (key, value) {
        var _this = this;
        var promise = Promise.resolve(value).catch(function (error) {
            _this.cache.delete(key);
            throw error;
        });
        this.cache.set(key, promise);
        return promise;
    };
    return PromisedCache;
}(LoadingCache));

var ObservableCache = /** @class */ (function (_super) {
    __extends(ObservableCache, _super);
    function ObservableCache(options) {
        var _this = _super.call(this, __assign({}, options, { loader: function (key) { return new DeferObservable$1(function () { return options.loader(key); }); } })) || this;
        _this.repeatSubject = new Subject$1();
        _this.observers = new Map();
        _this.ticker = options.ticker;
        return _this;
    }
    ObservableCache.prototype.set = function (key, value) {
        var _this = this;
        return new DeferObservable$1(function () {
            var stream = value.pipe(publishReplay$1(1), refCount$1(), catchError$1(function (error) {
                _this.cache.delete(key);
                return new ErrorObservable$1(error);
            }));
            _this.cache.set(key, stream);
            return stream;
        });
    };
    ObservableCache.prototype.get = function (key) {
        var _this = this;
        return new DeferObservable$1(function () { return _super.prototype.get.call(_this, key); });
    };
    ObservableCache.prototype.refresh = function (key) {
        var _this = this;
        return new DeferObservable$1(function () {
            var value = _super.prototype.refresh.call(_this, key);
            _this.repeatSubject.next(key);
            return value;
        });
    };
    ObservableCache.prototype.getObserver = function (key) {
        var _this = this;
        return new DeferObservable$1(function () {
            if (_this.observers.has(key)) {
                return _this.observers.get(key);
            }
            var repeatAfter = Math.max(0, _this.expireAfterWrite, _this.expireAfterAccess);
            var repeatStream = _this.repeatSubject.pipe(filter$1(function (k) { return k === key; }));
            if (repeatAfter > 0) {
                repeatStream = mergeStatic(repeatStream, new IntervalObservable$1(repeatAfter, _this.ticker));
            }
            var stream = new DeferObservable$1(function () { return _this.get(key); }).pipe(repeatWhen$1(function () { return repeatStream; }), finalize$1(function () { return _this.observers.delete(key); }), share$1());
            _this.observers.set(key, stream);
            return stream;
        });
    };
    return ObservableCache;
}(LoadingCache));

export { PromisedCache, ObservableCache };
//# sourceMappingURL=index.js.map
