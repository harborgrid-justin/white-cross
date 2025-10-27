/**
 * @fileoverview Inventory Locations Management Page
 *
 * Administrative interface for managing physical storage locations across
 * school facilities. Supports multi-location inventory tracking, transfers,
 * and location-specific reorder points for distributed healthcare operations.
 *
 * **Location Types:**
 * - **Health Office**: Primary school nurse office
 * - **Satellite Clinic**: Additional health rooms in large campuses
 * - **Central Storage**: Main supply storage/warehouse
 * - **Refrigerated Storage**: Temperature-controlled medication storage
 * - **Secure Storage**: Locked cabinet for controlled substances
 * - **Athletic Facilities**: Sports medicine supplies
 * - **Classroom First Aid**: Distributed emergency supplies
 *
 * **Location Management:**
 * - Create new storage locations
 * - Edit location details (name, address, contact)
 * - Set location type and capacity
 * - Define temperature monitoring requirements
 * - Configure security levels (open, restricted, secure)
 * - Assign location managers
 * - Archive unused locations
 *
 * **Location Attributes:**
 * - Location name and description
 * - Physical address or building/room identifier
 * - Location type classification
 * - Temperature range (for refrigerated locations)
 * - Security level (determines who can access)
 * - Storage capacity (square feet, shelf count)
 * - Active/inactive status
 * - Primary contact person
 *
 * **Multi-Location Features:**
 * - Separate stock counts per location
 * - Location-specific reorder points
 * - Inter-location transfer tracking
 * - Location-based picking/putaway
 * - Location utilization reporting
 *
 * **Healthcare Compliance:**
 * - Temperature monitoring for refrigerated medications
 * - Controlled substance secure storage requirements
 * - DEA registration by location (if applicable)
 * - Access control and audit logging
 * - Emergency access procedures
 *
 * **Location Statistics:**
 * - Item count stored at location
 * - Total inventory value at location
 * - Storage utilization percentage
 * - Low stock items at location
 * - Recent transaction activity
 *
 * **Business Rules:**
 * - Cannot delete location with current inventory (must transfer all items first)
 * - Secure locations require access authorization
 * - Temperature-controlled locations require monitoring equipment
 * - Each item must have a primary location
 *
 * **Integration Points:**
 * - Stock transfers between locations
 * - Transaction history by location
 * - Temperature monitoring systems
 * - Access control systems
 * - Reporting and analytics
 *
 * @module app/(dashboard)/inventory/locations
 * @see {@link InventoryLocationsContent} Server component with location management
 * @see {@link module:app/(dashboard)/inventory/stock/transfer} Location transfers
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryLocationsContent } from './InventoryLocationsContent';

export const metadata: Metadata = {
  title: 'Locations | Inventory',
  description: 'Manage inventory locations',
};

/**
 * Force dynamic rendering for authentication and real-time location data.
 */
export const dynamic = "force-dynamic";

/**
 * Inventory Locations Management Page Component
 *
 * @returns {JSX.Element} Server-rendered location management interface
 */
export default function InventoryLocationsPage() {
  return <InventoryLocationsContent />;
}
