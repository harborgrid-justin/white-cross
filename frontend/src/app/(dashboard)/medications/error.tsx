'use client';

/**
 * @fileoverview Medications Error Boundary - Healthcare-Specific Error Handling
 * @module app/(dashboard)/medications/error
 *
 * @description
 * Specialized error boundary for medication management system with healthcare-specific
 * error handling, safety protocols, and emergency procedures.
 *
 * **Healthcare Safety Features:**
 * - Emergency medication access protocols
 * - Critical alert system during errors
 * - Offline medication administration guidance
 * - Controlled substance security considerations
 * - Audit trail preservation during errors
 *
 * **Error Recovery:**
 * - Graceful degradation for medication administration
 * - Manual override procedures for emergencies
 * - Data integrity verification steps
 * - Staff notification procedures
 *
 * @since 1.0.0
 */

import { GenericDomainError } from '@/components/shared/errors/GenericDomainError';
import { AlertTriangle, Pill, Shield, Clock } from 'lucide-react';

export default function MedicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Determine error severity for healthcare context
  const isEmergencyScenario = error.message?.includes('emergency') || error.message?.includes('critical');
  const isNetworkError = error.message?.includes('network') || error.message?.includes('fetch');
  const isDataError = error.message?.includes('database') || error.message?.includes('sync');

  const getHealthcareMessage = (): string => {
    if (isEmergencyScenario) {
      return "Critical error in medication system. Emergency protocols may be needed for immediate medication administration.";
    }
    if (isNetworkError) {
      return "Network connectivity issues affecting medication system. Offline protocols may be necessary for urgent medication needs.";
    }
    if (isDataError) {
      return "Data synchronization error in medication records. Verify all recent medication administrations were properly recorded.";
    }
    return "Medication management system is temporarily unavailable. This may affect prescription tracking, administration scheduling, and inventory monitoring.";
  };

  const getRecoverySteps = (): string[] => {
    const baseSteps = [
      'Click "Try Again" to reload medication management system',
      'Verify network connectivity and system status',
    ];

    if (isEmergencyScenario) {
      return [
        '🚨 For immediate medication needs, follow emergency administration protocols',
        'Verify critical medications (EpiPens, inhalers, insulin) are accessible',
        'Document any emergency administrations manually',
        ...baseSteps,
        'Notify healthcare supervisor immediately',
        'Follow up with IT support for system restoration',
      ];
    }

    if (isNetworkError) {
      return [
        'Check network connection and internet access',
        'Verify VPN connection if required for medication system',
        ...baseSteps,
        'Use offline medication administration forms if needed',
        'Sync all offline records once system is restored',
        'Contact IT support if connectivity issues persist',
      ];
    }

    if (isDataError) {
      return [
        'Verify recent medication administrations were recorded',
        'Check for any pending medication administration entries',
        ...baseSteps,
        'Review audit logs for data inconsistencies',
        'Verify controlled substance inventory counts',
        'Contact system administrator for data recovery',
      ];
    }

    return [
      ...baseSteps,
      'Check system status dashboard for maintenance alerts',
      'Verify medication administration schedules are current',
      'Ensure emergency medications remain accessible',
      'Document any critical medications due during outage',
      'Contact IT support if error persists beyond 5 minutes',
    ];
  };

  const getErrorIcon = () => {
    if (isEmergencyScenario) {
      return <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />;
    }
    if (isNetworkError) {
      return <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />;
    }
    if (isDataError) {
      return <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />;
    }
    return <Pill className="h-8 w-8 text-red-600 dark:text-red-400" />;
  };

  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Medication Management"
      domainIcon={getErrorIcon()}
      customMessage={getHealthcareMessage()}
      customRecoverySteps={getRecoverySteps()}
      severity={isEmergencyScenario ? 'critical' : isNetworkError ? 'high' : 'medium'}
      showEmergencyContacts={isEmergencyScenario}
      preserveAuditTrail={true}
    />
  );
}
