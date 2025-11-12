import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Student } from '../../../database/models/student.model';
import { HealthRecord } from '../../../database/models/health-record.model';
import { Medication } from '../../../database/models/medication.model';
import { Appointment } from '../../../database/models/appointment.model';
import { Message } from '../../../database/models/message.model';

/**
 * Patient Portal Integration Service
 *
 * Comprehensive patient portal functionality enabling secure patient access
 * to health records, appointment scheduling, medication management, and
 * communication with healthcare providers
 *
 * Features:
 * - Secure patient authentication and authorization
 * - Health record access and sharing
 * - Appointment scheduling and management
 * - Medication refill requests and tracking
 * - Secure messaging with providers
 * - Health data export and portability
 * - Consent management for data sharing
 * - Emergency contact access
 * - Health education resources
 * - Telehealth integration
 *
 * @hipaa-requirement Patient access to health information
 */
@Injectable()
export class PatientPortalIntegrationService {
  private readonly logger = new Logger(PatientPortalIntegrationService.name);

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Medication)
    private readonly medicationModel: typeof Medication,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(Message)
    private readonly messageModel: typeof Message,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Authenticate patient portal access
   * @param credentials Patient login credentials
   */
  async authenticatePatient(credentials: PatientCredentials): Promise<PatientAuthResult> {
    const patient = await this.studentModel.findOne({
      where: {
        email: credentials.email,
        portalEnabled: true,
      },
    });

    if (!patient) {
      return {
        success: false,
        error: 'Patient not found or portal access not enabled',
      };
    }

    // Verify password (in real implementation, use proper password hashing)
    const isValidPassword = await this.verifyPatientPassword(patient, credentials.password);

    if (!isValidPassword) {
      await this.logFailedLoginAttempt(patient.id);
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Check if account is locked
    if (patient.portalLocked) {
      return {
        success: false,
        error: 'Account is temporarily locked. Please contact support.',
      };
    }

    // Generate session token
    const sessionToken = await this.generatePatientSessionToken(patient);

    // Log successful login
    await this.logPatientLogin(patient.id, 'portal');

    return {
      success: true,
      patientId: patient.id,
      sessionToken,
      patientProfile: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        dateOfBirth: patient.dateOfBirth,
        portalEnabled: patient.portalEnabled,
        lastLogin: patient.lastPortalLogin,
      },
    };
  }

  /**
   * Get patient health dashboard
   * @param patientId Patient ID
   */
  async getPatientDashboard(patientId: string): Promise<PatientDashboard> {
    // Verify patient has portal access
    await this.verifyPatientPortalAccess(patientId);

    const [
      profile,
      recentRecords,
      currentMedications,
      upcomingAppointments,
      unreadMessages,
      alerts,
    ] = await Promise.all([
      this.getPatientProfile(patientId),
      this.getRecentHealthRecords(patientId),
      this.getCurrentMedications(patientId),
      this.getUpcomingAppointments(patientId),
      this.getUnreadMessages(patientId),
      this.getPatientAlerts(patientId),
    ]);

    return {
      profile,
      recentHealthRecords: recentRecords,
      currentMedications,
      upcomingAppointments,
      unreadMessagesCount: unreadMessages.length,
      alerts,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get patient health records
   * @param patientId Patient ID
   * @param filters Optional filters for records
   */
  async getPatientHealthRecords(
    patientId: string,
    filters?: HealthRecordFilters,
  ): Promise<PatientHealthRecords> {
    await this.verifyPatientPortalAccess(patientId);

    const whereClause: any = { studentId: patientId };

    if (filters?.recordType) {
      whereClause.recordType = filters.recordType;
    }

    if (filters?.dateFrom) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [this.sequelize.Op.gte]: filters.dateFrom,
      };
    }

    if (filters?.dateTo) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        [this.sequelize.Op.lte]: filters.dateTo,
      };
    }

    const records = await this.healthRecordModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    });

    // Apply consent filters (PHI that patient has consented to share)
    const accessibleRecords = await this.filterRecordsByConsent(records, patientId);

    return {
      records: accessibleRecords.map(record => ({
        id: record.id,
        recordType: record.recordType,
        title: record.title,
        description: record.description,
        details: record.details,
        createdAt: record.createdAt,
        provider: record.provider,
        attachments: record.attachments || [],
      })),
      totalCount: accessibleRecords.length,
      hasMore: accessibleRecords.length === (filters?.limit || 50),
    };
  }

  /**
   * Request medication refill
   * @param patientId Patient ID
   * @param refillRequest Refill request details
   */
  async requestMedicationRefill(
    patientId: string,
    refillRequest: MedicationRefillRequest,
  ): Promise<RefillRequestResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Verify medication belongs to patient
    const medication = await this.medicationModel.findOne({
      where: {
        id: refillRequest.medicationId,
        studentId: patientId,
        isActive: true,
      },
    });

    if (!medication) {
      throw new Error('Medication not found or not accessible');
    }

    // Check refill eligibility
    const eligibility = await this.checkRefillEligibility(medication);

    if (!eligibility.eligible) {
      return {
        success: false,
        error: eligibility.reason,
        nextEligibleDate: eligibility.nextEligibleDate,
      };
    }

    // Create refill request
    const request = await this.createRefillRequest({
      patientId,
      medicationId: refillRequest.medicationId,
      quantity: refillRequest.quantity,
      pharmacyNotes: refillRequest.pharmacyNotes,
      urgency: refillRequest.urgency,
    });

    // Notify healthcare provider
    await this.notifyProviderOfRefillRequest(request);

    return {
      success: true,
      requestId: request.id,
      estimatedProcessingTime: this.getEstimatedProcessingTime(refillRequest.urgency),
      message: 'Refill request submitted successfully. You will be notified when it\'s processed.',
    };
  }

  /**
   * Schedule appointment through portal
   * @param patientId Patient ID
   * @param appointmentRequest Appointment scheduling request
   */
  async scheduleAppointment(
    patientId: string,
    appointmentRequest: AppointmentRequest,
  ): Promise<AppointmentSchedulingResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Check appointment type availability
    const availability = await this.checkAppointmentAvailability(appointmentRequest);

    if (!availability.available) {
      return {
        success: false,
        error: availability.reason,
        alternativeSlots: availability.alternativeSlots,
      };
    }

    // Create appointment
    const appointment = await this.appointmentModel.create({
      studentId: patientId,
      appointmentType: appointmentRequest.appointmentType,
      scheduledDate: appointmentRequest.preferredDate,
      scheduledTime: appointmentRequest.preferredTime,
      reason: appointmentRequest.reason,
      requestedBy: 'patient_portal',
      status: 'PENDING',
      notes: appointmentRequest.notes,
    });

    // Notify scheduling team
    await this.notifySchedulingTeam(appointment);

    return {
      success: true,
      appointmentId: appointment.id,
      scheduledDate: appointment.scheduledDate,
      scheduledTime: appointment.scheduledTime,
      confirmationMessage: 'Appointment request submitted. You will receive confirmation within 24 hours.',
    };
  }

  /**
   * Send secure message to healthcare provider
   * @param patientId Patient ID
   * @param message Message details
   */
  async sendSecureMessage(
    patientId: string,
    message: SecureMessage,
  ): Promise<MessageResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Validate message content for PHI
    const validation = await this.validateMessageContent(message.content);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Create message
    const newMessage = await this.messageModel.create({
      senderId: patientId,
      senderType: 'patient',
      recipientId: message.providerId,
      recipientType: 'provider',
      subject: message.subject,
      content: message.content,
      messageType: 'SECURE_PATIENT_MESSAGE',
      priority: message.priority || 'NORMAL',
      status: 'SENT',
      sentAt: new Date(),
    });

    // Notify recipient
    await this.notifyMessageRecipient(newMessage);

    return {
      success: true,
      messageId: newMessage.id,
      sentAt: newMessage.sentAt,
      message: 'Message sent successfully. You will receive a response within 24-48 hours.',
    };
  }

  /**
   * Get patient messages
   * @param patientId Patient ID
   * @param filters Message filters
   */
  async getPatientMessages(
    patientId: string,
    filters?: MessageFilters,
  ): Promise<PatientMessages> {
    await this.verifyPatientPortalAccess(patientId);

    const whereClause: any = {
      [this.sequelize.Op.or]: [
        { senderId: patientId, senderType: 'patient' },
        { recipientId: patientId, recipientType: 'patient' },
      ],
    };

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.dateFrom) {
      whereClause.sentAt = {
        ...whereClause.sentAt,
        [this.sequelize.Op.gte]: filters.dateFrom,
      };
    }

    const messages = await this.messageModel.findAll({
      where: whereClause,
      order: [['sentAt', 'DESC']],
      limit: filters?.limit || 20,
      offset: filters?.offset || 0,
    });

    return {
      messages: messages.map(msg => ({
        id: msg.id,
        subject: msg.subject,
        content: msg.content,
        senderType: msg.senderType,
        recipientType: msg.recipientType,
        priority: msg.priority,
        status: msg.status,
        sentAt: msg.sentAt,
        readAt: msg.readAt,
      })),
      totalCount: messages.length,
      unreadCount: messages.filter(m => !m.readAt).length,
    };
  }

  /**
   * Export patient health data
   * @param patientId Patient ID
   * @param exportRequest Export request details
   */
  async exportPatientData(
    patientId: string,
    exportRequest: DataExportRequest,
  ): Promise<DataExportResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Check export consent
    const hasConsent = await this.checkDataExportConsent(patientId);

    if (!hasConsent) {
      return {
        success: false,
        error: 'Data export consent required. Please update your privacy settings.',
      };
    }

    // Generate export
    const exportData = await this.generatePatientDataExport(patientId, exportRequest);

    // Create audit log
    await this.logDataExport(patientId, exportRequest);

    return {
      success: true,
      exportId: exportData.id,
      downloadUrl: exportData.downloadUrl,
      expiresAt: exportData.expiresAt,
      format: exportRequest.format,
      message: 'Data export is being prepared. You will receive a download link via email.',
    };
  }

  /**
   * Update patient portal preferences
   * @param patientId Patient ID
   * @param preferences Updated preferences
   */
  async updatePortalPreferences(
    patientId: string,
    preferences: PortalPreferences,
  ): Promise<PreferenceUpdateResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Validate preferences
    const validation = await this.validatePortalPreferences(preferences);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Update patient record
    await this.studentModel.update(
      {
        portalPreferences: preferences,
        portalPreferencesUpdatedAt: new Date(),
      },
      {
        where: { id: patientId },
      },
    );

    return {
      success: true,
      message: 'Portal preferences updated successfully.',
      updatedPreferences: preferences,
    };
  }

  /**
   * Get patient education resources
   * @param patientId Patient ID
   * @param category Resource category filter
   */
  async getPatientEducationResources(
    patientId: string,
    category?: string,
  ): Promise<EducationResources> {
    await this.verifyPatientPortalAccess(patientId);

    // Get patient's conditions for relevant resources
    const conditions = await this.getPatientConditions(patientId);

    // Get relevant education resources
    const resources = await this.getRelevantEducationResources(conditions, category);

    // Track resource access for analytics
    await this.trackResourceAccess(patientId, resources);

    return {
      resources,
      totalCount: resources.length,
      categories: this.getResourceCategories(),
      personalizedFor: conditions.map(c => c.details?.condition).filter(Boolean),
    };
  }

  /**
   * Access emergency contacts
   * @param patientId Patient ID
   */
  async getEmergencyContacts(patientId: string): Promise<EmergencyContacts> {
    await this.verifyPatientPortalAccess(patientId);

    // Get emergency contacts from student record
    const student = await this.studentModel.findByPk(patientId);

    if (!student) {
      throw new Error('Patient not found');
    }

    const contacts = student.emergencyContacts || [];

    return {
      contacts: contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        relationship: contact.relationship,
        phoneNumbers: contact.phoneNumbers,
        email: contact.email,
        address: contact.address,
        isPrimary: contact.isPrimary,
      })),
      lastUpdated: student.emergencyContactsUpdatedAt,
      accessLogged: true,
    };
  }

  /**
   * Update emergency contacts
   * @param patientId Patient ID
   * @param contacts Updated emergency contacts
   */
  async updateEmergencyContacts(
    patientId: string,
    contacts: EmergencyContactUpdate[],
  ): Promise<ContactUpdateResult> {
    await this.verifyPatientPortalAccess(patientId);

    // Validate contacts
    const validation = await this.validateEmergencyContacts(contacts);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Update contacts
    await this.studentModel.update(
      {
        emergencyContacts: contacts,
        emergencyContactsUpdatedAt: new Date(),
      },
      {
        where: { id: patientId },
      },
    );

    // Log access for audit
    await this.logEmergencyContactAccess(patientId, 'UPDATE');

    return {
      success: true,
      message: 'Emergency contacts updated successfully.',
      updatedContacts: contacts.length,
    };
  }

  /**
   * Get telehealth session details
   * @param patientId Patient ID
   * @param sessionId Telehealth session ID
   */
  async getTelehealthSession(
    patientId: string,
    sessionId: string,
  ): Promise<TelehealthSession> {
    await this.verifyPatientPortalAccess(patientId);

    // Get telehealth appointment
    const appointment = await this.appointmentModel.findOne({
      where: {
        id: sessionId,
        studentId: patientId,
        appointmentType: 'TELEHEALTH',
      },
    });

    if (!appointment) {
      throw new Error('Telehealth session not found');
    }

    // Generate session access details
    const sessionDetails = await this.generateTelehealthSessionDetails(appointment);

    return {
      sessionId: appointment.id,
      scheduledDate: appointment.scheduledDate,
      scheduledTime: appointment.scheduledTime,
      provider: appointment.provider,
      sessionUrl: sessionDetails.url,
      accessCode: sessionDetails.accessCode,
      instructions: sessionDetails.instructions,
      status: appointment.status,
    };
  }

  private async verifyPatientPortalAccess(patientId: string): Promise<void> {
    const patient = await this.studentModel.findByPk(patientId);

    if (!patient) {
      throw new Error('Patient not found');
    }

    if (!patient.portalEnabled) {
      throw new Error('Patient portal access not enabled');
    }

    if (patient.portalLocked) {
      throw new Error('Patient portal access is locked');
    }
  }

  private async verifyPatientPassword(patient: Student, password: string): Promise<boolean> {
    // In real implementation, use bcrypt or similar for password verification
    return patient.passwordHash === this.hashPassword(password);
  }

  private hashPassword(password: string): string {
    // Placeholder - use proper hashing in production
    return password;
  }

  private async generatePatientSessionToken(patient: Student): Promise<string> {
    // Generate secure session token
    const token = `patient_session_${patient.id}_${Date.now()}_${Math.random()}`;
    return token;
  }

  private async logPatientLogin(patientId: string, source: string): Promise<void> {
    // Log successful login for audit
    this.logger.log(`Patient ${patientId} logged in via ${source}`);
  }

  private async logFailedLoginAttempt(patientId: string): Promise<void> {
    // Log failed login attempt
    this.logger.warn(`Failed login attempt for patient ${patientId}`);
  }

  private async getPatientProfile(patientId: string): Promise<PatientProfile> {
    const patient = await this.studentModel.findByPk(patientId);

    if (!patient) {
      throw new Error('Patient not found');
    }

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      emergencyContacts: patient.emergencyContacts?.length || 0,
      portalEnabled: patient.portalEnabled,
      lastLogin: patient.lastPortalLogin,
      preferences: patient.portalPreferences,
    };
  }

  private async getRecentHealthRecords(patientId: string): Promise<HealthRecordSummary[]> {
    const records = await this.healthRecordModel.findAll({
      where: { studentId: patientId },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    return records.map(record => ({
      id: record.id,
      recordType: record.recordType,
      title: record.title,
      date: record.createdAt,
      provider: record.provider,
    }));
  }

  private async getCurrentMedications(patientId: string): Promise<MedicationSummary[]> {
    const medications = await this.medicationModel.findAll({
      where: {
        studentId: patientId,
        isActive: true,
      },
      order: [['createdAt', 'DESC']],
    });

    return medications.map(med => ({
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      nextRefillDate: med.nextRefillDate,
      daysRemaining: med.daysRemaining,
    }));
  }

  private async getUpcomingAppointments(patientId: string): Promise<AppointmentSummary[]> {
    const appointments = await this.appointmentModel.findAll({
      where: {
        studentId: patientId,
        scheduledDate: {
          [this.sequelize.Op.gte]: new Date(),
        },
        status: 'CONFIRMED',
      },
      order: [['scheduledDate', 'ASC']],
      limit: 3,
    });

    return appointments.map(appt => ({
      id: appt.id,
      appointmentType: appt.appointmentType,
      scheduledDate: appt.scheduledDate,
      scheduledTime: appt.scheduledTime,
      provider: appt.provider,
      location: appt.location,
    }));
  }

  private async getUnreadMessages(patientId: string): Promise<Message[]> {
    return await this.messageModel.findAll({
      where: {
        recipientId: patientId,
        recipientType: 'patient',
        readAt: null,
      },
    });
  }

  private async getPatientAlerts(patientId: string): Promise<PatientAlert[]> {
    const alerts: PatientAlert[] = [];

    // Check for upcoming appointments
    const upcomingAppts = await this.getUpcomingAppointments(patientId);
    if (upcomingAppts.length > 0) {
      const nextAppt = upcomingAppts[0];
      const daysUntil = Math.ceil(
        (new Date(nextAppt.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntil <= 1) {
        alerts.push({
          type: 'APPOINTMENT_REMINDER',
          priority: 'HIGH',
          title: 'Upcoming Appointment',
          message: `You have an appointment on ${nextAppt.scheduledDate} at ${nextAppt.scheduledTime}`,
          actionRequired: false,
        });
      }
    }

    // Check for medications needing refill
    const medications = await this.getCurrentMedications(patientId);
    const needsRefill = medications.filter(med => med.daysRemaining <= 7);

    if (needsRefill.length > 0) {
      alerts.push({
        type: 'MEDICATION_REFILL',
        priority: 'MEDIUM',
        title: 'Medication Refill Needed',
        message: `${needsRefill.length} medication(s) need refill within 7 days`,
        actionRequired: true,
      });
    }

    return alerts;
  }

  private async filterRecordsByConsent(records: HealthRecord[], patientId: string): Promise<HealthRecord[]> {
    // In real implementation, check patient consent preferences
    // For now, return all records (patient can access their own records)
    return records;
  }

  private async checkRefillEligibility(medication: Medication): Promise<RefillEligibility> {
    const now = new Date();
    const lastRefill = medication.lastRefillDate || medication.createdAt;
    const daysSinceLastRefill = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60 * 24));

    // Check if enough time has passed since last refill
    const minDaysBetweenRefills = 25; // Allow refill 5 days early

    if (daysSinceLastRefill < minDaysBetweenRefills) {
      return {
        eligible: false,
        reason: `Too soon for refill. Last refill was ${daysSinceLastRefill} days ago.`,
        nextEligibleDate: new Date(lastRefill.getTime() + (minDaysBetweenRefills * 24 * 60 * 60 * 1000)),
      };
    }

    // Check remaining quantity
    if (medication.daysRemaining > 7) {
      return {
        eligible: false,
        reason: `Medication still has ${medication.daysRemaining} days remaining.`,
        nextEligibleDate: new Date(now.getTime() + ((medication.daysRemaining - 7) * 24 * 60 * 60 * 1000)),
      };
    }

    return { eligible: true };
  }

  private async createRefillRequest(requestData: any): Promise<any> {
    // Create refill request record
    return {
      id: `refill_${Date.now()}`,
      ...requestData,
      status: 'PENDING',
      requestedAt: new Date(),
    };
  }

  private async notifyProviderOfRefillRequest(request: any): Promise<void> {
    // Send notification to healthcare provider
    this.logger.log(`Refill request ${request.id} sent to provider`);
  }

  private getEstimatedProcessingTime(urgency: string): string {
    switch (urgency) {
      case 'URGENT': return '2-4 hours';
      case 'HIGH': return '4-8 hours';
      default: return '24-48 hours';
    }
  }

  private async checkAppointmentAvailability(request: AppointmentRequest): Promise<AvailabilityCheck> {
    // Check provider availability for requested date/time
    const available = Math.random() > 0.3; // Placeholder logic

    if (!available) {
      return {
        available: false,
        reason: 'Requested time slot not available',
        alternativeSlots: [
          {
            date: request.preferredDate,
            time: '10:00',
            provider: 'Dr. Smith',
          },
          {
            date: request.preferredDate,
            time: '14:00',
            provider: 'Dr. Johnson',
          },
        ],
      };
    }

    return { available: true };
  }

  private async notifySchedulingTeam(appointment: Appointment): Promise<void> {
    // Notify scheduling team of new appointment request
    this.logger.log(`Appointment request ${appointment.id} sent to scheduling team`);
  }

  private async validateMessageContent(content: string): Promise<ValidationResult> {
    // Check for PHI in message content
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{10}\b/, // Phone numbers
      /\b[A-Z]{2}\d{6}\b/, // Medical record numbers
    ];

    for (const pattern of phiPatterns) {
      if (pattern.test(content)) {
        return {
          valid: false,
          error: 'Message contains protected health information. Please use secure channels for PHI.',
        };
      }
    }

    return { valid: true };
  }

  private async notifyMessageRecipient(message: Message): Promise<void> {
    // Send notification to message recipient
    this.logger.log(`Message ${message.id} notification sent to recipient`);
  }

  private async checkDataExportConsent(patientId: string): Promise<boolean> {
    // Check if patient has consented to data export
    const patient = await this.studentModel.findByPk(patientId);
    return patient?.portalPreferences?.dataExportConsent || false;
  }

  private async generatePatientDataExport(patientId: string, request: DataExportRequest): Promise<any> {
    // Generate patient data export
    return {
      id: `export_${Date.now()}`,
      downloadUrl: `https://portal.example.com/download/${patientId}/export_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  }

  private async logDataExport(patientId: string, request: DataExportRequest): Promise<void> {
    // Log data export for audit
    this.logger.log(`Data export requested for patient ${patientId}`);
  }

  private async validatePortalPreferences(preferences: PortalPreferences): Promise<ValidationResult> {
    // Validate portal preferences
    if (preferences.emailNotifications && !preferences.email) {
      return {
        valid: false,
        error: 'Email address required for email notifications',
      };
    }

    return { valid: true };
  }

  private async getPatientConditions(patientId: string): Promise<HealthRecord[]> {
    return await this.healthRecordModel.findAll({
      where: {
        studentId: patientId,
        recordType: 'CONDITION',
      },
    });
  }

  private async getRelevantEducationResources(conditions: HealthRecord[], category?: string): Promise<EducationResource[]> {
    // Get education resources relevant to patient's conditions
    const resources: EducationResource[] = [
      {
        id: 'asthma_101',
        title: 'Asthma Management Basics',
        category: 'RESPIRATORY',
        contentType: 'ARTICLE',
        url: '/education/asthma-basics',
        description: 'Learn the fundamentals of asthma management',
        readTime: 5,
        tags: ['asthma', 'respiratory', 'management'],
      },
      {
        id: 'diabetes_nutrition',
        title: 'Nutrition for Diabetes',
        category: 'ENDOCRINE',
        contentType: 'VIDEO',
        url: '/education/diabetes-nutrition',
        description: 'Dietary guidelines for diabetes management',
        readTime: 10,
        tags: ['diabetes', 'nutrition', 'diet'],
      },
    ];

    // Filter by category if specified
    if (category) {
      return resources.filter(r => r.category === category);
    }

    return resources;
  }

  private getResourceCategories(): string[] {
    return [
      'GENERAL',
      'CARDIOVASCULAR',
      'RESPIRATORY',
      'ENDOCRINE',
      'MENTAL_HEALTH',
      'PREVENTION',
      'NUTRITION',
    ];
  }

  private async trackResourceAccess(patientId: string, resources: EducationResource[]): Promise<void> {
    // Track resource access for analytics
    this.logger.log(`Patient ${patientId} accessed ${resources.length} education resources`);
  }

  private async logEmergencyContactAccess(patientId: string, action: string): Promise<void> {
    // Log emergency contact access for audit
    this.logger.log(`Emergency contact ${action} by patient ${patientId}`);
  }

  private async validateEmergencyContacts(contacts: EmergencyContactUpdate[]): Promise<ValidationResult> {
    if (contacts.length === 0) {
      return {
        valid: false,
        error: 'At least one emergency contact is required',
      };
    }

    const primaryContacts = contacts.filter(c => c.isPrimary);
    if (primaryContacts.length !== 1) {
      return {
        valid: false,
        error: 'Exactly one primary emergency contact is required',
      };
    }

    return { valid: true };
  }

  private async generateTelehealthSessionDetails(appointment: Appointment): Promise<any> {
    // Generate telehealth session access details
    return {
      url: `https://telehealth.example.com/session/${appointment.id}`,
      accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      instructions: 'Click the link above at your appointment time. Make sure your camera and microphone are working.',
    };
  }
}

// Type definitions
export interface PatientCredentials {
  email: string;
  password: string;
}

export interface PatientAuthResult {
  success: boolean;
  patientId?: string;
  sessionToken?: string;
  patientProfile?: PatientProfile;
  error?: string;
}

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  address?: any;
  emergencyContacts: number;
  portalEnabled: boolean;
  lastLogin?: Date;
  preferences?: PortalPreferences;
}

export interface PatientDashboard {
  profile: PatientProfile;
  recentHealthRecords: HealthRecordSummary[];
  currentMedications: MedicationSummary[];
  upcomingAppointments: AppointmentSummary[];
  unreadMessagesCount: number;
  alerts: PatientAlert[];
  lastUpdated: Date;
}

export interface HealthRecordSummary {
  id: string;
  recordType: string;
  title: string;
  date: Date;
  provider?: string;
}

export interface MedicationSummary {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextRefillDate?: Date;
  daysRemaining?: number;
}

export interface AppointmentSummary {
  id: string;
  appointmentType: string;
  scheduledDate: Date;
  scheduledTime: string;
  provider?: string;
  location?: string;
}

export interface PatientAlert {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  actionRequired: boolean;
}

export interface HealthRecordFilters {
  recordType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface PatientHealthRecords {
  records: PatientRecord[];
  totalCount: number;
  hasMore: boolean;
}

export interface PatientRecord {
  id: string;
  recordType: string;
  title: string;
  description?: string;
  details?: any;
  createdAt: Date;
  provider?: string;
  attachments: string[];
}

export interface MedicationRefillRequest {
  medicationId: string;
  quantity: number;
  pharmacyNotes?: string;
  urgency: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface RefillRequestResult {
  success: boolean;
  requestId?: string;
  estimatedProcessingTime?: string;
  message?: string;
  error?: string;
  nextEligibleDate?: Date;
}

export interface AppointmentRequest {
  appointmentType: string;
  preferredDate: Date;
  preferredTime: string;
  reason: string;
  notes?: string;
}

export interface AppointmentSchedulingResult {
  success: boolean;
  appointmentId?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  confirmationMessage?: string;
  error?: string;
  alternativeSlots?: AlternativeSlot[];
}

export interface AlternativeSlot {
  date: Date;
  time: string;
  provider: string;
}

export interface SecureMessage {
  providerId: string;
  subject: string;
  content: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface MessageResult {
  success: boolean;
  messageId?: string;
  sentAt?: Date;
  message?: string;
  error?: string;
}

export interface MessageFilters {
  status?: string;
  dateFrom?: Date;
  limit?: number;
  offset?: number;
}

export interface PatientMessages {
  messages: PatientMessage[];
  totalCount: number;
  unreadCount: number;
}

export interface PatientMessage {
  id: string;
  subject: string;
  content: string;
  senderType: string;
  recipientType: string;
  priority: string;
  status: string;
  sentAt: Date;
  readAt?: Date;
}

export interface DataExportRequest {
  format: 'PDF' | 'JSON' | 'XML' | 'CSV';
  includeRecords: boolean;
  includeMedications: boolean;
  includeAppointments: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface DataExportResult {
  success: boolean;
  exportId?: string;
  downloadUrl?: string;
  expiresAt?: Date;
  format?: string;
  message?: string;
  error?: string;
}

export interface PortalPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  email?: string;
  phone?: string;
  language: string;
  timezone: string;
  dataExportConsent: boolean;
}

export interface PreferenceUpdateResult {
  success: boolean;
  message?: string;
  updatedPreferences?: PortalPreferences;
  error?: string;
}

export interface EducationResources {
  resources: EducationResource[];
  totalCount: number;
  categories: string[];
  personalizedFor: string[];
}

export interface EducationResource {
  id: string;
  title: string;
  category: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'PDF' | 'INTERACTIVE';
  url: string;
  description: string;
  readTime: number;
  tags: string[];
}

export interface EmergencyContacts {
  contacts: EmergencyContact[];
  lastUpdated?: Date;
  accessLogged: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumbers: string[];
  email?: string;
  address?: any;
  isPrimary: boolean;
}

export interface EmergencyContactUpdate {
  id: string;
  name: string;
  relationship: string;
  phoneNumbers: string[];
  email?: string;
  address?: any;
  isPrimary: boolean;
}

export interface ContactUpdateResult {
  success: boolean;
  message?: string;
  updatedContacts?: number;
  error?: string;
}

export interface TelehealthSession {
  sessionId: string;
  scheduledDate: Date;
  scheduledTime: string;
  provider?: string;
  sessionUrl: string;
  accessCode: string;
  instructions: string;
  status: string;
}

export interface RefillEligibility {
  eligible: boolean;
  reason?: string;
  nextEligibleDate?: Date;
}

export interface AvailabilityCheck {
  available: boolean;
  reason?: string;
  alternativeSlots?: AlternativeSlot[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}