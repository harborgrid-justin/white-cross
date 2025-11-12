/**
 * Mock data for Communication Templates
 *
 * This module contains mock template data for development and testing.
 * In production, this would be replaced with actual API calls.
 */

import type { CommunicationTemplate } from './CommunicationTemplates.types';

/**
 * Mock communication templates for development and testing
 *
 * @remarks
 * This data should be replaced with actual API calls in production.
 * The structure matches the CommunicationTemplate interface.
 */
export const mockTemplates: CommunicationTemplate[] = [
  {
    id: '1',
    name: 'Appointment Reminder - Email',
    type: 'email',
    category: 'appointment',
    subject: 'Upcoming Appointment Reminder - {{student_name}}',
    content: 'Dear {{parent_name}},\n\nThis is a reminder that {{student_name}} has an appointment scheduled for {{appointment_date}} at {{appointment_time}}.\n\nPlease ensure they arrive 15 minutes early.\n\nBest regards,\n{{school_name}}',
    variables: ['student_name', 'parent_name', 'appointment_date', 'appointment_time', 'school_name'],
    tags: ['appointment', 'reminder', 'parent'],
    isActive: true,
    usage_count: 45,
    created_by: 'Sarah Johnson',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-20T14:30:00Z',
    last_used: '2024-03-25T09:15:00Z'
  },
  {
    id: '2',
    name: 'Medication Administration - SMS',
    type: 'sms',
    category: 'medication',
    content: '{{student_name}} received {{medication_name}} ({{dosage}}) at {{time}}. Administered by {{nurse_name}}. Any concerns? Reply STOP to opt out.',
    variables: ['student_name', 'medication_name', 'dosage', 'time', 'nurse_name'],
    tags: ['medication', 'notification', 'parent'],
    isActive: true,
    usage_count: 128,
    created_by: 'Mike Chen',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-03-18T11:45:00Z',
    last_used: '2024-03-25T13:22:00Z'
  },
  {
    id: '3',
    name: 'Emergency Contact Script',
    type: 'phone_script',
    category: 'emergency',
    content: 'Hello, this is {{nurse_name}} from {{school_name}}. I\'m calling regarding {{student_name}}. We have a {{emergency_type}} situation. {{student_name}} is currently {{current_status}}. Please {{required_action}}. Do you have any questions?',
    variables: ['nurse_name', 'school_name', 'student_name', 'emergency_type', 'current_status', 'required_action'],
    tags: ['emergency', 'script', 'parent', 'urgent'],
    isActive: true,
    usage_count: 12,
    created_by: 'Lisa Wang',
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-02-15T16:20:00Z',
    last_used: '2024-03-10T10:30:00Z'
  }
];
