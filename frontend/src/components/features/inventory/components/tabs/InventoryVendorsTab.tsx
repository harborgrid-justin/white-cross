/**
 * WF-COMP-043 | InventoryVendorsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../types | Dependencies: react, lucide-react, ../../../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Plus } from 'lucide-react'
import type { Vendor } from '@/types/inventory'

/**
 * Props for the InventoryVendorsTab component
 *
 * @interface InventoryVendorsTabProps
 * @property {Vendor[]} vendors - Array of vendor records to display
 */
interface InventoryVendorsTabProps {
  vendors: Vendor[]
}

/**
 * InventoryVendorsTab - Vendor relationship management interface
 *
 * Displays a grid of vendor cards with contact information, ratings, and payment
 * terms. Supports adding new vendors and managing existing vendor relationships
 * for medical supply procurement and inventory management.
 *
 * @param {InventoryVendorsTabProps} props - Component props
 * @returns {JSX.Element} Vendor cards grid with add vendor button
 *
 * @example
 * ```tsx
 * <InventoryVendorsTab
 *   vendors={[
 *     {
 *       id: '1',
 *       name: 'Medical Supplies Inc.',
 *       contactName: 'John Smith',
 *       email: 'john@medicalsupplies.com',
 *       phone: '555-0123',
 *       rating: 4.5,
 *       paymentTerms: 'Net 30'
 *     }
 *   ]}
 * />
 * ```
 *
 * @remarks
 * - "Add Vendor" button initiates new vendor creation workflow
 * - Grid layout adapts: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
 * - Each vendor card displays: name, rating, contact person, email, phone, payment terms
 * - Rating displayed as star icon with numerical value (e.g., "★ 4.5/5")
 * - Hover effect with shadow transition for better interactivity
 * - Contact information displayed only if available
 * - Payment terms help procurement staff understand vendor billing practices
 *
 * @security
 * - Vendor information visible to authorized procurement and inventory staff
 * - Contact details and payment terms restricted by role-based permissions
 * - Vendor creation requires appropriate authorization
 * - Sensitive contract terms not displayed in card view
 *
 * @compliance
 * - Vendor records support procurement audit requirements
 * - Contact information enables proper vendor communication
 * - Payment terms documentation for financial compliance
 * - Vendor ratings help ensure quality medical supply sourcing
 */
export default function InventoryVendorsTab({ vendors }: InventoryVendorsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Vendor Management</h3>
        <button className="btn-primary flex items-center text-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
              {vendor.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm text-gray-600">{vendor.rating}/5</span>
                </div>
              )}
            </div>
            {vendor.contactName && (
              <p className="text-sm text-gray-600 mb-1">Contact: {vendor.contactName}</p>
            )}
            {vendor.email && (
              <p className="text-sm text-gray-600 mb-1">{vendor.email}</p>
            )}
            {vendor.phone && (
              <p className="text-sm text-gray-600 mb-1">{vendor.phone}</p>
            )}
            {vendor.paymentTerms && (
              <p className="text-sm text-gray-500 mt-2">Terms: {vendor.paymentTerms}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

