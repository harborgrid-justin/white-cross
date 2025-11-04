/**
 * @fileoverview Student Action Types - Shared Type Definitions
 * @module lib/actions/students.types
 *
 * Shared type definitions for student server actions.
 * This file contains only type definitions and does not require 'use server'.
 */

/**
 * Standard action result wrapper for server actions
 * Provides consistent response format across all student operations
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
