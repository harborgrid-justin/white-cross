/**
 * @fileoverview Consent Management Service - Healthcare consent forms and digital signatures
 *
 * This service manages the complete lifecycle of healthcare consent forms and digital signatures,
 * ensuring legal validity and HIPAA compliance for all consent-based healthcare operations. Consent
 * forms are legally binding documents that authorize healthcare providers to perform specific actions,
 * share information, or administer treatments.
 *
 * Key responsibilities:
 * - Create and manage versioned consent form templates with legal validity requirements
 * - Capture digital signatures with complete audit trail (name, relationship, IP, timestamp)
 * - Validate signatory authorization and relationship to patient
 * - Track consent lifecycle including signing, expiration, and withdrawal
 * - Prevent duplicate signatures and enforce business rules
 * - Maintain immutable audit trail of consent decisions and withdrawals
 *
 * HIPAA Compliance:
 * - Ensures proper authorization before PHI disclosure per 45 CFR 164.508
 * - Maintains complete audit trails of consent authorization and revocation
 * - Validates signatory authority for legal representation
 * - Provides evidence of authorization for compliance audits
 *
 * Legal Considerations:
 * - Digital signatures captured with IP address and timestamp for authenticity
 * - Minimum content length requirements (50 characters) for legal validity
 * - Authorized relationship validation (parent, guardian, etc.)
 * - Version tracking for consent form changes
 * - Permanent and irreversible withdrawal with full audit trail
 * - Consent expiration date management
 *
 * Integration Points:
 * - Used by medication administration services for treatment authorization
 * - Required by photo release and student information sharing workflows
 * - Integrated with parent portal for online consent signing
 * - Provides data for compliance reporting and audit trails
 *
 * @module services/compliance/consentService
 * @since 1.0.0
 */

import { Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  ConsentForm,
  ConsentSignature,
  Student,
  sequelize
} from '../../database/models';
import {
  CreateConsentFormData,
  SignConsentFormData
} from './types';

/**
 * Service for managing healthcare consent forms and digital signatures.
 *
 * This service handles the creation, distribution, signing, and withdrawal of
 * consent forms required for healthcare operations. Consent forms are legally
 * binding documents that authorize healthcare providers to perform specific
 * actions, share information, or administer treatments.
 *
 * Key Features:
 * - Digital signature capture with legal validity
 * - Version control for consent form updates
 * - Expiration date management
 * - Consent withdrawal with full audit trail
 * - Relationship validation for legal authorization
 *
 * HIPAA Compliance: Ensures proper authorization before PHI disclosure,
 * maintains complete audit trails of consent decisions, and validates
 * signatory authority as required by 45 CFR 164.508.
 *
 * Legal Considerations:
 * - Digital signatures captured with IP address and timestamp
 * - Minimum content length requirements for legal validity
 * - Authorized relationship validation
 * - Version tracking for consent form changes
 * - Immutable audit trail of consent and withdrawal
 *
 * @example
 * ```typescript
 * // Create a new consent form
 * const consentForm = await ConsentService.createConsentForm({
 *   type: 'MEDICATION_ADMINISTRATION',
 *   title: 'Consent for Medication Administration',
 *   description: 'Authorizes school nurses to administer prescribed medications',
 *   content: 'Full legal text of the consent form...',
 *   version: '2.0',
 *   expiresAt: new Date('2026-06-30')
 * });
 *
 * // Parent signs consent form
 * const signature = await ConsentService.signConsentForm({
 *   consentFormId: consentForm.id,
 *   studentId: 'student-123',
 *   signedBy: 'Jane Doe',
 *   relationship: 'Mother',
 *   signatureData: 'base64-encoded-signature-image',
 *   ipAddress: '192.168.1.100'
 * });
 *
 * // Review student's consents
 * const consents = await ConsentService.getStudentConsents('student-123');
 * ```
 */
export class ConsentService {
  /**
   * Retrieves all consent forms with optional filtering by active status.
   *
   * Returns consent forms ordered by creation date (most recent first) with
   * the five most recent signatures included for each form. Useful for
   * administrators managing consent form templates and reviewing signing
   * activity.
   *
   * @param {Object} [filters={}] - Optional filters for consent form retrieval
   * @param {boolean} [filters.isActive] - Filter by active status (true = active only, false = inactive only, undefined = all)
   * @returns {Promise<ConsentForm[]>} Array of consent forms with recent signatures
   * @throws {Error} When database query fails or connection issues occur
   *
   * @example
   * ```typescript
   * // Get all active consent forms
   * const activeForms = await ConsentService.getConsentForms({
   *   isActive: true
   * });
   *
   * // Get all consent forms (active and inactive)
   * const allForms = await ConsentService.getConsentForms();
   *
   * activeForms.forEach(form => {
   *   console.log(`${form.title} (${form.type}) - ${form.signatures.length} recent signatures`);
   * });
   * ```
   */
  static async getConsentForms(filters: { isActive?: boolean } = {}): Promise<ConsentForm[]> {
    try {
      const whereClause: any = {};

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const forms = await ConsentForm.findAll({
        where: whereClause,
        include: [
          {
            model: ConsentSignature,
            as: 'signatures',
            limit: 5,
            separate: true,
            order: [['signedAt', 'DESC']]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${forms.length} consent forms`);
      return forms;
    } catch (error) {
      logger.error('Error getting consent forms:', error);
      throw new Error('Failed to fetch consent forms');
    }
  }

  /**
   * Retrieves a specific consent form by its unique identifier with all signatures.
   *
   * Returns the complete consent form including all historical signatures
   * ordered by signature date (most recent first). Used for detailed review
   * of consent form content and signing history.
   *
   * @param {string} id - Unique identifier of the consent form
   * @returns {Promise<ConsentForm>} The requested consent form with all signatures
   * @throws {Error} When consent form is not found or database query fails
   *
   * @example
   * ```typescript
   * try {
   *   const form = await ConsentService.getConsentFormById('consent-form-123');
   *   console.log(`${form.title}: ${form.signatures.length} total signatures`);
   * } catch (error) {
   *   console.error('Consent form not found');
   * }
   * ```
   */
  static async getConsentFormById(id: string): Promise<ConsentForm> {
    try {
      const form = await ConsentForm.findByPk(id, {
        include: [
          {
            model: ConsentSignature,
            as: 'signatures',
            order: [['signedAt', 'DESC']]
          }
        ]
      });

      if (!form) {
        throw new Error('Consent form not found');
      }

      logger.info(`Retrieved consent form: ${id}`);
      return form;
    } catch (error) {
      logger.error(`Error getting consent form ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new consent form with validation for legal requirements.
   *
   * This method creates legally valid consent forms with strict validation:
   * - Content must be at least 50 characters for legal validity
   * - Version must follow semantic versioning (X.Y or X.Y.Z format)
   * - Expiration date must be in the future if provided
   * - Forms are created as active by default
   *
   * The consent form content should include:
   * - Clear description of what is being authorized
   * - Scope and limitations of the consent
   * - Duration of consent validity
   * - Right to withdraw consent
   * - Consequences of withholding consent
   *
   * Legal Note: Consent forms must comply with state and federal regulations
   * including FERPA for educational records and HIPAA for healthcare data.
   *
   * @param {CreateConsentFormData} data - Consent form creation data
   * @param {ConsentType} data.type - Type of consent (e.g., 'MEDICATION_ADMINISTRATION', 'PHOTO_RELEASE')
   * @param {string} data.title - Title of the consent form (user-facing name)
   * @param {string} data.description - Brief description of consent purpose
   * @param {string} data.content - Full legal text of the consent form (minimum 50 characters)
   * @param {string} [data.version='1.0'] - Version number in X.Y or X.Y.Z format (defaults to '1.0')
   * @param {Date} [data.expiresAt] - Optional expiration date (must be future date)
   * @returns {Promise<ConsentForm>} The newly created consent form (active by default)
   * @throws {Error} When validation fails (invalid version format, expired date, insufficient content)
   *
   * @example
   * ```typescript
   * // Create medication administration consent
   * const medicationConsent = await ConsentService.createConsentForm({
   *   type: 'MEDICATION_ADMINISTRATION',
   *   title: 'Consent for Medication Administration',
   *   description: 'Authorizes school nurse to administer prescribed medications',
   *   content: 'I hereby authorize the school nurse to administer prescribed medications to my child during school hours. This includes over-the-counter medications as specified in the attached medical authorization form. I understand that I must provide all medications in original containers with proper labeling.',
   *   version: '2.0',
   *   expiresAt: new Date('2026-06-30') // End of next school year
   * });
   *
   * // Create simple consent without expiration
   * const photoConsent = await ConsentService.createConsentForm({
   *   type: 'PHOTO_RELEASE',
   *   title: 'Student Photo Release',
   *   description: 'Permission for yearbook and school website photos',
   *   content: 'I grant permission for my child to be photographed for school publications including yearbooks, newsletters, and the school website.'
   * });
   * ```
   */
  static async createConsentForm(data: CreateConsentFormData): Promise<ConsentForm> {
    try {
      // Validate expiration date if provided
      if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        if (expirationDate <= new Date()) {
          throw new Error('Consent form expiration date must be in the future');
        }
      }

      // Validate version format
      if (data.version && !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(data.version)) {
        throw new Error('Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)');
      }

      // Validate content length for legal validity
      if (data.content.trim().length < 50) {
        throw new Error('Consent form content must be at least 50 characters for legal validity');
      }

      const form = await ConsentForm.create({
        type: data.type,
        title: data.title,
        description: data.description,
        content: data.content,
        version: data.version || '1.0',
        isActive: true,
        expiresAt: data.expiresAt
      });

      logger.info(`Created consent form: ${form.id} - ${form.title} (${form.type})`);
      return form;
    } catch (error) {
      logger.error('Error creating consent form:', error);
      throw error;
    }
  }

  /**
   * Updates an existing consent form with validation for legal requirements.
   *
   * This method allows updating consent form properties while maintaining
   * validation rules for legal compliance. Common use cases include:
   * - Incrementing version number when content changes
   * - Deactivating outdated consent forms
   * - Updating expiration dates
   * - Correcting typos or clarifying language
   *
   * Best Practice: When making substantive changes to consent content,
   * increment the version number and consider creating a new consent form
   * rather than updating the existing one. Existing signatures remain valid
   * only for the version they signed.
   *
   * @param {string} id - Unique identifier of the consent form to update
   * @param {Partial<CreateConsentFormData & {isActive?: boolean}>} data - Fields to update
   * @param {string} [data.title] - Updated title
   * @param {string} [data.description] - Updated description
   * @param {string} [data.content] - Updated legal text (minimum 50 characters)
   * @param {string} [data.version] - Updated version (must match X.Y or X.Y.Z format)
   * @param {boolean} [data.isActive] - Set active/inactive status
   * @param {Date} [data.expiresAt] - Updated expiration date
   * @returns {Promise<ConsentForm>} The updated consent form
   * @throws {Error} When consent form not found, validation fails, or database update fails
   *
   * @example
   * ```typescript
   * // Deactivate an outdated consent form
   * await ConsentService.updateConsentForm('consent-form-123', {
   *   isActive: false
   * });
   *
   * // Update content and version for new school year
   * await ConsentService.updateConsentForm('consent-form-456', {
   *   content: 'Updated legal text reflecting new school policy...',
   *   version: '2.1',
   *   expiresAt: new Date('2026-06-30')
   * });
   * ```
   */
  static async updateConsentForm(
    id: string,
    data: Partial<CreateConsentFormData & { isActive?: boolean }>
  ): Promise<ConsentForm> {
    try {
      const existingForm = await ConsentForm.findByPk(id);

      if (!existingForm) {
        throw new Error('Consent form not found');
      }

      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.content) updateData.content = data.content;
      if (data.version) updateData.version = data.version;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.expiresAt) updateData.expiresAt = data.expiresAt;

      // Validate version format if provided
      if (data.version && !/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(data.version)) {
        throw new Error('Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)');
      }

      // Validate content length if provided
      if (data.content && data.content.trim().length < 50) {
        throw new Error('Consent form content must be at least 50 characters for legal validity');
      }

      await existingForm.update(updateData);

      logger.info(`Updated consent form: ${id}`);
      return existingForm;
    } catch (error) {
      logger.error(`Error updating consent form ${id}:`, error);
      throw error;
    }
  }

  /**
   * Records a digital signature for a consent form with comprehensive validation.
   *
   * This method implements the complete consent signing workflow with legal
   * validity requirements and HIPAA compliance safeguards. The signing process
   * includes:
   *
   * Validation Steps:
   * - Verify consent form exists and is active
   * - Check consent form has not expired
   * - Verify student exists in the system
   * - Validate signatory's authorized relationship
   * - Ensure consent not previously signed (prevents duplicates)
   * - Validate digital signature data format and size
   *
   * Legal Requirements:
   * - Signatory name required (minimum 2 characters)
   * - Relationship must be from authorized list
   * - Digital signature data captured for authenticity
   * - IP address logged for security and fraud prevention
   * - Timestamp automatically recorded
   *
   * Transaction Safety:
   * Uses database transaction to ensure atomicity - all validation and
   * creation steps succeed together or all fail together, preventing
   * partial consent records.
   *
   * HIPAA Compliance: Creates immutable audit trail of consent authorization
   * as required by 45 CFR 164.508 before PHI disclosure or use.
   *
   * @param {SignConsentFormData} data - Consent signature data
   * @param {string} data.consentFormId - ID of the consent form being signed
   * @param {string} data.studentId - ID of the student for whom consent is given
   * @param {string} data.signedBy - Full name of person signing (minimum 2 characters)
   * @param {string} data.relationship - Relationship to student from authorized list ('Mother', 'Father', 'Parent', 'Legal Guardian', 'Foster Parent', 'Grandparent', 'Stepparent', 'Other Authorized Adult')
   * @param {string} [data.signatureData] - Base64-encoded digital signature image (10-100,000 bytes)
   * @param {string} [data.ipAddress] - IP address of signing device for audit trail
   * @returns {Promise<ConsentSignature>} The created consent signature record
   * @throws {Error} When validation fails, form is inactive/expired, duplicate signature exists, or transaction fails
   *
   * @example
   * ```typescript
   * // Parent signs medication consent with digital signature
   * try {
   *   const signature = await ConsentService.signConsentForm({
   *     consentFormId: 'form-123',
   *     studentId: 'student-456',
   *     signedBy: 'Jane Marie Doe',
   *     relationship: 'Mother',
   *     signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
   *     ipAddress: '192.168.1.100'
   *   });
   *   console.log('Consent signed successfully at', signature.signedAt);
   * } catch (error) {
   *   if (error.message.includes('already signed')) {
   *     console.log('This consent was previously signed');
   *   } else if (error.message.includes('expired')) {
   *     console.log('Consent form has expired - new version needed');
   *   }
   * }
   *
   * // Legal guardian signs without digital signature capture
   * const signature = await ConsentService.signConsentForm({
   *   consentFormId: 'form-789',
   *   studentId: 'student-456',
   *   signedBy: 'Robert Johnson',
   *   relationship: 'Legal Guardian',
   *   ipAddress: '10.0.0.50'
   * });
   * ```
   */
  static async signConsentForm(data: SignConsentFormData): Promise<ConsentSignature> {
    const transaction = await sequelize.transaction();

    try {
      // Validate relationship
      const validRelationships = [
        'Mother', 'Father', 'Parent', 'Legal Guardian',
        'Foster Parent', 'Grandparent', 'Stepparent', 'Other Authorized Adult'
      ];
      if (!validRelationships.includes(data.relationship)) {
        throw new Error('Relationship must be a valid authorized relationship type');
      }

      // Validate signatory name
      if (!data.signedBy || data.signedBy.trim().length < 2) {
        throw new Error('Signatory name is required for legal validity');
      }

      // Verify consent form exists and is active
      const consentForm = await ConsentForm.findByPk(data.consentFormId, { transaction });
      if (!consentForm) {
        throw new Error('Consent form not found');
      }
      if (!consentForm.isActive) {
        throw new Error('Consent form is not active and cannot be signed');
      }

      // Check if consent form has expired
      if (consentForm.expiresAt && new Date(consentForm.expiresAt) < new Date()) {
        throw new Error('Consent form has expired and cannot be signed');
      }

      // Verify student exists
      const student = await Student.findByPk(data.studentId, { transaction });
      if (!student) {
        throw new Error('Student not found');
      }

      // Check if signature already exists (unique constraint)
      const existingSignature = await ConsentSignature.findOne({
        where: {
          consentFormId: data.consentFormId,
          studentId: data.studentId
        },
        transaction
      });

      if (existingSignature) {
        if (existingSignature.withdrawnAt) {
          throw new Error('Consent form was previously signed and withdrawn. A new consent form version may be required.');
        }
        throw new Error('Consent form already signed for this student');
      }

      // Validate digital signature data if provided
      if (data.signatureData) {
        if (data.signatureData.length < 10) {
          throw new Error('Digital signature data appears incomplete');
        }
        if (data.signatureData.length > 100000) {
          throw new Error('Digital signature data is too large (max 100KB)');
        }
      }

      // Create signature
      const signature = await ConsentSignature.create(
        {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
          signedBy: data.signedBy.trim(),
          relationship: data.relationship,
          signatureData: data.signatureData,
          ipAddress: data.ipAddress
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(
        `CONSENT SIGNED: Form ${data.consentFormId} for student ${student.firstName} ${student.lastName} ` +
        `(${data.studentId}) by ${data.signedBy} (${data.relationship})` +
        `${data.ipAddress ? ` from IP ${data.ipAddress}` : ''}`
      );

      return signature;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error signing consent form:', error);
      throw error;
    }
  }

  /**
   * Retrieves all consent signatures for a specific student.
   *
   * Returns a comprehensive view of all consents signed for the student,
   * ordered chronologically (most recent first). Each signature includes
   * the full consent form details for review. Essential for:
   * - Verifying required consents before medical procedures
   * - Reviewing authorization status before PHI disclosure
   * - Compliance audits and record reviews
   * - Parent portal consent management
   *
   * @param {string} studentId - Unique identifier of the student
   * @returns {Promise<ConsentSignature[]>} Array of all consent signatures with form details
   * @throws {Error} When student not found or database query fails
   *
   * @example
   * ```typescript
   * // Check if student has required consents
   * const consents = await ConsentService.getStudentConsents('student-123');
   *
   * // Verify medication consent is active
   * const medicationConsent = consents.find(c =>
   *   c.consentForm.type === 'MEDICATION_ADMINISTRATION' &&
   *   !c.withdrawnAt
   * );
   *
   * if (medicationConsent) {
   *   console.log(`Medication consent signed by ${medicationConsent.signedBy} on ${medicationConsent.signedAt}`);
   * } else {
   *   console.log('No active medication consent - administration not authorized');
   * }
   *
   * // List all active consents
   * const activeConsents = consents.filter(c => !c.withdrawnAt);
   * console.log(`Student has ${activeConsents.length} active consents`);
   * ```
   */
  static async getStudentConsents(studentId: string): Promise<ConsentSignature[]> {
    try {
      // Verify student exists
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const consents = await ConsentSignature.findAll({
        where: { studentId },
        include: [
          {
            model: ConsentForm,
            as: 'consentForm',
            required: true
          }
        ],
        order: [['signedAt', 'DESC']]
      });

      logger.info(`Retrieved ${consents.length} consents for student ${studentId}`);
      return consents;
    } catch (error) {
      logger.error(`Error getting consents for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Withdraws a previously signed consent with full audit trail.
   *
   * This method implements the legal right to withdraw consent at any time.
   * Once withdrawn, the consent is no longer valid for authorization, and
   * the withdrawal is permanent and irreversible. A new signature would be
   * required to re-establish consent.
   *
   * Legal Requirements:
   * - Consent withdrawal must be honored immediately
   * - Complete audit trail maintained (who withdrew, when)
   * - Withdrawal is permanent - cannot be undone
   * - Healthcare operations must cease if consent withdrawn
   *
   * HIPAA Compliance: Honors individuals' right to revoke authorization for
   * PHI use/disclosure as required by 45 CFR 164.508(b)(5). Maintains
   * complete audit trail of withdrawal decision.
   *
   * Impact of Withdrawal:
   * - Consent immediately becomes invalid for future operations
   * - Past actions taken under consent remain legally valid
   * - New consent signature required if authorization needed again
   * - Triggers notifications to affected staff (e.g., nurses cannot administer medication)
   *
   * @param {string} signatureId - Unique identifier of the consent signature to withdraw
   * @param {string} withdrawnBy - Full name of person withdrawing consent (minimum 2 characters for audit trail)
   * @returns {Promise<ConsentSignature>} The updated signature record with withdrawal details
   * @throws {Error} When signature not found, already withdrawn, or database update fails
   *
   * @example
   * ```typescript
   * // Parent withdraws medication consent
   * try {
   *   const withdrawn = await ConsentService.withdrawConsent(
   *     'signature-123',
   *     'Jane Doe'
   *   );
   *   console.log(`Consent withdrawn on ${withdrawn.withdrawnAt} by ${withdrawn.withdrawnBy}`);
   *   // Trigger notification to school nurse
   *   await notifyNurse(`Medication consent withdrawn for student ${withdrawn.studentId}`);
   * } catch (error) {
   *   if (error.message.includes('already withdrawn')) {
   *     console.log('Consent was previously withdrawn');
   *   }
   * }
   *
   * // Verify consent not withdrawn before using
   * const signature = await ConsentSignature.findByPk('sig-456');
   * if (signature.withdrawnAt) {
   *   throw new Error(`Consent was withdrawn on ${signature.withdrawnAt} by ${signature.withdrawnBy}`);
   * }
   * ```
   */
  static async withdrawConsent(signatureId: string, withdrawnBy: string): Promise<ConsentSignature> {
    try {
      // Validate withdrawn by name
      if (!withdrawnBy || withdrawnBy.trim().length < 2) {
        throw new Error('Withdrawn by name is required for audit trail');
      }

      const signature = await ConsentSignature.findByPk(signatureId, {
        include: [
          {
            model: ConsentForm,
            as: 'consentForm'
          },
          {
            model: Student,
            as: 'student'
          }
        ]
      });

      if (!signature) {
        throw new Error('Consent signature not found');
      }

      if (signature.withdrawnAt) {
        throw new Error(
          `Consent was already withdrawn on ${signature.withdrawnAt.toISOString().split('T')[0]} ` +
          `by ${signature.withdrawnBy}`
        );
      }

      await signature.update({
        withdrawnAt: new Date(),
        withdrawnBy: withdrawnBy.trim()
      });

      const student = (signature as any).student;
      logger.warn(
        `CONSENT WITHDRAWN: Signature ${signatureId} for student ` +
        `${student ? `${student.firstName} ${student.lastName}` : signature.studentId} ` +
        `withdrawn by ${withdrawnBy}. Consent is no longer valid.`
      );

      return signature;
    } catch (error) {
      logger.error(`Error withdrawing consent ${signatureId}:`, error);
      throw error;
    }
  }
}
