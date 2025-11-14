/**
 * Consent Service - Healthcare consent form management
 * HIPAA Compliance: 45 CFR 164.508 - Authorization requirements
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConsentForm, ConsentType } from '@/database/models';
import { ConsentSignature } from '@/database/models';
import { SignConsentFormDto } from '../dto/sign-consent-form.dto';
import { COMPLIANCE_ERRORS, ComplianceUtils } from '../utils/index';

import { BaseService } from '@/common/base';
export interface CreateConsentFormData {
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

@Injectable()
export class ConsentService extends BaseService {
  constructor(
    @InjectModel(ConsentForm)
    private readonly consentFormModel: typeof ConsentForm,
    @InjectModel(ConsentSignature)
    private readonly consentSignatureModel: typeof ConsentSignature,
    private readonly sequelize: Sequelize,
  ) {
    super("ConsentService");
  }

  /**
   * Get all consent forms with optional filtering
   */
  async getConsentForms(
    filters: { isActive?: boolean } = {},
  ): Promise<ConsentForm[]> {
    try {
      const whereClause: any = {};

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const forms = await this.consentFormModel.findAll({
        where: whereClause,
        include: [{ model: ConsentSignature, as: 'signatures' }],
        order: [['createdAt', 'DESC']],
      });

      this.logInfo(`Retrieved ${forms.length} consent forms`);
      return forms;
    } catch (error) {
      this.logError('Error getting consent forms:', error);
      throw error;
    }
  }

  /**
   * Get consent form by ID with all signatures
   */
  async getConsentFormById(id: string): Promise<ConsentForm> {
    try {
      const form = await this.consentFormModel.findByPk(id, {
        include: [{ model: ConsentSignature, as: 'signatures' }],
      });

      if (!form) {
        throw new NotFoundException('Consent form not found');
      }

      this.logInfo(`Retrieved consent form: ${id}`);
      return form;
    } catch (error) {
      this.logError(`Error getting consent form ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new consent form with validation
   */
  async createConsentForm(data: CreateConsentFormData): Promise<ConsentForm> {
    try {
      // Validate expiration date
      if (data.expiresAt) {
        const expirationDate = new Date(data.expiresAt);
        if (expirationDate <= new Date()) {
          throw new BadRequestException(COMPLIANCE_ERRORS.EXPIRATION_DATE_PAST);
        }
      }

      // Validate version format
      if (
        data.version &&
        !ComplianceUtils.validateVersionFormat(data.version)
      ) {
        throw new BadRequestException(COMPLIANCE_ERRORS.INVALID_VERSION_FORMAT);
      }

      // Validate content length
      if (!ComplianceUtils.validateContentLength(data.content, 50)) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONTENT_TOO_SHORT);
      }

      const form = await this.consentFormModel.create({
        ...data,
        version: data.version || '1.0',
        isActive: true,
      });

      this.logInfo(`Created consent form: ${form.id} - ${form.title}`);
      return form;
    } catch (error) {
      this.logError('Error creating consent form:', error);
      throw error;
    }
  }

  /**
   * Sign consent form with comprehensive validation and transaction support
   * HIPAA Compliance: Creates immutable audit trail of consent authorization
   */
  async signConsentForm(data: SignConsentFormDto): Promise<ConsentSignature> {
    const transaction = await this.sequelize.transaction();

    try {
      // Validate relationship
      if (!ComplianceUtils.validateRelationship(data.relationship)) {
        throw new BadRequestException(COMPLIANCE_ERRORS.INVALID_RELATIONSHIP);
      }

      // Validate signatory name
      if (!data.signedBy || data.signedBy.trim().length < 2) {
        throw new BadRequestException(
          COMPLIANCE_ERRORS.SIGNATORY_NAME_REQUIRED,
        );
      }

      // Verify consent form exists and is active
      const consentForm = await this.consentFormModel.findByPk(
        data.consentFormId,
        { transaction },
      );

      if (!consentForm) {
        throw new NotFoundException('Consent form not found');
      }

      if (!consentForm.isActive) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_NOT_ACTIVE);
      }

      // Check if consent form has expired
      if (
        consentForm.expiresAt &&
        new Date(consentForm.expiresAt) < new Date()
      ) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_EXPIRED);
      }

      // Check if signature already exists
      const existingSignature = await this.consentSignatureModel.findOne({
        where: {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
        },
        transaction,
      });

      if (existingSignature) {
        if (existingSignature.withdrawnAt) {
          throw new BadRequestException(
            'Consent form was previously signed and withdrawn. A new consent form version may be required.',
          );
        }
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_ALREADY_SIGNED);
      }

      // Validate digital signature data if provided
      if (data.signatureData) {
        const validation = ComplianceUtils.validateSignatureData(
          data.signatureData,
        );
        if (!validation.valid) {
          throw new BadRequestException(validation.error);
        }
      }

      // Create signature
      const signature = await this.consentSignatureModel.create(
        {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
          signedBy: data.signedBy.trim(),
          relationship: data.relationship,
          signatureData: data.signatureData,
          ipAddress: data.ipAddress,
          signedAt: new Date(),
        },
        { transaction },
      );

      await transaction.commit();

      this.logInfo(
        `CONSENT SIGNED: Form ${data.consentFormId} for student ${data.studentId} by ${data.signedBy} (${data.relationship})`,
      );

      return signature;
    } catch (error) {
      await transaction.rollback();
      this.logError('Error signing consent form:', error);
      throw error;
    }
  }

  /**
   * Get all consent signatures for a student
   */
  async getStudentConsents(studentId: string): Promise<ConsentSignature[]> {
    try {
      const consents = await this.consentSignatureModel.findAll({
        where: { studentId },
        include: [{ model: ConsentForm, as: 'consentForm' }],
        order: [['signedAt', 'DESC']],
      });

      this.logInfo(
        `Retrieved ${consents.length} consents for student ${studentId}`,
      );
      return consents;
    } catch (error) {
      this.logError(
        `Error getting consents for student ${studentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Withdraw consent with full audit trail
   * HIPAA Compliance: Honors right to revoke authorization per 45 CFR 164.508(b)(5)
   */
  async withdrawConsent(
    signatureId: string,
    withdrawnBy: string,
  ): Promise<ConsentSignature> {
    try {
      if (!withdrawnBy || withdrawnBy.trim().length < 2) {
        throw new BadRequestException(
          'Withdrawn by name is required for audit trail',
        );
      }

      const signature = await this.consentSignatureModel.findByPk(signatureId, {
        include: [{ model: ConsentForm, as: 'consentForm' }],
      });

      if (!signature) {
        throw new NotFoundException('Consent signature not found');
      }

      if (signature.withdrawnAt) {
        throw new BadRequestException(
          COMPLIANCE_ERRORS.CONSENT_ALREADY_WITHDRAWN,
        );
      }

      await signature.update({
        withdrawnAt: new Date(),
        withdrawnBy: withdrawnBy.trim(),
      });

      this.logWarning(
        `CONSENT WITHDRAWN: Signature ${signatureId} for student ${signature.studentId} withdrawn by ${withdrawnBy}. Consent is no longer valid.`,
      );

      return signature;
    } catch (error) {
      this.logError(`Error withdrawing consent ${signatureId}:`, error);
      throw error;
    }
  }
}
