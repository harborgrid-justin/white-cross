/**
 * Billing API Validation Schemas
 *
 * Zod schemas for runtime validation of billing requests.
 * Ensures data integrity before API calls.
 *
 * @module services/modules/billingApi/schemas
 * @category Validation
 */

import { z } from 'zod';

// =====================
// VALIDATION SCHEMAS
// =====================

/**
 * Validation schema for creating an invoice
 */
export const createInvoiceSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  serviceDate: z.string().datetime('Invalid service date'),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    category: z.enum(['consultation', 'treatment', 'medication', 'supplies', 'equipment', 'other']),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().nonnegative('Unit price must be non-negative'),
    discount: z.number().nonnegative('Discount must be non-negative').optional(),
    taxRate: z.number().nonnegative('Tax rate must be non-negative').optional(),
  })).min(1, 'At least one line item is required'),
  discountAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  insuranceClaimId: z.string().optional(),
});

/**
 * Validation schema for creating a payment
 */
export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['cash', 'check', 'credit-card', 'debit-card', 'bank-transfer', 'insurance']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  transactionId: z.string().optional(),
  authorizationCode: z.string().optional(),
});

// =====================
// ERROR UTILITIES
// =====================

/**
 * Creates a standardized API error from unknown error types
 *
 * @param error - The error object to process
 * @param fallbackMessage - Message to use if error is not an Error instance
 * @returns A proper Error instance
 */
export function createApiError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallbackMessage);
}

/**
 * Type guard for Zod validation errors
 *
 * @param error - The error to check
 * @returns True if error is a Zod validation error
 */
export function isZodError(error: unknown): error is z.ZodError {
  return error !== null &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'ZodError';
}

/**
 * Extracts user-friendly error message from Zod validation error
 *
 * @param error - The Zod error object
 * @returns A formatted error message
 */
export function formatZodError(error: z.ZodError): string {
  const firstError = error.errors[0];
  return firstError?.message || 'Validation failed';
}
