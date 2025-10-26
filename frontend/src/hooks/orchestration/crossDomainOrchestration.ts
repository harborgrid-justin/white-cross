/**
 * Cross-Domain Orchestration System
 *
 * Enterprise-grade workflow orchestration for coordinating complex multi-domain
 * operations in the White Cross Healthcare Platform. Provides declarative workflow
 * definitions, automatic retry handling, stage-based execution, and comprehensive
 * monitoring for healthcare business processes that span multiple system domains.
 *
 * @module hooks/orchestration/crossDomainOrchestration
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Purpose**:
 * - Coordinate complex healthcare workflows across multiple domains
 * - Ensure data consistency in multi-step operations
 * - Provide automatic retry and error handling
 * - Monitor workflow execution and performance
 *
 * **Architecture**:
 * - Re-exports from canonical stores location
 * - Declarative workflow definition
 * - Stage-based execution with dependencies
 * - Transaction-like semantics for healthcare data
 *
 * **Key Concepts**:
 * - **Orchestration Workflow**: Multi-stage business process definition
 * - **Orchestration Stage**: Individual step in workflow with retry policy
 * - **Domain Operation**: Atomic operation within a domain
 * - **Retry Policy**: Automatic retry configuration for failed operations
 * - **Success Criteria**: Validation rules for operation completion
 *
 * **Healthcare Workflows**:
 * 1. **Student Enrollment**: Student creation → Health records → Emergency contacts
 * 2. **Medication Management**: Prescription → Inventory check → Administration schedule
 * 3. **Incident Reporting**: Report creation → Witness statements → Follow-up actions
 * 4. **Appointment Scheduling**: Availability check → Scheduling → Notifications
 *
 * **Workflow Features**:
 * - Multi-stage execution with dependencies
 * - Automatic retry with exponential backoff
 * - Rollback support for failed workflows
 * - Progress notifications
 * - Performance monitoring
 * - HIPAA-compliant audit trails
 *
 * @example
 * ```typescript
 * // Example 1: Execute student enrollment workflow
 * import {
 *   executeStudentEnrollmentWorkflow,
 *   type OrchestrationWorkflow
 * } from '@/hooks/orchestration/crossDomainOrchestration';
 *
 * async function enrollStudent(studentData: StudentEnrollmentData) {
 *   const result = await executeStudentEnrollmentWorkflow({
 *     studentInfo: studentData.student,
 *     healthRecords: studentData.healthRecords,
 *     emergencyContacts: studentData.emergencyContacts,
 *     notifications: {
 *       enabled: true,
 *       channels: ['email', 'sms']
 *     }
 *   });
 *
 *   if (result.success) {
 *     console.log('Student enrolled:', result.studentId);
 *   } else {
 *     console.error('Enrollment failed:', result.errors);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 2: Execute medication management workflow
 * import {
 *   executeMedicationManagementWorkflow
 * } from '@/hooks/orchestration/crossDomainOrchestration';
 *
 * async function prescribeMedication(prescriptionData: PrescriptionData) {
 *   const result = await executeMedicationManagementWorkflow({
 *     prescription: prescriptionData,
 *     inventoryCheck: true,
 *     createSchedule: true,
 *     notifyNurse: true
 *   });
 *
 *   if (result.success) {
 *     console.log('Medication prescribed:', result.medicationId);
 *     console.log('Schedule created:', result.scheduleId);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 3: Custom workflow definition
 * import { type OrchestrationWorkflow } from '@/hooks/orchestration/crossDomainOrchestration';
 *
 * const appointmentWorkflow: OrchestrationWorkflow = {
 *   id: 'appointment-scheduling',
 *   name: 'Appointment Scheduling Workflow',
 *   stages: [
 *     {
 *       id: 'check-availability',
 *       name: 'Check Nurse Availability',
 *       operations: [
 *         {
 *           domain: 'appointments',
 *           action: 'checkAvailability',
 *           data: { nurseId: 'nurse-123', date: '2025-10-26' }
 *         }
 *       ],
 *       retryPolicy: { maxAttempts: 3, delayMs: 1000 },
 *       successCriteria: { requireAll: true }
 *     },
 *     {
 *       id: 'create-appointment',
 *       name: 'Create Appointment',
 *       dependsOn: ['check-availability'],
 *       operations: [
 *         {
 *           domain: 'appointments',
 *           action: 'create',
 *           data: { studentId: 'student-456', nurseId: 'nurse-123' }
 *         }
 *       ],
 *       retryPolicy: { maxAttempts: 2, delayMs: 2000 }
 *     },
 *     {
 *       id: 'send-notifications',
 *       name: 'Send Notifications',
 *       dependsOn: ['create-appointment'],
 *       operations: [
 *         {
 *           domain: 'communications',
 *           action: 'sendEmail',
 *           data: { template: 'appointment-confirmation' }
 *         }
 *       ],
 *       retryPolicy: { maxAttempts: 5, delayMs: 3000 }
 *     }
 *   ],
 *   monitoring: {
 *     enabled: true,
 *     trackPerformance: true,
 *     alertOnFailure: true
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Example 4: Monitor workflow execution
 * import { executeWorkflow } from '@/hooks/orchestration/crossDomainOrchestration';
 *
 * async function executeWithMonitoring(workflow: OrchestrationWorkflow) {
 *   const execution = await executeWorkflow(workflow);
 *
 *   console.log('Workflow Status:', execution.status);
 *   console.log('Completed Stages:', execution.completedStages);
 *   console.log('Execution Time:', execution.metrics.totalDuration);
 *   console.log('Retry Count:', execution.metrics.retryCount);
 *
 *   if (execution.errors.length > 0) {
 *     console.error('Workflow Errors:', execution.errors);
 *   }
 * }
 * ```
 *
 * @see {@link ../../stores/shared/orchestration/crossDomainOrchestration} for canonical implementation
 * @see {@link ./executeWorkflow} for workflow execution function
 *
 * @since 2.0.0
 */

export {
  // Types
  type OrchestrationWorkflow,
  type OrchestrationStage,
  type DomainOperation,
  type RetryPolicy,
  type SuccessCriteria,
  type StageNotification,
  type OperationCondition,
  type DataTransformation,
  type ValidationRule,
  type WorkflowConfiguration,
  type CronSchedule,
  type NotificationSettings,
  type WorkflowMetrics,
  type PerformanceMetric,
  type WorkflowExecution,
  type StageResult,
  type OperationResult,
  type ExecutionError,
  type ExecutionMetrics,
  type ResourceUsage,
  
  // Functions
  executeStudentEnrollmentWorkflow,
  executeMedicationManagementWorkflow,
} from '../../stores/shared/orchestration/crossDomainOrchestration';
