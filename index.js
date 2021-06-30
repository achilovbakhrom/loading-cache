import _ from "lodash";
import { __assign, __extends, __values } from "tslib";
import {
  HashCache,
  KeyedCache,
  REMOVAL_CAUSE_EXPLICIT,
  REMOVAL_CAUSE_REPLACED,
} from "./collections";
import { Observable } from "rxjs";
import { ErrorObservable as ErrorObservable$1 } from "rxjs/observable/ErrorObservable";
import { IntervalObservable as IntervalObservable$1 } from "rxjs/observable/IntervalObservable";
import { catchError as catchError$1 } from "rxjs/operators/catchError";
import { filter as filter$1 } from "rxjs/operators/filter";
import { finalize as finalize$1 } from "rxjs/operators/finalize";
import { mergeStatic } from "rxjs/operators/merge";
import { publishReplay as publishReplay$1 } from "rxjs/operators/publishReplay";
import { refCount as refCount$1 } from "rxjs/operators/refCount";
import { repeatWhen as repeatWhen$1 } from "rxjs/operators/repeatWhen";
import { share as share$1 } from "rxjs/operators/share";
import { Subject as Subject$1 } from "rxjs/Subject";

const LoadingCache = (function() {
  function LoadingCacheInner(options) {
    const self = this;
    this.options = options;
    const { keyHasher, loader } = options;
    if (!_.isFunction(loader)) {
      throw new TypeError("LoadingCache: `loader` expected to be a `function`");
    }
    const cacheOptions = {
      ticker: options.ticker,
      maxSize: options.maxSize,
      expireAfterAccess: options.expireAfterAccess,
      expireAfterWrite: options.expireAfterWrite,
      onRemove(entry, cause) {
        if (cause !== REMOVAL_CAUSE_EXPLICIT) {
          self.onRemove(entry, cause);
        }
      },
    };
    if (keyHasher) {
      this.cache = new HashCache(__assign({ keyHasher }, cacheOptions));
    } else {
      this.cache = new KeyedCache(cacheOptions);
    }
  }
  Object.defineProperty(LoadingCacheInner.prototype, "size", {
    /**
     * Returns the approximate number of entries in this cache.
     */
    get() {
      return this.cache.size;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(LoadingCacheInner.prototype, "maxSize", {
    get() {
      return this.cache.maxSize;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(LoadingCacheInner.prototype, "expireAfterAccess", {
    get() {
      return this.cache.expireAfterAccess;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(LoadingCacheInner.prototype, "expireAfterWrite", {
    get() {
      return this.cache.expireAfterWrite;
    },
    enumerable: true,
    configurable: true,
  });
  /**
   * Returns a boolean asserting whether a value has been associated to the `key` in this cache or not.
   */
  LoadingCacheInner.prototype.has = function(key) {
    return this.cache.has(key);
  };
  /**
   * Returns the `value` associated with `key` in this cache, first loading that value if necessary.
   */
  LoadingCacheInner.prototype.get = function(key) {
    return this.cache.has(key)
      ? this.cache.get(key)
      : this.set(key, this.options.loader(key));
  };
  /**
   * Loads a new value for key `key`.
   */
  LoadingCacheInner.prototype.refresh = function(key) {
    if (this.has(key)) {
      const value = this.cache.peek(key);
      this.cache.delete(key);
      this.onRemove([key, value], REMOVAL_CAUSE_REPLACED);
    }
    return this.get(key);
  };
  /**
   * Returns the `value` associated with `key` in this cache, or `undefined` if there is no cached value for `key`.
   */
  LoadingCacheInner.prototype.getIfPresent = function(key) {
    return this.has(key) ? this.get(key) : undefined;
  };
  /**
   * Removes any value associated to the `key` and returns the value that `LoadingCache#has(key)`
   * would have previously returned. `LoadingCache#has(key)` will return false afterwards.
   */
  LoadingCacheInner.prototype.delete = function(key) {
    const value = this.cache.peek(key);
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
  LoadingCacheInner.prototype.deleteAll = function(keys) {
    let e1;
    let a;
    let keys1;
    let keys11;
    try {
      for (
        keys1 = __values(keys), keys11 = keys1.next();
        !keys11.done;
        keys11 = keys1.next()
      ) {
        const key = keys11.value;
        this.delete(key);
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        a = keys1.return;
        if (keys11 && !keys11.done && a) a.call(keys1);
      } finally {
        if (e1) throw e1.error;
      }
    }
  };
  /**
   * Removes all key/value pairs from this cache.
   */
  LoadingCacheInner.prototype.clear = function() {
    const self = this;
    const entries = Array.from(this.entries());
    this.cache.clear();
    entries.forEach(entry => {
      self.onRemove(entry, REMOVAL_CAUSE_EXPLICIT);
    });
  };
  /**
   * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
   */
  LoadingCacheInner.prototype.entries = function() {
    return this.cache.entries();
  };
  /**
   * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in this cache.
   */
  LoadingCacheInner.prototype[Symbol.iterator] = function() {
    return this.entries();
  };
  LoadingCacheInner.prototype.onRemove = function(entry, cause) {
    if (this.options.onRemove) {
      this.options.onRemove(entry, cause);
    }
  };
  return LoadingCacheInner;
})();

const PromisedCache = /** @class */ (function(_super) {
  __extends(PromisedCacheInner, _super);
  function PromisedCacheInner(...args) {
    return (_super !== null && _super.apply(this, args)) || this;
  }
  PromisedCacheInner.prototype.set = function(key, value) {
    const self = this;
    const promise = Promise.resolve(value).catch(error => {
      self.cache.delete(key);
      throw error;
    });
    this.cache.set(key, promise);
    return promise;
  };
  return PromisedCacheInner;
})(LoadingCache);

const ObservableCache = /** @class */ (function(_super) {
  __extends(ObservableCacheInner, _super);
  function ObservableCacheInner(options) {
    const self =
      _super.call(
        this,
        __assign({}, options, {
          loader(key) {
            return Observable.defer(() => options.loader(key));
          },
        }),
      ) || this;
    self.repeatSubject = new Subject$1();
    self.observers = new Map();
    self.ticker = options.ticker;
    return self;
  }
  ObservableCacheInner.prototype.set = function(key, value) {
    const self = this;
    return Observable.defer(() => {
      const stream = value.pipe(
        publishReplay$1(1),
        refCount$1(),
        catchError$1(error => {
          self.cache.delete(key);
          return new ErrorObservable$1(error);
        }),
      );
      self.cache.set(key, stream);
      return stream;
    });
  };
  ObservableCacheInner.prototype.get = function(key) {
    const self = this;
    return Observable.defer(() => _super.prototype.get.call(self, key));
  };
  ObservableCacheInner.prototype.refresh = function(key) {
    const self = this;
    return Observable.defer(() => {
      const value = _super.prototype.refresh.call(self, key);
      self.repeatSubject.next(key);
      return value;
    });
  };
  ObservableCacheInner.prototype.getObserver = function(key) {
    const self = this;
    return Observable.defer(() => {
      if (self.observers.has(key)) {
        return self.observers.get(key);
      }
      const repeatAfter = Math.max(
        0,
        self.expireAfterWrite,
        self.expireAfterAccess,
      );
      let repeatStream = self.repeatSubject.pipe(filter$1(k => k === key));
      if (repeatAfter > 0) {
        repeatStream = mergeStatic(
          repeatStream,
          new IntervalObservable$1(repeatAfter, self.ticker),
        );
      }
      const stream = Observable.defer(() => self.get(key)).pipe(
        repeatWhen$1(() => repeatStream),
        finalize$1(() => self.observers.delete(key)),
        share$1(),
      );
      self.observers.set(key, stream);
      return stream;
    });
  };
  return ObservableCacheInner;
})(LoadingCache);

export { PromisedCache, ObservableCache };
