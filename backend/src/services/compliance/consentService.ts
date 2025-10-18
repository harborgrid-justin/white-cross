/**
 * LOC: 60EC8F5626
 * WC-GEN-238 | consentService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/compliance/index.ts)
 */

/**
 * WC-GEN-238 | consentService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
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

export class ConsentService {
  /**
   * Get all consent forms
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
   * Get consent form by ID
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
   * Create consent form
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
   * Update consent form
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
   * Sign consent form
   * Uses transaction to ensure atomicity and proper audit logging
   * HIPAA COMPLIANCE: Records digital signature with full audit trail
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
   * Get student consent signatures
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
   * Withdraw consent
   * HIPAA COMPLIANCE: Maintains complete audit trail of consent withdrawal
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
