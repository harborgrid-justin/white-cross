"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbacOperator = exports.AttributeType = void 0;
var AttributeType;
(function (AttributeType) {
    AttributeType["USER"] = "user";
    AttributeType["RESOURCE"] = "resource";
    AttributeType["ACTION"] = "action";
    AttributeType["ENVIRONMENT"] = "environment";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
var AbacOperator;
(function (AbacOperator) {
    AbacOperator["EQUALS"] = "equals";
    AbacOperator["NOT_EQUALS"] = "notEquals";
    AbacOperator["GREATER_THAN"] = "greaterThan";
    AbacOperator["LESS_THAN"] = "lessThan";
    AbacOperator["IN"] = "in";
    AbacOperator["NOT_IN"] = "notIn";
    AbacOperator["CONTAINS"] = "contains";
    AbacOperator["MATCHES"] = "matches";
})(AbacOperator || (exports.AbacOperator = AbacOperator = {}));
//# sourceMappingURL=abac-policy.interface.js.map