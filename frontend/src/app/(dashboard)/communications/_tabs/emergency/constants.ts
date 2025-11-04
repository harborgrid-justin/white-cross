/**
 * WF-COMM-EMERGENCY-CONSTANTS | constants.ts - Emergency Communication Constants
 * Purpose: Pre-defined emergency types and templates
 * Related: CommunicationEmergencyTab component
 * Last Updated: 2025-11-04
 */

import type { EmergencyType } from './types';

/**
 * Pre-defined emergency types with templates
 *
 * Each emergency type includes:
 * - Unique identifier
 * - Display name
 * - Description
 * - Severity level (critical, high, moderate)
 * - Pre-filled message template
 */
export const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: 'medical-emergency',
    name: 'Medical Emergency',
    description: 'Student requires immediate medical attention',
    severity: 'critical',
    template: 'URGENT: Your child requires immediate medical attention. Please contact the school nurse immediately at [PHONE].',
  },
  {
    id: 'injury',
    name: 'Injury / Accident',
    description: 'Student injured, non-life-threatening',
    severity: 'high',
    template: 'Your child has been injured at school. The injury is non-life-threatening, but requires your attention. Please contact the school at [PHONE].',
  },
  {
    id: 'illness',
    name: 'Sudden Illness',
    description: 'Student became ill and needs to go home',
    severity: 'moderate',
    template: 'Your child has become ill at school and needs to be picked up. Please contact the school office at [PHONE] to arrange pickup.',
  },
  {
    id: 'allergic-reaction',
    name: 'Allergic Reaction',
    description: 'Student experiencing allergic reaction',
    severity: 'critical',
    template: 'URGENT: Your child is experiencing an allergic reaction. Medical staff are attending. Please call the school immediately at [PHONE].',
  },
  {
    id: 'medication-issue',
    name: 'Medication Issue',
    description: 'Problem with student medication',
    severity: 'high',
    template: 'There is an issue regarding your child\'s medication. Please contact the school nurse at [PHONE] as soon as possible.',
  },
  {
    id: 'school-closure',
    name: 'Emergency School Closure',
    description: 'School closing due to emergency',
    severity: 'critical',
    template: 'EMERGENCY CLOSURE: School is closing immediately due to emergency conditions. Please arrange to pick up your child as soon as possible.',
  },
  {
    id: 'weather-emergency',
    name: 'Weather Emergency',
    description: 'Severe weather conditions',
    severity: 'high',
    template: 'WEATHER ALERT: Severe weather conditions. School will [ACTION]. Updates will follow.',
  },
  {
    id: 'security-incident',
    name: 'Security Incident',
    description: 'Security or safety concern',
    severity: 'critical',
    template: 'SECURITY ALERT: There is an ongoing security situation at school. Students are safe and secure. Do not come to the school at this time. Updates will follow.',
  },
];

/**
 * Default form values
 */
export const DEFAULT_EMERGENCY_FORM = {
  emergencyType: '',
  recipientType: 'individual' as 'individual' | 'group',
  selectedStudents: [] as string[],
  selectedGroup: '',
  subject: '',
  message: '',
  deliveryChannels: ['email', 'sms'] as Array<'email' | 'sms' | 'push' | 'voice'>,
  requireConfirmation: true,
  escalateToEmergencyContact: false,
};

/**
 * Delivery channel configuration based on severity
 */
export const SEVERITY_DELIVERY_CHANNELS = {
  critical: ['email', 'sms', 'push', 'voice'] as const,
  high: ['email', 'sms', 'push'] as const,
  moderate: ['email', 'push'] as const,
};
