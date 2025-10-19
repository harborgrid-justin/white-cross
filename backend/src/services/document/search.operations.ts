/**
 * LOC: D6A44FD802-SE
 * WC-GEN-255 | search.operations.ts - Document search and retrieval
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (document service aggregator)
 */

/**
 * WC-GEN-255 | search.operations.ts - Document search and retrieval
 * Purpose: Document search, filtering, and specialized retrieval operations
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model, Student model
 * Exports: Search functions | Key Services: Full-text search, filtering
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Query parsing → Database query → Result filtering
 * LLM Context: Enterprise search with complex filtering and performance optimization
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Document, DocumentSignature, Student, sequelize } from '../../database/models';
import { DocumentCategory, DocumentStatus } from '../../database/types/enums';
import { DocumentFilters } from './types';

/**
 * Search documents across all fields
 * @param query - Search query string
 * @param filters - Optional additional filters
 */
export async function searchDocuments(query: string, filters: Partial<DocumentFilters> = {}) {
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
 * Get all documents for a specific student
 * @param studentId - Student ID
 */
export async function getStudentDocuments(studentId: string) {
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
 * Get documents expiring within specified days
 * @param days - Number of days to look ahead
 */
export async function getExpiringDocuments(days: number = 30) {
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
export async function archiveExpiredDocuments() {
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
 * Get all document templates
 * @param category - Optional category filter
 */
export async function getTemplates(category?: DocumentCategory) {
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
