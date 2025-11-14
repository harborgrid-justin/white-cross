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
exports.VaccinationModule = exports.ValidationModule = exports.StatisticsModule = exports.SearchModule = exports.ImportExportModule = exports.VitalsModule = exports.MedicationModule = exports.ChronicConditionModule = exports.AllergyModule = exports.HealthRecordController = exports.HealthRecordService = exports.HealthRecordModule = void 0;
var health_record_module_1 = require("./health-record.module");
Object.defineProperty(exports, "HealthRecordModule", { enumerable: true, get: function () { return health_record_module_1.HealthRecordModule; } });
var health_record_service_1 = require("./health-record.service");
Object.defineProperty(exports, "HealthRecordService", { enumerable: true, get: function () { return health_record_service_1.HealthRecordService; } });
var health_record_controller_1 = require("./health-record.controller");
Object.defineProperty(exports, "HealthRecordController", { enumerable: true, get: function () { return health_record_controller_1.HealthRecordController; } });
__exportStar(require("./dto"), exports);
__exportStar(require("./services"), exports);
var allergy_module_1 = require("../services/allergy/allergy.module");
Object.defineProperty(exports, "AllergyModule", { enumerable: true, get: function () { return allergy_module_1.AllergyModule; } });
var chronic_condition_module_1 = require("./chronic-condition/chronic-condition.module");
Object.defineProperty(exports, "ChronicConditionModule", { enumerable: true, get: function () { return chronic_condition_module_1.ChronicConditionModule; } });
var medication_module_1 = require("./medication/medication.module");
Object.defineProperty(exports, "MedicationModule", { enumerable: true, get: function () { return medication_module_1.MedicationModule; } });
var vitals_module_1 = require("./vitals/vitals.module");
Object.defineProperty(exports, "VitalsModule", { enumerable: true, get: function () { return vitals_module_1.VitalsModule; } });
var import_export_module_1 = require("./import-export/import-export.module");
Object.defineProperty(exports, "ImportExportModule", { enumerable: true, get: function () { return import_export_module_1.ImportExportModule; } });
var search_module_1 = require("./search/search.module");
Object.defineProperty(exports, "SearchModule", { enumerable: true, get: function () { return search_module_1.SearchModule; } });
var statistics_module_1 = require("./statistics/statistics.module");
Object.defineProperty(exports, "StatisticsModule", { enumerable: true, get: function () { return statistics_module_1.StatisticsModule; } });
var validation_module_1 = require("./validation/validation.module");
Object.defineProperty(exports, "ValidationModule", { enumerable: true, get: function () { return validation_module_1.ValidationModule; } });
var vaccination_module_1 = require("./vaccination/vaccination.module");
Object.defineProperty(exports, "VaccinationModule", { enumerable: true, get: function () { return vaccination_module_1.VaccinationModule; } });
//# sourceMappingURL=index.js.map