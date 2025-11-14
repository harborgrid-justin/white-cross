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
exports.AllergySeverity = exports.AllergyType = exports.Allergy = exports.AllergyController = exports.AllergyModule = void 0;
var allergy_module_1 = require("./allergy.module");
Object.defineProperty(exports, "AllergyModule", { enumerable: true, get: function () { return allergy_module_1.AllergyModule; } });
__exportStar(require("./services"), exports);
var allergy_controller_1 = require("./allergy.controller");
Object.defineProperty(exports, "AllergyController", { enumerable: true, get: function () { return allergy_controller_1.AllergyController; } });
var models_1 = require("../../database/models");
Object.defineProperty(exports, "Allergy", { enumerable: true, get: function () { return models_1.Allergy; } });
Object.defineProperty(exports, "AllergyType", { enumerable: true, get: function () { return models_1.AllergyType; } });
Object.defineProperty(exports, "AllergySeverity", { enumerable: true, get: function () { return models_1.AllergySeverity; } });
//# sourceMappingURL=index.js.map