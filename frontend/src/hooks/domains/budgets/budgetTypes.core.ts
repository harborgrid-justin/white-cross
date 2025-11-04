/**
 * Budget Domain Core Type Definitions
 *
 * Core entity types for budgets, categories, and user references.
 *
 * @module hooks/domains/budgets/budgetTypes.core
 *
 * @since 1.0.0
 */

import type { BudgetTransaction } from './budgetTypes.transactions';

/**
 * Budget user reference interface for creators, approvers, and owners.
 *
 * Simplified user representation for budget-related user references. Contains
 * essential identifying information without full user profile details.
 *
 * @interface BudgetUser
 *
 * @property {string} id - Unique user identifier
 * @property {string} name - User full name
 * @property {string} email - User email address
 * @property {string} [avatar] - Optional avatar/profile image URL
 *
 * @example
 * ```typescript
 * const user: BudgetUser = {
 *   id: 'user-123',
 *   name: 'Jane Doe',
 *   email: 'jane.doe@school.edu',
 *   avatar: 'https://avatars.example.com/user-123.jpg'
 * };
 * ```
 *
 * @remarks
 * **Usage Contexts:**
 * - Budget owner: User who created the budget
 * - Budget approver: User who approved the budget
 * - Transaction creator: User who created the transaction
 * - Transaction approver: User who approved/rejected the transaction
 *
 * **Privacy:**
 * - Contains only publicly shareable user information
 * - No sensitive personal data included
 *
 * @see {@link Budget} for budget owner/approver usage
 * @see {@link BudgetTransaction} for transaction creator/approver usage
 *
 * @since 1.0.0
 */
export interface BudgetUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Budget category interface representing a budget allocation category.
 *
 * Categories organize budget allocations hierarchically and track spending
 * per category. Supports parent-child relationships for nested categorization.
 *
 * @interface BudgetCategory
 *
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name (e.g., "Medical Supplies", "Medications")
 * @property {string} [description] - Optional category description
 * @property {number} allocatedAmount - Amount allocated to this category
 * @property {number} spentAmount - Amount spent from this category
 * @property {number} remainingAmount - Remaining amount (allocatedAmount - spentAmount)
 * @property {string} [parentId] - Parent category ID for hierarchical structure
 * @property {BudgetCategory[]} [children] - Child subcategories
 * @property {BudgetTransaction[]} transactions - Transactions in this category
 *
 * @example
 * ```typescript
 * const category: BudgetCategory = {
 *   id: 'cat-123',
 *   name: 'Medical Supplies',
 *   description: 'General medical supplies and equipment',
 *   allocatedAmount: 25000,
 *   spentAmount: 12000,
 *   remainingAmount: 13000,
 *   parentId: undefined, // Top-level category
 *   children: [
 *     {
 *       id: 'cat-124',
 *       name: 'First Aid',
 *       allocatedAmount: 5000,
 *       spentAmount: 2000,
 *       remainingAmount: 3000,
 *       parentId: 'cat-123',
 *       children: [],
 *       transactions: [...]
 *     }
 *   ],
 *   transactions: [...]
 * };
 * ```
 *
 * @remarks
 * **Hierarchical Structure:**
 * - Top-level categories have parentId = undefined
 * - Child categories reference parent via parentId
 * - Unlimited nesting depth supported
 *
 * **Amount Aggregation:**
 * - Parent category amounts may aggregate child amounts
 * - Transactions assigned to specific category (leaf or parent)
 *
 * @see {@link Budget} for parent budget entity
 * @see {@link BudgetTransaction} for transaction structure
 *
 * @since 1.0.0
 */
export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  parentId?: string;
  children?: BudgetCategory[];
  transactions: BudgetTransaction[];
}

/**
 * Budget entity interface representing a complete budget with metadata and allocations.
 *
 * Represents a fiscal budget with total allocations, spending tracking, category
 * breakdowns, and approval workflow state. Budgets can be in various lifecycle
 * states from draft to closed.
 *
 * @interface Budget
 *
 * @property {string} id - Unique budget identifier
 * @property {string} name - Budget name (e.g., "2024 Healthcare Budget")
 * @property {string} [description] - Optional detailed budget description
 * @property {number} totalAmount - Total budgeted amount across all categories
 * @property {number} spentAmount - Total amount spent/committed from budget
 * @property {number} remainingAmount - Remaining budget (totalAmount - spentAmount)
 * @property {string} currency - Currency code (ISO 4217, e.g., "USD", "EUR")
 * @property {string} fiscalYear - Fiscal year identifier (e.g., "2024", "FY2024")
 * @property {string} startDate - Budget period start date (ISO 8601 format)
 * @property {string} endDate - Budget period end date (ISO 8601 format)
 * @property {'DRAFT' | 'ACTIVE' | 'FROZEN' | 'CLOSED'} status - Budget lifecycle status
 * @property {BudgetCategory[]} categories - Hierarchical budget categories
 * @property {string} [department] - Department or cost center identifier
 * @property {BudgetUser} owner - Budget owner/creator
 * @property {BudgetUser} [approver] - User who approved the budget
 * @property {string} createdAt - Creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const budget: Budget = {
 *   id: 'budget-123',
 *   name: '2024 School Health Services Budget',
 *   description: 'Annual budget for health services and medical supplies',
 *   totalAmount: 100000,
 *   spentAmount: 45000,
 *   remainingAmount: 55000,
 *   currency: 'USD',
 *   fiscalYear: '2024',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   status: 'ACTIVE',
 *   categories: [...],
 *   department: 'health-services',
 *   owner: { id: 'user-1', name: 'Jane Doe', email: 'jane@school.edu' },
 *   approver: { id: 'user-2', name: 'John Smith', email: 'john@school.edu' },
 *   createdAt: '2023-12-01T00:00:00Z',
 *   updatedAt: '2024-01-15T10:30:00Z'
 * };
 * ```
 *
 * @remarks
 * **Status Lifecycle:**
 * - DRAFT: Budget being planned, not yet approved
 * - ACTIVE: Approved and in use for transactions
 * - FROZEN: Temporarily locked, no new transactions
 * - CLOSED: Budget period ended, archived
 *
 * **Amount Calculations:**
 * - Amounts maintained in smallest currency unit (cents)
 * - remainingAmount = totalAmount - spentAmount
 * - Negative remaining indicates over budget
 *
 * @see {@link BudgetCategory} for category structure
 * @see {@link BudgetUser} for user reference type
 *
 * @since 1.0.0
 */
export interface Budget {
  id: string;
  name: string;
  description?: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  currency: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'FROZEN' | 'CLOSED';
  categories: BudgetCategory[];
  department?: string;
  owner: BudgetUser;
  approver?: BudgetUser;
  createdAt: string;
  updatedAt: string;
}
