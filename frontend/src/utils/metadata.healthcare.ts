/**
 * Healthcare-Specific Metadata Generators
 *
 * Specialized metadata generators for healthcare-related pages
 * in the White Cross Healthcare Platform. Each generator provides
 * SEO-optimized metadata with healthcare-specific keywords and descriptions.
 */

import { generateMetadata } from './metadata.generators';

/**
 * Healthcare-specific metadata generators
 *
 * Collection of pre-configured metadata generators for common
 * healthcare-related pages throughout the application.
 */
export const healthcareMetadata = {
  /**
   * Student management page metadata
   *
   * Metadata for the student management interface where nurses
   * can view and manage student health records and demographics.
   */
  students: () =>
    generateMetadata({
      title: 'Student Management',
      description: 'Manage student health records, demographics, and emergency contacts',
      keywords: ['student records', 'health information', 'demographics'],
      path: '/students',
    }),

  /**
   * Medication management page metadata
   *
   * Metadata for the medication tracking and administration interface
   * with compliance monitoring features.
   */
  medications: () =>
    generateMetadata({
      title: 'Medication Management',
      description: 'Track and administer student medications with compliance monitoring',
      keywords: ['medications', 'prescriptions', 'administration', 'compliance'],
      path: '/medications',
    }),

  /**
   * Health records page metadata
   *
   * Metadata for comprehensive student health records including
   * medical history and immunization tracking.
   */
  healthRecords: () =>
    generateMetadata({
      title: 'Health Records',
      description: 'Comprehensive student health records and medical history',
      keywords: ['health records', 'medical history', 'immunizations'],
      path: '/health-records',
    }),

  /**
   * Appointments page metadata
   *
   * Metadata for the appointment scheduling and management interface.
   */
  appointments: () =>
    generateMetadata({
      title: 'Appointments',
      description: 'Schedule and manage student health appointments',
      keywords: ['appointments', 'scheduling', 'calendar'],
      path: '/appointments',
    }),

  /**
   * Incident reports page metadata
   *
   * Metadata for documenting and tracking student health incidents
   * and injuries with proper documentation.
   */
  incidents: () =>
    generateMetadata({
      title: 'Incident Reports',
      description: 'Document and track student health incidents and injuries',
      keywords: ['incidents', 'injuries', 'documentation', 'reporting'],
      path: '/incidents',
    }),

  /**
   * Compliance page metadata
   *
   * Metadata for HIPAA compliance monitoring and audit log management.
   */
  compliance: () =>
    generateMetadata({
      title: 'Compliance Tracking',
      description: 'HIPAA compliance monitoring and audit logs',
      keywords: ['HIPAA', 'compliance', 'audit logs', 'security'],
      path: '/compliance',
    }),

  /**
   * Dashboard page metadata
   *
   * Metadata for the main healthcare management dashboard with
   * real-time insights and analytics.
   */
  dashboard: () =>
    generateMetadata({
      title: 'Dashboard',
      description: 'Healthcare management dashboard with real-time insights',
      keywords: ['dashboard', 'analytics', 'overview'],
      path: '/dashboard',
    }),
};
