/**
 * WC-GEN-266 | searchService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IncidentReport, Student, User, WitnessStatement } from '../../database/models';
import { IncidentFilters } from './types';

export class SearchService {
  /**
   * Search incident reports
   */
  static async searchIncidentReports(
    query: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {
        [Op.or]: [
          { description: { [Op.iLike]: `%${query}%` } },
          { location: { [Op.iLike]: `%${query}%` } },
          { actionsTaken: { [Op.iLike]: `%${query}%` } },
          { followUpNotes: { [Op.iLike]: `%${query}%` } }
        ]
      };

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } },
                { studentNumber: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${query}%` } },
                { lastName: { [Op.iLike]: `%${query}%` } }
              ]
            },
            required: false
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching incident reports:', error);
      throw error;
    }
  }

  /**
   * Advanced search with multiple filters
   */
  static async advancedSearch(
    filters: IncidentFilters,
    searchQuery?: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Apply filters
      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.reportedById) {
        whereClause.reportedById = filters.reportedById;
      }

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.severity) {
        whereClause.severity = filters.severity;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.occurredAt = {};
        if (filters.dateFrom) {
          whereClause.occurredAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.occurredAt[Op.lte] = filters.dateTo;
        }
      }

      if (filters.parentNotified !== undefined) {
        whereClause.parentNotified = filters.parentNotified;
      }

      if (filters.followUpRequired !== undefined) {
        whereClause.followUpRequired = filters.followUpRequired;
      }

      // Add text search if provided
      if (searchQuery) {
        whereClause[Op.and] = [
          ...(whereClause[Op.and] || []),
          {
            [Op.or]: [
              { description: { [Op.iLike]: `%${searchQuery}%` } },
              { location: { [Op.iLike]: `%${searchQuery}%` } },
              { actionsTaken: { [Op.iLike]: `%${searchQuery}%` } },
              { followUpNotes: { [Op.iLike]: `%${searchQuery}%` } }
            ]
          }
        ];
      }

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        appliedFilters: filters
      };
    } catch (error) {
      logger.error('Error performing advanced search:', error);
      throw error;
    }
  }

  /**
   * Search by student name or number
   */
  static async searchByStudent(
    studentQuery: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${studentQuery}%` } },
                { lastName: { [Op.iLike]: `%${studentQuery}%` } },
                { studentNumber: { [Op.iLike]: `%${studentQuery}%` } },
                {
                  [Op.and]: [
                    { firstName: { [Op.iLike]: `%${studentQuery.split(' ')[0]}%` } },
                    { lastName: { [Op.iLike]: `%${studentQuery.split(' ')[1] || ''}%` } }
                  ]
                }
              ]
            }
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching by student:', error);
      throw error;
    }
  }

  /**
   * Search by location
   */
  static async searchByLocation(
    locationQuery: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: {
          location: { [Op.iLike]: `%${locationQuery}%` }
        },
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching by location:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  static async getSearchSuggestions(query: string, limit: number = 10) {
    try {
      const suggestions = {
        students: [],
        locations: [],
        descriptions: []
      };

      // Get student suggestions
      const students = await Student.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            { studentNumber: { [Op.iLike]: `%${query}%` } }
          ]
        },
        attributes: ['id', 'firstName', 'lastName', 'studentNumber'],
        limit: limit / 2
      });

      suggestions.students = students.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        studentNumber: student.studentNumber
      }));

      // Get location suggestions
      const locations = await IncidentReport.findAll({
        where: {
          location: { [Op.iLike]: `%${query}%` }
        },
        attributes: ['location'],
        group: ['location'],
        limit: limit / 3,
        raw: true
      });

      suggestions.locations = locations.map(loc => loc.location);

      // Get description keywords
      const descriptions = await IncidentReport.findAll({
        where: {
          description: { [Op.iLike]: `%${query}%` }
        },
        attributes: ['description'],
        limit: limit / 3,
        raw: true
      });

      // Extract relevant keywords from descriptions
      suggestions.descriptions = descriptions
        .map(desc => {
          const words = desc.description.toLowerCase().split(' ');
          return words.filter(word => 
            word.includes(query.toLowerCase()) && 
            word.length > 3
          );
        })
        .flat()
        .filter((word, index, self) => self.indexOf(word) === index)
        .slice(0, limit / 3);

      return suggestions;
    } catch (error) {
      logger.error('Error getting search suggestions:', error);
      throw error;
    }
  }

  /**
   * Search incidents with evidence
   */
  static async searchIncidentsWithEvidence(
    query?: string,
    evidenceType?: 'photo' | 'video' | 'attachment',
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Filter by evidence type
      if (evidenceType === 'photo') {
        whereClause.evidencePhotos = { [Op.ne]: null };
      } else if (evidenceType === 'video') {
        whereClause.evidenceVideos = { [Op.ne]: null };
      } else if (evidenceType === 'attachment') {
        whereClause.attachments = { [Op.ne]: null };
      } else {
        // Any evidence
        whereClause[Op.or] = [
          { evidencePhotos: { [Op.ne]: null } },
          { evidenceVideos: { [Op.ne]: null } },
          { attachments: { [Op.ne]: null } }
        ];
      }

      // Add text search if provided
      if (query) {
        whereClause[Op.and] = [
          ...(whereClause[Op.and] || []),
          {
            [Op.or]: [
              { description: { [Op.iLike]: `%${query}%` } },
              { location: { [Op.iLike]: `%${query}%` } },
              { actionsTaken: { [Op.iLike]: `%${query}%` } }
            ]
          }
        ];
      }

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName', 'role']
          }
        ],
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports: reports.map(report => ({
          ...report.toJSON(),
          evidenceCount: (report.evidencePhotos || []).length + 
                        (report.evidenceVideos || []).length + 
                        (report.attachments || []).length
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching incidents with evidence:', error);
      throw error;
    }
  }

  /**
   * Full-text search across multiple fields
   */
  static async fullTextSearch(
    query: string,
    includeWitnesses: boolean = false,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const offset = (page - 1) * limit;
      const searchTerms = query.split(' ').filter(term => term.length > 2);

      const whereClause: any = {
        [Op.or]: searchTerms.map(term => ({
          [Op.or]: [
            { description: { [Op.iLike]: `%${term}%` } },
            { location: { [Op.iLike]: `%${term}%` } },
            { actionsTaken: { [Op.iLike]: `%${term}%` } },
            { followUpNotes: { [Op.iLike]: `%${term}%` } },
            { type: { [Op.iLike]: `%${term}%` } },
            { severity: { [Op.iLike]: `%${term}%` } }
          ]
        }))
      };

      const includeOptions: any[] = [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
        },
        {
          model: User,
          as: 'reportedBy',
          attributes: ['id', 'firstName', 'lastName', 'role']
        }
      ];

      if (includeWitnesses) {
        includeOptions.push({
          model: WitnessStatement,
          as: 'witnessStatements',
          attributes: ['id', 'witnessName', 'statement'],
          required: false
        });
      }

      const { rows: reports, count: total } = await IncidentReport.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: includeOptions,
        order: [['occurredAt', 'DESC']],
        distinct: true
      });

      return {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        searchTerms
      };
    } catch (error) {
      logger.error('Error performing full-text search:', error);
      throw error;
    }
  }
}
