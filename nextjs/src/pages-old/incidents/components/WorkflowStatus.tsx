/**
 * WorkflowStatus Component
 *
 * Visual workflow progress indicator for incident reports.
 * Displays workflow steps: Reported → Investigating → Resolved → Closed
 * Shows current step, timestamps, and allows navigation to step details.
 *
 * @component
 * @example
 * ```tsx
 * <WorkflowStatus incidentId="incident-123" />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/shared/store-hooks-index';
import { IncidentStatus } from '@/types/incidents';
import { fetchIncidentReportById } from '../store/incidentReportsSlice';
import { cn } from '@/utils/cn';
import debug from 'debug';

const log = debug('whitecross:workflow-status');

interface WorkflowStatusProps {
  /** ID of the incident to display workflow status for */
  incidentId: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Workflow step definition
 */
interface WorkflowStep {
  id: IncidentStatus;
  label: string;
  description: string;
}

/**
 * Workflow steps in order
 */
const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: IncidentStatus.OPEN,
    label: 'Reported',
    description: 'Incident has been reported',
  },
  {
    id: IncidentStatus.INVESTIGATING,
    label: 'Investigating',
    description: 'Incident is under investigation',
  },
  {
    id: IncidentStatus.RESOLVED,
    label: 'Resolved',
    description: 'Incident has been resolved',
  },
  {
    id: IncidentStatus.CLOSED,
    label: 'Closed',
    description: 'Incident is closed',
  },
];

/**
 * WorkflowStatus component - Visual workflow progress indicator
 */
const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ incidentId, className = '' }) => {
  const dispatch = useAppDispatch();
  const incident = useAppSelector((state) =>
    state.incidentReports.reports.find((r) => r.id === incidentId) ||
    state.incidentReports.selectedReport
  );
  const isLoading = useAppSelector((state) => state.incidentReports.loading.detail);

  const [selectedStep, setSelectedStep] = useState<IncidentStatus | null>(null);

  // Fetch incident if not loaded
  useEffect(() => {
    if (!incident && incidentId) {
      log('Fetching incident for workflow status:', incidentId);
      dispatch(fetchIncidentReportById(incidentId));
    }
  }, [incident, incidentId, dispatch]);

  // Get current status or default to OPEN
  const currentStatus = incident?.status || IncidentStatus.OPEN;

  // Calculate step index for current status
  const currentStepIndex = WORKFLOW_STEPS.findIndex((step) => step.id === currentStatus);

  /**
   * Get step status (completed, current, or upcoming)
   */
  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'upcoming' => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  /**
   * Get timestamp for a step (mock implementation - adjust based on actual data)
   */
  const getStepTimestamp = (step: WorkflowStep): string | null => {
    if (!incident) return null;

    // Map steps to actual timestamp fields
    switch (step.id) {
      case IncidentStatus.OPEN:
        return incident.createdAt || incident.reportedAt || null;
      case IncidentStatus.INVESTIGATING:
        // You may need to add these fields to your incident model
        return null;
      case IncidentStatus.RESOLVED:
        return null;
      case IncidentStatus.CLOSED:
        return null;
      default:
        return null;
    }
  };

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return 'Not started';

    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Handle step click
   */
  const handleStepClick = (step: WorkflowStep, stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    if (status !== 'upcoming') {
      log('Step clicked:', step.id);
      setSelectedStep(selectedStep === step.id ? null : step.id);
    }
  };

  /**
   * Calculate progress percentage
   */
  const progressPercentage = ((currentStepIndex + 1) / WORKFLOW_STEPS.length) * 100;

  if (isLoading) {
    return (
      <div className={cn('workflow-status', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center w-1/4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className={cn('workflow-status', className)}>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>No incident data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('workflow-status', className)}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Workflow Progress
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Status: <span className="font-medium text-gray-900 dark:text-gray-100">
                {WORKFLOW_STEPS[currentStepIndex]?.label || 'Unknown'}
              </span>
            </p>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 dark:bg-primary-600 transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          <div className="flex justify-between items-start">
            {WORKFLOW_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const timestamp = getStepTimestamp(step);
              const isSelected = selectedStep === step.id;
              const isClickable = status !== 'upcoming';

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex flex-col items-center w-1/4 relative',
                    isClickable && 'cursor-pointer group'
                  )}
                  onClick={() => handleStepClick(step, index)}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleStepClick(step, index);
                    }
                  }}
                >
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 mb-2',
                      status === 'completed' &&
                        'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white',
                      status === 'current' &&
                        'bg-primary-500 dark:bg-primary-600 border-primary-500 dark:border-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900',
                      status === 'upcoming' &&
                        'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500',
                      isClickable && 'group-hover:ring-4 group-hover:ring-gray-200 dark:group-hover:ring-gray-600'
                    )}
                  >
                    {status === 'completed' ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="text-center">
                    <p
                      className={cn(
                        'text-sm font-medium mb-1',
                        status === 'completed' && 'text-green-700 dark:text-green-400',
                        status === 'current' && 'text-primary-700 dark:text-primary-400',
                        status === 'upcoming' && 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {step.label}
                    </p>

                    {/* Timestamp */}
                    {(status === 'completed' || status === 'current') && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(timestamp)}
                      </p>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-6 left-1/2 w-full h-0.5 -z-10',
                        status === 'completed'
                          ? 'bg-green-500 dark:bg-green-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      )}
                      style={{ left: 'calc(50% + 24px)' }}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Details (shown when step is clicked) */}
        {selectedStep && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {WORKFLOW_STEPS.find((s) => s.id === selectedStep)?.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {WORKFLOW_STEPS.find((s) => s.id === selectedStep)?.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {formatTimestamp(
                    getStepTimestamp(WORKFLOW_STEPS.find((s) => s.id === selectedStep)!)
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedStep(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                aria-label="Close details"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStatus;
