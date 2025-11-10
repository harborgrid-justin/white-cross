"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwardMethod = exports.ProcurementMethod = exports.EvaluationCriteriaType = exports.VendorQualificationStatus = exports.BidStatus = exports.BidSolicitationStatus = void 0;
var BidSolicitationStatus;
(function (BidSolicitationStatus) {
    BidSolicitationStatus["DRAFT"] = "draft";
    BidSolicitationStatus["PUBLISHED"] = "published";
    BidSolicitationStatus["OPEN"] = "open";
    BidSolicitationStatus["CLOSED"] = "closed";
    BidSolicitationStatus["CANCELLED"] = "cancelled";
    BidSolicitationStatus["AWARDED"] = "awarded";
})(BidSolicitationStatus || (exports.BidSolicitationStatus = BidSolicitationStatus = {}));
var BidStatus;
(function (BidStatus) {
    BidStatus["DRAFT"] = "draft";
    BidStatus["SUBMITTED"] = "submitted";
    BidStatus["WITHDRAWN"] = "withdrawn";
    BidStatus["UNDER_EVALUATION"] = "under_evaluation";
    BidStatus["QUALIFIED"] = "qualified";
    BidStatus["DISQUALIFIED"] = "disqualified";
    BidStatus["AWARDED"] = "awarded";
    BidStatus["REJECTED"] = "rejected";
})(BidStatus || (exports.BidStatus = BidStatus = {}));
var VendorQualificationStatus;
(function (VendorQualificationStatus) {
    VendorQualificationStatus["PENDING"] = "pending";
    VendorQualificationStatus["APPROVED"] = "approved";
    VendorQualificationStatus["CONDITIONAL"] = "conditional";
    VendorQualificationStatus["REJECTED"] = "rejected";
    VendorQualificationStatus["EXPIRED"] = "expired";
})(VendorQualificationStatus || (exports.VendorQualificationStatus = VendorQualificationStatus = {}));
var EvaluationCriteriaType;
(function (EvaluationCriteriaType) {
    EvaluationCriteriaType["TECHNICAL"] = "technical";
    EvaluationCriteriaType["FINANCIAL"] = "financial";
    EvaluationCriteriaType["PAST_PERFORMANCE"] = "past_performance";
    EvaluationCriteriaType["EXPERIENCE"] = "experience";
    EvaluationCriteriaType["SCHEDULE"] = "schedule";
    EvaluationCriteriaType["SAFETY"] = "safety";
    EvaluationCriteriaType["QUALITY"] = "quality";
})(EvaluationCriteriaType || (exports.EvaluationCriteriaType = EvaluationCriteriaType = {}));
var ProcurementMethod;
(function (ProcurementMethod) {
    ProcurementMethod["COMPETITIVE_SEALED_BID"] = "competitive_sealed_bid";
    ProcurementMethod["COMPETITIVE_NEGOTIATION"] = "competitive_negotiation";
    ProcurementMethod["SMALL_PURCHASE"] = "small_purchase";
    ProcurementMethod["SOLE_SOURCE"] = "sole_source";
    ProcurementMethod["EMERGENCY"] = "emergency";
})(ProcurementMethod || (exports.ProcurementMethod = ProcurementMethod = {}));
var AwardMethod;
(function (AwardMethod) {
    AwardMethod["LOWEST_RESPONSIVE_BID"] = "lowest_responsive_bid";
    AwardMethod["BEST_VALUE"] = "best_value";
    AwardMethod["QUALIFICATIONS_BASED"] = "qualifications_based";
    AwardMethod["TWO_STEP"] = "two_step";
})(AwardMethod || (exports.AwardMethod = AwardMethod = {}));
//# sourceMappingURL=bid.types.js.map