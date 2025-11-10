"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractDocumentType = exports.BondType = exports.InsuranceType = exports.MilestoneStatus = exports.AmendmentStatus = exports.PaymentStatus = exports.ContractType = exports.ContractStatus = void 0;
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING_APPROVAL"] = "pending_approval";
    ContractStatus["APPROVED"] = "approved";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["SUSPENDED"] = "suspended";
    ContractStatus["COMPLETED"] = "completed";
    ContractStatus["TERMINATED"] = "terminated";
    ContractStatus["CLOSED"] = "closed";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var ContractType;
(function (ContractType) {
    ContractType["LUMP_SUM"] = "lump_sum";
    ContractType["UNIT_PRICE"] = "unit_price";
    ContractType["COST_PLUS"] = "cost_plus";
    ContractType["TIME_AND_MATERIALS"] = "time_and_materials";
    ContractType["GUARANTEED_MAXIMUM_PRICE"] = "guaranteed_maximum_price";
    ContractType["DESIGN_BUILD"] = "design_build";
})(ContractType || (exports.ContractType = ContractType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["DRAFT"] = "draft";
    PaymentStatus["SUBMITTED"] = "submitted";
    PaymentStatus["UNDER_REVIEW"] = "under_review";
    PaymentStatus["APPROVED"] = "approved";
    PaymentStatus["REJECTED"] = "rejected";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["PARTIALLY_PAID"] = "partially_paid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var AmendmentStatus;
(function (AmendmentStatus) {
    AmendmentStatus["DRAFT"] = "draft";
    AmendmentStatus["PENDING_REVIEW"] = "pending_review";
    AmendmentStatus["APPROVED"] = "approved";
    AmendmentStatus["REJECTED"] = "rejected";
    AmendmentStatus["EXECUTED"] = "executed";
})(AmendmentStatus || (exports.AmendmentStatus = AmendmentStatus = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["NOT_STARTED"] = "not_started";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["COMPLETED"] = "completed";
    MilestoneStatus["VERIFIED"] = "verified";
    MilestoneStatus["OVERDUE"] = "overdue";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
var InsuranceType;
(function (InsuranceType) {
    InsuranceType["GENERAL_LIABILITY"] = "general_liability";
    InsuranceType["WORKERS_COMPENSATION"] = "workers_compensation";
    InsuranceType["PROFESSIONAL_LIABILITY"] = "professional_liability";
    InsuranceType["BUILDERS_RISK"] = "builders_risk";
    InsuranceType["UMBRELLA"] = "umbrella";
    InsuranceType["AUTO"] = "auto";
})(InsuranceType || (exports.InsuranceType = InsuranceType = {}));
var BondType;
(function (BondType) {
    BondType["BID_BOND"] = "bid_bond";
    BondType["PERFORMANCE_BOND"] = "performance_bond";
    BondType["PAYMENT_BOND"] = "payment_bond";
    BondType["MAINTENANCE_BOND"] = "maintenance_bond";
})(BondType || (exports.BondType = BondType = {}));
var ContractDocumentType;
(function (ContractDocumentType) {
    ContractDocumentType["CONTRACT_AGREEMENT"] = "contract_agreement";
    ContractDocumentType["GENERAL_CONDITIONS"] = "general_conditions";
    ContractDocumentType["SPECIAL_CONDITIONS"] = "special_conditions";
    ContractDocumentType["TECHNICAL_SPECIFICATIONS"] = "technical_specifications";
    ContractDocumentType["DRAWINGS"] = "drawings";
    ContractDocumentType["ADDENDUM"] = "addendum";
    ContractDocumentType["AMENDMENT"] = "amendment";
    ContractDocumentType["EXHIBIT"] = "exhibit";
})(ContractDocumentType || (exports.ContractDocumentType = ContractDocumentType = {}));
//# sourceMappingURL=contract.types.js.map