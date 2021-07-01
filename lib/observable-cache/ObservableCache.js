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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DeferObservable_1 = require("rxjs/observable/DeferObservable");
var ErrorObservable_1 = require("rxjs/observable/ErrorObservable");
var IntervalObservable_1 = require("rxjs/observable/IntervalObservable");
var catchError_1 = require("rxjs/operators/catchError");
var filter_1 = require("rxjs/operators/filter");
var finalize_1 = require("rxjs/operators/finalize");
var merge_1 = require("rxjs/operators/merge");
var publishReplay_1 = require("rxjs/operators/publishReplay");
var refCount_1 = require("rxjs/operators/refCount");
var repeatWhen_1 = require("rxjs/operators/repeatWhen");
var share_1 = require("rxjs/operators/share");
var Subject_1 = require("rxjs/Subject");
var LoadingCache_1 = require("../abstract/LoadingCache");
var ObservableCache = /** @class */ (function (_super) {
    __extends(ObservableCache, _super);
    function ObservableCache(options) {
        var _this = _super.call(this, __assign({}, options, { loader: function (key) { return new DeferObservable_1.DeferObservable(function () { return options.loader(key); }); } })) || this;
        _this.repeatSubject = new Subject_1.Subject();
        _this.observers = new Map();
        _this.ticker = options.ticker;
        return _this;
    }
    ObservableCache.prototype.set = function (key, value) {
        var _this = this;
        return new DeferObservable_1.DeferObservable(function () {
            var stream = value.pipe(publishReplay_1.publishReplay(1), refCount_1.refCount(), catchError_1.catchError(function (error) {
                _this.cache.delete(key);
                return new ErrorObservable_1.ErrorObservable(error);
            }));
            _this.cache.set(key, stream);
            return stream;
        });
    };
    ObservableCache.prototype.get = function (key) {
        var _this = this;
        return new DeferObservable_1.DeferObservable(function () { return _super.prototype.get.call(_this, key); });
    };
    ObservableCache.prototype.refresh = function (key) {
        var _this = this;
        return new DeferObservable_1.DeferObservable(function () {
            var value = _super.prototype.refresh.call(_this, key);
            _this.repeatSubject.next(key);
            return value;
        });
    };
    ObservableCache.prototype.getObserver = function (key) {
        var _this = this;
        return new DeferObservable_1.DeferObservable(function () {
            if (_this.observers.has(key)) {
                return _this.observers.get(key);
            }
            var repeatAfter = Math.max(0, _this.expireAfterWrite, _this.expireAfterAccess);
            var repeatStream = _this.repeatSubject.pipe(filter_1.filter(function (k) { return k === key; }));
            if (repeatAfter > 0) {
                repeatStream = merge_1.mergeStatic(repeatStream, new IntervalObservable_1.IntervalObservable(repeatAfter, _this.ticker));
            }
            var stream = new DeferObservable_1.DeferObservable(function () { return _this.get(key); }).pipe(repeatWhen_1.repeatWhen(function () { return repeatStream; }), finalize_1.finalize(function () { return _this.observers.delete(key); }), share_1.share());
            _this.observers.set(key, stream);
            return stream;
        });
    };
    return ObservableCache;
}(LoadingCache_1.LoadingCache));
exports.ObservableCache = ObservableCache;
//# sourceMappingURL=ObservableCache.js.map