/**
 * @fileoverview Create New Incident Report - Form page for creating new incident reports
 * with comprehensive data collection, validation, and submission workflow.
 *
 * @module app/(dashboard)/incidents/new/page
 * @category Incidents - Core Pages
 *
 * ## Overview
 * Provides incident creation interface with comprehensive form for documenting incidents
 * including type, severity, location, description, medical response, and notification details.
 * Supports draft saving and multi-step workflow for complex incident reports.
 *
 * ## Incident Creation Workflow
 * 1. **Basic Information**: Incident type, date/time, location, student selection
 * 2. **Incident Details**: Description, severity assessment, witness identification
 * 3. **Medical Response**: First aid provided, medical personnel involved, treatment details
 * 4. **Notifications**: Parent/guardian notification, administrator alerts, emergency contacts
 * 5. **Documentation**: Photo uploads, related documents, privacy settings
 * 6. **Review & Submit**: Final review before submission to PENDING_REVIEW status
 *
 * ## Initial Status
 * New incidents are created in **DRAFT** status until submitted, then transition to
 * **PENDING_REVIEW** for administrator validation.
 *
 * ## Incident Types & Required Fields
 *
 * ### INJURY (Physical Injury)
 * Required fields:
 * - Injury type (cut, bruise, fracture, head injury, etc.)
 * - Body part affected
 * - Severity level (MINOR to LIFE_THREATENING)
 * - Medical response provided
 * - Parent notification (required for SERIOUS and above)
 *
 * ### ILLNESS (Medical/Health)
 * Required fields:
 * - Symptoms description
 * - Temperature (if fever present)
 * - Medical response or medication administered
 * - Contagious disease consideration
 * - Return-to-school criteria
 *
 * ### BEHAVIORAL (Conduct/Discipline)
 * Required fields:
 * - Behavior description
 * - Trigger/context information
 * - Witnesses (if available)
 * - Intervention provided
 * - Follow-up action plan
 *
 * ### SAFETY (Hazards/Environment)
 * Required fields:
 * - Hazard description and location
 * - Risk level assessment
 * - Immediate mitigation actions
 * - Responsible party for resolution
 * - Resolution deadline
 *
 * ### EMERGENCY (Critical Situations)
 * Required fields:
 * - Emergency type (medical, fire, lockdown, etc.)
 * - Emergency response activated (911, evacuation, etc.)
 * - Personnel involved
 * - Timeline of events
 * - Parent notification (mandatory)
 * - Administrator notification (mandatory)
 *
 * ## Validation Rules
 * - Student ID required and must exist in system
 * - Incident date cannot be in the future
 * - Incident date cannot be more than 30 days in the past (configurable)
 * - Description minimum 10 characters
 * - Location required (specific location details encouraged)
 * - Parent notification required for SERIOUS+ severity
 * - Medical response required if medical attention provided
 *
 * ## Compliance Requirements
 * - **Mandatory Reporting**: Certain incident types trigger automatic reporting to authorities
 *   - Suspected abuse or neglect
 *   - Head injuries with loss of consciousness
 *   - Emergency medical transport
 *   - Communicable disease exposure
 * - **FERPA Protection**: Student privacy maintained throughout documentation
 * - **Audit Logging**: Incident creation logged with user, timestamp, and initial data
 * - **Data Retention**: Incidents retained per district policy (minimum 7 years)
 *
 * ## Automatic Notifications
 * Based on incident type and severity, the following notifications may be triggered:
 * - **Parents/Guardians**: SERIOUS+ injuries, medical transport, emergencies
 * - **School Administrators**: All incident types (configurable by type)
 * - **School Nurse**: Medical incidents and injuries requiring follow-up
 * - **District Office**: CRITICAL and LIFE_THREATENING incidents
 * - **Authorities**: Mandatory reporting incidents (abuse, serious injury, etc.)
 *
 * ## Draft Saving
 * Incidents can be saved as drafts and completed later:
 * - Auto-save every 30 seconds when form has unsaved changes
 * - Manual save via "Save Draft" button
 * - Drafts accessible from incidents list (DRAFT status filter)
 * - Drafts do not trigger notifications or reporting requirements
 * - Drafts can be deleted by creator within 30 days
 *
 * ## Integration Points
 * - **Student Records**: Automatic linking to student health and behavioral history
 * - **Emergency Contacts**: Retrieves parent/guardian contact information for notifications
 * - **Health Records**: Links to student allergies, medications, and medical conditions
 * - **Staff Directory**: Retrieves reporting staff member and witness contact information
 * - **Document Management**: Supports photo and document uploads for evidence
 * - **Notification System**: Triggers email/SMS notifications based on severity and type
 *
 * ## Security & Privacy
 * - Authentication required (enforced by dynamic rendering)
 * - Role-based field visibility (some fields restricted to administrators)
 * - Confidential incident toggle restricts access to authorized personnel
 * - Sensitive information (medical details) excluded from non-medical staff view
 * - All form submissions audit-logged with user and timestamp
 *
 * @see {@link IncidentReportForm} for the main form component with validation logic
 * @see {@link createIncident} for server action handling incident creation
 * @see {@link /incidents} for return to incidents list after creation
 *
 * @example
 * // This page is rendered at route: /incidents/new
 * // User fills out comprehensive incident report form
 * // On submit, incident created in DRAFT or PENDING_REVIEW status
 * // User redirected to incident detail page or incidents list
 */

import React from 'react';
import { Metadata } from 'next';
import { IncidentReportForm } from '@/components/incidents/IncidentReportForm';

export const metadata: Metadata = {
  title: 'New Incident Report | White Cross',
  description: 'Create a new incident report',
};

// Force dynamic rendering due to auth requirements and form CSRF token generation
export const dynamic = "force-dynamic";

/**
 * New Incident Page Component
 *
 * Renders the incident creation form with comprehensive data collection fields.
 * Form includes validation, draft saving, and automatic notification triggers.
 *
 * @component
 *
 * @returns {JSX.Element} Rendered incident creation form with page header
 *
 * @description
 * Displays full-width form (max 4xl) for optimal readability and field organization.
 * Form is responsive and adapts to mobile, tablet, and desktop viewports.
 *
 * The IncidentReportForm component handles:
 * - Multi-section form layout (basic info, details, medical, notifications)
 * - Real-time validation with error messaging
 * - Draft auto-save (every 30 seconds)
 * - Conditional field display based on incident type
 * - File upload for incident documentation
 * - Parent notification preview before submission
 *
 * @example
 * ```tsx
 * // Rendered automatically at route /incidents/new
 * // No props required
 * <NewIncidentPage />
 * ```
 */
export default function NewIncidentPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Incident Report</h1>
      {/* IncidentReportForm handles all form logic, validation, and submission */}
      <IncidentReportForm />
    </div>
  );
}
