/**
 * EscalationPanel Component
 *
 * Escalation management for incident reports.
 * Displays escalation rules, manual escalation options, escalation history,
 * escalation targets (supervisor, administrator, emergency contact),
 * and urgency level selection.
 *
 * @component
 * @example
 * ```tsx
 * <EscalationPanel incidentId="incident-123" />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/shared/store-hooks-index';
import { Button } from '@/components/ui/buttons/Button';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Badge } from '@/components/ui/display/Badge';
import { fetchIncidentReportById, updateIncidentReport } from '../store/incidentReportsSlice';
import { IncidentSeverity } from '@/types/incidents';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import debug from 'debug';

const log = debug('whitecross:escalation-panel');

interface EscalationPanelProps {
  /** ID of the incident to display escalation panel for */
  incidentId: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Escalation target types
 */
enum EscalationTarget {
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  EXTERNAL_AUTHORITY = 'EXTERNAL_AUTHORITY',
}

/**
 * Urgency levels for escalation
 */
enum UrgencyLevel {
  STANDARD = 'STANDARD',
  ELEVATED = 'ELEVATED',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Escalation history entry
 */
interface EscalationEntry {
  id: string;
  escalatedAt: string;
  escalatedBy: string;
  escalatedByName: string;
  target: EscalationTarget;
  targetName: string;
  urgency: UrgencyLevel;
  reason: string;
  automated: boolean;
}

/**
 * Escalation rule
 */
interface EscalationRule {
  id: string;
  condition: string;
  target: EscalationTarget;
  urgency: UrgencyLevel;
  enabled: boolean;
}

/**
 * EscalationPanel component - Escalation management
 */
const EscalationPanel: React.FC<EscalationPanelProps> = ({ incidentId, className = '' }) => {
  const dispatch = useAppDispatch();
  const incident = useAppSelector((state) =>
    state.incidentReports.reports.find((r) => r.id === incidentId) ||
    state.incidentReports.selectedReport
  );
  const currentUser = useAppSelector((state) => state.auth?.user);
  const isLoading = useAppSelector((state) => state.incidentReports.loading.detail);

  // Local state
  const [showEscalationForm, setShowEscalationForm] = useState<boolean>(false);
  const [escalationTarget, setEscalationTarget] = useState<EscalationTarget>(
    EscalationTarget.SUPERVISOR
  );
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.STANDARD);
  const [escalationReason, setEscalationReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Mock escalation rules - replace with actual data from backend
  const [escalationRules] = useState<EscalationRule[]>([
    {
      id: '1',
      condition: 'Severity is CRITICAL',
      target: EscalationTarget.ADMINISTRATOR,
      urgency: UrgencyLevel.CRITICAL,
      enabled: true,
    },
    {
      id: '2',
      condition: 'Incident not resolved within 24 hours',
      target: EscalationTarget.SUPERVISOR,
      urgency: UrgencyLevel.ELEVATED,
      enabled: true,
    },
    {
      id: '3',
      condition: 'Parent notification required but not sent',
      target: EscalationTarget.EMERGENCY_CONTACT,
      urgency: UrgencyLevel.HIGH,
      enabled: true,
    },
  ]);

  // Mock escalation history - replace with actual data from backend
  const [escalationHistory, setEscalationHistory] = useState<EscalationEntry[]>([
    {
      id: '1',
      escalatedAt: '2025-10-24T09:00:00Z',
      escalatedBy: 'user-1',
      escalatedByName: 'Jane Smith',
      target: EscalationTarget.SUPERVISOR,
      targetName: 'Michael Brown (Supervisor)',
      urgency: UrgencyLevel.ELEVATED,
      reason: 'Incident requires immediate supervisor attention for policy guidance.',
      automated: false,
    },
  ]);

  // Fetch incident if not loaded
  useEffect(() => {
    if (!incident && incidentId) {
      log('Fetching incident for escalation panel:', incidentId);
      dispatch(fetchIncidentReportById(incidentId));
    }
  }, [incident, incidentId, dispatch]);

  // Target options for selection
  const targetOptions: SelectOption[] = [
    { value: EscalationTarget.SUPERVISOR, label: 'Supervisor' },
    { value: EscalationTarget.ADMINISTRATOR, label: 'Administrator' },
    { value: EscalationTarget.EMERGENCY_CONTACT, label: 'Emergency Contact' },
    { value: EscalationTarget.DISTRICT_ADMIN, label: 'District Administrator' },
    { value: EscalationTarget.EXTERNAL_AUTHORITY, label: 'External Authority' },
  ];

  // Urgency options for selection
  const urgencyOptions: SelectOption[] = [
    { value: UrgencyLevel.STANDARD, label: 'Standard Urgency' },
    { value: UrgencyLevel.ELEVATED, label: 'Elevated Urgency' },
    { value: UrgencyLevel.HIGH, label: 'High Urgency' },
    { value: UrgencyLevel.CRITICAL, label: 'Critical Urgency' },
  ];

  /**
   * Handle escalation submission
   */
  const handleEscalate = async () => {
    if (!escalationReason.trim()) {
      toast.error('Please provide a reason for escalation');
      return;
    }

    setIsSubmitting(true);
    log('Escalating incident:', {
      incidentId,
      target: escalationTarget,
      urgency: urgencyLevel,
      reason: escalationReason,
    });

    try {
      // Create new escalation entry
      const newEscalation: EscalationEntry = {
        id: `${Date.now()}`,
        escalatedAt: new Date().toISOString(),
        escalatedBy: currentUser?.id || 'unknown',
        escalatedByName: `${currentUser?.firstName} ${currentUser?.lastName}` || 'Unknown User',
        target: escalationTarget,
        targetName: targetOptions.find((t) => t.value === escalationTarget)?.label || 'Unknown',
        urgency: urgencyLevel,
        reason: escalationReason,
        automated: false,
      };

      // Add to history
      setEscalationHistory((prev) => [newEscalation, ...prev]);

      // Update incident in backend
      await dispatch(
        updateIncidentReport({
          id: incidentId,
          data: {
            severity:
              urgencyLevel === UrgencyLevel.CRITICAL
                ? IncidentSeverity.CRITICAL
                : incident?.severity || IncidentSeverity.MEDIUM,
            followUpNotes: `Escalated to ${escalationTarget} with ${urgencyLevel} urgency: ${escalationReason}`,
          },
        })
      ).unwrap();

      toast.success('Incident escalated successfully');
      setEscalationReason('');
      setShowEscalationForm(false);
    } catch (error: any) {
      log('Error escalating incident:', error);
      toast.error(error.message || 'Failed to escalate incident');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get urgency badge variant
   */
  const getUrgencyBadgeVariant = (urgency: UrgencyLevel): 'default' | 'warning' | 'danger' => {
    switch (urgency) {
      case UrgencyLevel.CRITICAL:
        return 'danger';
      case UrgencyLevel.HIGH:
      case UrgencyLevel.ELEVATED:
        return 'warning';
      default:
        return 'default';
    }
  };

  /**
   * Get target icon
   */
  const getTargetIcon = (target: EscalationTarget): JSX.Element => {
    const baseClasses = 'w-5 h-5';

    switch (target) {
      case EscalationTarget.SUPERVISOR:
        return (
          <svg className={baseClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case EscalationTarget.ADMINISTRATOR:
        return (
          <svg className={baseClasses} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case EscalationTarget.EMERGENCY_CONTACT:
        return (
          <svg className={baseClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );
      default:
        return (
          <svg className={baseClasses} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
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

  if (isLoading) {
    return (
      <div className={cn('escalation-panel', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('escalation-panel', className)}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Escalation Management
          </h3>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setShowEscalationForm(!showEscalationForm)}
            disabled={isSubmitting}
          >
            {showEscalationForm ? 'Cancel Escalation' : 'Escalate Incident'}
          </Button>
        </div>

        {/* Manual Escalation Form */}
        {showEscalationForm && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-4">
              Manual Escalation
            </h4>

            <div className="space-y-4">
              {/* Escalate To */}
              <div>
                <Select
                  label="Escalate To"
                  required
                  options={targetOptions}
                  value={escalationTarget}
                  onChange={(value) => setEscalationTarget(value as EscalationTarget)}
                  disabled={isSubmitting}
                  helperText="Select the escalation target"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <Select
                  label="Urgency Level"
                  required
                  options={urgencyOptions}
                  value={urgencyLevel}
                  onChange={(value) => setUrgencyLevel(value as UrgencyLevel)}
                  disabled={isSubmitting}
                  helperText="Set the urgency level for this escalation"
                />
              </div>

              {/* Reason for Escalation */}
              <div>
                <Textarea
                  label="Reason for Escalation"
                  required
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Explain why this incident needs to be escalated..."
                  rows={3}
                  maxLength={500}
                  showCharCount
                  disabled={isSubmitting}
                  helperText="Provide a detailed reason for escalation"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handleEscalate}
                  loading={isSubmitting}
                  disabled={isSubmitting || !escalationReason.trim()}
                >
                  Escalate Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEscalationForm(false);
                    setEscalationReason('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Escalation Rules */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Escalation Rules
          </h4>
          <div className="space-y-2">
            {escalationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {rule.condition}
                      </span>
                      {rule.enabled ? (
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>Target: {targetOptions.find((t) => t.value === rule.target)?.label}</span>
                      <span>•</span>
                      <Badge variant={getUrgencyBadgeVariant(rule.urgency)} size="sm">
                        {rule.urgency}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-gray-400 dark:text-gray-600">
                    {getTargetIcon(rule.target)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation History */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Escalation History
          </h4>

          {escalationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No escalations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {escalationHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-orange-600 dark:text-orange-400 mt-0.5">
                      {getTargetIcon(entry.target)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Escalated to {entry.targetName}
                        </span>
                        {entry.automated && (
                          <Badge variant="default" size="sm">
                            Automated
                          </Badge>
                        )}
                        <Badge variant={getUrgencyBadgeVariant(entry.urgency)} size="sm">
                          {entry.urgency}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {entry.reason}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>By {entry.escalatedByName}</span>
                        <span>•</span>
                        <span>{formatDate(entry.escalatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning Banner for Critical Incidents */}
        {incident?.severity === IncidentSeverity.CRITICAL && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h5 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                  Critical Incident
                </h5>
                <p className="text-sm text-red-800 dark:text-red-200">
                  This incident is marked as CRITICAL. Ensure appropriate authorities have been
                  notified and all escalation protocols are followed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalationPanel;
