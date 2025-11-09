/**
 * LOC: DOC-LEGAL-HOLD-001
 * File: /reuse/document/composites/downstream/legal-hold-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - ../document-compliance-audit-composite
 *   - ../document-contract-lifecycle-composite
 *
 * DOWNSTREAM (imported by):
 *   - Litigation support services
 *   - Legal discovery systems
 *   - Compliance enforcement handlers
 *   - Document retention managers
 */

/**
 * File: /reuse/document/composites/downstream/legal-hold-services.ts
 * Locator: WC-LEGAL-HOLD-001
 * Purpose: Legal Hold Management Services - Litigation support and legal preservation
 *
 * Upstream: Composed from document-compliance-audit-composite, document-contract-lifecycle-composite
 * Downstream: Litigation support, legal discovery, compliance enforcement, retention management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 15 production-ready functions for legal hold management and litigation support
 *
 * LLM Context: Production-grade legal hold system for White Cross healthcare platform.
 * Manages litigation holds, prevents deletion of legally protected documents,
 * tracks custodians, and manages discovery requests. Ensures HIPAA compliance
 * while supporting legal proceedings and regulatory investigations.
 */

import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Model,
  Column,
  Table,
  DataType,
  Index,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsDate,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Legal hold status enumeration
 */
export enum LegalHoldStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
}

/**
 * Hold type enumeration
 */
export enum HoldType {
  LITIGATION = 'LITIGATION',
  REGULATORY_INVESTIGATION = 'REGULATORY_INVESTIGATION',
  INTERNAL_INVESTIGATION = 'INTERNAL_INVESTIGATION',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  OTHER = 'OTHER',
}

/**
 * Discovery request status
 */
export enum DiscoveryRequestStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DENIED = 'DENIED',
  APPEALED = 'APPEALED',
}

/**
 * Legal hold interface
 */
export interface LegalHold {
  id: string;
  holdName: string;
  holdType: HoldType;
  description: string;
  status: LegalHoldStatus;
  createdBy: string;
  createdDate: Date;
  expirationDate?: Date;
  documents: string[];
}

/**
 * Custodian interface
 */
export interface Custodian {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

/**
 * Legal hold DTO
 */
export class LegalHoldDto {
  @ApiProperty({ description: 'Legal hold identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Hold name' })
  @IsString()
  holdName: string;

  @ApiProperty({ description: 'Hold type' })
  @IsEnum(HoldType)
  holdType: HoldType;

  @ApiProperty({ description: 'Hold status' })
  @IsEnum(LegalHoldStatus)
  status: LegalHoldStatus;

  @ApiPropertyOptional({ description: 'Number of documents' })
  @IsNumber()
  documentCount?: number;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsDate()
  expirationDate?: Date;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDate()
  createdAt?: Date;
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Legal Hold Model - Tracks litigation holds on documents
 */
@Table({
  tableName: 'legal_holds',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['hold_type'] },
    { fields: ['created_by'] },
    { fields: ['expiration_date'] },
  ],
})
export class LegalHoldModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  holdName: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(HoldType)))
  holdType: HoldType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(LegalHoldStatus)))
  status: LegalHoldStatus;

  @AllowNull(false)
  @Column(DataType.UUID)
  createdBy: string;

  @Column(DataType.DATE)
  expirationDate: Date;

  @Default(0)
  @Column(DataType.INTEGER)
  documentCount: number;

  @Column(DataType.TEXT)
  caseNumber: string;

  @Column(DataType.TEXT)
  legalRepresentative: string;

  @Column(DataType.TEXT)
  legalRepresentativeEmail: string;

  @Column(DataType.TEXT)
  notes: string;

  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Hold Document Association Model - Links documents to holds
 */
@Table({
  tableName: 'hold_document_associations',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class HoldDocumentAssociation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  holdId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  documentId: string;

  @Default('HELD')
  @Column(DataType.ENUM('HELD', 'EXEMPT', 'REVIEW_PENDING'))
  status: string;

  @Column(DataType.TEXT)
  reason: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Custodian Model - Tracks document custodians
 */
@Table({
  tableName: 'legal_custodians',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class LegalCustodian extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  holdId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  email: string;

  @Column(DataType.STRING(255))
  phone: string;

  @Column(DataType.STRING(100))
  department: string;

  @Default('ACTIVE')
  @Column(DataType.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'))
  status: string;

  @Column(DataType.DATE)
  notificationDate: Date;

  @Column(DataType.DATE)
  acknowledgedDate: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  hasAcknowledged: boolean;

  @Column(DataType.INTEGER)
  documentCount: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

/**
 * Discovery Request Model - Tracks eDiscovery requests
 */
@Table({
  tableName: 'discovery_requests',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class DiscoveryRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  holdId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  requestedBy: string;

  @Column(DataType.TEXT)
  searchQuery: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(DiscoveryRequestStatus)))
  status: DiscoveryRequestStatus;

  @Column(DataType.DATE)
  requestDate: Date;

  @Column(DataType.DATE)
  completionDate: Date;

  @Default(0)
  @Column(DataType.INTEGER)
  documentCount: number;

  @Column(DataType.STRING(500))
  exportPath: string;

  @Column(DataType.TEXT)
  notes: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Legal Hold Services
 *
 * Manages legal holds, document preservation, custodians,
 * and eDiscovery requests for litigation support.
 */
@Injectable()
export class LegalHoldService {
  constructor(private sequelize: Sequelize) {}

  /**
   * Create legal hold
   *
   * Establishes new legal hold with case information,
   * legal representative, and applicable documents.
   *
   * @param holdName - Name of the hold
   * @param holdType - Type of hold
   * @param createdBy - User creating the hold
   * @param description - Hold description
   * @param caseNumber - Associated case number
   * @param expirationDate - Optional hold expiration date
   * @returns Promise with created legal hold
   * @throws BadRequestException when validation fails
   * @throws ConflictException when hold name already exists
   */
  async createLegalHold(
    holdName: string,
    holdType: HoldType,
    createdBy: string,
    description: string,
    caseNumber: string,
    expirationDate?: Date,
  ): Promise<LegalHoldDto> {
    try {
      const existing = await LegalHoldModel.findOne({
        where: { holdName, status: { [Op.ne]: LegalHoldStatus.RELEASED } },
      });

      if (existing) {
        throw new ConflictException('Active hold with this name already exists');
      }

      const hold = await LegalHoldModel.create({
        holdName,
        holdType,
        createdBy,
        description,
        caseNumber,
        expirationDate,
        status: LegalHoldStatus.PENDING,
      });

      return this.mapHoldToDto(hold);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add documents to legal hold
   *
   * Associates multiple documents with a legal hold,
   * preventing deletion and preserving evidence.
   *
   * @param holdId - Legal hold identifier
   * @param documentIds - Array of document identifiers
   * @param reason - Reason for adding documents
   * @returns Promise with confirmation
   * @throws NotFoundException when hold not found
   * @throws BadRequestException when validation fails
   */
  async addDocumentsToHold(
    holdId: string,
    documentIds: string[],
    reason: string,
  ): Promise<{ success: boolean; addedCount: number }> {
    const transaction = await this.sequelize.transaction();

    try {
      const hold = await LegalHoldModel.findByPk(holdId, { transaction });

      if (!hold) {
        throw new NotFoundException('Legal hold not found');
      }

      if (hold.status === LegalHoldStatus.RELEASED) {
        throw new BadRequestException('Cannot add documents to released hold');
      }

      const associations = await HoldDocumentAssociation.bulkCreate(
        documentIds.map((docId) => ({
          holdId,
          documentId: docId,
          status: 'HELD',
          reason,
        })),
        { transaction },
      );

      // Update document count
      await hold.increment('documentCount', {
        by: documentIds.length,
        transaction,
      });

      await transaction.commit();
      return { success: true, addedCount: associations.length };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Activate legal hold
   *
   * Activates hold enforcement preventing document deletion.
   *
   * @param holdId - Legal hold identifier
   * @returns Promise with activated hold
   * @throws NotFoundException when hold not found
   */
  async activateLegalHold(holdId: string): Promise<LegalHoldDto> {
    const hold = await LegalHoldModel.findByPk(holdId);

    if (!hold) {
      throw new NotFoundException('Legal hold not found');
    }

    const updated = await hold.update({
      status: LegalHoldStatus.ACTIVE,
    });

    return this.mapHoldToDto(updated);
  }

  /**
   * Release legal hold
   *
   * Terminates hold, allowing document deletion
   * according to retention policies.
   *
   * @param holdId - Legal hold identifier
   * @param releasedBy - User releasing hold
   * @param reason - Release reason
   * @returns Promise with released hold
   * @throws NotFoundException when hold not found
   */
  async releaseLegalHold(
    holdId: string,
    releasedBy: string,
    reason: string,
  ): Promise<LegalHoldDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const hold = await LegalHoldModel.findByPk(holdId, { transaction });

      if (!hold) {
        throw new NotFoundException('Legal hold not found');
      }

      const updated = await hold.update(
        {
          status: LegalHoldStatus.RELEASED,
          metadata: {
            ...hold.metadata,
            releasedBy,
            releasedDate: new Date().toISOString(),
            releaseReason: reason,
          },
        },
        { transaction },
      );

      await transaction.commit();
      return this.mapHoldToDto(updated);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Add custodian to legal hold
   *
   * Adds custodian with document preservation responsibilities
   * and notification requirements.
   *
   * @param holdId - Legal hold identifier
   * @param custodian - Custodian information
   * @returns Promise with added custodian
   * @throws NotFoundException when hold not found
   */
  async addCustodian(
    holdId: string,
    custodian: { name: string; email: string; department: string },
  ): Promise<LegalCustodian> {
    const hold = await LegalHoldModel.findByPk(holdId);

    if (!hold) {
      throw new NotFoundException('Legal hold not found');
    }

    return await LegalCustodian.create({
      holdId,
      ...custodian,
      notificationDate: new Date(),
    });
  }

  /**
   * Get custodian documents
   *
   * Retrieves all documents under hold associated with
   * specific custodian for production.
   *
   * @param custodianId - Custodian identifier
   * @param limit - Maximum documents
   * @returns Promise with custodian documents
   * @throws NotFoundException when custodian not found
   */
  async getCustodianDocuments(
    custodianId: string,
    limit: number = 500,
  ): Promise<{ count: number; documentIds: string[] }> {
    const custodian = await LegalCustodian.findByPk(custodianId);

    if (!custodian) {
      throw new NotFoundException('Custodian not found');
    }

    const associations = await HoldDocumentAssociation.findAll({
      where: { holdId: custodian.holdId },
      limit,
    });

    return {
      count: associations.length,
      documentIds: associations.map((a) => a.documentId),
    };
  }

  /**
   * Create discovery request
   *
   * Creates eDiscovery request for document production
   * with search criteria and tracking.
   *
   * @param holdId - Associated legal hold
   * @param requestedBy - Person requesting documents
   * @param searchQuery - Search criteria
   * @param description - Request description
   * @returns Promise with discovery request
   * @throws NotFoundException when hold not found
   */
  async createDiscoveryRequest(
    holdId: string,
    requestedBy: string,
    searchQuery: string,
    description: string,
  ): Promise<DiscoveryRequest> {
    const hold = await LegalHoldModel.findByPk(holdId);

    if (!hold) {
      throw new NotFoundException('Legal hold not found');
    }

    return await DiscoveryRequest.create({
      holdId,
      requestedBy,
      searchQuery,
      description,
      status: DiscoveryRequestStatus.PENDING,
      requestDate: new Date(),
    });
  }

  /**
   * List active legal holds
   *
   * Retrieves all active holds with document counts
   * and expiration information.
   *
   * @param limit - Maximum results
   * @param offset - Pagination offset
   * @returns Promise with active holds
   */
  async listActiveLegalHolds(
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ count: number; records: LegalHoldDto[] }> {
    const { count, rows } = await LegalHoldModel.findAndCountAll({
      where: {
        status: { [Op.in]: [LegalHoldStatus.PENDING, LegalHoldStatus.ACTIVE] },
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      count,
      records: rows.map((r) => this.mapHoldToDto(r)),
    };
  }

  /**
   * Get holds for document
   *
   * Retrieves all holds associated with a specific
   * document to prevent deletion.
   *
   * @param documentId - Document identifier
   * @returns Promise with applicable holds
   */
  async getDocumentHolds(documentId: string): Promise<LegalHoldDto[]> {
    const associations = await HoldDocumentAssociation.findAll({
      where: { documentId },
    });

    const holdIds = associations.map((a) => a.holdId);

    const holds = await LegalHoldModel.findAll({
      where: {
        id: { [Op.in]: holdIds },
        status: { [Op.in]: [LegalHoldStatus.PENDING, LegalHoldStatus.ACTIVE] },
      },
    });

    return holds.map((h) => this.mapHoldToDto(h));
  }

  /**
   * Get legal hold statistics
   *
   * Returns aggregate statistics for legal holds including
   * active holds, custodians, and discovery requests.
   *
   * @returns Promise with hold statistics
   */
  async getLegalHoldStatistics(): Promise<{
    totalHolds: number;
    activeHolds: number;
    releasedHolds: number;
    totalDocumentsHeld: number;
    totalCustodians: number;
    pendingDiscoveryRequests: number;
  }> {
    const totalHolds = await LegalHoldModel.count();
    const activeHolds = await LegalHoldModel.count({
      where: { status: LegalHoldStatus.ACTIVE },
    });
    const releasedHolds = await LegalHoldModel.count({
      where: { status: LegalHoldStatus.RELEASED },
    });

    const totalDocuments = await HoldDocumentAssociation.count();
    const totalCustodians = await LegalCustodian.count();
    const pendingRequests = await DiscoveryRequest.count({
      where: { status: DiscoveryRequestStatus.PENDING },
    });

    return {
      totalHolds,
      activeHolds,
      releasedHolds,
      totalDocumentsHeld: totalDocuments,
      totalCustodians,
      pendingDiscoveryRequests: pendingRequests,
    };
  }

  /**
   * Map LegalHoldModel to DTO
   *
   * @private
   * @param hold - Legal hold model instance
   * @returns DTO representation
   */
  private mapHoldToDto(hold: LegalHoldModel): LegalHoldDto {
    return {
      id: hold.id,
      holdName: hold.holdName,
      holdType: hold.holdType,
      status: hold.status,
      documentCount: hold.documentCount,
      expirationDate: hold.expirationDate,
      createdAt: hold.createdAt,
    };
  }
}
