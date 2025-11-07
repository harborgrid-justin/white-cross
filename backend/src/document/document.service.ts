import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document, DocumentAuditTrail, DocumentSignature } from '@/document/entities';
import { CreateDocumentDto, SignDocumentDto, UpdateDocumentDto } from './dto';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

/**
 * Document Service - Main orchestrator for all document operations
 * Implements HIPAA-compliant document management with comprehensive audit trails
 */
@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
    @InjectModel(DocumentSignature)
    private signatureModel: typeof DocumentSignature,
    @InjectModel(DocumentAuditTrail)
    private auditModel: typeof DocumentAuditTrail,
    private sequelize: Sequelize,
  ) {}

  /**
   * Get all documents with pagination and filters
   */
  async getDocuments(page: number = 1, limit: number = 20, filters: any = {}) {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (filters.category) whereClause.category = filters.category;
    if (filters.status) whereClause.status = filters.status;
    if (filters.studentId) whereClause.studentId = filters.studentId;
    if (filters.uploadedBy) whereClause.uploadedBy = filters.uploadedBy;

    if (filters.searchTerm) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
        { fileName: { [Op.iLike]: `%${filters.searchTerm}%` } },
      ];
    }

    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = { [Op.overlap]: filters.tags };
    }

    const { rows: documents, count: total } =
      await this.documentModel.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          { model: Document, as: 'versions', limit: 5, separate: true },
          { model: DocumentSignature, as: 'signatures' },
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

    return {
      documents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get document by ID with all associations
   */
  async getDocumentById(id: string) {
    const document = await this.documentModel.findByPk(id, {
      include: [
        { model: Document, as: 'parent' },
        { model: Document, as: 'versions' },
        { model: DocumentSignature, as: 'signatures' },
        { model: DocumentAuditTrail, as: 'auditTrail', limit: 50 },
      ],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  /**
   * Create a new document with validation and audit trail
   */
  async createDocument(createDto: CreateDocumentDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const document = await this.documentModel.create(
        {
          ...createDto,
          title: createDto.title.trim(),
          description: createDto.description?.trim(),
          fileType: createDto.fileType.toLowerCase().trim(),
          fileName: createDto.fileName.trim(),
          tags: createDto.tags?.map((tag) => tag.trim()) || [],
          isTemplate: createDto.isTemplate || false,
          status: 'DRAFT',
          version: 1,
          accessLevel: createDto.accessLevel || 'STAFF_ONLY',
          accessCount: 0,
        },
        { transaction },
      );

      await this.addAuditTrail(
        document.id,
        'CREATED',
        createDto.uploadedBy,
        undefined,
        transaction,
      );

      await transaction.commit();

      return this.getDocumentById(document.id);
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - never expose PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to create document. Please try again.');
    }
  }

  /**
   * Update an existing document
   */
  async updateDocument(
    id: string,
    updateDto: UpdateDocumentDto,
    updatedBy: string,
  ) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const document = await this.documentModel.findByPk(id);
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      const updateData: any = {};
      if (updateDto.title) updateData.title = updateDto.title.trim();
      if (updateDto.description !== undefined)
        updateData.description = updateDto.description?.trim();
      if (updateDto.status) updateData.status = updateDto.status;
      if (updateDto.tags)
        updateData.tags = updateDto.tags.map((tag) => tag.trim());
      if (updateDto.retentionDate)
        updateData.retentionDate = updateDto.retentionDate;
      if (updateDto.accessLevel) updateData.accessLevel = updateDto.accessLevel;

      await document.update(updateData, { transaction });

      await this.addAuditTrail(
        id,
        'UPDATED',
        updatedBy,
        updateDto,
        transaction,
      );

      await transaction.commit();

      return this.getDocumentById(id);
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - never expose PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to update document. Please try again.');
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string, deletedBy: string) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const document = await this.documentModel.findByPk(id);
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      await this.addAuditTrail(
        id,
        'DELETED',
        deletedBy,
        undefined,
        transaction,
      );
      await document.destroy({ transaction });
      await transaction.commit();

      return { success: true };
    } catch (error) {
      await transaction.rollback();
      // HIPAA-compliant error handling - never expose PHI
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Failed to delete document. Please try again.');
    }
  }

  /**
   * Sign a document
   */
  async signDocument(signDto: SignDocumentDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      const document = await this.documentModel.findByPk(signDto.documentId);
      if (!document) {
        throw new NotFoundException(
          `Document with ID ${signDto.documentId} not found`,
        );
      }

      const signature = await this.signatureModel.create(
        {
          documentId: signDto.documentId,
          signedBy: signDto.signedBy,
          signedByRole: signDto.signedByRole.trim(),
          signatureData: signDto.signatureData,
          ipAddress: signDto.ipAddress,
        },
        { transaction },
      );

      await document.update({ status: 'APPROVED' }, { transaction });

      await this.addAuditTrail(
        signDto.documentId,
        'SIGNED',
        signDto.signedBy,
        { signedByRole: signDto.signedByRole },
        transaction,
      );

      await transaction.commit();

      return signature;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Download a document (tracks access)
   */
  async downloadDocument(
    documentId: string,
    downloadedBy: string,
    ipAddress?: string,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const document = await this.documentModel.findByPk(documentId, {
        transaction,
      });
      if (!document) {
        throw new NotFoundException(`Document with ID ${documentId} not found`);
      }

      await document.update(
        {
          lastAccessedAt: new Date(),
          accessCount: document.accessCount + 1,
        },
        { transaction },
      );

      await this.addAuditTrail(
        documentId,
        'DOWNLOADED',
        downloadedBy,
        { ipAddress, containsPHI: document.containsPHI },
        transaction,
      );

      await transaction.commit();

      return this.getDocumentById(documentId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Helper: Add audit trail entry
   */
  private async addAuditTrail(
    documentId: string,
    action: string,
    performedBy: string,
    changes?: any,
    transaction?: any,
  ) {
    try {
      await this.auditModel.create(
        {
          documentId,
          action,
          performedBy,
          changes,
        },
        { transaction },
      );
    } catch (error) {
      // Audit trail failures shouldn't stop operations
      console.error('Error adding audit trail:', error);
    }
  }
}
