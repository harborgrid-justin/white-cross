/**
 * Budget Domain Transaction Type Definitions
 *
 * Transaction and attachment types for budget operations.
 *
 * @module hooks/domains/budgets/budgetTypes.transactions
 *
 * @since 1.0.0
 */

import type { BudgetUser } from './budgetTypes.core';

/**
 * Transaction attachment interface for supporting documents.
 *
 * Represents uploaded files attached to budget transactions such as invoices,
 * receipts, purchase orders, or other supporting documentation.
 *
 * @interface TransactionAttachment
 *
 * @property {string} id - Unique attachment identifier
 * @property {string} fileName - Original file name
 * @property {string} fileUrl - URL to access the file
 * @property {number} fileSize - File size in bytes
 * @property {string} mimeType - MIME type (e.g., "application/pdf", "image/jpeg")
 * @property {string} uploadedAt - Upload timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const attachment: TransactionAttachment = {
 *   id: 'att-123',
 *   fileName: 'invoice-2024-001.pdf',
 *   fileUrl: 'https://storage.example.com/attachments/invoice-2024-001.pdf',
 *   fileSize: 204800, // 200 KB
 *   mimeType: 'application/pdf',
 *   uploadedAt: '2024-03-15T10:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Supported File Types:**
 * - Documents: PDF, DOC, DOCX
 * - Images: JPEG, PNG, GIF
 * - Spreadsheets: XLS, XLSX, CSV
 *
 * **File Size Limits:**
 * - Typically 10 MB maximum per file
 * - Multiple attachments allowed per transaction
 *
 * @see {@link BudgetTransaction} for parent transaction entity
 *
 * @since 1.0.0
 */
export interface TransactionAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Budget transaction interface representing a financial transaction.
 *
 * Transactions record income, expenses, or transfers within budgets with approval
 * workflow tracking. Each transaction affects budget and category balances.
 *
 * @interface BudgetTransaction
 *
 * @property {string} id - Unique transaction identifier
 * @property {string} budgetId - Associated budget ID
 * @property {string} categoryId - Associated category ID
 * @property {number} amount - Transaction amount (positive for all types)
 * @property {'INCOME' | 'EXPENSE' | 'TRANSFER'} type - Transaction type
 * @property {string} description - Transaction description/purpose
 * @property {string} [reference] - Optional external reference number (invoice, PO, etc.)
 * @property {string} date - Transaction date (ISO 8601 format)
 * @property {'PENDING' | 'APPROVED' | 'REJECTED'} status - Approval status
 * @property {TransactionAttachment[]} attachments - Supporting documents/receipts
 * @property {BudgetUser} createdBy - User who created the transaction
 * @property {BudgetUser} [approvedBy] - User who approved/rejected (if applicable)
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const transaction: BudgetTransaction = {
 *   id: 'tx-123',
 *   budgetId: 'budget-123',
 *   categoryId: 'cat-123',
 *   amount: 250.00,
 *   type: 'EXPENSE',
 *   description: 'First aid kit supplies',
 *   reference: 'PO-2024-001',
 *   date: '2024-03-15',
 *   status: 'APPROVED',
 *   attachments: [
 *     {
 *       id: 'att-1',
 *       fileName: 'invoice.pdf',
 *       fileUrl: 'https://storage.example.com/invoice.pdf',
 *       fileSize: 102400,
 *       mimeType: 'application/pdf',
 *       uploadedAt: '2024-03-15T10:00:00Z'
 *     }
 *   ],
 *   createdBy: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' },
 *   approvedBy: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' },
 *   createdAt: '2024-03-15T09:30:00Z',
 *   updatedAt: '2024-03-15T14:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Transaction Types:**
 * - INCOME: Adds to budget (e.g., funding received)
 * - EXPENSE: Deducts from budget (e.g., purchase, payment)
 * - TRANSFER: Moves between categories (neutral to total budget)
 *
 * **Approval Workflow:**
 * - PENDING: Awaiting approval
 * - APPROVED: Approved and applied to budget
 * - REJECTED: Rejected, not applied to budget
 *
 * **Amount Handling:**
 * - Amount always positive regardless of type
 * - Type determines budget impact direction
 * - Stored in smallest currency unit
 *
 * @see {@link Budget} for parent budget entity
 * @see {@link BudgetCategory} for category entity
 * @see {@link TransactionAttachment} for attachment structure
 *
 * @since 1.0.0
 */
export interface BudgetTransaction {
  id: string;
  budgetId: string;
  categoryId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string;
  reference?: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  attachments: TransactionAttachment[];
  createdBy: BudgetUser;
  approvedBy?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}
