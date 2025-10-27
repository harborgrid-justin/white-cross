/**
 * @fileoverview Inventory Categories Management Page
 *
 * Administrative interface for creating, editing, and organizing inventory
 * categories and subcategories. Provides hierarchical category structure for
 * effective inventory classification and reporting.
 *
 * **Category Hierarchy:**
 * - **Top-Level Categories**: Medications, Medical Supplies, Equipment, Office Supplies
 * - **Subcategories**: Each top-level has specialized subcategories
 * - **Tags**: Additional classification for cross-cutting concerns
 *
 * **Category Management:**
 * - Create new categories and subcategories
 * - Edit category names and descriptions
 * - Set category icons and colors (for UI identification)
 * - Define category-specific reorder rules
 * - Archive unused categories (never delete - preserves historical data)
 * - Reorder categories (drag-and-drop priority)
 *
 * **Healthcare-Specific Categories:**
 * - **Medications**: Prescription, OTC, Controlled Substances, Vaccines
 * - **Medical Supplies**: Wound Care, Diagnostic, PPE, First Aid
 * - **Equipment**: Diagnostic Devices, Treatment Equipment, Storage
 * - **Specialized**: Diabetic Supplies, Asthma Management, Allergy Care
 *
 * **Category Attributes:**
 * - Category name and description
 * - Parent category (for subcategories)
 * - Default reorder point
 * - Default supplier
 * - Regulatory compliance flags (DEA, FDA, etc.)
 * - Expiration tracking requirements
 * - Temperature control requirements
 *
 * **Category Statistics:**
 * - Item count per category
 * - Total inventory value by category
 * - Average turnover rate
 * - Low stock items in category
 * - Expiring items in category
 *
 * **Business Rules:**
 * - Cannot delete category with active items (must archive)
 * - Category names must be unique within parent
 * - Subcategories inherit parent compliance requirements
 * - Moving items between categories updates reporting
 *
 * **Reporting Integration:**
 * - Category-based inventory reports
 * - Spend analysis by category
 * - Usage trends by category
 * - Compliance reporting by category type
 *
 * @module app/(dashboard)/inventory/categories
 * @see {@link InventoryCategoriesContent} Server component with category management
 * @see {@link module:app/(dashboard)/inventory/items} Items using categories
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryCategoriesContent } from './InventoryCategoriesContent';

export const metadata: Metadata = {
  title: 'Categories | Inventory',
  description: 'Manage inventory categories',
};

/**
 * Force dynamic rendering for authentication and real-time category data.
 */
export const dynamic = "force-dynamic";

/**
 * Inventory Categories Management Page Component
 *
 * @returns {JSX.Element} Server-rendered category management interface
 */
export default function InventoryCategoriesPage() {
  return <InventoryCategoriesContent />;
}
