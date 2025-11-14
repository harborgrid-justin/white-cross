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
exports.WitnessStatement = exports.FollowUpAction = exports.IncidentReport = void 0;
__exportStar(require("./incident-report.controller"), exports);
__exportStar(require("./incident-report.module"), exports);
__exportStar(require("./dto"), exports);
var models_1 = require("../database/models");
Object.defineProperty(exports, "IncidentReport", { enumerable: true, get: function () { return models_1.IncidentReport; } });
Object.defineProperty(exports, "FollowUpAction", { enumerable: true, get: function () { return models_1.FollowUpAction; } });
Object.defineProperty(exports, "WitnessStatement", { enumerable: true, get: function () { return models_1.WitnessStatement; } });
__exportStar(require("./enums"), exports);
__exportStar(require("./services"), exports);
//# sourceMappingURL=index.js.map