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
exports.DatabaseOptimizationService = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./index-management.service"), exports);
__exportStar(require("./query-optimization.service"), exports);
__exportStar(require("./statistics-analysis.service"), exports);
__exportStar(require("./vacuum-maintenance.service"), exports);
__exportStar(require("./bloat-detection.service"), exports);
__exportStar(require("./cache-optimization.service"), exports);
var database_optimization_service_1 = require("./database-optimization.service");
Object.defineProperty(exports, "DatabaseOptimizationService", { enumerable: true, get: function () { return database_optimization_service_1.DatabaseOptimizationService; } });
//# sourceMappingURL=index.js.map