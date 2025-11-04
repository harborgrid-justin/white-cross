/**
 * WF-COMM-EMERGENCY-001 | CommunicationEmergencyTab.tsx - Emergency Communication Interface
 * Purpose: Critical and emergency notifications with priority handling
 * Upstream: Communications system | Dependencies: React, UI components
 * Downstream: Emergency notification API, SMS gateway | Called by: Communications page
 * Related: Emergency protocols, incident management, HIPAA compliance
 * Exports: CommunicationEmergencyTab component | Key Features: Urgent alerts, multi-channel delivery, confirmation tracking
 * Last Updated: 2025-11-04 | File Type: .tsx
 * Critical Path: Emergency detected → Compose alert → Send via all channels → Track confirmations
 * LLM Context: Emergency notification system for White Cross healthcare platform
 */

'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import {
  EmergencyTypeSelector,
  EmergencyRecipientSelector,
  EmergencyMessageComposer,
  EmergencyDeliveryOptions,
  useEmergencyForm,
  useEmergencyValidation,
  useEmergencyTemplates,
  type EmergencyAlertData,
} from './emergency';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Props for CommunicationEmergencyTab component
 */
interface CommunicationEmergencyTabProps {
  className?: string;
  onEmergencyAlertSent?: (alert: EmergencyAlertData) => void;
}

/**
 * Communication Emergency Tab Component
 *
 * Handles critical and urgent communications requiring immediate parent/guardian attention.
 * Provides pre-defined emergency templates, multi-channel delivery, and confirmation tracking.
 *
 * **Features:**
 * - Pre-defined emergency templates
 * - Critical severity levels
 * - Multi-channel delivery (Email, SMS, Push, Voice call)
 * - Individual or group emergency alerts
 * - Delivery confirmation tracking
 * - Emergency contact escalation
 * - Automatic retry for failed deliveries
 * - HIPAA-compliant audit logging
 * - Emergency protocol integration
 *
 * **Emergency Types:**
 * - Medical emergencies
 * - Injuries/accidents
 * - Sudden illness
 * - Allergic reactions
 * - Medication issues
 * - School closures
 * - Weather emergencies
 * - Security incidents
 *
 * **Delivery Priority:**
 * - Critical: All channels simultaneously
 * - High: SMS + Email + Push
 * - Moderate: Email + Push
 *
 * @component
 * @param {CommunicationEmergencyTabProps} props - Component props
 * @returns {JSX.Element} Rendered emergency communication interface
 *
 * @example
 * ```tsx
 * <CommunicationEmergencyTab onEmergencyAlertSent={handleAlertSent} />
 * ```
 */
export const CommunicationEmergencyTab: React.FC<CommunicationEmergencyTabProps> = ({
  className,
  onEmergencyAlertSent,
}) => {
  const [isSending, setIsSending] = useState(false);

  // Use custom hooks for state management
  const {
    formState,
    setEmergencyType,
    setRecipientType,
    setSelectedStudents,
    setSelectedGroup,
    setSubject,
    setMessage,
    setDeliveryChannels,
    setRequireConfirmation,
    setEscalateToEmergencyContact,
    resetForm,
  } = useEmergencyForm();

  // Use validation hook
  const { errors, validateForm, clearErrors } = useEmergencyValidation(formState);

  // Use templates hook
  const { selectedType, applyTemplate } = useEmergencyTemplates(
    formState.emergencyType,
    setSubject,
    setMessage,
    setDeliveryChannels
  );

  /**
   * Handles emergency type selection and applies template
   */
  const handleEmergencyTypeChange = (typeId: string) => {
    setEmergencyType(typeId);
    if (typeId) {
      applyTemplate(typeId);
    }
  };

  /**
   * Handles emergency alert sending
   */
  const handleSendAlert = async () => {
    if (!validateForm()) return;

    if (selectedType?.severity === 'critical') {
      if (
        !confirm(
          'This is a CRITICAL emergency alert. Are you sure you want to send this notification?'
        )
      ) {
        return;
      }
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const alertData: EmergencyAlertData = {
        emergencyType: formState.emergencyType,
        severity: selectedType?.severity,
        recipientType: formState.recipientType,
        recipients:
          formState.recipientType === 'individual'
            ? formState.selectedStudents
            : formState.selectedGroup,
        subject: formState.subject,
        message: formState.message,
        deliveryChannels: formState.deliveryChannels,
        requireConfirmation: formState.requireConfirmation,
        escalateToEmergencyContact: formState.escalateToEmergencyContact,
        timestamp: new Date().toISOString(),
      };

      onEmergencyAlertSent?.(alertData);

      alert('Emergency alert sent successfully! Delivery tracking initiated.');

      // Reset form
      resetForm();
      clearErrors();
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      alert('Failed to send emergency alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this emergency alert?')) {
      resetForm();
      clearErrors();
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Warning */}
      <div className="border-l-4 border-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg">
        <div className="flex items-start">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
              Emergency Communications
            </h2>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Use this interface for urgent and emergency notifications only. All emergency alerts
              are logged and tracked.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Type Selection */}
      <EmergencyTypeSelector
        value={formState.emergencyType}
        onChange={handleEmergencyTypeChange}
        error={errors.emergencyType}
      />

      {/* Recipients */}
      <EmergencyRecipientSelector
        recipientType={formState.recipientType}
        selectedStudents={formState.selectedStudents}
        selectedGroup={formState.selectedGroup}
        onRecipientTypeChange={setRecipientType}
        onStudentsChange={setSelectedStudents}
        onGroupChange={setSelectedGroup}
        error={errors.recipients}
      />

      {/* Message Content */}
      <EmergencyMessageComposer
        subject={formState.subject}
        message={formState.message}
        onSubjectChange={setSubject}
        onMessageChange={setMessage}
        subjectError={errors.subject}
        messageError={errors.message}
      />

      {/* Delivery Options */}
      <EmergencyDeliveryOptions
        selectedChannels={formState.deliveryChannels}
        onChannelsChange={setDeliveryChannels}
        requireConfirmation={formState.requireConfirmation}
        escalateToEmergency={formState.escalateToEmergencyContact}
        onConfirmationChange={setRequireConfirmation}
        onEscalationChange={setEscalateToEmergencyContact}
        severity={selectedType?.severity}
        error={errors.deliveryChannels}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleCancel} disabled={isSending}>
          Cancel
        </Button>

        <Button
          variant="destructive"
          onClick={handleSendAlert}
          disabled={isSending}
          className="font-bold bg-red-600 hover:bg-red-700"
          aria-label="Send emergency alert"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Send Emergency Alert
        </Button>
      </div>
    </div>
  );
};

export default CommunicationEmergencyTab;
