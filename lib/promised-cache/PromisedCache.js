"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LoadingCache_1 = require("../abstract/LoadingCache");
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
}(LoadingCache_1.LoadingCache));
exports.PromisedCache = PromisedCache;
//# sourceMappingURL=PromisedCache.js.map