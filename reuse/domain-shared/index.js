"use strict";
/**
 * File: /reuse/domain-shared/index.ts
 * Purpose: Barrel export for domain-shared types and utilities
 *
 * Provides centralized exports of common types, interfaces, and utilities
 * used across construction, consulting, and engineer domain kits.
 *
 * @module DomainShared
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * import {
 *   BaseEntity,
 *   CommonStatus,
 *   PaginatedResponse,
 *   BaseDTO,
 *   ListQueryDTO
 * } from '@domain-shared';
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Base entity types and interfaces
__exportStar(require("./types/base-entity"), exports);
// Validation DTOs and base classes
__exportStar(require("./types/validation-dtos"), exports);
//# sourceMappingURL=index.js.map