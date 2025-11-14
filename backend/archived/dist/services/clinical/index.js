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
exports.VitalSigns = exports.TreatmentPlan = exports.StudentDrugAllergy = exports.Prescription = exports.FollowUpAppointment = exports.DrugInteraction = exports.DrugCatalog = exports.ClinicalProtocol = exports.ClinicalNote = exports.ClinicVisit = exports.ClinicalModule = void 0;
var clinical_module_1 = require("./clinical.module");
Object.defineProperty(exports, "ClinicalModule", { enumerable: true, get: function () { return clinical_module_1.ClinicalModule; } });
__exportStar(require("./dto"), exports);
var models_1 = require("../../database/models");
Object.defineProperty(exports, "ClinicVisit", { enumerable: true, get: function () { return models_1.ClinicVisit; } });
Object.defineProperty(exports, "ClinicalNote", { enumerable: true, get: function () { return models_1.ClinicalNote; } });
Object.defineProperty(exports, "ClinicalProtocol", { enumerable: true, get: function () { return models_1.ClinicalProtocol; } });
Object.defineProperty(exports, "DrugCatalog", { enumerable: true, get: function () { return models_1.DrugCatalog; } });
Object.defineProperty(exports, "DrugInteraction", { enumerable: true, get: function () { return models_1.DrugInteraction; } });
Object.defineProperty(exports, "FollowUpAppointment", { enumerable: true, get: function () { return models_1.FollowUpAppointment; } });
Object.defineProperty(exports, "Prescription", { enumerable: true, get: function () { return models_1.Prescription; } });
Object.defineProperty(exports, "StudentDrugAllergy", { enumerable: true, get: function () { return models_1.StudentDrugAllergy; } });
Object.defineProperty(exports, "TreatmentPlan", { enumerable: true, get: function () { return models_1.TreatmentPlan; } });
Object.defineProperty(exports, "VitalSigns", { enumerable: true, get: function () { return models_1.VitalSigns; } });
__exportStar(require("./controllers"), exports);
__exportStar(require("./services"), exports);
//# sourceMappingURL=index.js.map