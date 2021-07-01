"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeferObservable_1 = require("rxjs/observable/DeferObservable");
const ErrorObservable_1 = require("rxjs/observable/ErrorObservable");
const IntervalObservable_1 = require("rxjs/observable/IntervalObservable");
const catchError_1 = require("rxjs/operators/catchError");
const filter_1 = require("rxjs/operators/filter");
const finalize_1 = require("rxjs/operators/finalize");
const merge_1 = require("rxjs/operators/merge");
const publishReplay_1 = require("rxjs/operators/publishReplay");
const refCount_1 = require("rxjs/operators/refCount");
const repeatWhen_1 = require("rxjs/operators/repeatWhen");
const share_1 = require("rxjs/operators/share");
const Subject_1 = require("rxjs/Subject");
const LoadingCache_1 = require("../abstract/LoadingCache");
class ObservableCache extends LoadingCache_1.LoadingCache {
    constructor(options) {
        super(Object.assign({}, options, { loader: (key) => new DeferObservable_1.DeferObservable(() => options.loader(key)) }));
        this.repeatSubject = new Subject_1.Subject();
        this.observers = new Map();
        this.ticker = options.ticker;
    }
    set(key, value) {
        return new DeferObservable_1.DeferObservable(() => {
            const stream = value.pipe(publishReplay_1.publishReplay(1), refCount_1.refCount(), catchError_1.catchError((error) => {
                this.cache.delete(key);
                return new ErrorObservable_1.ErrorObservable(error);
            }));
            this.cache.set(key, stream);
            return stream;
        });
    }
    get(key) {
        return new DeferObservable_1.DeferObservable(() => super.get(key));
    }
    refresh(key) {
        return new DeferObservable_1.DeferObservable(() => {
            const value = super.refresh(key);
            this.repeatSubject.next(key);
            return value;
        });
    }
    getObserver(key) {
        return new DeferObservable_1.DeferObservable(() => {
            if (this.observers.has(key)) {
                return this.observers.get(key);
            }
            const repeatAfter = Math.max(0, this.expireAfterWrite, this.expireAfterAccess);
            let repeatStream = this.repeatSubject.pipe(filter_1.filter((k) => k === key));
            if (repeatAfter > 0) {
                repeatStream = merge_1.mergeStatic(repeatStream, new IntervalObservable_1.IntervalObservable(repeatAfter, this.ticker));
            }
            const stream = new DeferObservable_1.DeferObservable(() => this.get(key)).pipe(repeatWhen_1.repeatWhen(() => repeatStream), finalize_1.finalize(() => this.observers.delete(key)), share_1.share());
            this.observers.set(key, stream);
            return stream;
        });
    }
}
exports.ObservableCache = ObservableCache;
//# sourceMappingURL=ObservableCache.js.map