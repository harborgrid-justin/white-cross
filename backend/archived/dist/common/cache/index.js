"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareInvalidationStrategy = exports.HealthcareCacheStrategy = exports.HealthcareCacheUtils = exports.HealthcareCacheFactory = exports.HealthcareCacheService = void 0;
__exportStar(require("./healthcare-cache.service"), exports);
var healthcare_cache_service_1 = require("./healthcare-cache.service");
Object.defineProperty(exports, "HealthcareCacheService", { enumerable: true, get: function () { return healthcare_cache_service_1.HealthcareCacheService; } });
Object.defineProperty(exports, "HealthcareCacheFactory", { enumerable: true, get: function () { return healthcare_cache_service_1.HealthcareCacheFactory; } });
Object.defineProperty(exports, "HealthcareCacheUtils", { enumerable: true, get: function () { return healthcare_cache_service_1.HealthcareCacheUtils; } });
Object.defineProperty(exports, "HealthcareCacheStrategy", { enumerable: true, get: function () { return healthcare_cache_service_1.HealthcareCacheStrategy; } });
Object.defineProperty(exports, "HealthcareInvalidationStrategy", { enumerable: true, get: function () { return healthcare_cache_service_1.HealthcareInvalidationStrategy; } });
//# sourceMappingURL=index.js.map