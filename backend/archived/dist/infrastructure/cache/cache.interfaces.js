"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEvent = void 0;
var CacheEvent;
(function (CacheEvent) {
    CacheEvent["HIT"] = "cache:hit";
    CacheEvent["MISS"] = "cache:miss";
    CacheEvent["SET"] = "cache:set";
    CacheEvent["DELETE"] = "cache:delete";
    CacheEvent["INVALIDATE"] = "cache:invalidate";
    CacheEvent["ERROR"] = "cache:error";
    CacheEvent["WARM"] = "cache:warm";
    CacheEvent["EVICT"] = "cache:evict";
})(CacheEvent || (exports.CacheEvent = CacheEvent = {}));
//# sourceMappingURL=cache.interfaces.js.map