/**
 * WF-COMM-TEMPLATES-MOCK | Template Mock Data
 * Purpose: Mock template data for development and testing
 * Upstream: None | Dependencies: types
 * Downstream: CommunicationTemplatesTab | Called by: Tab initialization
 * Related: Template management, sample templates
 * Exports: mockTemplates array
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Initial template data
 * LLM Context: Sample healthcare templates for school nursing
 */

import { MessageTemplate } from './types';

/**
 * Mock templates data for development
 * Real implementation would fetch from API
 */
export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Medication Administration Notification',
    category: 'medications',
    subject: 'Medication Administration Update',
    content: 'Your child, {{STUDENT_NAME}}, received their scheduled {{MEDICATION_NAME}} medication today at {{TIME}}. No adverse reactions observed. If you have any questions, please contact the school nurse at {{PHONE}}.',
    variables: ['STUDENT_NAME', 'MEDICATION_NAME', 'TIME', 'PHONE'],
    usage: 142,
    lastUsed: '2025-10-27T12:30:00',
    createdAt: '2025-09-01T08:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '2',
    name: 'Health Screening Reminder',
    category: 'health-screenings',
    subject: 'Upcoming Health Screening',
    content: 'Annual health screenings for {{GRADE}} will be conducted on {{DATE}}. Please ensure all required health forms are completed and submitted by {{DEADLINE}}. Contact the school nurse at {{PHONE}} with questions.',
    variables: ['GRADE', 'DATE', 'DEADLINE', 'PHONE'],
    usage: 28,
    lastUsed: '2025-10-26T09:00:00',
    createdAt: '2025-09-15T10:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '3',
    name: 'Permission Slip - Field Trip',
    category: 'permissions',
    subject: 'Field Trip Permission Slip Required',
    content: 'Your child\'s class will be taking a field trip to {{DESTINATION}} on {{DATE}}. Please complete and return the attached permission slip by {{DEADLINE}}. Contact {{TEACHER_NAME}} at {{EMAIL}} with questions.',
    variables: ['DESTINATION', 'DATE', 'DEADLINE', 'TEACHER_NAME', 'EMAIL'],
    usage: 15,
    lastUsed: '2025-10-20T14:00:00',
    createdAt: '2025-10-01T08:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '4',
    name: 'Immunization Record Request',
    category: 'immunizations',
    subject: 'Immunization Records Update Required',
    content: 'Our records show that {{STUDENT_NAME}}\'s immunization records need to be updated. Please provide updated immunization documentation by {{DEADLINE}}. Records can be submitted to the school nurse or emailed to {{EMAIL}}.',
    variables: ['STUDENT_NAME', 'DEADLINE', 'EMAIL'],
    usage: 34,
    lastUsed: '2025-10-25T11:00:00',
    createdAt: '2025-08-20T09:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '5',
    name: 'Allergy Alert Notification',
    category: 'allergies',
    subject: 'Important: Allergy Information Update',
    content: 'We have updated our records regarding {{STUDENT_NAME}}\'s allergies. Current allergies on file: {{ALLERGIES}}. Please review and confirm this information is accurate by contacting the school nurse at {{PHONE}}.',
    variables: ['STUDENT_NAME', 'ALLERGIES', 'PHONE'],
    usage: 56,
    lastUsed: '2025-10-24T15:00:00',
    createdAt: '2025-09-10T10:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
  {
    id: '6',
    name: 'Health Alert - Contagious Illness',
    category: 'health-alerts',
    subject: 'Health Alert: {{ILLNESS_NAME}}',
    content: 'This is to inform you that cases of {{ILLNESS_NAME}} have been reported in {{LOCATION}}. Please monitor your child for symptoms including {{SYMPTOMS}}. If symptoms develop, keep your child home and contact your healthcare provider.',
    variables: ['ILLNESS_NAME', 'LOCATION', 'SYMPTOMS'],
    usage: 8,
    lastUsed: '2025-10-15T08:00:00',
    createdAt: '2025-09-05T09:00:00',
    createdBy: 'Nurse Sarah Johnson',
    isPublic: true,
  },
];
