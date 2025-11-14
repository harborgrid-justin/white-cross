"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceStatus = exports.RouteOfAdministration = exports.SiteOfAdministration = exports.VaccineType = void 0;
var VaccineType;
(function (VaccineType) {
    VaccineType["COVID_19"] = "COVID_19";
    VaccineType["FLU"] = "FLU";
    VaccineType["MEASLES"] = "MEASLES";
    VaccineType["MUMPS"] = "MUMPS";
    VaccineType["RUBELLA"] = "RUBELLA";
    VaccineType["MMR"] = "MMR";
    VaccineType["POLIO"] = "POLIO";
    VaccineType["HEPATITIS_A"] = "HEPATITIS_A";
    VaccineType["HEPATITIS_B"] = "HEPATITIS_B";
    VaccineType["VARICELLA"] = "VARICELLA";
    VaccineType["TETANUS"] = "TETANUS";
    VaccineType["DIPHTHERIA"] = "DIPHTHERIA";
    VaccineType["PERTUSSIS"] = "PERTUSSIS";
    VaccineType["TDAP"] = "TDAP";
    VaccineType["DTAP"] = "DTAP";
    VaccineType["HIB"] = "HIB";
    VaccineType["PNEUMOCOCCAL"] = "PNEUMOCOCCAL";
    VaccineType["ROTAVIRUS"] = "ROTAVIRUS";
    VaccineType["MENINGOCOCCAL"] = "MENINGOCOCCAL";
    VaccineType["HPV"] = "HPV";
    VaccineType["OTHER"] = "OTHER";
})(VaccineType || (exports.VaccineType = VaccineType = {}));
var SiteOfAdministration;
(function (SiteOfAdministration) {
    SiteOfAdministration["ARM_LEFT"] = "ARM_LEFT";
    SiteOfAdministration["ARM_RIGHT"] = "ARM_RIGHT";
    SiteOfAdministration["THIGH_LEFT"] = "THIGH_LEFT";
    SiteOfAdministration["THIGH_RIGHT"] = "THIGH_RIGHT";
    SiteOfAdministration["BUTTOCK_LEFT"] = "BUTTOCK_LEFT";
    SiteOfAdministration["BUTTOCK_RIGHT"] = "BUTTOCK_RIGHT";
    SiteOfAdministration["ORAL"] = "ORAL";
    SiteOfAdministration["NASAL"] = "NASAL";
    SiteOfAdministration["OTHER"] = "OTHER";
})(SiteOfAdministration || (exports.SiteOfAdministration = SiteOfAdministration = {}));
var RouteOfAdministration;
(function (RouteOfAdministration) {
    RouteOfAdministration["INTRAMUSCULAR"] = "INTRAMUSCULAR";
    RouteOfAdministration["SUBCUTANEOUS"] = "SUBCUTANEOUS";
    RouteOfAdministration["INTRADERMAL"] = "INTRADERMAL";
    RouteOfAdministration["ORAL"] = "ORAL";
    RouteOfAdministration["INTRANASAL"] = "INTRANASAL";
    RouteOfAdministration["INTRAVENOUS"] = "INTRAVENOUS";
    RouteOfAdministration["OTHER"] = "OTHER";
})(RouteOfAdministration || (exports.RouteOfAdministration = RouteOfAdministration = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["OVERDUE"] = "OVERDUE";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "PARTIALLY_COMPLIANT";
    ComplianceStatus["EXEMPT"] = "EXEMPT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
//# sourceMappingURL=vaccination.interface.js.map