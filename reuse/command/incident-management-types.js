"use strict";
/**
 * @fileoverview Advanced TypeScript Type Definitions for Incident Management Systems
 *
 * This module provides a comprehensive type system for command and control incident management,
 * leveraging advanced TypeScript features including discriminated unions, conditional types,
 * mapped types, template literal types, and branded primitives. The type system enforces
 * compile-time guarantees for incident lifecycle management, resource allocation, and
 * inter-agency coordination.
 *
 * **Architecture Principles:**
 * - Type-level state machines for status transitions with exhaustive checking
 * - Branded types for domain-specific primitives preventing accidental misuse
 * - Discriminated unions for type-safe pattern matching and runtime discrimination
 * - Generic constraints ensuring structural and semantic correctness
 * - Variance annotations for proper subtype relationships
 * - Conditional types for type transformations and validations
 *
 * **Type Safety Guarantees:**
 * - All types are strictly typed with no implicit `any`
 * - Illegal states are unrepresentable through type design
 * - Exhaustive pattern matching enforced by discriminated unions
 * - Compile-time validation of status transitions
 * - Type-safe event payloads with temporal ordering
 *
 * **Performance Considerations:**
 * - Zero runtime overhead - all types erased at compile time
 * - Structural typing enables efficient type checking
 * - Const assertions for literal type inference
 * - Readonly types prevent defensive copying
 *
 * @module incident-management-types
 * @category Type System
 * @since 1.0.0
 * @author TypeScript Architect
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePriority = exports.ChannelType = exports.ResourceStatus = exports.ResourceType = exports.ICSPosition = exports.IncidentStatus = exports.IncidentSeverity = void 0;
// ============================================================================
// INCIDENT TYPE HIERARCHIES - Discriminated Unions
// ============================================================================
/**
 * Incident severity levels with strict ordering guarantees.
 * Uses numeric literal types for compile-time ordering validation.
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity[IncidentSeverity["ROUTINE"] = 1] = "ROUTINE";
    IncidentSeverity[IncidentSeverity["ELEVATED"] = 2] = "ELEVATED";
    IncidentSeverity[IncidentSeverity["URGENT"] = 3] = "URGENT";
    IncidentSeverity[IncidentSeverity["CRITICAL"] = 4] = "CRITICAL";
    IncidentSeverity[IncidentSeverity["CATASTROPHIC"] = 5] = "CATASTROPHIC";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
// ============================================================================
// STATUS TRANSITION TYPES - State Machine
// ============================================================================
/**
 * Incident lifecycle status with state machine semantics.
 * Transitions are validated at compile time through mapped types.
 */
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["REPORTED"] = "REPORTED";
    IncidentStatus["DISPATCHED"] = "DISPATCHED";
    IncidentStatus["EN_ROUTE"] = "EN_ROUTE";
    IncidentStatus["ON_SCENE"] = "ON_SCENE";
    IncidentStatus["CONTAINED"] = "CONTAINED";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
// ============================================================================
// COMMAND STRUCTURE TYPES
// ============================================================================
/**
 * Incident Command System (ICS) position types.
 */
var ICSPosition;
(function (ICSPosition) {
    ICSPosition["INCIDENT_COMMANDER"] = "INCIDENT_COMMANDER";
    ICSPosition["SAFETY_OFFICER"] = "SAFETY_OFFICER";
    ICSPosition["LIAISON_OFFICER"] = "LIAISON_OFFICER";
    ICSPosition["PUBLIC_INFORMATION_OFFICER"] = "PUBLIC_INFORMATION_OFFICER";
    ICSPosition["OPERATIONS_CHIEF"] = "OPERATIONS_CHIEF";
    ICSPosition["PLANNING_CHIEF"] = "PLANNING_CHIEF";
    ICSPosition["LOGISTICS_CHIEF"] = "LOGISTICS_CHIEF";
    ICSPosition["FINANCE_ADMIN_CHIEF"] = "FINANCE_ADMIN_CHIEF";
})(ICSPosition || (exports.ICSPosition = ICSPosition = {}));
// ============================================================================
// RESOURCE ALLOCATION TYPES
// ============================================================================
/**
 * Resource type enumeration with capability classification.
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["ENGINE"] = "ENGINE";
    ResourceType["LADDER"] = "LADDER";
    ResourceType["RESCUE"] = "RESCUE";
    ResourceType["AMBULANCE"] = "AMBULANCE";
    ResourceType["MEDIC_UNIT"] = "MEDIC_UNIT";
    ResourceType["PATROL"] = "PATROL";
    ResourceType["HAZMAT"] = "HAZMAT";
    ResourceType["AIR_SUPPORT"] = "AIR_SUPPORT";
    ResourceType["COMMAND_VEHICLE"] = "COMMAND_VEHICLE";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Resource status with availability semantics.
 */
var ResourceStatus;
(function (ResourceStatus) {
    ResourceStatus["AVAILABLE"] = "AVAILABLE";
    ResourceStatus["DISPATCHED"] = "DISPATCHED";
    ResourceStatus["EN_ROUTE"] = "EN_ROUTE";
    ResourceStatus["ON_SCENE"] = "ON_SCENE";
    ResourceStatus["COMMITTED"] = "COMMITTED";
    ResourceStatus["OUT_OF_SERVICE"] = "OUT_OF_SERVICE";
})(ResourceStatus || (exports.ResourceStatus = ResourceStatus = {}));
// ============================================================================
// COMMUNICATION CHANNEL TYPES
// ============================================================================
/**
 * Communication channel type enumeration.
 */
var ChannelType;
(function (ChannelType) {
    ChannelType["RADIO"] = "RADIO";
    ChannelType["PHONE"] = "PHONE";
    ChannelType["TEXT"] = "TEXT";
    ChannelType["DATA"] = "DATA";
    ChannelType["VIDEO"] = "VIDEO";
    ChannelType["SATELLITE"] = "SATELLITE";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
/**
 * Message priority for communication routing.
 */
var MessagePriority;
(function (MessagePriority) {
    MessagePriority["ROUTINE"] = "ROUTINE";
    MessagePriority["PRIORITY"] = "PRIORITY";
    MessagePriority["IMMEDIATE"] = "IMMEDIATE";
    MessagePriority["FLASH"] = "FLASH";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
//# sourceMappingURL=incident-management-types.js.map