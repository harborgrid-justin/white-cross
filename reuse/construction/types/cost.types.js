"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeOrderStatus = exports.CommitmentType = exports.CostType = exports.CostCategory = exports.EstimateType = void 0;
var EstimateType;
(function (EstimateType) {
    EstimateType["PRELIMINARY"] = "preliminary";
    EstimateType["CONCEPTUAL"] = "conceptual";
    EstimateType["DETAILED"] = "detailed";
    EstimateType["CONTROL"] = "control";
})(EstimateType || (exports.EstimateType = EstimateType = {}));
var CostCategory;
(function (CostCategory) {
    CostCategory["LABOR"] = "labor";
    CostCategory["MATERIAL"] = "material";
    CostCategory["EQUIPMENT"] = "equipment";
    CostCategory["SUBCONTRACTOR"] = "subcontractor";
    CostCategory["INDIRECT"] = "indirect";
    CostCategory["OTHER"] = "other";
})(CostCategory || (exports.CostCategory = CostCategory = {}));
var CostType;
(function (CostType) {
    CostType["LABOR"] = "labor";
    CostType["MATERIAL"] = "material";
    CostType["EQUIPMENT"] = "equipment";
    CostType["SUBCONTRACTOR"] = "subcontractor";
    CostType["INDIRECT"] = "indirect";
})(CostType || (exports.CostType = CostType = {}));
var CommitmentType;
(function (CommitmentType) {
    CommitmentType["PURCHASE_ORDER"] = "purchase_order";
    CommitmentType["SUBCONTRACT"] = "subcontract";
    CommitmentType["RENTAL_AGREEMENT"] = "rental_agreement";
})(CommitmentType || (exports.CommitmentType = CommitmentType = {}));
var ChangeOrderStatus;
(function (ChangeOrderStatus) {
    ChangeOrderStatus["PENDING"] = "pending";
    ChangeOrderStatus["APPROVED"] = "approved";
    ChangeOrderStatus["REJECTED"] = "rejected";
    ChangeOrderStatus["INCORPORATED"] = "incorporated";
})(ChangeOrderStatus || (exports.ChangeOrderStatus = ChangeOrderStatus = {}));
//# sourceMappingURL=cost.types.js.map