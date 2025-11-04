/**
 * @fileoverview Compliance Requirements List Component - List container for compliance items
 * @module app/(dashboard)/compliance/_components/ComplianceRequirementsList
 * @category Compliance - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Shield } from 'lucide-react';
import { ComplianceRequirementCard } from './ComplianceRequirementCard';
import type { ComplianceRequirementsListProps } from './compliance.types';

/**
 * Compliance requirements list component
 * Displays a collection of compliance requirements with add functionality
 *
 * @param items - Array of compliance items to display
 * @param loading - Optional loading state for skeleton display
 * @param onAddRequirement - Optional callback when add requirement button is clicked
 */
export function ComplianceRequirementsList({
  items,
  loading = false,
  onAddRequirement
}: ComplianceRequirementsListProps) {
  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No compliance requirements found
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Get started by adding your first compliance requirement
          </p>
          {onAddRequirement && (
            <Button onClick={onAddRequirement}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Requirement
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Compliance Requirements
            </h3>
            <p className="text-sm text-gray-500">
              Track regulatory compliance across all healthcare standards
            </p>
          </div>
          {onAddRequirement && (
            <Button onClick={onAddRequirement} aria-label="Add new compliance requirement">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Requirement
            </Button>
          )}
        </div>
      </div>

      {/* Requirements List */}
      <div className="p-6">
        <div className="space-y-4" role="list">
          {items.map((item) => (
            <div key={item.id} role="listitem">
              <ComplianceRequirementCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
