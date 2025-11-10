"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetentionPeriod = exports.DistributionStatus = exports.RevisionType = exports.DocumentDiscipline = exports.DocumentStatus = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["DRAWING"] = "drawing";
    DocumentType["SPECIFICATION"] = "specification";
    DocumentType["SUBMITTAL"] = "submittal";
    DocumentType["RFI"] = "rfi";
    DocumentType["CHANGE_ORDER"] = "change_order";
    DocumentType["ADDENDUM"] = "addendum";
    DocumentType["MEETING_MINUTES"] = "meeting_minutes";
    DocumentType["INSPECTION_REPORT"] = "inspection_report";
    DocumentType["TRANSMITTAL"] = "transmittal";
    DocumentType["CONTRACT"] = "contract";
    DocumentType["CORRESPONDENCE"] = "correspondence";
    DocumentType["SHOP_DRAWING"] = "shop_drawing";
    DocumentType["PRODUCT_DATA"] = "product_data";
    DocumentType["SAMPLE"] = "sample";
    DocumentType["CLOSEOUT"] = "closeout";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "draft";
    DocumentStatus["IN_REVIEW"] = "in_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["APPROVED_WITH_COMMENTS"] = "approved_with_comments";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["SUPERSEDED"] = "superseded";
    DocumentStatus["VOID"] = "void";
    DocumentStatus["ISSUED_FOR_CONSTRUCTION"] = "issued_for_construction";
    DocumentStatus["ISSUED_FOR_BIDDING"] = "issued_for_bidding";
    DocumentStatus["ISSUED_FOR_PERMIT"] = "issued_for_permit";
    DocumentStatus["AS_BUILT"] = "as_built";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var DocumentDiscipline;
(function (DocumentDiscipline) {
    DocumentDiscipline["ARCHITECTURAL"] = "architectural";
    DocumentDiscipline["STRUCTURAL"] = "structural";
    DocumentDiscipline["MECHANICAL"] = "mechanical";
    DocumentDiscipline["ELECTRICAL"] = "electrical";
    DocumentDiscipline["PLUMBING"] = "plumbing";
    DocumentDiscipline["CIVIL"] = "civil";
    DocumentDiscipline["LANDSCAPE"] = "landscape";
    DocumentDiscipline["FIRE_PROTECTION"] = "fire_protection";
    DocumentDiscipline["GENERAL"] = "general";
})(DocumentDiscipline || (exports.DocumentDiscipline = DocumentDiscipline = {}));
var RevisionType;
(function (RevisionType) {
    RevisionType["MAJOR"] = "major";
    RevisionType["MINOR"] = "minor";
    RevisionType["ADDENDUM"] = "addendum";
    RevisionType["BULLETIN"] = "bulletin";
    RevisionType["CLARIFICATION"] = "clarification";
})(RevisionType || (exports.RevisionType = RevisionType = {}));
var DistributionStatus;
(function (DistributionStatus) {
    DistributionStatus["PENDING"] = "pending";
    DistributionStatus["SENT"] = "sent";
    DistributionStatus["DELIVERED"] = "delivered";
    DistributionStatus["ACKNOWLEDGED"] = "acknowledged";
    DistributionStatus["REJECTED"] = "rejected";
})(DistributionStatus || (exports.DistributionStatus = DistributionStatus = {}));
var RetentionPeriod;
(function (RetentionPeriod) {
    RetentionPeriod["ONE_YEAR"] = "1_year";
    RetentionPeriod["THREE_YEARS"] = "3_years";
    RetentionPeriod["FIVE_YEARS"] = "5_years";
    RetentionPeriod["SEVEN_YEARS"] = "7_years";
    RetentionPeriod["TEN_YEARS"] = "10_years";
    RetentionPeriod["PERMANENT"] = "permanent";
})(RetentionPeriod || (exports.RetentionPeriod = RetentionPeriod = {}));
//# sourceMappingURL=document.types.js.map