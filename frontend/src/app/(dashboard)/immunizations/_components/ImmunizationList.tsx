/**
 * @fileoverview Immunization List Component
 * @module app/immunizations/components
 *
 * Displays list of immunization records using ImmunizationCard components.
 * Handles empty state and selection management.
 */

'use client';

import React from 'react';
import { Plus, Syringe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Immunization } from './types/immunization.types';
import { ImmunizationCardComponent } from './ImmunizationCard';

interface ImmunizationListProps {
  immunizations: Immunization[];
  selectedImmunizations: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
}

/**
 * ImmunizationList component
 * Renders list of immunization cards or empty state
 */
export const ImmunizationListComponent: React.FC<ImmunizationListProps> = ({
  immunizations,
  selectedImmunizations,
  onSelectionChange,
}) => {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Immunizations ({immunizations.length})
        </h2>

        {immunizations.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 font-medium mb-2">No immunizations found</p>
            <p className="text-sm text-gray-400 mb-4">
              Try adjusting your filters or schedule a new immunization.
            </p>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Immunization
            </Button>
          </div>
        ) : (
          /* Immunization Cards */
          <div className="space-y-4">
            {immunizations.map((immunization) => (
              <ImmunizationCardComponent
                key={immunization.id}
                immunization={immunization}
                isSelected={selectedImmunizations.has(immunization.id)}
                onSelectionChange={(selected) =>
                  onSelectionChange(immunization.id, selected)
                }
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
