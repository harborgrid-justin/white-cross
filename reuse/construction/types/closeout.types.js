"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.TrainingStatus = exports.InspectionResult = exports.DocumentStatus = exports.CloseoutDocumentType = exports.PunchListItemCategory = exports.PunchListItemPriority = exports.PunchListItemStatus = exports.CloseoutStatus = void 0;
var CloseoutStatus;
(function (CloseoutStatus) {
    CloseoutStatus["INITIATED"] = "INITIATED";
    CloseoutStatus["PUNCH_LIST_IN_PROGRESS"] = "PUNCH_LIST_IN_PROGRESS";
    CloseoutStatus["FINAL_INSPECTION_SCHEDULED"] = "FINAL_INSPECTION_SCHEDULED";
    CloseoutStatus["FINAL_INSPECTION_COMPLETE"] = "FINAL_INSPECTION_COMPLETE";
    CloseoutStatus["DOCUMENTATION_IN_PROGRESS"] = "DOCUMENTATION_IN_PROGRESS";
    CloseoutStatus["OWNER_TRAINING_SCHEDULED"] = "OWNER_TRAINING_SCHEDULED";
    CloseoutStatus["OWNER_TRAINING_COMPLETE"] = "OWNER_TRAINING_COMPLETE";
    CloseoutStatus["WARRANTY_DOCUMENTATION_PENDING"] = "WARRANTY_DOCUMENTATION_PENDING";
    CloseoutStatus["FINAL_PAYMENT_PENDING"] = "FINAL_PAYMENT_PENDING";
    CloseoutStatus["LIEN_RELEASE_PENDING"] = "LIEN_RELEASE_PENDING";
    CloseoutStatus["SUBSTANTIALLY_COMPLETE"] = "SUBSTANTIALLY_COMPLETE";
    CloseoutStatus["FULLY_COMPLETE"] = "FULLY_COMPLETE";
    CloseoutStatus["ON_HOLD"] = "ON_HOLD";
    CloseoutStatus["CANCELLED"] = "CANCELLED";
})(CloseoutStatus || (exports.CloseoutStatus = CloseoutStatus = {}));
var PunchListItemStatus;
(function (PunchListItemStatus) {
    PunchListItemStatus["OPEN"] = "OPEN";
    PunchListItemStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PunchListItemStatus["READY_FOR_REVIEW"] = "READY_FOR_REVIEW";
    PunchListItemStatus["REVIEWED"] = "REVIEWED";
    PunchListItemStatus["APPROVED"] = "APPROVED";
    PunchListItemStatus["REJECTED"] = "REJECTED";
    PunchListItemStatus["CLOSED"] = "CLOSED";
    PunchListItemStatus["CANCELLED"] = "CANCELLED";
})(PunchListItemStatus || (exports.PunchListItemStatus = PunchListItemStatus = {}));
var PunchListItemPriority;
(function (PunchListItemPriority) {
    PunchListItemPriority["CRITICAL"] = "CRITICAL";
    PunchListItemPriority["HIGH"] = "HIGH";
    PunchListItemPriority["MEDIUM"] = "MEDIUM";
    PunchListItemPriority["LOW"] = "LOW";
})(PunchListItemPriority || (exports.PunchListItemPriority = PunchListItemPriority = {}));
var PunchListItemCategory;
(function (PunchListItemCategory) {
    PunchListItemCategory["SAFETY"] = "SAFETY";
    PunchListItemCategory["CODE_COMPLIANCE"] = "CODE_COMPLIANCE";
    PunchListItemCategory["QUALITY"] = "QUALITY";
    PunchListItemCategory["FINISH"] = "FINISH";
    PunchListItemCategory["FUNCTIONAL"] = "FUNCTIONAL";
    PunchListItemCategory["COSMETIC"] = "COSMETIC";
    PunchListItemCategory["DOCUMENTATION"] = "DOCUMENTATION";
    PunchListItemCategory["WARRANTY"] = "WARRANTY";
    PunchListItemCategory["OTHER"] = "OTHER";
})(PunchListItemCategory || (exports.PunchListItemCategory = PunchListItemCategory = {}));
var CloseoutDocumentType;
(function (CloseoutDocumentType) {
    CloseoutDocumentType["AS_BUILT_DRAWING"] = "AS_BUILT_DRAWING";
    CloseoutDocumentType["OM_MANUAL"] = "OM_MANUAL";
    CloseoutDocumentType["WARRANTY_CERTIFICATE"] = "WARRANTY_CERTIFICATE";
    CloseoutDocumentType["EQUIPMENT_WARRANTY"] = "EQUIPMENT_WARRANTY";
    CloseoutDocumentType["MATERIAL_WARRANTY"] = "MATERIAL_WARRANTY";
    CloseoutDocumentType["TRAINING_MATERIAL"] = "TRAINING_MATERIAL";
    CloseoutDocumentType["TRAINING_CERTIFICATE"] = "TRAINING_CERTIFICATE";
    CloseoutDocumentType["INSPECTION_REPORT"] = "INSPECTION_REPORT";
    CloseoutDocumentType["CERTIFICATE_OF_OCCUPANCY"] = "CERTIFICATE_OF_OCCUPANCY";
    CloseoutDocumentType["LIEN_RELEASE"] = "LIEN_RELEASE";
    CloseoutDocumentType["FINAL_PAYMENT_APPLICATION"] = "FINAL_PAYMENT_APPLICATION";
    CloseoutDocumentType["CLOSEOUT_CHECKLIST"] = "CLOSEOUT_CHECKLIST";
    CloseoutDocumentType["LESSONS_LEARNED"] = "LESSONS_LEARNED";
    CloseoutDocumentType["FINAL_PROJECT_REPORT"] = "FINAL_PROJECT_REPORT";
    CloseoutDocumentType["ATTIC_STOCK"] = "ATTIC_STOCK";
    CloseoutDocumentType["KEYING_SCHEDULE"] = "KEYING_SCHEDULE";
    CloseoutDocumentType["COMMISSIONING_REPORT"] = "COMMISSIONING_REPORT";
    CloseoutDocumentType["TEST_REPORT"] = "TEST_REPORT";
    CloseoutDocumentType["OTHER"] = "OTHER";
})(CloseoutDocumentType || (exports.CloseoutDocumentType = CloseoutDocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DocumentStatus["SUBMITTED"] = "SUBMITTED";
    DocumentStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    DocumentStatus["APPROVED"] = "APPROVED";
    DocumentStatus["REJECTED"] = "REJECTED";
    DocumentStatus["DELIVERED"] = "DELIVERED";
    DocumentStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var InspectionResult;
(function (InspectionResult) {
    InspectionResult["PASSED"] = "PASSED";
    InspectionResult["PASSED_WITH_CONDITIONS"] = "PASSED_WITH_CONDITIONS";
    InspectionResult["FAILED"] = "FAILED";
    InspectionResult["PENDING"] = "PENDING";
    InspectionResult["CANCELLED"] = "CANCELLED";
})(InspectionResult || (exports.InspectionResult = InspectionResult = {}));
var TrainingStatus;
(function (TrainingStatus) {
    TrainingStatus["SCHEDULED"] = "SCHEDULED";
    TrainingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TrainingStatus["COMPLETED"] = "COMPLETED";
    TrainingStatus["RESCHEDULED"] = "RESCHEDULED";
    TrainingStatus["CANCELLED"] = "CANCELLED";
})(TrainingStatus || (exports.TrainingStatus = TrainingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["APPROVED"] = "APPROVED";
    PaymentStatus["PROCESSED"] = "PROCESSED";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["REJECTED"] = "REJECTED";
    PaymentStatus["ON_HOLD"] = "ON_HOLD";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=closeout.types.js.map