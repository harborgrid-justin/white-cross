/**
 * @fileoverview Service Orchestrator for Complex Workflows
 * @module services/domain/orchestration/ServiceOrchestrator
 * @category Domain Services
 * 
 * Orchestrates complex workflows across multiple services using saga pattern.
 * Provides pre-built orchestrations for common healthcare operations.
 * 
 * Key Features:
 * - Student admission workflow
 * - Medication prescription workflow
 * - Emergency response workflow
 * - Health record creation workflow
 * - Automatic compensation on failures
 * 
 * @example
 * ```typescript
 * // Orchestrate student admission
 * const result = await orchestrator.admitStudent({
 *   student: { firstName: 'John', lastName: 'Doe', ... },
 *   healthRecord: { allergies: [], conditions: [] },
 *   contacts: [{ name: 'Jane Doe', relationship: 'Parent', ... }]
 * });
 * ```
 */

import { Saga, sagaManager } from './SagaManager';
import { eventBus } from '../events/EventBus';
import {
  StudentEnrolledEvent,
  HealthRecordCreatedEvent,
  MedicationPrescribedEvent,
  EmergencyAlertCreatedEvent,
  AppointmentScheduledEvent,
  ParentNotificationSentEvent
} from '../events/DomainEvents';
import { serviceRegistry } from '../../core/ServiceRegistry';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface StudentAdmissionRequest {
  student: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade: string;
    [key: string]: unknown;
  };
  healthRecord?: {
    allergies?: unknown[];
    conditions?: unknown[];
    medications?: unknown[];
  };
  contacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    [key: string]: unknown;
  }>;
  notifyParents?: boolean;
}

export interface StudentAdmissionResult {
  student: { id: string; [key: string]: unknown };
  healthRecord?: { id: string; [key: string]: unknown };
  contacts?: Array<{ id: string; [key: string]: unknown }>;
  notifications?: Array<{ id: string; [key: string]: unknown }>;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  errors?: string[];
}

export interface MedicationPrescriptionRequest {
  studentId: string;
  medication: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    [key: string]: unknown;
  };
  notifyParents?: boolean;
  scheduleAdministration?: boolean;
}

export interface MedicationPrescriptionResult {
  prescription: { id: string; [key: string]: unknown };
  schedule?: { id: string; [key: string]: unknown };
  notification?: { id: string; [key: string]: unknown };
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  errors?: string[];
}

export interface EmergencyResponseRequest {
  studentId: string;
  incidentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  notifyContacts?: boolean;
  notifyAdministration?: boolean;
}

export interface EmergencyResponseResult {
  incident: { id: string; [key: string]: unknown };
  alert: { id: string; [key: string]: unknown };
  notifications: Array<{ id: string; [key: string]: unknown }>;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  errors?: string[];
}

/**
 * Service Orchestrator
 * Coordinates complex workflows across multiple services
 */
export class ServiceOrchestrator {
  private static instance: ServiceOrchestrator;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceOrchestrator {
    if (!ServiceOrchestrator.instance) {
      ServiceOrchestrator.instance = new ServiceOrchestrator();
    }
    return ServiceOrchestrator.instance;
  }

  /**
   * Orchestrate student admission workflow
   * Steps:
   * 1. Create student record
   * 2. Initialize health record
   * 3. Add emergency contacts
   * 4. Send notifications to parents
   */
  public async admitStudent(
    request: StudentAdmissionRequest
  ): Promise<StudentAdmissionResult> {
    const saga = sagaManager.create<StudentAdmissionResult>('StudentAdmission');
    const result: StudentAdmissionResult = {
      student: { id: '' },
      status: 'SUCCESS',
      errors: []
    };

    try {
      // Step 1: Create student record
      const studentsService = serviceRegistry.getService('students') as any;
      if (!studentsService) {
        throw new Error('Students service not available');
      }

      const student = await saga.step(
        () => studentsService.create(request.student),
        (student: any) => studentsService.delete(student.id)
      );
      result.student = student;

      // Publish student enrolled event
      await eventBus.publish(
        new StudentEnrolledEvent(
          student.id,
          student.studentNumber,
          student.firstName,
          student.lastName
        )
      );

      // Step 2: Initialize health record (if provided)
      if (request.healthRecord) {
        const healthService = serviceRegistry.getService('health') as any;
        if (healthService) {
          try {
            const healthRecord = await saga.step(
              () => healthService.initialize(student.id, request.healthRecord),
              (record: any) => healthService.delete(record.id)
            );
            result.healthRecord = healthRecord;

            // Publish health record created event
            await eventBus.publish(
              new HealthRecordCreatedEvent(
                student.id,
                healthRecord.id,
                'INITIAL'
              )
            );
          } catch (error) {
            result.status = 'PARTIAL';
            result.errors?.push(`Health record creation failed: ${error}`);
          }
        }
      }

      // Step 3: Add emergency contacts (if provided)
      if (request.contacts && request.contacts.length > 0) {
        const contactsService = serviceRegistry.getService('contacts') as any;
        if (contactsService) {
          try {
            const contacts = await saga.step(
              () => Promise.all(
                request.contacts!.map(contact =>
                  contactsService.create({ ...contact, studentId: student.id })
                )
              ),
              (contacts: any[]) =>
                Promise.all(contacts.map(c => contactsService.delete(c.id)))
            );
            result.contacts = contacts;
          } catch (error) {
            result.status = 'PARTIAL';
            result.errors?.push(`Contact creation failed: ${error}`);
          }
        }
      }

      // Step 4: Send parent notifications (if requested)
      if (request.notifyParents) {
        const notificationService = serviceRegistry.getService('notifications') as any;
        if (notificationService && result.contacts) {
          try {
            const notifications = await saga.step(
              () => Promise.all(
                result.contacts!.map(contact =>
                  notificationService.send({
                    recipientId: contact.id,
                    type: 'STUDENT_ADMISSION',
                    subject: 'Student Admission Confirmation',
                    message: `${student.firstName} ${student.lastName} has been admitted.`
                  })
                )
              ),
              () => Promise.resolve() // Notifications don't need compensation
            );
            result.notifications = notifications;
          } catch (error) {
            result.status = 'PARTIAL';
            result.errors?.push(`Notification failed: ${error}`);
          }
        }
      }

      await saga.commit();
      sagaManager.complete(saga.getSagaId());
      return result;
    } catch (error) {
      await saga.rollback();
      sagaManager.complete(saga.getSagaId());
      result.status = 'FAILED';
      result.errors?.push(`Admission failed: ${error}`);
      throw new Error(`Student admission failed: ${error}`);
    }
  }

  /**
   * Orchestrate medication prescription workflow
   * Steps:
   * 1. Create prescription
   * 2. Schedule administration (if requested)
   * 3. Notify parents (if requested)
   */
  public async prescribeMedication(
    request: MedicationPrescriptionRequest
  ): Promise<MedicationPrescriptionResult> {
    const saga = sagaManager.create<MedicationPrescriptionResult>('MedicationPrescription');
    const result: MedicationPrescriptionResult = {
      prescription: { id: '' },
      status: 'SUCCESS',
      errors: []
    };

    try {
      // Step 1: Create prescription
      const medicationService = serviceRegistry.getService('medications') as any;
      if (!medicationService) {
        throw new Error('Medication service not available');
      }

      const prescription = await saga.step(
        () => medicationService.prescribe({
          studentId: request.studentId,
          ...request.medication
        }),
        (prescription: any) => medicationService.discontinue(prescription.id)
      );
      result.prescription = prescription;

      // Publish medication prescribed event
      await eventBus.publish(
        new MedicationPrescribedEvent(
          request.studentId,
          prescription.id,
          request.medication.name,
          request.medication.prescribedBy
        )
      );

      // Step 2: Schedule administration (if requested)
      if (request.scheduleAdministration) {
        const schedulingService = serviceRegistry.getService('scheduling') as any;
        if (schedulingService) {
          try {
            const schedule = await saga.step(
              () => schedulingService.createMedicationSchedule({
                studentId: request.studentId,
                prescriptionId: prescription.id,
                frequency: request.medication.frequency
              }),
              (schedule: any) => schedulingService.deleteSchedule(schedule.id)
            );
            result.schedule = schedule;
          } catch (error) {
            result.status = 'PARTIAL';
            result.errors?.push(`Scheduling failed: ${error}`);
          }
        }
      }

      // Step 3: Notify parents (if requested)
      if (request.notifyParents) {
        const notificationService = serviceRegistry.getService('notifications') as any;
        if (notificationService) {
          try {
            const notification = await saga.step(
              () => notificationService.send({
                studentId: request.studentId,
                type: 'MEDICATION_PRESCRIBED',
                subject: 'Medication Prescription Notice',
                message: `New prescription: ${request.medication.name}`
              }),
              () => Promise.resolve() // Notifications don't need compensation
            );
            result.notification = notification;
          } catch (error) {
            result.status = 'PARTIAL';
            result.errors?.push(`Notification failed: ${error}`);
          }
        }
      }

      await saga.commit();
      sagaManager.complete(saga.getSagaId());
      return result;
    } catch (error) {
      await saga.rollback();
      sagaManager.complete(saga.getSagaId());
      result.status = 'FAILED';
      result.errors?.push(`Prescription failed: ${error}`);
      throw new Error(`Medication prescription failed: ${error}`);
    }
  }

  /**
   * Orchestrate emergency response workflow
   * Steps:
   * 1. Create incident report
   * 2. Create emergency alert
   * 3. Notify emergency contacts
   * 4. Notify administration (if requested)
   */
  public async handleEmergency(
    request: EmergencyResponseRequest
  ): Promise<EmergencyResponseResult> {
    const saga = sagaManager.create<EmergencyResponseResult>('EmergencyResponse');
    const result: EmergencyResponseResult = {
      incident: { id: '' },
      alert: { id: '' },
      notifications: [],
      status: 'SUCCESS',
      errors: []
    };

    try {
      // Step 1: Create incident report (no compensation - permanent record)
      const incidentService = serviceRegistry.getService('incidents') as any;
      if (!incidentService) {
        throw new Error('Incident service not available');
      }

      const incident = await saga.step(
        () => incidentService.create({
          studentId: request.studentId,
          type: request.incidentType,
          severity: request.severity,
          description: request.description,
          reportedAt: new Date()
        }),
        () => Promise.resolve() // Don't delete incident reports
      );
      result.incident = incident;

      // Step 2: Create emergency alert
      const alertService = serviceRegistry.getService('alerts') as any;
      if (alertService) {
        const alert = await saga.step(
          () => alertService.create({
            studentId: request.studentId,
            incidentId: incident.id,
            type: request.incidentType,
            severity: request.severity
          }),
          (alert: any) => alertService.resolve(alert.id)
        );
        result.alert = alert;

        // Publish emergency alert event
        await eventBus.publish(
          new EmergencyAlertCreatedEvent(
            alert.id,
            request.studentId,
            request.incidentType,
            request.severity
          )
        );
      }

      // Step 3: Notify emergency contacts
      if (request.notifyContacts) {
        const notificationService = serviceRegistry.getService('notifications') as any;
        const contactsService = serviceRegistry.getService('contacts') as any;

        if (notificationService && contactsService) {
          try {
            const contacts = await contactsService.getEmergencyContacts(request.studentId);
            const notifications = await saga.step(
              () => Promise.all(
                contacts.map((contact: any) =>
                  notificationService.sendEmergency({
                    recipientId: contact.id,
                    type: 'EMERGENCY_ALERT',
                    subject: `Emergency Alert: ${request.incidentType}`,
                    message: request.description,
                    priority: 'URGENT'
                  })
                )
              ),
              () => Promise.resolve() // Notifications don't need compensation
            );
            result.notifications = notifications;
          } catch (error) {
            result.errors?.push(`Contact notification failed: ${error}`);
          }
        }
      }

      // Step 4: Notify administration
      if (request.notifyAdministration) {
        const notificationService = serviceRegistry.getService('notifications') as any;
        if (notificationService) {
          try {
            await notificationService.notifyAdministration({
              type: 'EMERGENCY_INCIDENT',
              severity: request.severity,
              incidentId: incident.id,
              studentId: request.studentId
            });
          } catch (error) {
            result.errors?.push(`Administration notification failed: ${error}`);
          }
        }
      }

      await saga.commit();
      sagaManager.complete(saga.getSagaId());
      return result;
    } catch (error) {
      await saga.rollback();
      sagaManager.complete(saga.getSagaId());
      result.status = 'FAILED';
      result.errors?.push(`Emergency response failed: ${error}`);
      throw new Error(`Emergency response failed: ${error}`);
    }
  }

  /**
   * Get orchestration statistics
   */
  public getStatistics() {
    return sagaManager.getStatistics();
  }
}

// Export singleton instance
export const serviceOrchestrator = ServiceOrchestrator.getInstance();
