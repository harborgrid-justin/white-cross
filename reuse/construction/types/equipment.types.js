"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationStatus = exports.ConditionRating = exports.MaintenanceType = exports.OwnershipType = exports.EquipmentStatus = exports.EquipmentCategory = void 0;
var EquipmentCategory;
(function (EquipmentCategory) {
    EquipmentCategory["EXCAVATOR"] = "excavator";
    EquipmentCategory["BULLDOZER"] = "bulldozer";
    EquipmentCategory["LOADER"] = "loader";
    EquipmentCategory["BACKHOE"] = "backhoe";
    EquipmentCategory["GRADER"] = "grader";
    EquipmentCategory["CRANE"] = "crane";
    EquipmentCategory["FORKLIFT"] = "forklift";
    EquipmentCategory["DUMP_TRUCK"] = "dump_truck";
    EquipmentCategory["CONCRETE_MIXER"] = "concrete_mixer";
    EquipmentCategory["CONCRETE_PUMP"] = "concrete_pump";
    EquipmentCategory["COMPACTOR"] = "compactor";
    EquipmentCategory["PAVER"] = "paver";
    EquipmentCategory["GENERATOR"] = "generator";
    EquipmentCategory["AIR_COMPRESSOR"] = "air_compressor";
    EquipmentCategory["SCAFFOLDING"] = "scaffolding";
    EquipmentCategory["LIFT"] = "lift";
    EquipmentCategory["DRILL"] = "drill";
    EquipmentCategory["SAW"] = "saw";
    EquipmentCategory["HAND_TOOLS"] = "hand_tools";
    EquipmentCategory["SAFETY_EQUIPMENT"] = "safety_equipment";
})(EquipmentCategory || (exports.EquipmentCategory = EquipmentCategory = {}));
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["AVAILABLE"] = "available";
    EquipmentStatus["IN_USE"] = "in_use";
    EquipmentStatus["MAINTENANCE"] = "maintenance";
    EquipmentStatus["REPAIR"] = "repair";
    EquipmentStatus["OUT_OF_SERVICE"] = "out_of_service";
    EquipmentStatus["RESERVED"] = "reserved";
    EquipmentStatus["IN_TRANSIT"] = "in_transit";
    EquipmentStatus["RETIRED"] = "retired";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
var OwnershipType;
(function (OwnershipType) {
    OwnershipType["OWNED"] = "owned";
    OwnershipType["LEASED"] = "leased";
    OwnershipType["RENTED"] = "rented";
    OwnershipType["FINANCED"] = "financed";
})(OwnershipType || (exports.OwnershipType = OwnershipType = {}));
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["PREVENTIVE"] = "preventive";
    MaintenanceType["CORRECTIVE"] = "corrective";
    MaintenanceType["PREDICTIVE"] = "predictive";
    MaintenanceType["EMERGENCY"] = "emergency";
    MaintenanceType["INSPECTION"] = "inspection";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
var ConditionRating;
(function (ConditionRating) {
    ConditionRating["EXCELLENT"] = "excellent";
    ConditionRating["GOOD"] = "good";
    ConditionRating["FAIR"] = "fair";
    ConditionRating["POOR"] = "poor";
    ConditionRating["CRITICAL"] = "critical";
})(ConditionRating || (exports.ConditionRating = ConditionRating = {}));
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["VALID"] = "valid";
    CertificationStatus["EXPIRING_SOON"] = "expiring_soon";
    CertificationStatus["EXPIRED"] = "expired";
    CertificationStatus["NOT_REQUIRED"] = "not_required";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
//# sourceMappingURL=equipment.types.js.map