import { __extends, __read, __values } from "tslib";

const SystemTicker = (function() {
  function SystemTickerInner() {}
  SystemTickerInner.prototype.now = function() {
    return Date.now();
  };
  return SystemTickerInner;
})();

const AbstractIterator = /** @class */ (function() {
  function AbstractIteratorInner() {}
  AbstractIteratorInner.prototype[Symbol.iterator] = function() {
    return this;
  };
  return AbstractIteratorInner;
})();

const MapIterator = /** @class */ (function(_super) {
  __extends(MapIteratorInner, _super);
  function MapIteratorInner(source, mapper) {
    const self = _super.call(this) || this;
    self.source = source;
    self.mapper = mapper;
    return self;
  }
  MapIteratorInner.prototype.next = function() {
    const result = this.source.next();
    return result.done
      ? { done: result.done }
      : { done: false, value: this.mapper(result.value) };
  };
  return MapIteratorInner;
})(AbstractIterator);

const FilterIterator = /** @class */ (function(_super) {
  __extends(FilterIteratorInner, _super);
  function FilterIteratorInner(source, predicate) {
    const self = _super.call(this) || this;
    self.source = source;
    self.predicate = predicate;
    return self;
  }
  FilterIteratorInner.prototype.next = function() {
    let e1;
    let c;
    let a;
    let b;
    try {
      for (a = __values(this.source), b = a.next(); !b.done; b = a.next()) {
        const { value } = b;
        if (this.predicate(value)) {
          return { done: false, value };
        }
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        c = a.return;
        if (b && !b.done && c) c.call(a);
      } finally {
        if (e1) throw e1.error;
      }
    }
    return { done: true };
  };
  return FilterIteratorInner;
})(AbstractIterator);

const IteratorBuilder = /** @class */ (function() {
  function IteratorBuilderInner(source) {
    this.source = source;
  }
  IteratorBuilderInner.prototype.map = function(mapper) {
    return new IteratorBuilderInner(new MapIterator(this.source, mapper));
  };
  IteratorBuilderInner.prototype.filter = function(predicate) {
    return new IteratorBuilderInner(new FilterIterator(this.source, predicate));
  };
  IteratorBuilderInner.prototype.build = function() {
    return this.source;
  };
  return IteratorBuilderInner;
})();

const ObjectIterator = /** @class */ (function(_super) {
  __extends(ObjectIteratorInner, _super);
  function ObjectIteratorInner(source) {
    const self = _super.call(this) || this;
    self.source = source;
    return self;
  }
  ObjectIteratorInner.prototype.next = function() {
    const self = this;
    if (!this.iterator) {
      const keys = Object.keys(this.source);
      this.iterator = new IteratorBuilder(keys.entries())
        .map(_a => {
          const b = __read(_a, 2);
          const x = b[1];
          return [x, self.source[x]];
        })
        .build();
    }
    return this.iterator.next();
  };
  return ObjectIteratorInner;
})(AbstractIterator);

const BaseCollection = /** @class */ (function() {
  function BaseCollectionInner() {
    /**
     * Returns a new `Iterator` object that contains an array of [`key`, `value`] for each element in
     * the `Collection` object.
     */
    this[Symbol.iterator] = this.entries;
  }
  /**
   * Calls `callbackFn` once for each key-value pair present in the `Collection` object.
   * If a thisArg parameter is provided to forEach, it will be used as the this value for each callback.
   */
  BaseCollectionInner.prototype.forEach = function(callbackfn, thisArg) {
    let e1;
    let d;
    let a;
    let b;
    try {
      for (a = __values(this), b = a.next(); !b.done; b = a.next()) {
        const c = __read(b.value, 2);
        const k = c[0];
        const v = c[1];
        callbackfn.call(thisArg, v, k, this);
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        d = a.return;
        if (b && !b.done && d) d.call(a);
      } finally {
        if (e1) throw e1.error;
      }
    }
  };
  return BaseCollectionInner;
})();

const KeyedCollection = /** @class */ (function(_super) {
  __extends(KeyedCollectionInner, _super);
  function KeyedCollectionInner(...args) {
    return (_super !== null && _super.apply(this, args)) || this;
  }
  /**
   * Sets each [`key`, `value`] entry from `entries` in the `Collection` object. Returns the `Collection` object.
   */
  KeyedCollectionInner.prototype.setAll = function(entries) {
    let e1;
    let b;
    let entries1;
    let entries11;
    try {
      for (
        entries1 = __values(entries), entries11 = entries1.next();
        !entries11.done;
        entries11 = entries1.next()
      ) {
        const a = __read(entries11.value, 2);
        const k = a[0];
        const v = a[1];
        this.set(k, v);
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        b = entries1.return;
        if (entries11 && !entries11.done && b) b.call(entries1);
      } finally {
        if (e1) throw e1.error;
      }
    }
    return this;
  };
  /**
   * Removes any values associated to the `keys`.
   */
  KeyedCollectionInner.prototype.deleteAll = function(keys) {
    let e2;
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
      e2 = { error };
    } finally {
      try {
        a = keys1.return;
        if (keys11 && !keys11.done && a) a.call(keys1);
      } finally {
        if (e2) throw e2.error;
      }
    }
  };
  /**
   * Returns a new `Iterator` object that contains the keys for each element in the `Collection` object
   * in insertion order.
   */
  KeyedCollectionInner.prototype.keys = function() {
    return new IteratorBuilder(this.entries())
      .map(_a => {
        const b = __read(_a, 1);
        const x = b[0];
        return x;
      })
      .build();
  };
  /**
   * Returns a new `Iterator` object that contains the `values` for each element in the `Collection` object.
   */
  KeyedCollectionInner.prototype.values = function() {
    return new IteratorBuilder(this.entries())
      .map(_a => {
        const b = __read(_a, 2);
        const x = b[1];
        return x;
      })
      .build();
  };
  return KeyedCollectionInner;
})(BaseCollection);

const REMOVAL_CAUSE_SIZE = "SIZE";
const REMOVAL_CAUSE_EXPIRED = "EXPIRED";
const REMOVAL_CAUSE_EXPLICIT = "EXPLICIT";
const REMOVAL_CAUSE_REPLACED = "REPLACED";

const CacheCollection = /** @class */ (function(_super) {
  __extends(CacheCollectionInner, _super);
  function CacheCollectionInner(...args) {
    return (_super !== null && _super.apply(this, args)) || this;
  }
  /**
   * Remove expired entries from cache, and returns number of removed elements.
   */
  CacheCollectionInner.prototype.cleanup = function() {
    const { size } = this;
    return size - Array.from(this.keys()).length;
  };
  return CacheCollectionInner;
})(KeyedCollection);

const SortedMap = /** @class */ (function(_super) {
  __extends(SortedMapInner, _super);
  function SortedMapInner(...args) {
    return (_super !== null && _super.apply(this, args)) || this;
  }
  /**
   * Returns first value in the `Collection` object, or `undefined` if there is none.
   */
  SortedMapInner.prototype.firstEntry = function() {
    let e1;
    let c;
    let b;
    let a;
    try {
      for (a = __values(this), b = a.next(); !b.done; b = a.next()) {
        const entry = b.value;
        return entry;
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        c = a.return;
        if (b && !b.done && c) c.call(a);
      } finally {
        if (e1) throw e1.error;
      }
    }
    return undefined;
  };
  /**
   * Returns last value in the `Collection` object, or `undefined` if there is none.
   */
  SortedMapInner.prototype.lastEntry = function() {
    let e2;
    let c;
    let result;
    let a;
    let b;
    try {
      for (a = __values(this), b = a.next(); !b.done; b = a.next()) {
        const entry = b.value;
        result = entry;
      }
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        c = a.return;
        if (b && !b.done && c) c.call(a);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return result;
  };
  return SortedMapInner;
})(KeyedCollection);

const LinkedMapNode = /** @class */ (function() {
  function LinkedMapNodeInner(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
    this.key = key;
    this.value = value;
  }
  return LinkedMapNodeInner;
})();

const LinkedMapIterator = /** @class */ (function(_super) {
  __extends(LinkedMapIteratorInner, _super);
  function LinkedMapIteratorInner(node) {
    const self = _super.call(this) || this;
    self.node = node;
    return self;
  }
  LinkedMapIteratorInner.prototype.next = function() {
    if (!this.node) {
      return { done: true };
    }
    const a = this.node;
    const { key, value } = a;
    this.node = this.node.prev;
    return { done: false, value: [key, value] };
  };
  return LinkedMapIteratorInner;
})(AbstractIterator);

const LinkedMap = /** @class */ (function(_super) {
  __extends(LinkedMapInner, _super);
  function LinkedMapInner(entries) {
    const self = _super.call(this) || this;
    self.head = null;
    self.tail = null;
    self.map = new Map();
    if (entries) {
      self.setAll(entries);
    }
    return self;
  }
  Object.defineProperty(LinkedMapInner.prototype, "size", {
    get() {
      return this.map.size;
    },
    enumerable: true,
    configurable: true,
  });
  LinkedMapInner.prototype.entries = function() {
    return new LinkedMapIterator(this.tail);
  };
  LinkedMapInner.prototype.clear = function() {
    this.map.clear();
    this.head = null;
    this.tail = null;
  };
  LinkedMapInner.prototype.delete = function(key) {
    const node = this.map.get(key);
    if (node) {
      this.unlinkNode(node);
      this.map.delete(key);
      return true;
    }
    return false;
  };
  LinkedMapInner.prototype.get = function(key) {
    const node = this.map.get(key);
    return node ? node.value : undefined;
  };
  LinkedMapInner.prototype.has = function(key) {
    return this.map.has(key);
  };
  LinkedMapInner.prototype.set = function(key, value) {
    const node = this.insert(key, value);
    this.setHead(node);
    return this;
  };
  LinkedMapInner.prototype.setFirst = function(key, value) {
    const node = this.insert(key, value);
    this.setTail(node);
    return this;
  };
  LinkedMapInner.prototype.firstEntry = function() {
    const node = this.tail;
    return node ? [node.key, node.value] : undefined;
  };
  LinkedMapInner.prototype.lastEntry = function() {
    const node = this.head;
    return node ? [node.key, node.value] : undefined;
  };
  LinkedMapInner.prototype.setHead = function(node) {
    const n = node;
    n.next = this.head;
    n.prev = null;
    if (this.head) {
      this.head.prev = n;
    }
    this.head = n;
    if (!this.tail) {
      this.tail = n;
    }
  };

  LinkedMapInner.prototype.setTail = function(node) {
    const n = node;
    n.next = null;
    n.prev = this.tail;

    if (this.tail) {
      this.tail.next = n;
    }
    this.tail = n;
    if (!this.head) {
      this.head = n;
    }
  };

  LinkedMapInner.prototype.insert = function(key, value) {
    let node = this.map.get(key);
    if (node) {
      node.value = value;
      this.unlinkNode(node);
    } else {
      node = new LinkedMapNode(key, value);
      this.map.set(key, node);
    }
    return node;
  };
  LinkedMapInner.prototype.unlinkNode = function(_a) {
    const { prev, next } = _a;
    if (prev) {
      prev.next = next;
    } else {
      this.head = next;
    }
    if (next) {
      next.prev = prev;
    } else {
      this.tail = prev;
    }
  };
  return LinkedMapInner;
})(SortedMap);

const DEFAULT_MAX_SIZE = 100;
const LRUMap = (function(_super) {
  __extends(LRUMapInner, _super);
  function LRUMapInner(a) {
    const b = a === undefined ? {} : a;
    const { maxSize, onRemove } = b;
    const self = _super.call(this) || this;
    self.map = new LinkedMap();
    self.options = { maxSize, onRemove };
    return self;
  }
  Object.defineProperty(LRUMapInner.prototype, "size", {
    get() {
      return this.map.size;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(LRUMapInner.prototype, "maxSize", {
    get() {
      return this.options.maxSize || DEFAULT_MAX_SIZE;
    },
    enumerable: true,
    configurable: true,
  });
  LRUMapInner.prototype.clear = function() {
    let e1;
    let a;
    let entries1;
    let entries11;
    const entries = this.entries();
    this.map.clear();
    try {
      for (
        entries1 = __values(entries), entries11 = entries1.next();
        !entries11.done;
        entries11 = entries1.next()
      ) {
        const entry = entries11.value;
        this.onRemove(entry, REMOVAL_CAUSE_EXPLICIT);
      }
    } catch (error) {
      e1 = { error };
    } finally {
      try {
        a = entries1.return;
        if (entries11 && !entries11.done && a) a.call(entries1);
      } finally {
        if (e1) throw e1.error;
      }
    }
  };
  LRUMapInner.prototype.delete = function(key) {
    if (this.map.has(key)) {
      const value = this.map.get(key);
      this.map.delete(key);
      this.onRemove([key, value], REMOVAL_CAUSE_EXPLICIT);
      return true;
    }
    return false;
  };
  LRUMapInner.prototype.entries = function() {
    return this.map.entries();
  };
  /**
   * Returns the value associated to the `key`, or `undefined` if there is none
   * with updating element position in `Collection`
   */
  LRUMapInner.prototype.get = function(key) {
    if (!this.map.has(key)) {
      return undefined;
    }
    const value = this.map.get(key);
    this.set(key, value);
    return value;
  };
  /**
   * Returns the value associated to the `key`, or `undefined` if there is none
   * without updating element position in `Collection`
   */
  LRUMapInner.prototype.peek = function(key) {
    return this.map.get(key);
  };
  LRUMapInner.prototype.firstEntry = function() {
    const node = this.map.firstEntry();
    if (node) {
      this.set(node[0], node[1]);
    }
    return node;
  };
  LRUMapInner.prototype.lastEntry = function() {
    return this.map.lastEntry();
  };
  LRUMapInner.prototype.has = function(key) {
    return this.map.has(key);
  };
  LRUMapInner.prototype.keys = function() {
    return this.map.keys();
  };
  LRUMapInner.prototype.set = function(key, value) {
    return this.setValue(key, value, true);
  };
  LRUMapInner.prototype.setFirst = function(key, value) {
    return this.setValue(key, value, false);
  };
  LRUMapInner.prototype.values = function() {
    return this.map.values();
  };
  LRUMapInner.prototype.setValue = function(key, value, last) {
    const { map } = this;
    let replacedEntry;
    if (this.has(key)) {
      const a = __read(last ? map.lastEntry() : map.firstEntry(), 1);
      const k = a[0];
      if (k !== key) {
        replacedEntry = [key, map.get(key)];
      }
    } else {
      const firstEntry = map.firstEntry();
      if (firstEntry && this.size >= this.maxSize) {
        map.delete(firstEntry[0]);
        this.onRemove(firstEntry, REMOVAL_CAUSE_SIZE);
      }
    }
    if (last) {
      map.set(key, value);
    } else {
      map.setFirst(key, value);
    }
    if (replacedEntry) {
      this.onRemove(replacedEntry, REMOVAL_CAUSE_REPLACED);
    }
    return this;
  };
  LRUMapInner.prototype.onRemove = function(entry, cause) {
    if (this.options.onRemove) {
      this.options.onRemove(entry, cause);
    }
  };
  return LRUMapInner;
})(SortedMap);

const KeyedCacheNode = /** @class */ (function() {
  function KeyedCacheNodeInner(value, expiresAt) {
    this.value = value;
    this.expiresAt = expiresAt;
  }
  return KeyedCacheNodeInner;
})();
const KeyedCache = (function(_super) {
  __extends(KeyedCacheInner, _super);
  function KeyedCacheInner(options) {
    const self = _super.call(this) || this;
    const { maxSize, onRemove, expireAfterWrite, expireAfterAccess } =
      options || {};
    const a = options.ticker;
    const ticker = a === undefined ? new SystemTicker() : a;
    self.options = {
      ticker,
      maxSize,
      onRemove,
      expireAfterWrite,
      expireAfterAccess,
    };
    if (maxSize) {
      self.map = new LRUMap({
        maxSize,
        onRemove(_c, cause) {
          const b = __read(_c, 2);
          const key = b[0];
          const node = b[1];
          if (cause !== REMOVAL_CAUSE_EXPLICIT) {
            self.onRemove([key, node.value], cause);
          }
        },
      });
    } else {
      self.map = new LinkedMap();
    }
    return self;
  }
  Object.defineProperty(KeyedCacheInner.prototype, "now", {
    get() {
      return this.options.ticker.now();
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(KeyedCacheInner.prototype, "size", {
    get() {
      return this.map.size;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(KeyedCacheInner.prototype, "maxSize", {
    get() {
      return this.options.maxSize;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(KeyedCacheInner.prototype, "expireAfterAccess", {
    get() {
      return this.options.expireAfterAccess || 0;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(KeyedCacheInner.prototype, "expireAfterWrite", {
    get() {
      return this.options.expireAfterWrite || 0;
    },
    enumerable: true,
    configurable: true,
  });
  KeyedCacheInner.prototype.clear = function() {
    let e1;
    let b;
    let entries1;
    let entries11;
    const entries = this.map.entries();
    this.map.clear();

    try {
      for (
        entries1 = __values(entries), entries11 = entries1.next();
        !entries11.done;
        entries11 = entries1.next()
      ) {
        const a = __read(entries11.value, 2);
        const key = a[0];
        const node = a[1];
        this.onRemove([key, node.value], REMOVAL_CAUSE_EXPLICIT);
      }
    } catch (e11) {
      e1 = { error: e11 };
    } finally {
      b = entries1.return;
      try {
        if (entries11 && !entries11.done && b) b.call(entries1);
      } finally {
        if (e1) throw e1.error;
      }
    }
  };

  KeyedCacheInner.prototype.delete = function(key) {
    const node = this.map.get(key);
    if (node) {
      this.map.delete(key);
      this.onRemove([key, node.value], REMOVAL_CAUSE_EXPLICIT);
      return true;
    }
    return false;
  };

  KeyedCacheInner.prototype.entries = function() {
    const self = this;
    return new IteratorBuilder(this.map.entries())
      .filter(_a => {
        const b = __read(_a, 1);
        const k = b[0];
        return self.has(k);
      })
      .map(_a => {
        const b = __read(_a, 2);
        const key = b[0];
        const node = b[1];
        return [key, node.value];
      })
      .build();
  };
  KeyedCacheInner.prototype.has = function(key) {
    return Boolean(this.peekNode(key));
  };
  KeyedCacheInner.prototype.get = function(key) {
    if (!this.has(key)) {
      return undefined;
    }
    const node = this.map.get(key);
    if (this.expireAfterAccess) {
      node.expiresAt = Math.max(
        node.expiresAt,
        this.now + this.expireAfterAccess,
      );
    }
    return node.value;
  };
  KeyedCacheInner.prototype.peek = function(key) {
    const node = this.peekNode(key);
    return node ? node.value : undefined;
  };
  KeyedCacheInner.prototype.set = function(key, value) {
    const expiresAfter = Math.max(
      this.expireAfterWrite,
      this.expireAfterAccess,
    );
    const node = new KeyedCacheNode(
      value,
      expiresAfter === 0 ? Infinity : expiresAfter + this.now,
    );
    this.map.set(key, node);
    return this;
  };
  KeyedCacheInner.prototype.peekNode = function(key) {
    const node =
      this.map instanceof LRUMap ? this.map.peek(key) : this.map.get(key);
    if (node) {
      if (node.expiresAt > this.now) {
        return node;
      }
      this.map.delete(key);
      this.onRemove([key, node.value], REMOVAL_CAUSE_EXPIRED);
    }
    return undefined;
  };
  KeyedCacheInner.prototype.onRemove = function(entry, cause) {
    if (this.options.onRemove) {
      this.options.onRemove(entry, cause);
    }
  };
  return KeyedCacheInner;
})(CacheCollection);

const HashCacheNode = /** @class */ (function() {
  function HashCacheNodeInner(key, value) {
    this.key = key;
    this.value = value;
  }
  return HashCacheNodeInner;
})();
const HashCache = /** @class */ (function(_super) {
  __extends(HashCacheInner, _super);
  function HashCacheInner(options) {
    const self = _super.call(this) || this;

    const {
      ticker,
      maxSize,
      onRemove,
      keyHasher,
      expireAfterWrite,
      expireAfterAccess,
    } = options;

    const cacheOptions = {
      ticker,
      maxSize,
      expireAfterWrite,
      expireAfterAccess,
    };
    if (onRemove) {
      cacheOptions.onRemove = function(_a, cause) {
        const b = __read(_a, 2);
        const node = b[1];
        return onRemove([node.key, node.value], cause);
      };
    }
    self.keyHasher = keyHasher;
    self.cache = new KeyedCache(cacheOptions);
    return self;
  }
  Object.defineProperty(HashCacheInner.prototype, "size", {
    get() {
      return this.cache.size;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(HashCacheInner.prototype, "maxSize", {
    get() {
      return this.cache.maxSize;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(HashCacheInner.prototype, "expireAfterAccess", {
    get() {
      return this.cache.expireAfterAccess;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(HashCacheInner.prototype, "expireAfterWrite", {
    get() {
      return this.cache.expireAfterWrite;
    },
    enumerable: true,
    configurable: true,
  });
  HashCacheInner.prototype.clear = function() {
    this.cache.clear();
  };
  HashCacheInner.prototype.delete = function(key) {
    return this.cache.delete(this.keyHasher(key));
  };
  HashCacheInner.prototype.entries = function() {
    return new IteratorBuilder(this.cache.entries())
      .map(_a => {
        const b = __read(_a, 2);
        const x = b[1];
        return [x.key, x.value];
      })
      .build();
  };
  HashCacheInner.prototype.get = function(key) {
    const node = this.cache.get(this.keyHasher(key));
    return node ? node.value : undefined;
  };
  HashCacheInner.prototype.peek = function(key) {
    const node = this.cache.peek(this.keyHasher(key));
    return node ? node.value : undefined;
  };
  HashCacheInner.prototype.has = function(key) {
    return this.cache.has(this.keyHasher(key));
  };
  HashCacheInner.prototype.set = function(key, value) {
    this.cache.set(this.keyHasher(key), new HashCacheNode(key, value));
    return this;
  };
  return HashCacheInner;
})(CacheCollection);

export {
  SystemTicker,
  ObjectIterator,
  IteratorBuilder,
  CacheCollection,
  REMOVAL_CAUSE_SIZE,
  REMOVAL_CAUSE_EXPIRED,
  REMOVAL_CAUSE_EXPLICIT,
  REMOVAL_CAUSE_REPLACED,
  LinkedMap,
  LRUMap,
  KeyedCache,
  HashCache,
};
