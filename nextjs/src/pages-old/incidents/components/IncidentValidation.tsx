/**
 * IncidentValidation Component
 *
 * Production-grade form validation checker for incident reports.
 * Validates incident data completeness and provides real-time feedback.
 *
 * @module pages/incidents/components/IncidentValidation
 */

import React, { useMemo } from 'react';
import { z } from 'zod';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Progress } from '../../../components/ui/feedback/Progress';
import { Badge } from '../../../components/ui/display/Badge';
import type { IncidentReport, IncidentType, IncidentSeverity } from '../../../types/incidents';

/**
 * Validation field definition
 */
interface ValidationField {
  name: string;
  label: string;
  required: boolean;
  isValid: boolean;
  category: 'basic' | 'details' | 'response' | 'followup';
}

/**
 * Component props
 */
interface IncidentValidationProps {
  /** Partial incident data to validate */
  incident: Partial<IncidentReport>;
  /** Optional CSS class name */
  className?: string;
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, completionPercent: number) => void;
}

/**
 * Incident report validation schema
 */
const incidentValidationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  type: z.nativeEnum({
    INJURY: 'INJURY',
    ILLNESS: 'ILLNESS',
    BEHAVIORAL: 'BEHAVIORAL',
    MEDICATION_ERROR: 'MEDICATION_ERROR',
    ALLERGIC_REACTION: 'ALLERGIC_REACTION',
    EMERGENCY: 'EMERGENCY',
    OTHER: 'OTHER',
  } as Record<string, string>),
  severity: z.nativeEnum({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  } as Record<string, string>),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  occurredAt: z.string().min(1, 'Incident date/time is required'),
  actionsTaken: z.string().min(10, 'Actions taken must be at least 10 characters'),
  reportedById: z.string().min(1, 'Reporter is required'),
});

/**
 * IncidentValidation component - Real-time form validation with completion tracking
 *
 * Features:
 * - Real-time field-level validation
 * - Progress bar showing completion percentage
 * - Field-by-field checklist with status indicators
 * - Category grouping (basic info, details, response, follow-up)
 * - "Ready to submit" indicator
 * - Accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <IncidentValidation
 *   incident={incidentData}
 *   onValidationChange={(isValid, percent) => {
 *     setCanSubmit(isValid);
 *     setProgress(percent);
 *   }}
 * />
 * ```
 */
const IncidentValidation: React.FC<IncidentValidationProps> = ({
  incident,
  className = '',
  onValidationChange
}) => {
  /**
   * Validate incident data and compute field statuses
   */
  const validationResult = useMemo(() => {
    const result = incidentValidationSchema.safeParse(incident);

    const fields: ValidationField[] = [
      {
        name: 'studentId',
        label: 'Student Selected',
        required: true,
        isValid: !!incident.studentId,
        category: 'basic',
      },
      {
        name: 'type',
        label: 'Incident Type',
        required: true,
        isValid: !!incident.type,
        category: 'basic',
      },
      {
        name: 'severity',
        label: 'Severity Level',
        required: true,
        isValid: !!incident.severity,
        category: 'basic',
      },
      {
        name: 'occurredAt',
        label: 'Date & Time of Incident',
        required: true,
        isValid: !!incident.occurredAt,
        category: 'basic',
      },
      {
        name: 'location',
        label: 'Location',
        required: true,
        isValid: !!incident.location && incident.location.length > 0,
        category: 'details',
      },
      {
        name: 'description',
        label: 'Incident Description',
        required: true,
        isValid: !!incident.description && incident.description.length >= 10,
        category: 'details',
      },
      {
        name: 'actionsTaken',
        label: 'Actions Taken',
        required: true,
        isValid: !!incident.actionsTaken && incident.actionsTaken.length >= 10,
        category: 'response',
      },
      {
        name: 'reportedById',
        label: 'Reported By',
        required: true,
        isValid: !!incident.reportedById,
        category: 'response',
      },
    ];

    // Add optional fields
    if (incident.followUpRequired) {
      fields.push({
        name: 'followUpNotes',
        label: 'Follow-up Notes',
        required: false,
        isValid: !!incident.followUpNotes,
        category: 'followup',
      });
    }

    const validFields = fields.filter(f => f.isValid).length;
    const requiredFields = fields.filter(f => f.required).length;
    const completionPercent = Math.round((validFields / fields.length) * 100);
    const isValid = result.success;

    return {
      isValid,
      fields,
      validFields,
      requiredFields,
      completionPercent,
    };
  }, [incident]);

  /**
   * Notify parent of validation changes
   */
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationResult.isValid, validationResult.completionPercent);
    }
  }, [validationResult.isValid, validationResult.completionPercent, onValidationChange]);

  /**
   * Group fields by category
   */
  const fieldsByCategory = useMemo(() => {
    const categories = {
      basic: validationResult.fields.filter(f => f.category === 'basic'),
      details: validationResult.fields.filter(f => f.category === 'details'),
      response: validationResult.fields.filter(f => f.category === 'response'),
      followup: validationResult.fields.filter(f => f.category === 'followup'),
    };
    return categories;
  }, [validationResult.fields]);

  /**
   * Get progress variant based on completion
   */
  const getProgressVariant = (percent: number): 'error' | 'warning' | 'success' | 'default' => {
    if (percent < 40) return 'error';
    if (percent < 70) return 'warning';
    if (percent < 100) return 'default';
    return 'success';
  };

  return (
    <div
      className={cn('incident-validation bg-white rounded-lg border border-gray-200 p-6', className)}
      role="region"
      aria-label="Incident validation status"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Validation Status</h3>
          {validationResult.isValid ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Ready to Submit
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1">
              <AlertCircle className="w-4 h-4" />
              Incomplete
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <Progress
          value={validationResult.completionPercent}
          max={100}
          variant={getProgressVariant(validationResult.completionPercent)}
          showLabel
          label={`${validationResult.validFields} of ${validationResult.fields.length} fields completed`}
          size="md"
          aria-label={`Form completion: ${validationResult.completionPercent}%`}
        />
      </div>

      {/* Field Checklist */}
      <div className="space-y-4">
        {/* Basic Information */}
        {fieldsByCategory.basic.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
            <div className="space-y-2">
              {fieldsByCategory.basic.map(field => (
                <ValidationFieldItem key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}

        {/* Incident Details */}
        {fieldsByCategory.details.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Incident Details</h4>
            <div className="space-y-2">
              {fieldsByCategory.details.map(field => (
                <ValidationFieldItem key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}

        {/* Response & Actions */}
        {fieldsByCategory.response.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Response & Actions</h4>
            <div className="space-y-2">
              {fieldsByCategory.response.map(field => (
                <ValidationFieldItem key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}

        {/* Follow-up */}
        {fieldsByCategory.followup.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Follow-up (Optional)</h4>
            <div className="space-y-2">
              {fieldsByCategory.followup.map(field => (
                <ValidationFieldItem key={field.name} field={field} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Individual validation field item component
 */
const ValidationFieldItem: React.FC<{ field: ValidationField }> = ({ field }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-md transition-colors',
        field.isValid ? 'bg-green-50' : 'bg-gray-50'
      )}
      role="listitem"
    >
      {field.isValid ? (
        <CheckCircle2
          className="w-5 h-5 text-green-600 flex-shrink-0"
          aria-label="Completed"
        />
      ) : (
        <Circle
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          aria-label="Incomplete"
        />
      )}
      <span className={cn(
        'text-sm',
        field.isValid ? 'text-gray-900' : 'text-gray-600'
      )}>
        {field.label}
        {field.required && !field.isValid && (
          <span className="text-red-600 ml-1" aria-label="Required">*</span>
        )}
      </span>
    </div>
  );
};

IncidentValidation.displayName = 'IncidentValidation';

export default React.memo(IncidentValidation);
