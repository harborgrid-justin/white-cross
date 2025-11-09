"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayType = exports.MilestoneStatus = exports.ResourceType = exports.RelationshipType = exports.ConstraintType = exports.ActivityStatus = exports.DurationType = void 0;
var DurationType;
(function (DurationType) {
    DurationType["WORKING_DAYS"] = "working_days";
    DurationType["CALENDAR_DAYS"] = "calendar_days";
    DurationType["HOURS"] = "hours";
})(DurationType || (exports.DurationType = DurationType = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["NOT_STARTED"] = "not_started";
    ActivityStatus["IN_PROGRESS"] = "in_progress";
    ActivityStatus["COMPLETED"] = "completed";
    ActivityStatus["SUSPENDED"] = "suspended";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
var ConstraintType;
(function (ConstraintType) {
    ConstraintType["START_NO_EARLIER"] = "start_no_earlier";
    ConstraintType["FINISH_NO_LATER"] = "finish_no_later";
    ConstraintType["MUST_START_ON"] = "must_start_on";
    ConstraintType["MUST_FINISH_ON"] = "must_finish_on";
})(ConstraintType || (exports.ConstraintType = ConstraintType = {}));
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["FS"] = "FS";
    RelationshipType["SS"] = "SS";
    RelationshipType["FF"] = "FF";
    RelationshipType["SF"] = "SF";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["LABOR"] = "labor";
    ResourceType["EQUIPMENT"] = "equipment";
    ResourceType["MATERIAL"] = "material";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["UPCOMING"] = "upcoming";
    MilestoneStatus["ACHIEVED"] = "achieved";
    MilestoneStatus["MISSED"] = "missed";
    MilestoneStatus["AT_RISK"] = "at_risk";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
var DelayType;
(function (DelayType) {
    DelayType["EXCUSABLE"] = "excusable";
    DelayType["COMPENSABLE"] = "compensable";
    DelayType["CONCURRENT"] = "concurrent";
    DelayType["NON_EXCUSABLE"] = "non_excusable";
})(DelayType || (exports.DelayType = DelayType = {}));
//# sourceMappingURL=schedule.types.js.map