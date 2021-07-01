"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var collections_1 = require("@umidbekkarimov/collections");
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
                if (cause !== collections_1.REMOVAL_CAUSE_EXPLICIT) {
                    _this.onRemove(entry, cause);
                }
            }
        };
        if (keyHasher) {
            this.cache = new collections_1.HashCache(__assign({ keyHasher: keyHasher }, cacheOptions));
        }
        else {
            this.cache = new collections_1.KeyedCache(cacheOptions);
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
            this.onRemove([key, value], collections_1.REMOVAL_CAUSE_REPLACED);
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
        this.onRemove([key, value], collections_1.REMOVAL_CAUSE_EXPLICIT);
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
            _this.onRemove(entry, collections_1.REMOVAL_CAUSE_EXPLICIT);
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
exports.LoadingCache = LoadingCache;
//# sourceMappingURL=LoadingCache.js.map