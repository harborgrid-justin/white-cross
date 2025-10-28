/**
 * Payload Helper Utilities
 * Type-safe utilities for handling Hapi request payloads with proper TypeScript types
 */

import { Readable } from 'stream';

/**
 * Type guard to check if payload is an object (not string, Buffer, or Readable)
 * @param payload - The request payload to check
 * @returns True if payload is a plain object
 */
export function isPayloadObject(
  payload: string | object | Readable | Buffer | undefined
): payload is Record<string, unknown> {
  return (
    payload !== null &&
    payload !== undefined &&
    typeof payload === 'object' &&
    !(payload instanceof Buffer) &&
    !(payload instanceof Readable)
  );
}

/**
 * Safely extract payload as a typed object
 * @param payload - The request payload
 * @returns Payload as Record<string, unknown> or empty object if invalid
 * @throws Error if payload is not an object type
 */
export function extractPayload(
  payload: string | object | Readable | Buffer | undefined
): Record<string, unknown> {
  if (!isPayloadObject(payload)) {
    throw new Error('Request payload must be an object');
  }
  return payload;
}

/**
 * Safely extract payload as a typed object with default fallback
 * @param payload - The request payload
 * @returns Payload as Record<string, unknown> or empty object if invalid
 */
export function extractPayloadSafe(
  payload: string | object | Readable | Buffer | undefined
): Record<string, unknown> {
  if (!isPayloadObject(payload)) {
    return {};
  }
  return payload;
}

/**
 * Extract a specific property from payload with type safety
 * @param payload - The request payload
 * @param key - Property key to extract
 * @returns The property value or undefined
 */
export function extractPayloadProperty<T = unknown>(
  payload: string | object | Readable | Buffer | undefined,
  key: string
): T | undefined {
  if (!isPayloadObject(payload)) {
    return undefined;
  }
  return payload[key] as T;
}

/**
 * Create a spread-safe payload object with additional properties
 * Safely merges payload with additional fields
 * @param payload - The request payload
 * @param additionalFields - Additional fields to merge
 * @returns Merged object safe for spreading
 */
export function createPayloadWithFields(
  payload: string | object | Readable | Buffer | undefined,
  additionalFields: Record<string, unknown>
): Record<string, unknown> {
  const basePayload = extractPayload(payload);
  return {
    ...basePayload,
    ...additionalFields
  };
}

/**
 * Convert date string fields to Date objects
 * @param payload - The request payload
 * @param dateFields - Array of field names that should be converted to Date
 * @returns Payload with date fields converted
 */
export function convertPayloadDates(
  payload: Record<string, unknown>,
  dateFields: string[]
): Record<string, unknown> {
  const result = { ...payload };

  for (const field of dateFields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = new Date(result[field] as string);
    }
  }

  return result;
}

/**
 * Type-safe payload extractor with date conversion
 * Common pattern for controllers that need date field conversion
 * @param payload - The request payload
 * @param dateFields - Fields to convert to Date objects
 * @param additionalFields - Additional fields to merge
 * @returns Merged and date-converted payload
 */
export function preparePayload(
  payload: string | object | Readable | Buffer | undefined,
  options?: {
    dateFields?: string[];
    additionalFields?: Record<string, unknown>;
  }
): Record<string, unknown> {
  let result = extractPayload(payload);

  if (options?.dateFields) {
    result = convertPayloadDates(result, options.dateFields);
  }

  if (options?.additionalFields) {
    result = {
      ...result,
      ...options.additionalFields
    };
  }

  return result;
}
