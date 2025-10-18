/**
 * WC-GEN-248 | documentService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  Document,
  DocumentSignature,
  DocumentAuditTrail,
  Student,
  User,
  sequelize
} from '../database/models';
import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentAction
} from '../database/types/enums';
import {
  validateDocumentCreation,
  validateDocumentUpdate,
  validateDocumentCanBeSigned,
  validateDocumentCanBeDeleted,
  validateSignatureData,
  validateSharePermissions,
  validateVersionCreation,
  validateFileUpload,
  calculateDefaultRetentionDate,
  throwIfValidationErrors,
  DocumentValidationError,
  RETENTION_YEARS,
} from '../utils/documentValidation';

// Type augmentation for Document model associations
declare module '../database/models' {
  interface Document {
    versions?: Document[];
    parent?: Document;
    signatures?: DocumentSignature[];
    auditTrail?: DocumentAuditTrail[];
  }
}

/**
 * Interface for creating a new document
 */
export interface CreateDocumentData {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  studentId?: string;
  tags?: string[];
  isTemplate?: boolean;
  templateData?: any;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Interface for updating an existing document
 */
export interface UpdateDocumentData {
  title?: string;
  description?: string;
  status?: DocumentStatus;
  tags?: string[];
  retentionDate?: Date;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Interface for document filters
 */
export interface DocumentFilters {
  category?: DocumentCategory;
  status?: DocumentStatus;
  studentId?: string;
  uploadedBy?: string;
  searchTerm?: string;
  tags?: string[];
}

/**
 * Interface for document signature data
 */
export interface SignDocumentData {
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Interface for creating document from template
 */
export interface CreateFromTemplateData {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: any;
}

/**
 * Document Service
 * Handles all document management operations including creation, versioning,
 * signatures, and audit trail with full HIPAA compliance
 */
export class DocumentService {
  /**
   * Get all documents with pagination and filters
   * @param page - Page number (1-indexed)
   * @param limit - Number of documents per page
   * @param filters - Optional filters for documents
   */
  static async getDocuments(
    page: number = 1,
    limit: number = 20,
    filters: DocumentFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Apply filters
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }
      if (filters.uploadedBy) {
        whereClause.uploadedBy = filters.uploadedBy;
      }
      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { description: { [Op.iLike]: `%${filters.searchTerm}%` } },
          { fileName: { [Op.iLike]: `%${filters.searchTerm}%` } }
        ];
      }
      if (filters.tags && filters.tags.length > 0) {
        whereClause.tags = { [Op.overlap]: filters.tags };
      }

      const { rows: documents, count: total } = await Document.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Document,
            as: 'versions',
            limit: 5,
            separate: true,
            order: [['version', 'DESC']]
          },
          {
            model: DocumentSignature,
            as: 'signatures'
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      logger.info(`Retrieved ${documents.length} documents`);

      return {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting documents:', error);
      throw new Error('Failed to retrieve documents');
    }
  }

  /**
   * Get document by ID with all associations
   * @param id - Document ID
   */
  static async getDocumentById(id: string) {
    try {
      const document = await Document.findByPk(id, {
        include: [
          {
            model: Document,
            as: 'parent'
          },
          {
            model: Document,
            as: 'versions',
            separate: true,
            order: [['version', 'DESC']]
          },
          {
            model: DocumentSignature,
            as: 'signatures',
            separate: true,
            order: [['signedAt', 'DESC']]
          },
          {
            model: DocumentAuditTrail,
            as: 'auditTrail',
            limit: 50,
            separate: true,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!document) {
        throw new Error('Document not found');
      }

      logger.info(`Retrieved document: ${id}`);
      return document;
    } catch (error) {
      logger.error(`Error getting document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new document
   * @param data - Document creation data
   */
  static async createDocument(data: CreateDocumentData) {
    const transaction = await sequelize.transaction();

    try {
      // Validate document creation data
      const validationErrors = validateDocumentCreation({
        title: data.title,
        description: data.description,
        category: data.category,
        fileType: data.fileType,
        fileName: data.fileName,
        fileSize: data.fileSize,
        tags: data.tags,
        accessLevel: data.accessLevel,
      });

      throwIfValidationErrors(validationErrors);

      // Verify student exists if studentId is provided
      if (data.studentId) {
        const student = await Student.findByPk(data.studentId);
        if (!student) {
          throw new Error('Student not found');
        }
      }

      // Calculate default retention date based on category
      const defaultRetentionDate = calculateDefaultRetentionDate(data.category as DocumentCategory);

      // Create the document
      const document = await Document.create({
        title: data.title.trim(),
        description: data.description?.trim(),
        category: data.category,
        fileType: data.fileType.toLowerCase().trim(),
        fileName: data.fileName.trim(),
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
        uploadedBy: data.uploadedBy,
        studentId: data.studentId,
        tags: data.tags?.map(tag => tag.trim()) || [],
        isTemplate: data.isTemplate || false,
        templateData: data.templateData,
        status: DocumentStatus.DRAFT,
        version: 1,
        accessLevel: data.accessLevel || DocumentAccessLevel.STAFF_ONLY,
        retentionDate: defaultRetentionDate,
      }, { transaction });

      // Create audit trail entry
      await this.addAuditTrail(
        document.id,
        DocumentAction.CREATED,
        data.uploadedBy,
        undefined,
        transaction
      );

      await transaction.commit();

      // Reload with associations
      await document.reload({
        include: [
          {
            model: DocumentSignature,
            as: 'signatures'
          }
        ]
      });

      logger.info(`Created document: ${document.id} - ${document.title}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Update an existing document
   * @param id - Document ID
   * @param data - Update data
   * @param updatedBy - User ID performing the update
   */
  static async updateDocument(id: string, data: UpdateDocumentData, updatedBy: string) {
    const transaction = await sequelize.transaction();

    try {
      const document = await Document.findByPk(id);

      if (!document) {
        throw new Error('Document not found');
      }

      // Validate update data
      const validationErrors = validateDocumentUpdate(
        document.status,
        {
          title: data.title,
          description: data.description,
          status: data.status,
          tags: data.tags,
          retentionDate: data.retentionDate,
          accessLevel: data.accessLevel,
        },
        document.category
      );

      throwIfValidationErrors(validationErrors);

      // Build update data with sanitization
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.description !== undefined) updateData.description = data.description?.trim();
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tags !== undefined) updateData.tags = data.tags.map(tag => tag.trim());
      if (data.retentionDate !== undefined) updateData.retentionDate = data.retentionDate;
      if (data.accessLevel !== undefined) updateData.accessLevel = data.accessLevel;

      // Update the document
      await document.update(updateData, { transaction });

      // Create audit trail entry with changes
      await this.addAuditTrail(
        id,
        DocumentAction.UPDATED,
        updatedBy,
        data,
        transaction
      );

      await transaction.commit();

      // Reload with associations
      await document.reload({
        include: [
          {
            model: DocumentSignature,
            as: 'signatures'
          },
          {
            model: Document,
            as: 'versions'
          }
        ]
      });

      logger.info(`Updated document: ${id}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error updating document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   * @param id - Document ID
   * @param deletedBy - User ID performing the deletion
   */
  static async deleteDocument(id: string, deletedBy: string) {
    const transaction = await sequelize.transaction();

    try {
      const document = await Document.findByPk(id);

      if (!document) {
        throw new Error('Document not found');
      }

      // Validate if document can be deleted
      const deletionError = validateDocumentCanBeDeleted(document.status, document.category);
      if (deletionError) {
        throw new DocumentValidationError([deletionError]);
      }

      // Create audit trail entry before deletion
      await this.addAuditTrail(
        id,
        DocumentAction.DELETED,
        deletedBy,
        undefined,
        transaction
      );

      // Delete the document (cascade will handle signatures and audit trail)
      await document.destroy({ transaction });

      await transaction.commit();

      logger.info(`Deleted document: ${id}`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new version of an existing document
   * @param parentId - Parent document ID
   * @param data - Document data for new version
   */
  static async createDocumentVersion(
    parentId: string,
    data: CreateDocumentData
  ) {
    const transaction = await sequelize.transaction();

    try {
      const parent = await Document.findByPk(parentId, {
        include: [
          {
            model: Document,
            as: 'versions'
          }
        ],
        transaction
      });

      if (!parent) {
        throw new Error('Parent document not found');
      }

      // Validate if new version can be created
      const versionCount = parent.versions?.length || 0;
      const versionError = validateVersionCreation(parent.status, versionCount);
      if (versionError) {
        throw new DocumentValidationError([versionError]);
      }

      // Validate file upload for new version
      const fileErrors = validateFileUpload(data.fileName, data.fileType, data.fileSize);
      throwIfValidationErrors(fileErrors);

      const newVersion = parent.version + 1;

      // Create new document version
      const document = await Document.create({
        title: data.title || parent.title,
        description: data.description || parent.description,
        category: parent.category,
        fileType: data.fileType,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
        uploadedBy: data.uploadedBy,
        studentId: parent.studentId,
        tags: data.tags || parent.tags,
        isTemplate: parent.isTemplate,
        templateData: data.templateData || parent.templateData,
        status: DocumentStatus.DRAFT,
        version: newVersion,
        accessLevel: parent.accessLevel,
        parentId: parentId
      }, { transaction });

      // Create audit trail entry
      await this.addAuditTrail(
        document.id,
        DocumentAction.CREATED,
        data.uploadedBy,
        { version: newVersion, parentId },
        transaction
      );

      await transaction.commit();

      logger.info(`Created document version ${newVersion}: ${document.id}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating document version:', error);
      throw error;
    }
  }

  /**
   * Sign a document
   * @param data - Signature data
   */
  static async signDocument(data: SignDocumentData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify document exists
      const document = await Document.findByPk(data.documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Validate if document can be signed
      const signableError = validateDocumentCanBeSigned(
        document.status,
        document.retentionDate?.toISOString()
      );
      if (signableError) {
        throw new DocumentValidationError([signableError]);
      }

      // Validate signature data
      const signatureErrors = validateSignatureData(
        data.signedBy,
        data.signedByRole,
        data.signatureData
      );
      throwIfValidationErrors(signatureErrors);

      // Create signature
      const signature = await DocumentSignature.create({
        documentId: data.documentId,
        signedBy: data.signedBy,
        signedByRole: data.signedByRole.trim(),
        signatureData: data.signatureData,
        ipAddress: data.ipAddress
      }, { transaction });

      // Update document status to APPROVED
      await document.update(
        { status: DocumentStatus.APPROVED },
        { transaction }
      );

      // Create audit trail entry
      await this.addAuditTrail(
        data.documentId,
        DocumentAction.SIGNED,
        data.signedBy,
        { signedByRole: data.signedByRole },
        transaction
      );

      await transaction.commit();

      logger.info(`Document signed: ${data.documentId} by ${data.signedBy}`);
      return signature;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error signing document:', error);
      throw error;
    }
  }

  /**
   * Share a document with specified users
   * @param documentId - Document ID
   * @param sharedBy - User ID sharing the document
   * @param sharedWith - Array of user IDs to share with
   */
  static async shareDocument(documentId: string, sharedBy: string, sharedWith: string[]) {
    try {
      // Validate share permissions
      const shareErrors = validateSharePermissions(sharedWith);
      throwIfValidationErrors(shareErrors);

      // Verify document exists
      const document = await Document.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Validate document is not archived or expired
      if (document.status === DocumentStatus.ARCHIVED || document.status === DocumentStatus.EXPIRED) {
        throw new DocumentValidationError([{
          field: 'status',
          message: `Cannot share ${document.status.toLowerCase()} documents`,
          code: 'DOCUMENT_NOT_SHAREABLE',
          value: document.status,
        }]);
      }

      // Create audit trail entry
      await this.addAuditTrail(
        documentId,
        DocumentAction.SHARED,
        sharedBy,
        { sharedWith }
      );

      logger.info(`Document shared: ${documentId} with ${sharedWith.length} users`);
      return { success: true, sharedWith };
    } catch (error) {
      logger.error('Error sharing document:', error);
      throw error;
    }
  }

  /**
   * Download a document (tracks access)
   * @param documentId - Document ID
   * @param downloadedBy - User ID downloading the document
   * @param ipAddress - Optional IP address of the downloader
   */
  static async downloadDocument(documentId: string, downloadedBy: string, ipAddress?: string) {
    const transaction = await sequelize.transaction();

    try {
      const document = await Document.findByPk(documentId, { transaction });

      if (!document) {
        throw new Error('Document not found');
      }

      // Update access tracking for HIPAA compliance
      await document.update(
        {
          lastAccessedAt: new Date(),
          accessCount: document.accessCount + 1,
        },
        { transaction }
      );

      // Create audit trail entry with PHI flag
      await this.addAuditTrail(
        documentId,
        DocumentAction.DOWNLOADED,
        downloadedBy,
        { ipAddress, containsPHI: document.containsPHI },
        transaction
      );

      await transaction.commit();

      // Reload with associations
      await document.reload({
        include: [
          {
            model: Document,
            as: 'parent'
          },
          {
            model: Document,
            as: 'versions',
            separate: true,
            order: [['version', 'DESC']]
          },
          {
            model: DocumentSignature,
            as: 'signatures',
            separate: true,
            order: [['signedAt', 'DESC']]
          },
          {
            model: DocumentAuditTrail,
            as: 'auditTrail',
            limit: 50,
            separate: true,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      logger.info(`Document downloaded: ${documentId} by ${downloadedBy}${document.containsPHI ? ' [PHI]' : ''}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error downloading document:', error);
      throw error;
    }
  }

  /**
   * View a document (tracks access)
   * @param documentId - Document ID
   * @param viewedBy - User ID viewing the document
   * @param ipAddress - Optional IP address of the viewer
   */
  static async viewDocument(documentId: string, viewedBy: string, ipAddress?: string) {
    const transaction = await sequelize.transaction();

    try {
      const document = await Document.findByPk(documentId, { transaction });

      if (!document) {
        throw new Error('Document not found');
      }

      // Update access tracking for HIPAA compliance
      await document.update(
        {
          lastAccessedAt: new Date(),
          accessCount: document.accessCount + 1,
        },
        { transaction }
      );

      // Create audit trail entry
      await this.addAuditTrail(
        documentId,
        DocumentAction.VIEWED,
        viewedBy,
        { ipAddress, containsPHI: document.containsPHI },
        transaction
      );

      await transaction.commit();

      // Reload with associations
      await document.reload({
        include: [
          {
            model: Document,
            as: 'parent'
          },
          {
            model: Document,
            as: 'versions',
            separate: true,
            order: [['version', 'DESC']]
          },
          {
            model: DocumentSignature,
            as: 'signatures',
            separate: true,
            order: [['signedAt', 'DESC']]
          },
          {
            model: DocumentAuditTrail,
            as: 'auditTrail',
            limit: 50,
            separate: true,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      logger.info(`Document viewed: ${documentId} by ${viewedBy}${document.containsPHI ? ' [PHI]' : ''}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error viewing document:', error);
      throw error;
    }
  }

  /**
   * Get all document templates
   * @param category - Optional category filter
   */
  static async getTemplates(category?: DocumentCategory) {
    try {
      const whereClause: any = { isTemplate: true };

      if (category) {
        whereClause.category = category as any;
      }

      const templates = await Document.findAll({
        where: whereClause,
        order: [['title', 'ASC']]
      });

      logger.info(`Retrieved ${templates.length} document templates`);
      return templates;
    } catch (error) {
      logger.error('Error getting document templates:', error);
      throw error;
    }
  }

  /**
   * Create a document from a template
   * @param templateId - Template document ID
   * @param data - Data for new document
   */
  static async createFromTemplate(
    templateId: string,
    data: CreateFromTemplateData
  ) {
    const transaction = await sequelize.transaction();

    try {
      const template = await Document.findByPk(templateId);

      if (!template || !template.isTemplate) {
        throw new Error('Template not found');
      }

      // Merge template data with provided data
      const mergedTemplateData = data.templateData
        ? { ...(template.templateData || {}), ...data.templateData }
        : template.templateData;

      // Create document from template
      const document = await Document.create({
        title: data.title,
        description: template.description,
        category: template.category,
        fileType: template.fileType,
        fileName: `${data.title}.${template.fileType}`,
        fileSize: 0, // Will be updated when file is generated
        fileUrl: '', // Will be updated when file is generated
        uploadedBy: data.uploadedBy,
        studentId: data.studentId,
        tags: template.tags,
        isTemplate: false,
        templateData: mergedTemplateData,
        status: DocumentStatus.DRAFT,
        version: 1,
        accessLevel: template.accessLevel
      }, { transaction });

      // Create audit trail entry
      await this.addAuditTrail(
        document.id,
        DocumentAction.CREATED,
        data.uploadedBy,
        { fromTemplate: templateId },
        transaction
      );

      await transaction.commit();

      logger.info(`Created document from template: ${document.id}`);
      return document;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating document from template:', error);
      throw error;
    }
  }

  /**
   * Get all documents for a specific student
   * @param studentId - Student ID
   */
  static async getStudentDocuments(studentId: string) {
    try {
      // Verify student exists
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const documents = await Document.findAll({
        where: { studentId },
        include: [
          {
            model: DocumentSignature,
            as: 'signatures'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      logger.info(`Retrieved ${documents.length} documents for student ${studentId}`);
      return documents;
    } catch (error) {
      logger.error(`Error getting documents for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Search documents across all fields
   * @param query - Search query string
   * @param filters - Optional additional filters
   */
  static async searchDocuments(query: string, filters: Partial<DocumentFilters> = {}) {
    try {
      const whereClause: any = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { fileName: { [Op.iLike]: `%${query}%` } }
        ]
      };

      // Apply additional filters
      if (filters.category) {
        whereClause.category = filters.category;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }
      if (filters.uploadedBy) {
        whereClause.uploadedBy = filters.uploadedBy;
      }

      const documents = await Document.findAll({
        where: whereClause,
        include: [
          {
            model: DocumentSignature,
            as: 'signatures'
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      logger.info(`Found ${documents.length} documents matching query: ${query}`);
      return documents;
    } catch (error) {
      logger.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Get documents expiring within specified days
   * @param days - Number of days to look ahead
   */
  static async getExpiringDocuments(days: number = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const documents = await Document.findAll({
        where: {
          retentionDate: {
            [Op.lte]: futureDate,
            [Op.gte]: new Date()
          },
          status: { [Op.ne]: DocumentStatus.ARCHIVED }
        },
        order: [['retentionDate', 'ASC']]
      });

      logger.info(`Retrieved ${documents.length} documents expiring within ${days} days`);
      return documents;
    } catch (error) {
      logger.error('Error getting expiring documents:', error);
      throw error;
    }
  }

  /**
   * Archive all expired documents
   */
  static async archiveExpiredDocuments() {
    try {
      const [affectedCount] = await Document.update(
        { status: DocumentStatus.ARCHIVED },
        {
          where: {
            retentionDate: { [Op.lte]: new Date() },
            status: { [Op.ne]: DocumentStatus.ARCHIVED }
          }
        }
      );

      logger.info(`Archived ${affectedCount} expired documents`);
      return { archived: affectedCount };
    } catch (error) {
      logger.error('Error archiving expired documents:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive document statistics
   */
  static async getDocumentStatistics() {
    try {
      const [
        totalDocuments,
        byCategory,
        byStatus,
        totalSize,
        recentDocuments
      ] = await Promise.all([
        Document.count(),
        Document.findAll({
          attributes: [
            'category',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['category'],
          raw: true
        }),
        Document.findAll({
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        Document.sum('fileSize'),
        Document.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        })
      ]);

      const statistics = {
        total: totalDocuments,
        byCategory: (byCategory as any[]).map(c => ({
          category: c.category,
          count: parseInt(c.count, 10)
        })),
        byStatus: (byStatus as any[]).map(s => ({
          status: s.status,
          count: parseInt(s.count, 10)
        })),
        totalSize: totalSize || 0,
        recentDocuments
      };

      logger.info('Retrieved document statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting document statistics:', error);
      throw error;
    }
  }

  /**
   * Add audit trail entry for document operations
   * @param documentId - Document ID
   * @param action - Action performed
   * @param performedBy - User ID performing the action
   * @param changes - Optional changes data
   * @param transaction - Optional transaction
   */
  private static async addAuditTrail(
    documentId: string,
    action: DocumentAction,
    performedBy: string,
    changes?: any,
    transaction?: any
  ) {
    try {
      await DocumentAuditTrail.create({
        documentId,
        action,
        performedBy,
        changes
      }, { transaction });
    } catch (error) {
      logger.error('Error adding audit trail:', error);
      // Don't throw error - audit trail failures shouldn't stop operations
    }
  }

  /**
   * Get all document categories with metadata
   */
  static async getDocumentCategories() {
    try {
      // Get category counts from database
      const categoryCounts = await Document.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      // Standard document categories for healthcare
      const standardCategories = [
        {
          value: DocumentCategory.MEDICAL_RECORD,
          label: 'Medical Record',
          description: 'Patient medical records and health history',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: DocumentCategory.CONSENT_FORM,
          label: 'Consent Form',
          description: 'Parental consent and authorization forms',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: DocumentCategory.POLICY,
          label: 'Policy Document',
          description: 'Health office policies and procedures',
          requiresSignature: false,
          retentionYears: 5
        },
        {
          value: DocumentCategory.INCIDENT_REPORT,
          label: 'Incident Report',
          description: 'Incident and accident reports',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: DocumentCategory.TRAINING,
          label: 'Training Materials',
          description: 'Staff training and certification documents',
          requiresSignature: false,
          retentionYears: 5
        },
        {
          value: DocumentCategory.ADMINISTRATIVE,
          label: 'Administrative',
          description: 'Administrative and operational documents',
          requiresSignature: false,
          retentionYears: 3
        },
        {
          value: DocumentCategory.STUDENT_FILE,
          label: 'Student File',
          description: 'General student file documents',
          requiresSignature: false,
          retentionYears: 7
        },
        {
          value: DocumentCategory.INSURANCE,
          label: 'Insurance',
          description: 'Insurance and coverage documents',
          requiresSignature: false,
          retentionYears: 7
        },
        {
          value: DocumentCategory.OTHER,
          label: 'Other',
          description: 'Other documents not fitting standard categories',
          requiresSignature: false,
          retentionYears: 3
        }
      ];

      // Add document counts to standard categories
      const categoriesWithCounts = standardCategories.map(category => {
        const countData = (categoryCounts as any[]).find(c => c.category === category.value);
        const count = countData ? parseInt(countData.count, 10) : 0;
        return {
          ...category,
          documentCount: count
        };
      });

      logger.info('Retrieved document categories');
      return categoriesWithCounts;
    } catch (error) {
      logger.error('Error getting document categories:', error);
      throw error;
    }
  }

  /**
   * Bulk delete documents by IDs
   * @param documentIds - Array of document IDs to delete
   * @param deletedBy - User ID performing the deletion
   */
  static async bulkDeleteDocuments(documentIds: string[], deletedBy: string) {
    const transaction = await sequelize.transaction();

    try {
      if (!documentIds || documentIds.length === 0) {
        throw new Error('No document IDs provided');
      }

      // Get documents to be deleted for logging
      const documentsToDelete = await Document.findAll({
        where: {
          id: { [Op.in]: documentIds }
        },
        transaction
      });

      // Create audit trail entries for each document
      for (const doc of documentsToDelete) {
        await this.addAuditTrail(
          doc.id,
          DocumentAction.DELETED,
          deletedBy,
          { bulkDelete: true },
          transaction
        );
      }

      // Delete the documents
      const deletedCount = await Document.destroy({
        where: {
          id: { [Op.in]: documentIds }
        },
        transaction
      });

      await transaction.commit();

      const notFoundCount = documentIds.length - deletedCount;

      logger.info(`Bulk delete completed: ${deletedCount} documents deleted, ${notFoundCount} not found`);

      return {
        deleted: deletedCount,
        notFound: notFoundCount,
        success: true
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in bulk delete operation:', error);
      throw error;
    }
  }

  /**
   * Get audit trail for a specific document
   * @param documentId - Document ID
   * @param limit - Maximum number of entries to retrieve
   */
  static async getDocumentAuditTrail(documentId: string, limit: number = 100) {
    try {
      const document = await Document.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const auditTrail = await DocumentAuditTrail.findAll({
        where: { documentId },
        order: [['createdAt', 'DESC']],
        limit
      });

      logger.info(`Retrieved ${auditTrail.length} audit trail entries for document ${documentId}`);
      return auditTrail;
    } catch (error) {
      logger.error(`Error getting audit trail for document ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Get all signatures for a specific document
   * @param documentId - Document ID
   */
  static async getDocumentSignatures(documentId: string) {
    try {
      const document = await Document.findByPk(documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      const signatures = await DocumentSignature.findAll({
        where: { documentId },
        order: [['signedAt', 'DESC']]
      });

      logger.info(`Retrieved ${signatures.length} signatures for document ${documentId}`);
      return signatures;
    } catch (error) {
      logger.error(`Error getting signatures for document ${documentId}:`, error);
      throw error;
    }
  }
}
