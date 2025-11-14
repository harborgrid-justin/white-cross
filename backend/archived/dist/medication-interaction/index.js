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
exports.StudentMedication = exports.Medication = void 0;
__exportStar(require("./medication-interaction.controller"), exports);
__exportStar(require("./medication-interaction.module"), exports);
__exportStar(require("./medication-interaction.service"), exports);
__exportStar(require("./dto"), exports);
var models_1 = require("../database/models");
Object.defineProperty(exports, "Medication", { enumerable: true, get: function () { return models_1.Medication; } });
Object.defineProperty(exports, "StudentMedication", { enumerable: true, get: function () { return models_1.StudentMedication; } });
//# sourceMappingURL=index.js.map