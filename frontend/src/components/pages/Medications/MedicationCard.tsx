'use client';

import React from 'react';
import { Pill, Clock, AlertTriangle, User, Calendar } from 'lucide-react';

/**
 * Interface for medication data
 */
interface Medication {
  /** Unique identifier for the medication */
  id: string;
  /** Name of the medication */
  name: string;
  /** Generic name of the medication */
  genericName?: string;
  /** Dosage information */
  dosage: string;
  /** Frequency of administration */
  frequency: string;
  /** Route of administration (oral, injection, etc.) */
  route: string;
  /** Current status of the medication */
  status: 'active' | 'inactive' | 'discontinued' | 'on-hold';
  /** Prescribing physician */
  prescribedBy: string;
  /** Date medication was prescribed */
  prescribedDate: string;
  /** Start date for medication */
  startDate: string;
  /** End date for medication (if applicable) */
  endDate?: string;
  /** Next scheduled dose time */
  nextDose?: string;
  /** Indication/reason for medication */
  indication: string;
  /** Special instructions */
  instructions?: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Number of refills remaining */
  refillsRemaining?: number;
  /** Pharmacy information */
  pharmacy?: string;
  /** Last administration date/time */
  lastAdministered?: string;
  /** Compliance percentage */
  complianceRate?: number;
}

/**
 * Props for the MedicationCard component
 */
interface MedicationCardProps {
  /** Medication data to display */
  medication: Medication;
  /** Callback when card is clicked */
  onClick?: (medication: Medication) => void;
  /** Whether the card is selected */
  selected?: boolean;
  /** Show detailed view */
  detailed?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationCard Component
 * 
 * Displays medication information in a card format with status indicators,
 * dosage details, and administration tracking. Supports both compact and
 * detailed view modes with accessibility features.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationCard 
 *   medication={medicationData}
 *   onClick={handleMedicationClick}
 *   detailed={true}
 * />
 * ```
 */
export const MedicationCard = ({
  medication,
  onClick,
  selected = false,
  detailed = false,
  className = ''
}: MedicationCardProps) => {
  const getStatusColor = (status: Medication['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Medication['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(medication);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md 
        transition-all duration-200 cursor-pointer
        ${selected ? 'ring-2 ring-blue-500 border-blue-300' : ''}
        ${onClick ? 'hover:border-gray-300' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={`Medication: ${medication.name}, ${medication.dosage}, Status: ${medication.status}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {medication.name}
              </h3>
              {medication.genericName && (
                <p className="text-sm text-gray-600 truncate">
                  Generic: {medication.genericName}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium text-gray-900">
                  {medication.dosage}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">
                  {medication.frequency}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600 capitalize">
                  {medication.route}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {medication.priority !== 'low' && (
              <AlertTriangle 
                className={`w-4 h-4 ${getPriorityColor(medication.priority)}`}
                aria-label={`${medication.priority} priority`}
              />
            )}
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${getStatusColor(medication.status)}
            `}>
              {medication.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Indication */}
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">For:</span> {medication.indication}
          </p>
        </div>

        {/* Next dose and timing info */}
        {medication.nextDose && (
          <div className="flex items-center space-x-4 mb-3 p-2 bg-blue-50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Next Dose: {formatTime(medication.nextDose)}
              </p>
              <p className="text-xs text-blue-700">
                {formatDate(medication.nextDose)}
              </p>
            </div>
          </div>
        )}

        {/* Detailed information */}
        {detailed && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {/* Prescriber info */}
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Prescribed by: <span className="font-medium">{medication.prescribedBy}</span>
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Started: <span className="font-medium">{formatDate(medication.startDate)}</span>
                {medication.endDate && (
                  <>
                    {', '}Ends: <span className="font-medium">{formatDate(medication.endDate)}</span>
                  </>
                )}
              </span>
            </div>

            {/* Instructions */}
            {medication.instructions && (
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                <span className="font-medium">Instructions:</span> {medication.instructions}
              </div>
            )}

            {/* Compliance and refills */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {medication.complianceRate !== undefined && (
                <div>
                  <span className="text-gray-600">Compliance:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          medication.complianceRate >= 90 ? 'bg-green-500' :
                          medication.complianceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${medication.complianceRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {medication.complianceRate}%
                    </span>
                  </div>
                </div>
              )}
              {medication.refillsRemaining !== undefined && (
                <div>
                  <span className="text-gray-600">Refills:</span>
                  <p className="font-medium mt-1">
                    {medication.refillsRemaining} remaining
                  </p>
                </div>
              )}
            </div>

            {/* Pharmacy */}
            {medication.pharmacy && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Pharmacy:</span> {medication.pharmacy}
              </p>
            )}

            {/* Last administered */}
            {medication.lastAdministered && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last given:</span> {formatTime(medication.lastAdministered)} on {formatDate(medication.lastAdministered)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationCard;
