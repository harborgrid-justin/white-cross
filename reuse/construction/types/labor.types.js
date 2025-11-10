"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalStatus = exports.CertificationStatus = exports.UnionStatus = exports.PayrollType = exports.TimesheetStatus = exports.ShiftType = exports.LaborCraft = void 0;
var LaborCraft;
(function (LaborCraft) {
    LaborCraft["CARPENTER"] = "carpenter";
    LaborCraft["ELECTRICIAN"] = "electrician";
    LaborCraft["PLUMBER"] = "plumber";
    LaborCraft["HVAC_TECHNICIAN"] = "hvac_technician";
    LaborCraft["MASON"] = "mason";
    LaborCraft["IRONWORKER"] = "ironworker";
    LaborCraft["LABORER"] = "laborer";
    LaborCraft["EQUIPMENT_OPERATOR"] = "equipment_operator";
    LaborCraft["FOREMAN"] = "foreman";
    LaborCraft["SUPERINTENDENT"] = "superintendent";
    LaborCraft["SAFETY_OFFICER"] = "safety_officer";
})(LaborCraft || (exports.LaborCraft = LaborCraft = {}));
var ShiftType;
(function (ShiftType) {
    ShiftType["DAY"] = "day";
    ShiftType["NIGHT"] = "night";
    ShiftType["SWING"] = "swing";
    ShiftType["OVERTIME"] = "overtime";
    ShiftType["WEEKEND"] = "weekend";
})(ShiftType || (exports.ShiftType = ShiftType = {}));
var TimesheetStatus;
(function (TimesheetStatus) {
    TimesheetStatus["DRAFT"] = "draft";
    TimesheetStatus["SUBMITTED"] = "submitted";
    TimesheetStatus["APPROVED"] = "approved";
    TimesheetStatus["REJECTED"] = "rejected";
    TimesheetStatus["CERTIFIED"] = "certified";
})(TimesheetStatus || (exports.TimesheetStatus = TimesheetStatus = {}));
var PayrollType;
(function (PayrollType) {
    PayrollType["REGULAR"] = "regular";
    PayrollType["OVERTIME"] = "overtime";
    PayrollType["DOUBLE_TIME"] = "double_time";
    PayrollType["PREVAILING_WAGE"] = "prevailing_wage";
})(PayrollType || (exports.PayrollType = PayrollType = {}));
var UnionStatus;
(function (UnionStatus) {
    UnionStatus["UNION"] = "union";
    UnionStatus["NON_UNION"] = "non_union";
    UnionStatus["APPRENTICE"] = "apprentice";
})(UnionStatus || (exports.UnionStatus = UnionStatus = {}));
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["ACTIVE"] = "active";
    CertificationStatus["EXPIRED"] = "expired";
    CertificationStatus["PENDING"] = "pending";
    CertificationStatus["SUSPENDED"] = "suspended";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
//# sourceMappingURL=labor.types.js.map