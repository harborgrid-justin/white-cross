"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOperator = void 0;
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQ"] = "eq";
    FilterOperator["NE"] = "ne";
    FilterOperator["GT"] = "gt";
    FilterOperator["GTE"] = "gte";
    FilterOperator["LT"] = "lt";
    FilterOperator["LTE"] = "lte";
    FilterOperator["IN"] = "in";
    FilterOperator["NOT_IN"] = "notIn";
    FilterOperator["LIKE"] = "like";
    FilterOperator["ILIKE"] = "iLike";
    FilterOperator["NOT_LIKE"] = "notLike";
    FilterOperator["BETWEEN"] = "between";
    FilterOperator["IS_NULL"] = "isNull";
    FilterOperator["NOT_NULL"] = "notNull";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["CONTAINED"] = "contained";
    FilterOperator["OVERLAP"] = "overlap";
    FilterOperator["REGEXP"] = "regexp";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
//# sourceMappingURL=interfaces.js.map