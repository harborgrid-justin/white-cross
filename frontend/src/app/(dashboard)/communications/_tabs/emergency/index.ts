/**
 * WF-COMM-EMERGENCY-BARREL | index.ts - Emergency Components Barrel Export
 * Purpose: Central export point for emergency communication components
 * Last Updated: 2025-11-04
 */

// Components
export { EmergencyTypeSelector } from './EmergencyTypeSelector';
export { EmergencyRecipientSelector } from './EmergencyRecipientSelector';
export { EmergencyMessageComposer } from './EmergencyMessageComposer';
export { EmergencyDeliveryOptions } from './EmergencyDeliveryOptions';

// Hooks
export * from './hooks';

// Types
export type {
  EmergencySeverity,
  RecipientType,
  DeliveryChannel,
  EmergencyType,
  EmergencyFormState,
  EmergencyFormErrors,
  EmergencyAlertData,
  EmergencyTypeSelectorProps,
  EmergencyRecipientSelectorProps,
  EmergencyMessageComposerProps,
  EmergencyDeliveryOptionsProps,
  UseEmergencyFormReturn,
  UseEmergencyValidationReturn,
  UseEmergencyTemplatesReturn,
} from './types';

// Constants
export { EMERGENCY_TYPES, DEFAULT_EMERGENCY_FORM, SEVERITY_DELIVERY_CHANNELS } from './constants';
