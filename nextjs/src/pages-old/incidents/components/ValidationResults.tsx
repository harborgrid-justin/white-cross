/**
 * ValidationResults Component
 *
 * Displays comprehensive validation results with errors, warnings, and info messages.
 * Groups results by severity and provides actionable links to fix issues.
 *
 * @module pages/incidents/components/ValidationResults
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight, Download, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Badge } from '../../../components/ui/display/Badge';
import { Button } from '../../../components/ui/buttons/Button';

/**
 * Validation result severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Individual validation result
 */
export interface ValidationResult {
  /** Result ID */
  id: string;
  /** Severity level */
  severity: ValidationSeverity;
  /** Error/warning/info message */
  message: string;
  /** Field name this result relates to */
  field?: string;
  /** Additional context or suggestion */
  suggestion?: string;
  /** Callback to navigate to/focus the related field */
  onFix?: () => void;
}

/**
 * Component props
 */
interface ValidationResultsProps {
  /** Array of validation results */
  results: ValidationResult[];
  /** Optional CSS class name */
  className?: string;
  /** Show export button */
  showExport?: boolean;
  /** Callback when export is clicked */
  onExport?: () => void;
  /** Allow dismissing individual results */
  dismissible?: boolean;
  /** Callback when result is dismissed */
  onDismiss?: (id: string) => void;
}

/**
 * ValidationResults component - Display comprehensive validation results
 *
 * Features:
 * - Groups results by severity (errors, warnings, info)
 * - Collapsible sections for each severity level
 * - Links to fields needing attention
 * - Export validation report
 * - Dismissible results
 * - Color-coded severity indicators
 * - Accessible with ARIA labels
 *
 * @example
 * ```tsx
 * <ValidationResults
 *   results={[
 *     { id: '1', severity: 'error', message: 'Student is required', field: 'studentId' },
 *     { id: '2', severity: 'warning', message: 'Parent not notified', field: 'parentNotified' }
 *   ]}
 *   showExport
 *   onExport={handleExport}
 * />
 * ```
 */
const ValidationResults: React.FC<ValidationResultsProps> = ({
  results,
  className = '',
  showExport = false,
  onExport,
  dismissible = false,
  onDismiss,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<ValidationSeverity>>(
    new Set(['error', 'warning'])
  );
  const [dismissedResults, setDismissedResults] = useState<Set<string>>(new Set());

  /**
   * Group results by severity
   */
  const groupedResults = useMemo(() => {
    const activeResults = results.filter(r => !dismissedResults.has(r.id));

    return {
      error: activeResults.filter(r => r.severity === 'error'),
      warning: activeResults.filter(r => r.severity === 'warning'),
      info: activeResults.filter(r => r.severity === 'info'),
    };
  }, [results, dismissedResults]);

  /**
   * Total counts
   */
  const counts = useMemo(() => ({
    total: results.length - dismissedResults.size,
    error: groupedResults.error.length,
    warning: groupedResults.warning.length,
    info: groupedResults.info.length,
  }), [results.length, dismissedResults.size, groupedResults]);

  /**
   * Toggle section expansion
   */
  const toggleSection = (severity: ValidationSeverity) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(severity)) {
        newSet.delete(severity);
      } else {
        newSet.add(severity);
      }
      return newSet;
    });
  };

  /**
   * Handle result dismissal
   */
  const handleDismiss = (id: string) => {
    setDismissedResults(prev => new Set(prev).add(id));
    if (onDismiss) {
      onDismiss(id);
    }
  };

  /**
   * Export results as JSON
   */
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export behavior
      const exportData = {
        timestamp: new Date().toISOString(),
        summary: counts,
        results: results.filter(r => !dismissedResults.has(r.id)),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-results-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (counts.total === 0) {
    return (
      <div className={cn('validation-results bg-white rounded-lg border border-gray-200 p-6', className)}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
          <p className="text-sm text-gray-600">No validation issues found.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('validation-results bg-white rounded-lg border border-gray-200', className)}
      role="region"
      aria-label="Validation results"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
            <div className="flex items-center gap-3 mt-1">
              {counts.error > 0 && (
                <Badge variant="error" size="sm">
                  {counts.error} Error{counts.error !== 1 ? 's' : ''}
                </Badge>
              )}
              {counts.warning > 0 && (
                <Badge variant="warning" size="sm">
                  {counts.warning} Warning{counts.warning !== 1 ? 's' : ''}
                </Badge>
              )}
              {counts.info > 0 && (
                <Badge variant="info" size="sm">
                  {counts.info} Info
                </Badge>
              )}
            </div>
          </div>

          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Results Sections */}
      <div className="divide-y divide-gray-200">
        {/* Errors */}
        {counts.error > 0 && (
          <ValidationSection
            severity="error"
            title="Errors"
            icon={<AlertCircle className="w-5 h-5" />}
            results={groupedResults.error}
            expanded={expandedSections.has('error')}
            onToggle={() => toggleSection('error')}
            dismissible={dismissible}
            onDismiss={handleDismiss}
          />
        )}

        {/* Warnings */}
        {counts.warning > 0 && (
          <ValidationSection
            severity="warning"
            title="Warnings"
            icon={<AlertTriangle className="w-5 h-5" />}
            results={groupedResults.warning}
            expanded={expandedSections.has('warning')}
            onToggle={() => toggleSection('warning')}
            dismissible={dismissible}
            onDismiss={handleDismiss}
          />
        )}

        {/* Info */}
        {counts.info > 0 && (
          <ValidationSection
            severity="info"
            title="Information"
            icon={<Info className="w-5 h-5" />}
            results={groupedResults.info}
            expanded={expandedSections.has('info')}
            onToggle={() => toggleSection('info')}
            dismissible={dismissible}
            onDismiss={handleDismiss}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Validation section component for a specific severity level
 */
interface ValidationSectionProps {
  severity: ValidationSeverity;
  title: string;
  icon: React.ReactNode;
  results: ValidationResult[];
  expanded: boolean;
  onToggle: () => void;
  dismissible: boolean;
  onDismiss: (id: string) => void;
}

const ValidationSection: React.FC<ValidationSectionProps> = ({
  severity,
  title,
  icon,
  results,
  expanded,
  onToggle,
  dismissible,
  onDismiss,
}) => {
  const severityColors = {
    error: 'text-red-700 bg-red-50',
    warning: 'text-yellow-700 bg-yellow-50',
    info: 'text-blue-700 bg-blue-50',
  };

  const iconColors = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div className={cn('validation-section', severityColors[severity])}>
      {/* Section Header */}
      <button
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-colors"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`${severity}-results`}
      >
        <div className="flex items-center gap-3">
          <div className={iconColors[severity]}>{icon}</div>
          <span className="font-medium">{title}</span>
          <Badge variant={severity} size="sm">
            {results.length}
          </Badge>
        </div>
        {expanded ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Section Content */}
      {expanded && (
        <div id={`${severity}-results`} className="px-4 pb-3 space-y-2">
          {results.map(result => (
            <ValidationResultItem
              key={result.id}
              result={result}
              severity={severity}
              dismissible={dismissible}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Individual validation result item
 */
interface ValidationResultItemProps {
  result: ValidationResult;
  severity: ValidationSeverity;
  dismissible: boolean;
  onDismiss: (id: string) => void;
}

const ValidationResultItem: React.FC<ValidationResultItemProps> = ({
  result,
  severity,
  dismissible,
  onDismiss,
}) => {
  const borderColors = {
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-md border p-3',
        borderColors[severity]
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {result.message}
          </p>
          {result.field && (
            <p className="text-xs text-gray-600 mt-1">
              Field: <span className="font-mono">{result.field}</span>
            </p>
          )}
          {result.suggestion && (
            <p className="text-xs text-gray-600 mt-1 italic">
              {result.suggestion}
            </p>
          )}
          {result.onFix && (
            <button
              onClick={result.onFix}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
            >
              Fix this issue →
            </button>
          )}
        </div>

        {dismissible && (
          <button
            onClick={() => onDismiss(result.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

ValidationResults.displayName = 'ValidationResults';

export default React.memo(ValidationResults);
