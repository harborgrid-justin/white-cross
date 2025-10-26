/**
 * @fileoverview Healthcare Workflows Module - Automated Clinical Workflow Orchestration
 *
 * Central export module for all healthcare workflow automation. Provides coordinated
 * emergency response and medication management workflows that ensure patient safety,
 * regulatory compliance, and clinical best practices in school healthcare settings.
 *
 * **Module Organization:**
 * - Emergency Workflows: Time-critical emergency response and escalation
 * - Medication Workflows: Safe medication administration with Five Rights verification
 *
 * **Key Capabilities:**
 *
 * **Emergency Response Automation:**
 * - Rapid emergency alert creation and classification
 * - Automated response team assembly
 * - Multi-channel emergency contact cascading
 * - Coordinated action execution and tracking
 * - Automatic escalation monitoring
 * - Complete timeline and audit documentation
 *
 * **Medication Safety Automation:**
 * - Five Rights verification workflow
 * - Drug-drug interaction detection
 * - Contraindication blocking
 * - Emergency medication protocols
 * - Compliance monitoring and reporting
 * - Parent notification automation
 *
 * **Workflow Integration:**
 * Emergency and medication workflows are designed to work together seamlessly.
 * For example, emergency medication protocols (EpiPen for anaphylaxis) trigger both
 * the medication administration workflow AND the emergency response cascade to ensure
 * comprehensive patient care.
 *
 * **Safety and Compliance:**
 * All workflows implement multiple safety layers, audit logging, and regulatory
 * compliance measures including HIPAA, FERPA, Joint Commission standards, and
 * state nursing practice acts.
 *
 * @module stores/domains/healthcare/workflows
 * @requires ./emergencyWorkflows
 * @requires ./medicationWorkflows
 *
 * @security All workflows require appropriate role-based permissions
 * @security PHI audit logging enabled for all healthcare operations
 * @security Emergency operations bypass rate limiting for life-safety
 *
 * @compliance HIPAA - Protected Health Information handling
 * @compliance FERPA - Student privacy in healthcare records
 * @compliance Joint Commission - Healthcare quality and safety standards
 * @compliance 21 CFR Part 11 - Electronic records and signatures
 * @compliance State Board of Nursing - Medication administration regulations
 *
 * @example Emergency Response Workflow
 * ```typescript
 * import { createEmergencyAlert, emergencyContactCascade } from '@/stores/domains/healthcare/workflows';
 *
 * // Create critical emergency alert
 * const alert = await dispatch(createEmergencyAlert({
 *   type: 'SEVERE_ALLERGIC_REACTION',
 *   severity: 'CRITICAL',
 *   studentId: 'STU-12345',
 *   location: 'Cafeteria',
 *   description: 'Anaphylaxis - student unresponsive',
 *   reportedBy: 'TEACHER-789'
 * })).unwrap();
 *
 * // Automatically triggers:
 * // - Response team assembly (nurse, principal, EMS)
 * // - Emergency contact cascade
 * // - Incident documentation
 * // - Escalation monitoring
 * ```
 *
 * @example Medication Administration Workflow
 * ```typescript
 * import { administrateMedication, verifyFiveRights } from '@/stores/domains/healthcare/workflows';
 *
 * // Administer medication with full safety checks
 * const administration = await dispatch(administrateMedication({
 *   studentId: 'STU-12345',
 *   medicationId: 'MED-67890',
 *   dosageGiven: '10mg',
 *   route: 'oral',
 *   administeredBy: 'NURSE-001',
 *   notes: 'Student tolerated medication well'
 * })).unwrap();
 *
 * // Automatically performs:
 * // - Five Rights verification
 * // - Drug interaction checking
 * // - Contraindication blocking
 * // - Parent notification (if required)
 * // - Adverse reaction monitoring
 * ```
 *
 * @example Emergency Medication Protocol
 * ```typescript
 * import { emergencyMedicationProtocol } from '@/stores/domains/healthcare/workflows';
 *
 * // Execute emergency protocol (bypasses normal checks for life-saving treatment)
 * await dispatch(emergencyMedicationProtocol({
 *   studentId: 'STU-12345',
 *   emergencyType: 'ANAPHYLAXIS',
 *   location: 'School Cafeteria',
 *   responderId: 'TEACHER-456'
 * })).unwrap();
 *
 * // Automatically:
 * // - Administers EpiPen immediately
 * // - Calls 911 for EMS
 * // - Notifies parents via phone/SMS
 * // - Documents complete emergency response
 * // - Prepares for second dose if needed
 * ```
 *
 * @example Integrated Emergency and Medication Workflow
 * ```typescript
 * import {
 *   createEmergencyAlert,
 *   emergencyMedicationProtocol
 * } from '@/stores/domains/healthcare/workflows';
 *
 * // 1. Create emergency alert
 * const alert = await dispatch(createEmergencyAlert({
 *   type: 'SEVERE_ALLERGIC_REACTION',
 *   severity: 'CRITICAL',
 *   studentId: 'STU-12345',
 *   location: 'Cafeteria',
 *   description: 'Student experiencing anaphylaxis',
 *   reportedBy: 'TEACHER-001'
 * })).unwrap();
 *
 * // 2. Execute emergency medication protocol
 * await dispatch(emergencyMedicationProtocol({
 *   studentId: 'STU-12345',
 *   emergencyType: 'ANAPHYLAXIS',
 *   location: 'Cafeteria',
 *   responderId: 'NURSE-001'
 * })).unwrap();
 *
 * // Result: Complete coordinated emergency response
 * // - EpiPen administered
 * // - EMS contacted
 * // - Parents notified via multiple channels
 * // - Response team assembled
 * // - Complete documentation and audit trail
 * // - Escalation monitoring active
 * ```
 *
 * @author White Cross Healthcare Platform
 * @since 1.0.0
 *
 * @see {@link module:stores/domains/healthcare/workflows/emergencyWorkflows} for emergency workflow details
 * @see {@link module:stores/domains/healthcare/workflows/medicationWorkflows} for medication workflow details
 */

export * from './emergencyWorkflows';
export * from './medicationWorkflows';
