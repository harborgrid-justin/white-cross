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
exports.FollowUpStatus = exports.UpdateAdministrationDto = exports.CalculateDoseDto = exports.CheckSafetyDto = exports.AdministrationHistoryFiltersDto = exports.AdministrationStatus = exports.SubmitWitnessSignatureDto = exports.RequestWitnessSignatureDto = exports.RecordHeldMedicationDto = exports.RecordMissedDoseDto = exports.RecordRefusalDto = exports.InitiateAdministrationDto = exports.RecordAdministrationDto = exports.VitalSignsDto = exports.StudentResponse = exports.FiveRightsVerificationResultDto = exports.VerifyFiveRightsDto = exports.FiveRightsDataDto = exports.AdministrationRoute = void 0;
var five_rights_verification_dto_1 = require("./five-rights-verification.dto");
Object.defineProperty(exports, "AdministrationRoute", { enumerable: true, get: function () { return five_rights_verification_dto_1.AdministrationRoute; } });
Object.defineProperty(exports, "FiveRightsDataDto", { enumerable: true, get: function () { return five_rights_verification_dto_1.FiveRightsDataDto; } });
Object.defineProperty(exports, "VerifyFiveRightsDto", { enumerable: true, get: function () { return five_rights_verification_dto_1.VerifyFiveRightsDto; } });
Object.defineProperty(exports, "FiveRightsVerificationResultDto", { enumerable: true, get: function () { return five_rights_verification_dto_1.FiveRightsVerificationResultDto; } });
var record_administration_dto_1 = require("./record-administration.dto");
Object.defineProperty(exports, "StudentResponse", { enumerable: true, get: function () { return record_administration_dto_1.StudentResponse; } });
Object.defineProperty(exports, "VitalSignsDto", { enumerable: true, get: function () { return record_administration_dto_1.VitalSignsDto; } });
Object.defineProperty(exports, "RecordAdministrationDto", { enumerable: true, get: function () { return record_administration_dto_1.RecordAdministrationDto; } });
Object.defineProperty(exports, "InitiateAdministrationDto", { enumerable: true, get: function () { return record_administration_dto_1.InitiateAdministrationDto; } });
var record_refusal_dto_1 = require("./record-refusal.dto");
Object.defineProperty(exports, "RecordRefusalDto", { enumerable: true, get: function () { return record_refusal_dto_1.RecordRefusalDto; } });
Object.defineProperty(exports, "RecordMissedDoseDto", { enumerable: true, get: function () { return record_refusal_dto_1.RecordMissedDoseDto; } });
Object.defineProperty(exports, "RecordHeldMedicationDto", { enumerable: true, get: function () { return record_refusal_dto_1.RecordHeldMedicationDto; } });
var witness_signature_dto_1 = require("./witness-signature.dto");
Object.defineProperty(exports, "RequestWitnessSignatureDto", { enumerable: true, get: function () { return witness_signature_dto_1.RequestWitnessSignatureDto; } });
Object.defineProperty(exports, "SubmitWitnessSignatureDto", { enumerable: true, get: function () { return witness_signature_dto_1.SubmitWitnessSignatureDto; } });
var administration_filters_dto_1 = require("./administration-filters.dto");
Object.defineProperty(exports, "AdministrationStatus", { enumerable: true, get: function () { return administration_filters_dto_1.AdministrationStatus; } });
Object.defineProperty(exports, "AdministrationHistoryFiltersDto", { enumerable: true, get: function () { return administration_filters_dto_1.AdministrationHistoryFiltersDto; } });
Object.defineProperty(exports, "CheckSafetyDto", { enumerable: true, get: function () { return administration_filters_dto_1.CheckSafetyDto; } });
Object.defineProperty(exports, "CalculateDoseDto", { enumerable: true, get: function () { return administration_filters_dto_1.CalculateDoseDto; } });
var update_administration_dto_1 = require("./update-administration.dto");
Object.defineProperty(exports, "UpdateAdministrationDto", { enumerable: true, get: function () { return update_administration_dto_1.UpdateAdministrationDto; } });
Object.defineProperty(exports, "FollowUpStatus", { enumerable: true, get: function () { return update_administration_dto_1.FollowUpStatus; } });
__exportStar(require("./administration-filters.dto"), exports);
__exportStar(require("./five-rights-verification.dto"), exports);
__exportStar(require("./record-administration.dto"), exports);
__exportStar(require("./record-refusal.dto"), exports);
__exportStar(require("./witness-signature.dto"), exports);
//# sourceMappingURL=index.js.map