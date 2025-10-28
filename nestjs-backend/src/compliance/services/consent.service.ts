/**
 * Consent Service - Healthcare consent form management
 * HIPAA Compliance: 45 CFR 164.508 - Authorization requirements
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConsentForm } from '../entities/consent-form.entity';
import { ConsentSignature } from '../entities/consent-signature.entity';
import { SignConsentFormDto } from '../dto/sign-consent-form.dto';
import { ComplianceUtils, COMPLIANCE_ERRORS } from '../utils';

export interface CreateConsentFormData {
  type: string;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(
    @InjectRepository(ConsentForm)
    private readonly consentFormRepository: Repository<ConsentForm>,
    @InjectRepository(ConsentSignature)
    private readonly consentSignatureRepository: Repository<ConsentSignature>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Get all consent forms with optional filtering
   */
  async getConsentForms(filters: { isActive?: boolean } = {}): Promise<ConsentForm[]> {
    try {
      const whereClause: any = {};

      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }

      const forms = await this.consentFormRepository.find({
        where: whereClause,
        relations: ['signatures'],
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Retrieved ${forms.length} consent forms`);
      return forms;
    } catch (error) {
      this.logger.error('Error getting consent forms:', error);
      throw error;
    }
  }

  /**
   * Get consent form by ID with all signatures
   */
  async getConsentFormById(id: string): Promise<ConsentForm> {
    try {
      const form = await this.consentFormRepository.findOne({
        where: { id },
        relations: ['signatures'],
      });

      if (!form) {
        throw new NotFoundException('Consent form not found');
      }

      this.logger.log(`Retrieved consent form: ${id}`);
      return form;
    } catch (error) {
      this.logger.error(`Error getting consent form ${id}:`, error);
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
      if (data.version && !ComplianceUtils.validateVersionFormat(data.version)) {
        throw new BadRequestException(COMPLIANCE_ERRORS.INVALID_VERSION_FORMAT);
      }

      // Validate content length
      if (!ComplianceUtils.validateContentLength(data.content, 50)) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONTENT_TOO_SHORT);
      }

      const form = this.consentFormRepository.create({
        ...data,
        version: data.version || '1.0',
        isActive: true,
      });

      const savedForm = await this.consentFormRepository.save(form);

      this.logger.log(`Created consent form: ${savedForm.id} - ${savedForm.title}`);
      return savedForm;
    } catch (error) {
      this.logger.error('Error creating consent form:', error);
      throw error;
    }
  }

  /**
   * Sign consent form with comprehensive validation and transaction support
   * HIPAA Compliance: Creates immutable audit trail of consent authorization
   */
  async signConsentForm(data: SignConsentFormDto): Promise<ConsentSignature> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate relationship
      if (!ComplianceUtils.validateRelationship(data.relationship)) {
        throw new BadRequestException(COMPLIANCE_ERRORS.INVALID_RELATIONSHIP);
      }

      // Validate signatory name
      if (!data.signedBy || data.signedBy.trim().length < 2) {
        throw new BadRequestException(COMPLIANCE_ERRORS.SIGNATORY_NAME_REQUIRED);
      }

      // Verify consent form exists and is active
      const consentForm = await queryRunner.manager.findOne(ConsentForm, {
        where: { id: data.consentFormId },
      });

      if (!consentForm) {
        throw new NotFoundException('Consent form not found');
      }

      if (!consentForm.isActive) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_NOT_ACTIVE);
      }

      // Check if consent form has expired
      if (consentForm.expiresAt && new Date(consentForm.expiresAt) < new Date()) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_EXPIRED);
      }

      // Check if signature already exists
      const existingSignature = await queryRunner.manager.findOne(ConsentSignature, {
        where: {
          consentFormId: data.consentFormId,
          studentId: data.studentId,
        },
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
        const validation = ComplianceUtils.validateSignatureData(data.signatureData);
        if (!validation.valid) {
          throw new BadRequestException(validation.error);
        }
      }

      // Create signature
      const signature = queryRunner.manager.create(ConsentSignature, {
        consentFormId: data.consentFormId,
        studentId: data.studentId,
        signedBy: data.signedBy.trim(),
        relationship: data.relationship,
        signatureData: data.signatureData || null,
        ipAddress: data.ipAddress || null,
      });

      const savedSignature = await queryRunner.manager.save(signature);
      await queryRunner.commitTransaction();

      this.logger.log(
        `CONSENT SIGNED: Form ${data.consentFormId} for student ${data.studentId} by ${data.signedBy} (${data.relationship})`,
      );

      return savedSignature;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error signing consent form:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get all consent signatures for a student
   */
  async getStudentConsents(studentId: string): Promise<ConsentSignature[]> {
    try {
      const consents = await this.consentSignatureRepository.find({
        where: { studentId },
        relations: ['consentForm'],
        order: { signedAt: 'DESC' },
      });

      this.logger.log(`Retrieved ${consents.length} consents for student ${studentId}`);
      return consents;
    } catch (error) {
      this.logger.error(`Error getting consents for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Withdraw consent with full audit trail
   * HIPAA Compliance: Honors right to revoke authorization per 45 CFR 164.508(b)(5)
   */
  async withdrawConsent(signatureId: string, withdrawnBy: string): Promise<ConsentSignature> {
    try {
      if (!withdrawnBy || withdrawnBy.trim().length < 2) {
        throw new BadRequestException('Withdrawn by name is required for audit trail');
      }

      const signature = await this.consentSignatureRepository.findOne({
        where: { id: signatureId },
        relations: ['consentForm'],
      });

      if (!signature) {
        throw new NotFoundException('Consent signature not found');
      }

      if (signature.withdrawnAt) {
        throw new BadRequestException(COMPLIANCE_ERRORS.CONSENT_ALREADY_WITHDRAWN);
      }

      signature.withdrawnAt = new Date();
      signature.withdrawnBy = withdrawnBy.trim();

      const updatedSignature = await this.consentSignatureRepository.save(signature);

      this.logger.warn(
        `CONSENT WITHDRAWN: Signature ${signatureId} for student ${signature.studentId} withdrawn by ${withdrawnBy}. Consent is no longer valid.`,
      );

      return updatedSignature;
    } catch (error) {
      this.logger.error(`Error withdrawing consent ${signatureId}:`, error);
      throw error;
    }
  }
}
