/**
 * @fileoverview Immunization Card Component
 * @module app/immunizations/components
 *
 * Displays individual immunization record with all details.
 * Shows student info, vaccine details, dates, status, and actions.
 */

'use client';

import React from 'react';
import { Edit, Eye, CheckCircle, MoreVertical, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Immunization } from './types/immunization.types';
import {
  getStatusBadge,
  getPriorityBadge,
  getTypeIcon,
  formatDate,
  isOverdue,
} from './utils/immunization.utils';

interface ImmunizationCardProps {
  immunization: Immunization;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

/**
 * ImmunizationCard component
 * Renders a single immunization record with all details and actions
 */
export const ImmunizationCardComponent: React.FC<ImmunizationCardProps> = ({
  immunization,
  isSelected,
  onSelectionChange,
}) => {
  const overdueStatus = isOverdue(immunization.dueDate, immunization.status);

  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
        overdueStatus ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with checkbox and basic info */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label={`Select immunization: ${immunization.vaccineName}`}
            />

            {getTypeIcon(immunization.immunizationType)}

            <div>
              <h3 className="font-semibold text-gray-900">{immunization.vaccineName}</h3>
              <p className="text-sm text-gray-600">
                {immunization.studentName} • {immunization.studentId}
              </p>
            </div>

            {overdueStatus && (
              <AlertTriangle className="h-5 w-5 text-red-500" aria-label="Overdue" />
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <span className="text-gray-500">Due Date:</span>
              <div className="font-medium">{formatDate(immunization.dueDate)}</div>
            </div>
            <div>
              <span className="text-gray-500">Series:</span>
              <div className="font-medium">
                {immunization.seriesPosition || 'Single dose'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Priority:</span>
              <div className="font-medium">{getPriorityBadge(immunization.priority)}</div>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <div className="font-medium capitalize">
                {immunization.immunizationType.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Administration Details (if administered) */}
          {immunization.administeredDate && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3 p-2 bg-green-50 rounded">
              <div>
                <span className="text-gray-500">Administered:</span>
                <div className="font-medium">{formatDate(immunization.administeredDate)}</div>
              </div>
              {immunization.lotNumber && (
                <div>
                  <span className="text-gray-500">Lot #:</span>
                  <div className="font-medium">{immunization.lotNumber}</div>
                </div>
              )}
              {immunization.administeredBy && (
                <div>
                  <span className="text-gray-500">Administered by:</span>
                  <div className="font-medium">{immunization.administeredBy}</div>
                </div>
              )}
            </div>
          )}

          {/* Reactions (if any) */}
          {immunization.reactions && immunization.reactions.length > 0 && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <span className="text-sm font-medium text-yellow-800">Reactions:</span>
              <ul className="text-sm text-yellow-700 mt-1">
                {immunization.reactions.map((reaction, index) => (
                  <li key={index}>• {reaction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {immunization.notes && (
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Notes:</strong> {immunization.notes}
            </div>
          )}

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {getStatusBadge(immunization.status)}
            {immunization.nextDue && (
              <Badge className="bg-blue-100 text-blue-800">
                Next due: {formatDate(immunization.nextDue)}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="sm" title="View details" aria-label="View details">
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Edit immunization"
            aria-label="Edit immunization"
          >
            <Edit className="h-4 w-4" />
          </Button>

          {immunization.status === 'scheduled' && (
            <Button
              variant="ghost"
              size="sm"
              title="Mark as administered"
              aria-label="Mark as administered"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="sm" title="More options" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
