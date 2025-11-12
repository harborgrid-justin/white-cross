# Billing Module Structure

This directory contains the refactored billing management system, split into focused modules for better maintainability and code organization.

## Module Overview

### Main Entry Point
- **billing.actions.ts** (102 lines)
  - Main export file that re-exports all billing functionality
  - Use this for all imports: `import { ... } from '@/lib/actions/billing.actions'`
  - Maintains backward compatibility with existing code

### Core Modules

#### 1. billing.types.ts (182 lines)
**Purpose**: TypeScript type definitions and interfaces

**Exports**:
- `ActionResult<T>` - Standard action response wrapper
- `Invoice`, `InvoiceLineItem` - Invoice data structures
- `CreateInvoiceData`, `UpdateInvoiceData`, `InvoiceFilters` - Invoice operation types
- `Payment`, `CreatePaymentData`, `PaymentFilters` - Payment data structures
- `BillingAnalytics`, `BillingStats` - Analytics and statistics types
- `BillingRecord` - Healthcare billing record type
- `ApiResponse<T>` - API response wrapper

**Usage**: Import types directly from main file
```typescript
import { Invoice, Payment, BillingStats } from '@/lib/actions/billing.actions';
```

#### 2. billing.cache.ts (259 lines)
**Purpose**: Caching functions and cache configuration

**Exports**:
- `BILLING_CACHE_TAGS` - Cache tag constants
- `getInvoice(id)` - Get single invoice with caching
- `getInvoices(filters?)` - Get invoice list with caching
- `getPayment(id)` - Get single payment with caching
- `getPayments(filters?)` - Get payment list with caching
- `getBillingAnalytics(filters?)` - Get analytics with caching
- `getBillingStats()` - Get billing statistics with caching
- `clearBillingCache(resourceType?, resourceId?)` - Clear cache

**Usage**: Cached reads for optimal performance
```typescript
import { getInvoices, getBillingStats } from '@/lib/actions/billing.actions';

const invoices = await getInvoices({ status: 'paid' });
const stats = await getBillingStats();
```

#### 3. billing.invoices.ts (370 lines)
**Purpose**: Invoice CRUD operations with audit logging

**Exports**:
- `createInvoiceAction(data)` - Create new invoice
- `updateInvoiceAction(invoiceId, data)` - Update invoice
- `sendInvoiceAction(invoiceId)` - Send invoice to customer
- `voidInvoiceAction(invoiceId)` - Void/cancel invoice
- `invoiceExists(invoiceId)` - Check if invoice exists
- `getInvoiceCount(filters?)` - Get invoice count

**Usage**: Server actions for invoice management
```typescript
import { createInvoiceAction, updateInvoiceAction } from '@/lib/actions/billing.actions';

const result = await createInvoiceAction({
  customerId: '123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  amount: 1000,
  currency: 'USD',
  dueDate: '2025-12-31',
  description: 'Services rendered',
  lineItems: [...]
});
```

#### 4. billing.payments.ts (210 lines)
**Purpose**: Payment processing operations with audit logging

**Exports**:
- `createPaymentAction(data)` - Create new payment
- `refundPaymentAction(paymentId, refundAmount?)` - Refund payment
- `paymentExists(paymentId)` - Check if payment exists
- `getPaymentCount(filters?)` - Get payment count

**Usage**: Server actions for payment processing
```typescript
import { createPaymentAction, refundPaymentAction } from '@/lib/actions/billing.actions';

const result = await createPaymentAction({
  invoiceId: 'inv-123',
  amount: 1000,
  currency: 'USD',
  paymentMethod: 'credit_card',
  transactionId: 'txn-456'
});
```

#### 5. billing.forms.ts (96 lines)
**Purpose**: Form data handling wrappers

**Exports**:
- `createInvoiceFromForm(formData)` - Create invoice from form submission
- `createPaymentFromForm(formData)` - Create payment from form submission

**Usage**: Use in Server Components with form actions
```typescript
import { createInvoiceFromForm } from '@/lib/actions/billing.actions';

export default function InvoiceForm() {
  return (
    <form action={createInvoiceFromForm}>
      {/* form fields */}
    </form>
  );
}
```

#### 6. billing.utils.ts (115 lines)
**Purpose**: Utility and dashboard functions

**Exports**:
- `getRevenueSummary()` - Get revenue summary metrics
- `getBillingDashboardData()` - Get comprehensive dashboard data

**Usage**: Utility functions for dashboards
```typescript
import { getBillingDashboardData } from '@/lib/actions/billing.actions';

const { billingRecords, stats } = await getBillingDashboardData();
```

## Import Best Practices

Always import from the main `billing.actions.ts` file:

```typescript
// ✅ CORRECT - Import from main file
import {
  Invoice,
  getInvoices,
  createInvoiceAction
} from '@/lib/actions/billing.actions';

// ❌ INCORRECT - Don't import from individual modules
import { Invoice } from '@/lib/actions/billing.types';
import { getInvoices } from '@/lib/actions/billing.cache';
```

## Features

- **HIPAA Compliant**: All operations include audit logging
- **Next.js Cache Integration**: Automatic caching with revalidateTag/revalidatePath
- **Type Safe**: Full TypeScript type coverage
- **Server Actions**: Proper 'use server' directives for Next.js 14+
- **Form Integration**: FormData handling for UI components
- **Error Handling**: Comprehensive validation and error handling

## Architecture Benefits

1. **Modular**: Each file has a single, well-defined purpose
2. **Maintainable**: Easier to locate and modify specific functionality
3. **Testable**: Smaller, focused modules are easier to test
4. **Scalable**: Can add new modules without affecting existing code
5. **No Breaking Changes**: Backward compatible through main export file

## File Size Summary

| File | Lines | Purpose |
|------|-------|---------|
| billing.actions.ts | 102 | Main exports |
| billing.types.ts | 182 | Type definitions |
| billing.payments.ts | 210 | Payment operations |
| billing.cache.ts | 259 | Caching & data fetching |
| billing.invoices.ts | 370 | Invoice operations |
| billing.forms.ts | 96 | Form handling |
| billing.utils.ts | 115 | Utilities |

## Migration Notes

If you were previously importing from `billing.actions.ts`, no changes are needed. All exports remain available at the same import path:

```typescript
import { Invoice, getInvoices, createInvoiceAction } from '@/lib/actions/billing.actions';
```

The refactoring is transparent to consumers of the API.
