/**
 * @fileoverview Common Integration Type Definitions
 * @module types/domain/integrations/common
 * @category Healthcare - Integration Management
 *
 * Common type definitions used across integration modules.
 * Provides type-safe alternatives to `any` for dynamic data.
 */

/**
 * JSON-serializable primitive types
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON-serializable value type
 * Represents any value that can be safely serialized to JSON
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * JSON-serializable object type
 * Object with string keys and JSON-serializable values
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON-serializable array type
 * Array of JSON-serializable values
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * Unknown record type for truly dynamic objects
 * Use this when the structure is completely unknown but needs to be an object
 */
export type UnknownRecord = Record<string, unknown>;
