/**
 * WF-COMM-EMERGENCY-TYPES | types.ts - Emergency Communication Type Definitions
 * Purpose: TypeScript interfaces for emergency communication system
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

/**
 * Emergency severity levels
 */
export type EmergencySeverity = 'critical' | 'high' | 'moderate';

/**
 * Recipient type for emergency alerts
 */
export type RecipientType = 'individual' | 'group';

/**
 * Delivery channel options
 */
export type DeliveryChannel = 'email' | 'sms' | 'push' | 'voice';

/**
 * Emergency type definition with template
 */
export interface EmergencyType {
  id: string;
  name: string;
  description: string;
  severity: EmergencySeverity;
  template?: string;
}

/**
 * Emergency form state
 */
export interface EmergencyFormState {
  emergencyType: string;
  recipientType: RecipientType;
  selectedStudents: string[];
  selectedGroup: string;
  subject: string;
  message: string;
  deliveryChannels: DeliveryChannel[];
  requireConfirmation: boolean;
  escalateToEmergencyContact: boolean;
}

/**
 * Form validation errors
 */
export interface EmergencyFormErrors {
  emergencyType?: string;
  recipients?: string;
  subject?: string;
  message?: string;
  deliveryChannels?: string;
}

/**
 * Emergency alert data for submission
 */
export interface EmergencyAlertData {
  emergencyType: string;
  severity?: EmergencySeverity;
  recipientType: RecipientType;
  recipients: string[] | string;
  subject: string;
  message: string;
  deliveryChannels: DeliveryChannel[];
  requireConfirmation: boolean;
  escalateToEmergencyContact: boolean;
  timestamp: string;
}

/**
 * Props for EmergencyTypeSelector component
 */
export interface EmergencyTypeSelectorProps {
  value: string;
  onChange: (typeId: string) => void;
  error?: string;
  className?: string;
}

/**
 * Props for EmergencyRecipientSelector component
 */
export interface EmergencyRecipientSelectorProps {
  recipientType: RecipientType;
  selectedStudents: string[];
  selectedGroup: string;
  onRecipientTypeChange: (type: RecipientType) => void;
  onStudentsChange: (students: string[]) => void;
  onGroupChange: (group: string) => void;
  error?: string;
  className?: string;
}

/**
 * Props for EmergencyMessageComposer component
 */
export interface EmergencyMessageComposerProps {
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  subjectError?: string;
  messageError?: string;
  className?: string;
}

/**
 * Props for EmergencyDeliveryOptions component
 */
export interface EmergencyDeliveryOptionsProps {
  selectedChannels: DeliveryChannel[];
  onChannelsChange: (channels: DeliveryChannel[]) => void;
  requireConfirmation: boolean;
  escalateToEmergency: boolean;
  onConfirmationChange: (value: boolean) => void;
  onEscalationChange: (value: boolean) => void;
  severity?: EmergencySeverity;
  error?: string;
  className?: string;
}

/**
 * Return type for useEmergencyForm hook
 */
export interface UseEmergencyFormReturn {
  formState: EmergencyFormState;
  setEmergencyType: (typeId: string) => void;
  setRecipientType: (type: RecipientType) => void;
  setSelectedStudents: (students: string[]) => void;
  setSelectedGroup: (group: string) => void;
  setSubject: (subject: string) => void;
  setMessage: (message: string) => void;
  setDeliveryChannels: (channels: DeliveryChannel[]) => void;
  setRequireConfirmation: (value: boolean) => void;
  setEscalateToEmergencyContact: (value: boolean) => void;
  resetForm: () => void;
}

/**
 * Return type for useEmergencyValidation hook
 */
export interface UseEmergencyValidationReturn {
  errors: EmergencyFormErrors;
  validateForm: () => boolean;
  clearErrors: () => void;
  setError: (field: keyof EmergencyFormErrors, message: string) => void;
}

/**
 * Return type for useEmergencyTemplates hook
 */
export interface UseEmergencyTemplatesReturn {
  selectedType: EmergencyType | undefined;
  applyTemplate: (typeId: string) => void;
}
