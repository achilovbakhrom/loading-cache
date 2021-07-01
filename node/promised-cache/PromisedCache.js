"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoadingCache_1 = require("../abstract/LoadingCache");
class PromisedCache extends LoadingCache_1.LoadingCache {
    set(key, value) {
        const promise = Promise.resolve(value).catch((error) => {
            this.cache.delete(key);
            throw error;
        });
        this.cache.set(key, promise);
        return promise;
    }
}
exports.PromisedCache = PromisedCache;
//# sourceMappingURL=PromisedCache.js.map