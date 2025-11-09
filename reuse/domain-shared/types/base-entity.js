"use strict";
/**
 * File: /reuse/domain-shared/types/base-entity.ts
 * Purpose: Base entity type definitions shared across all domain kits
 *
 * This module provides foundational type definitions and interfaces used across
 * construction, consulting, and engineer domains. These types ensure consistency
 * in entity structure, audit metadata, and common patterns.
 *
 * @module DomainShared/BaseEntity
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOperator = exports.ApprovalStatus = exports.Priority = exports.CommonStatus = void 0;
/**
 * Common status enum values used across domains
 * Domains can extend this with domain-specific statuses
 */
var CommonStatus;
(function (CommonStatus) {
    CommonStatus["DRAFT"] = "draft";
    CommonStatus["ACTIVE"] = "active";
    CommonStatus["PENDING"] = "pending";
    CommonStatus["IN_PROGRESS"] = "in_progress";
    CommonStatus["COMPLETED"] = "completed";
    CommonStatus["ON_HOLD"] = "on_hold";
    CommonStatus["CANCELLED"] = "cancelled";
    CommonStatus["ARCHIVED"] = "archived";
})(CommonStatus || (exports.CommonStatus = CommonStatus = {}));
/**
 * Priority levels used across domains
 */
var Priority;
(function (Priority) {
    Priority["CRITICAL"] = "critical";
    Priority["HIGH"] = "high";
    Priority["MEDIUM"] = "medium";
    Priority["LOW"] = "low";
})(Priority || (exports.Priority = Priority = {}));
/**
 * Approval status used in workflow-based entities
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING_APPROVAL"] = "pending_approval";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["NEEDS_REVISION"] = "needs_revision";
    ApprovalStatus["WITHDRAWN"] = "withdrawn";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Filter operators for advanced queries
 */
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQUALS"] = "eq";
    FilterOperator["NOT_EQUALS"] = "ne";
    FilterOperator["GREATER_THAN"] = "gt";
    FilterOperator["GREATER_THAN_OR_EQUAL"] = "gte";
    FilterOperator["LESS_THAN"] = "lt";
    FilterOperator["LESS_THAN_OR_EQUAL"] = "lte";
    FilterOperator["IN"] = "in";
    FilterOperator["NOT_IN"] = "not_in";
    FilterOperator["LIKE"] = "like";
    FilterOperator["BETWEEN"] = "between";
    FilterOperator["IS_NULL"] = "is_null";
    FilterOperator["IS_NOT_NULL"] = "is_not_null";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
//# sourceMappingURL=base-entity.js.map