/**
 * LOC: D6A44FD802-A
 * WC-GEN-257 | analytics.operations.ts - Document analytics and statistics
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
 * WC-GEN-257 | analytics.operations.ts - Document analytics and statistics
 * Purpose: Document statistics, reporting, and category metadata
 * Upstream: ../utils/logger, ../database/models | Dependencies: sequelize
 * Downstream: Document service index | Called by: DocumentService class
 * Related: Document model
 * Exports: Analytics functions | Key Services: Statistics, reporting
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Data aggregation → Statistics calculation → Response formatting
 * LLM Context: Healthcare document analytics for compliance and operational insights
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Document, sequelize } from '../../database/models';
import { DocumentCategory } from '../../database/types/enums';
import { DocumentStatistics, DocumentCategoryMetadata } from './types';

/**
 * Get comprehensive document statistics
 */
export async function getDocumentStatistics(): Promise<DocumentStatistics> {
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

    const statistics: DocumentStatistics = {
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
 * Get all document categories with metadata
 */
export async function getDocumentCategories(): Promise<DocumentCategoryMetadata[]> {
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
    const standardCategories: DocumentCategoryMetadata[] = [
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
