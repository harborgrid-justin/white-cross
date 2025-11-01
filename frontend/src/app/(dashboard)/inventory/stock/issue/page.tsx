/**
 * @fileoverview Stock Issuance Page
 *
 * Interface for issuing inventory items from stock for student use, staff use,
 * or administrative purposes. Implements FIFO (First In, First Out) inventory
 * management and comprehensive tracking for healthcare compliance.
 *
 * **Issue Types:**
 * - Student dispensing (medication, supplies for student use)
 * - Staff usage (office supplies, equipment)
 * - Classroom distribution (health education materials)
 * - Emergency use (first aid, emergency medications)
 * - Donation/disposal (expired items, charitable donations)
 *
 * **FIFO Implementation:**
 * - Automatically selects oldest batch/lot first
 * - Prioritizes items closest to expiration
 * - Prevents issuance of expired items
 * - Tracks remaining shelf life
 *
 * **Healthcare Tracking:**
 * - Patient association for medication dispensing (links to student records)
 * - Prescription/authorization reference
 * - Dosage and administration instructions
 * - Follow-up care documentation
 *
 * **Stock Reduction Logic:**
 * - Decrements on-hand quantity immediately
 * - Updates stock valuation (reduces by unit cost)
 * - Triggers low stock alerts if quantity falls below reorder point
 * - Creates transaction audit record
 *
 * **Authorization:**
 * - Role-based access control (nurses can issue medications, staff can issue supplies)
 * - Controlled substance issuance requires additional verification
 * - Emergency override capabilities for urgent situations
 *
 * @module app/(dashboard)/inventory/stock/issue
 * @see {@link IssueStockContent} Server component with issuance form
 * @see {@link module:app/(dashboard)/inventory/transactions} Issue history
 */

import React from 'react';
import { Metadata } from 'next';
import { IssueStockContent } from './_components/IssueStockContent';

export const metadata: Metadata = {
  title: 'Issue Stock | Inventory',
  description: 'Issue stock from inventory',
};

/**
 * Force dynamic rendering for authentication and FIFO batch selection.
 */


/**
 * Stock Issuance Page Component
 *
 * @returns {JSX.Element} Server-rendered stock issuance form
 */
export default function IssueStockPage() {
  return <IssueStockContent />;
}
