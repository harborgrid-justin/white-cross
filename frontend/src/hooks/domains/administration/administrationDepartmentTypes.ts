/**
 * @fileoverview Administration domain department-related type definitions
 * @module hooks/domains/administration/administrationDepartmentTypes
 * @category Hooks - Administration
 *
 * Type definitions for departments, organizational hierarchy, and budget management.
 *
 * @remarks
 * **Hierarchical Structure:**
 * Departments can be nested using parentId to create organizational trees.
 * Root departments have null/undefined parentId.
 *
 * **Budget Tracking:**
 * Optional budget field enables financial management and reporting per department.
 */

import { AdminUser, Address } from './administrationUserTypes';

/**
 * Department or organizational unit entity.
 *
 * Represents a department within the school/district organizational hierarchy.
 * Used for staff organization, budget tracking, and access control.
 *
 * @property {string} id - Unique department identifier
 * @property {string} name - Department display name
 * @property {string} description - Detailed department description
 * @property {string} code - Short department code (e.g., 'NURS', 'ADMIN')
 * @property {string} [parentId] - Parent department ID for hierarchical structure
 * @property {string} [managerId] - User ID of department manager
 * @property {DepartmentStaff[]} staff - Staff members assigned to department
 * @property {DepartmentBudget} [budget] - Department budget allocation
 * @property {string} [location] - Physical location or building
 * @property {ContactInfo} contactInfo - Department contact information
 * @property {boolean} isActive - Whether department is currently active
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @remarks
 * **Hierarchical Structure:**
 * Departments can be nested using parentId to create organizational trees.
 * Root departments have null/undefined parentId.
 *
 * **Budget Tracking:**
 * Optional budget field enables financial management and reporting per department.
 *
 * @example
 * ```typescript
 * const nursingDept: Department = {
 *   id: 'dept-nursing',
 *   name: 'School Nursing',
 *   description: 'Nursing staff responsible for student health',
 *   code: 'NURS',
 *   parentId: 'dept-health-services',
 *   managerId: 'usr-head-nurse',
 *   staff: [],
 *   budget: {
 *     allocated: 50000,
 *     spent: 32000,
 *     remaining: 18000,
 *     fiscalYear: '2025',
 *     currency: 'USD'
 *   },
 *   location: 'Building A, Room 105',
 *   contactInfo: {
 *     email: 'nursing@school.edu',
 *     phoneNumber: '+1-555-0199',
 *     extension: '105'
 *   },
 *   isActive: true,
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-10-26T12:00:00Z'
 * };
 * ```
 *
 * @see {@link DepartmentStaff} for staff assignment structure
 * @see {@link DepartmentBudget} for budget details
 * @see {@link useDepartments} for querying departments
 */
export interface Department {
  id: string;
  name: string;
  description: string;
  code: string;
  parentId?: string;
  managerId?: string;
  staff: DepartmentStaff[];
  budget?: DepartmentBudget;
  location?: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStaff {
  userId: string;
  user: AdminUser;
  position: string;
  startDate: string;
  endDate?: string;
  isManager: boolean;
}

export interface DepartmentBudget {
  allocated: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
  currency: string;
}

export interface ContactInfo {
  email?: string;
  phoneNumber?: string;
  extension?: string;
  address?: Address;
}
