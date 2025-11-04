/**
 * WF-COMM-EMERGENCY-HOOK-TEMPLATES | useEmergencyTemplates.ts - Emergency Template Hook
 * Purpose: Manages emergency type templates and auto-configuration
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

import { useMemo, useCallback } from 'react';
import type {
  EmergencyType,
  UseEmergencyTemplatesReturn,
  DeliveryChannel,
} from '../types';
import { EMERGENCY_TYPES, SEVERITY_DELIVERY_CHANNELS } from '../constants';

/**
 * Custom hook for managing emergency templates
 *
 * Provides template selection and auto-configuration based on
 * emergency type severity levels.
 *
 * @param {string} emergencyTypeId - Currently selected emergency type ID
 * @param {function} onSubjectChange - Callback to update subject
 * @param {function} onMessageChange - Callback to update message
 * @param {function} onChannelsChange - Callback to update delivery channels
 * @returns {UseEmergencyTemplatesReturn} Selected type and apply function
 *
 * @example
 * ```tsx
 * const { selectedType, applyTemplate } = useEmergencyTemplates(
 *   emergencyTypeId,
 *   setSubject,
 *   setMessage,
 *   setDeliveryChannels
 * );
 * ```
 */
export function useEmergencyTemplates(
  emergencyTypeId: string,
  onSubjectChange: (subject: string) => void,
  onMessageChange: (message: string) => void,
  onChannelsChange: (channels: DeliveryChannel[]) => void
): UseEmergencyTemplatesReturn {
  const selectedType = useMemo(
    () => EMERGENCY_TYPES.find((type) => type.id === emergencyTypeId),
    [emergencyTypeId]
  );

  const applyTemplate = useCallback(
    (typeId: string) => {
      const type = EMERGENCY_TYPES.find((t) => t.id === typeId);

      if (!type) return;

      // Set subject with URGENT prefix
      onSubjectChange(`URGENT: ${type.name}`);

      // Set message from template
      if (type.template) {
        onMessageChange(type.template);
      }

      // Auto-select delivery channels based on severity
      const channels = [...SEVERITY_DELIVERY_CHANNELS[type.severity]];
      onChannelsChange(channels as DeliveryChannel[]);
    },
    [onSubjectChange, onMessageChange, onChannelsChange]
  );

  return {
    selectedType,
    applyTemplate,
  };
}
