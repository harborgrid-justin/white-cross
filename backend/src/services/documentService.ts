import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateDocumentData {
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  studentId?: string;
  tags?: string[];
  isTemplate?: boolean;
  templateData?: Prisma.InputJsonValue;
  accessLevel?: string;
}

export interface UpdateDocumentData {
  title?: string;
  description?: string;
  status?: string;
  tags?: string[];
  retentionDate?: Date;
  accessLevel?: string;
}

export class DocumentService {
  /**
   * Get all documents with pagination and filters
   */
  static async getDocuments(
    page: number = 1,
    limit: number = 20,
    filters: {
      category?: string;
      status?: string;
      studentId?: string;
      uploadedBy?: string;
      searchTerm?: string;
      tags?: string[];
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.DocumentWhereInput = {};

      if (filters.category) {
        where.category = filters.category as any;
      }
      if (filters.status) {
        where.status = filters.status as any;
      }
      if (filters.studentId) {
        where.studentId = filters.studentId;
      }
      if (filters.uploadedBy) {
        where.uploadedBy = filters.uploadedBy;
      }
      if (filters.searchTerm) {
        where.OR = [
          { title: { contains: filters.searchTerm, mode: 'insensitive' } },
          { description: { contains: filters.searchTerm, mode: 'insensitive' } },
          { fileName: { contains: filters.searchTerm, mode: 'insensitive' } },
        ];
      }
      if (filters.tags && filters.tags.length > 0) {
        where.tags = { hasSome: filters.tags };
      }

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take: limit,
          include: {
            versions: {
              take: 5,
              orderBy: { version: 'desc' },
            },
            signatures: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.document.count({ where }),
      ]);

      logger.info(`Retrieved ${documents.length} documents`);

      return {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting documents:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string) {
    try {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          parent: true,
          versions: {
            orderBy: { version: 'desc' },
          },
          signatures: {
            orderBy: { signedAt: 'desc' },
          },
          auditTrail: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
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
   */
  static async createDocument(data: CreateDocumentData) {
    try {
      const document = await prisma.document.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category as any,
          fileType: data.fileType,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileUrl: data.fileUrl,
          uploadedBy: data.uploadedBy,
          studentId: data.studentId,
          tags: data.tags || [],
          isTemplate: data.isTemplate || false,
          templateData: data.templateData,
          status: 'DRAFT',
          version: 1,
          accessLevel: (data.accessLevel || 'STAFF_ONLY') as any,
        },
        include: {
          signatures: true,
        },
      });

      // Create audit trail entry
      await this.addAuditTrail(document.id, 'CREATED', data.uploadedBy);

      logger.info(`Created document: ${document.id}`);
      return document;
    } catch (error) {
      logger.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Update document
   */
  static async updateDocument(id: string, data: UpdateDocumentData, updatedBy: string) {
    try {
      const updateData: Prisma.DocumentUpdateInput = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.status) updateData.status = data.status as any;
      if (data.tags) updateData.tags = data.tags;
      if (data.retentionDate) updateData.retentionDate = data.retentionDate;
      if (data.accessLevel) updateData.accessLevel = data.accessLevel as any;

      const document = await prisma.document.update({
        where: { id },
        data: updateData,
        include: {
          signatures: true,
          versions: true,
        },
      });

      // Create audit trail entry
      await this.addAuditTrail(id, 'UPDATED', updatedBy, data as Prisma.InputJsonValue);

      logger.info(`Updated document: ${id}`);
      return document;
    } catch (error) {
      logger.error(`Error updating document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(id: string, deletedBy: string) {
    try {
      // Create audit trail entry before deletion
      await this.addAuditTrail(id, 'DELETED', deletedBy);

      await prisma.document.delete({
        where: { id },
      });

      logger.info(`Deleted document: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new version of document
   */
  static async createDocumentVersion(
    parentId: string,
    data: CreateDocumentData
  ) {
    try {
      const parent = await prisma.document.findUnique({
        where: { id: parentId },
        include: { versions: true },
      });

      if (!parent) {
        throw new Error('Parent document not found');
      }

      const newVersion = parent.version + 1;

      const document = await prisma.document.create({
        data: {
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
          templateData: data.templateData || parent.templateData || undefined,
          status: 'DRAFT',
          version: newVersion,
          accessLevel: parent.accessLevel,
          parentId: parentId,
        },
      });

      await this.addAuditTrail(document.id, 'CREATED', data.uploadedBy);

      logger.info(`Created document version ${newVersion}: ${document.id}`);
      return document;
    } catch (error) {
      logger.error(`Error creating document version:`, error);
      throw error;
    }
  }

  /**
   * Sign document
   */
  static async signDocument(data: {
    documentId: string;
    signedBy: string;
    signedByRole: string;
    signatureData?: string;
    ipAddress?: string;
  }) {
    try {
      const signature = await prisma.documentSignature.create({
        data: {
          documentId: data.documentId,
          signedBy: data.signedBy,
          signedByRole: data.signedByRole,
          signatureData: data.signatureData,
          ipAddress: data.ipAddress,
        },
      });

      // Update document status if needed
      await prisma.document.update({
        where: { id: data.documentId },
        data: { status: 'APPROVED' },
      });

      await this.addAuditTrail(data.documentId, 'SIGNED', data.signedBy);

      logger.info(`Document signed: ${data.documentId}`);
      return signature;
    } catch (error) {
      logger.error('Error signing document:', error);
      throw error;
    }
  }

  /**
   * Share document (track access)
   */
  static async shareDocument(documentId: string, sharedBy: string, sharedWith: string[]) {
    try {
      await this.addAuditTrail(documentId, 'SHARED', sharedBy, { sharedWith });

      logger.info(`Document shared: ${documentId}`);
      return { success: true, sharedWith };
    } catch (error) {
      logger.error('Error sharing document:', error);
      throw error;
    }
  }

  /**
   * Download document (track access)
   */
  static async downloadDocument(documentId: string, downloadedBy: string, _ipAddress?: string) {
    try {
      const document = await this.getDocumentById(documentId);

      await this.addAuditTrail(documentId, 'DOWNLOADED', downloadedBy);

      logger.info(`Document downloaded: ${documentId} by ${downloadedBy}`);
      return document;
    } catch (error) {
      logger.error('Error downloading document:', error);
      throw error;
    }
  }

  /**
   * View document (track access)
   */
  static async viewDocument(documentId: string, viewedBy: string, _ipAddress?: string) {
    try {
      const document = await this.getDocumentById(documentId);

      await this.addAuditTrail(documentId, 'VIEWED', viewedBy);

      logger.info(`Document viewed: ${documentId} by ${viewedBy}`);
      return document;
    } catch (error) {
      logger.error('Error viewing document:', error);
      throw error;
    }
  }

  /**
   * Get document templates
   */
  static async getTemplates(category?: string) {
    try {
      const where: Prisma.DocumentWhereInput = { isTemplate: true };
      
      if (category) {
        where.category = category as any;
      }

      const templates = await prisma.document.findMany({
        where,
        orderBy: { title: 'asc' },
      });

      logger.info(`Retrieved ${templates.length} document templates`);
      return templates;
    } catch (error) {
      logger.error('Error getting document templates:', error);
      throw error;
    }
  }

  /**
   * Create document from template
   */
  static async createFromTemplate(
    templateId: string,
    data: {
      title: string;
      uploadedBy: string;
      studentId?: string;
      templateData?: Prisma.InputJsonValue;
    }
  ) {
    try {
      const template = await prisma.document.findUnique({
        where: { id: templateId },
      });

      if (!template || !template.isTemplate) {
        throw new Error('Template not found');
      }

      // Merge template data with provided data
      const mergedTemplateData = data.templateData 
        ? { ...(template.templateData as object || {}), ...(data.templateData as object) }
        : template.templateData;

      const document = await prisma.document.create({
        data: {
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
          templateData: mergedTemplateData || undefined,
          status: 'DRAFT',
          version: 1,
          accessLevel: template.accessLevel,
        },
      });

      await this.addAuditTrail(document.id, 'CREATED', data.uploadedBy);

      logger.info(`Created document from template: ${document.id}`);
      return document;
    } catch (error) {
      logger.error('Error creating document from template:', error);
      throw error;
    }
  }

  /**
   * Get documents by student
   */
  static async getStudentDocuments(studentId: string) {
    try {
      const documents = await prisma.document.findMany({
        where: { studentId },
        include: {
          signatures: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      logger.info(`Retrieved ${documents.length} documents for student ${studentId}`);
      return documents;
    } catch (error) {
      logger.error(`Error getting documents for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Search documents
   */
  static async searchDocuments(query: string, filters: Record<string, string> = {}) {
    try {
      const where: Prisma.DocumentWhereInput = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { fileName: { contains: query, mode: 'insensitive' } },
        ],
        ...filters,
      };

      const documents = await prisma.document.findMany({
        where,
        include: {
          signatures: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      logger.info(`Found ${documents.length} documents matching query: ${query}`);
      return documents;
    } catch (error) {
      logger.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Get documents expiring soon
   */
  static async getExpiringDocuments(days: number = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const documents = await prisma.document.findMany({
        where: {
          retentionDate: {
            lte: futureDate,
            gte: new Date(),
          },
          status: { not: 'ARCHIVED' },
        },
        orderBy: { retentionDate: 'asc' },
      });

      logger.info(`Retrieved ${documents.length} documents expiring within ${days} days`);
      return documents;
    } catch (error) {
      logger.error('Error getting expiring documents:', error);
      throw error;
    }
  }

  /**
   * Archive expired documents
   */
  static async archiveExpiredDocuments() {
    try {
      const result = await prisma.document.updateMany({
        where: {
          retentionDate: { lte: new Date() },
          status: { not: 'ARCHIVED' },
        },
        data: { status: 'ARCHIVED' },
      });

      logger.info(`Archived ${result.count} expired documents`);
      return { archived: result.count };
    } catch (error) {
      logger.error('Error archiving expired documents:', error);
      throw error;
    }
  }

  /**
   * Get document statistics
   */
  static async getDocumentStatistics() {
    try {
      const [
        totalDocuments,
        byCategory,
        byStatus,
        totalSize,
        recentDocuments,
      ] = await Promise.all([
        prisma.document.count(),
        prisma.document.groupBy({
          by: ['category'],
          _count: { id: true },
        }),
        prisma.document.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        prisma.document.aggregate({
          _sum: { fileSize: true },
        }),
        prisma.document.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      const statistics = {
        total: totalDocuments,
        byCategory: byCategory.map(c => ({ category: c.category, count: c._count.id })),
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
        totalSize: totalSize._sum.fileSize || 0,
        recentDocuments,
      };

      logger.info('Retrieved document statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting document statistics:', error);
      throw error;
    }
  }

  /**
   * Add audit trail entry
   */
  private static async addAuditTrail(
    documentId: string,
    action: string,
    performedBy: string,
    changes?: Prisma.InputJsonValue
  ) {
    try {
      await prisma.documentAuditTrail.create({
        data: {
          documentId,
          action: action as any,
          performedBy,
          changes,
        },
      });
    } catch (error) {
      logger.error('Error adding audit trail:', error);
      // Don't throw error - audit trail failures shouldn't stop operations
    }
  }

  /**
   * Get document categories
   */
  static async getDocumentCategories() {
    try {
      // Get categories with document counts
      const categoryCounts = await prisma.document.groupBy({
        by: ['category'],
        _count: { id: true },
      });

      // Standard document categories for healthcare
      const standardCategories = [
        {
          value: 'MEDICAL_RECORD',
          label: 'Medical Record',
          description: 'Patient medical records and health history',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'CONSENT_FORM',
          label: 'Consent Form',
          description: 'Parental consent and authorization forms',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'IMMUNIZATION_RECORD',
          label: 'Immunization Record',
          description: 'Vaccination and immunization records',
          requiresSignature: false,
          retentionYears: 10
        },
        {
          value: 'MEDICATION_AUTHORIZATION',
          label: 'Medication Authorization',
          description: 'Medication administration authorization forms',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'EMERGENCY_CONTACT',
          label: 'Emergency Contact',
          description: 'Emergency contact information forms',
          requiresSignature: true,
          retentionYears: 3
        },
        {
          value: 'HEALTH_PLAN',
          label: 'Health Plan',
          description: 'Individualized health plans and care plans',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'INCIDENT_REPORT',
          label: 'Incident Report',
          description: 'Incident and accident reports',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'PHYSICIAN_ORDER',
          label: 'Physician Order',
          description: 'Healthcare provider orders and prescriptions',
          requiresSignature: true,
          retentionYears: 7
        },
        {
          value: 'LAB_RESULT',
          label: 'Lab Result',
          description: 'Laboratory and diagnostic test results',
          requiresSignature: false,
          retentionYears: 7
        },
        {
          value: 'POLICY_DOCUMENT',
          label: 'Policy Document',
          description: 'Health office policies and procedures',
          requiresSignature: false,
          retentionYears: 5
        },
        {
          value: 'COMMUNICATION',
          label: 'Communication',
          description: 'Parent and staff communications',
          requiresSignature: false,
          retentionYears: 3
        },
        {
          value: 'ADMINISTRATIVE',
          label: 'Administrative',
          description: 'Administrative and operational documents',
          requiresSignature: false,
          retentionYears: 3
        },
        {
          value: 'OTHER',
          label: 'Other',
          description: 'Other documents not fitting standard categories',
          requiresSignature: false,
          retentionYears: 3
        }
      ];

      // Add document counts to standard categories
      const categoriesWithCounts = standardCategories.map(category => {
        const count = categoryCounts.find(c => c.category === category.value)?._count.id || 0;
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
}
