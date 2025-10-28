/**
 * LOC: C41E6D37EC-Q01
 * WC-SVC-STU-QUERY | Student Query Builder Module
 *
 * UPSTREAM (imports from):
 *   - models (database/models)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - search.ts (./search.ts)
 *   - crud.ts (./crud.ts)
 */

/**
 * WC-SVC-STU-QUERY | Student Query Builder Module
 * Purpose: Constructs complex database queries for student data retrieval
 * Upstream: database models, types | Dependencies: Sequelize
 * Downstream: Search, CRUD operations | Called by: Student service modules
 * Related: search.ts, crud.ts
 * Exports: StudentQueryBuilder class
 * Last Updated: 2025-10-19 | Dependencies: sequelize
 * Critical Path: Filter construction → Query execution → Result formatting
 * LLM Context: Optimized query building for HIPAA-compliant student data access
 */

import { Op } from 'sequelize';
import {
  EmergencyContact,
  User,
  Allergy,
  StudentMedication,
  Medication,
  MedicationLog,
  HealthRecord,
  ChronicCondition,
  Appointment,
  IncidentReport
} from '../../database/models';
import { StudentFilters } from './types';

/**
 * Student Query Builder
 * Constructs Sequelize queries based on filters and requirements
 */
export class StudentQueryBuilder {
  /**
   * Build where clause from filters
   * @param filters - Student filters
   * @returns Sequelize where clause
   */
  static buildWhereClause(filters: StudentFilters): any {
    const whereClause: any = {};

    // Search filter - searches across first name, last name, and student number
    if (filters.search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { studentNumber: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    // Grade filter
    if (filters.grade) {
      whereClause.grade = filters.grade;
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    // Nurse assignment filter
    if (filters.nurseId) {
      whereClause.nurseId = filters.nurseId;
    }

    // Gender filter
    if (filters.gender) {
      whereClause.gender = filters.gender;
    }

    return whereClause;
  }

  /**
   * Build include array for associations
   * @param filters - Student filters
   * @param includeAll - Include all associations (for detail view)
   * @returns Sequelize include array
   */
  static buildIncludeArray(filters: StudentFilters, includeAll: boolean = false): any[] {
    const includeArray: any[] = [
      {
        model: EmergencyContact,
        as: 'emergencyContacts',
        where: { isActive: true },
        required: false,
        order: [['priority', 'ASC']]
      },
      {
        model: User,
        as: 'nurse',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ];

    // Filter by allergies if requested
    if (filters.hasAllergies) {
      includeArray.push({
        model: Allergy,
        as: 'allergies',
        required: true,
        where: { active: true }
      });
    } else {
      includeArray.push({
        model: Allergy,
        as: 'allergies',
        required: false,
        where: { active: true }
      });
    }

    // Filter by medications if requested
    if (filters.hasMedications) {
      includeArray.push({
        model: StudentMedication,
        as: 'medications',
        required: true,
        where: { isActive: true },
        include: [
          {
            model: Medication,
            as: 'medication',
            attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
          }
        ]
      });
    } else {
      includeArray.push({
        model: StudentMedication,
        as: 'medications',
        required: false,
        where: { isActive: true },
        include: [
          {
            model: Medication,
            as: 'medication',
            attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
          }
        ]
      });
    }

    return includeArray;
  }

  /**
   * Build complete profile include array with all associations
   * Used for detailed student view
   * @returns Sequelize include array
   */
  static buildCompleteProfileInclude(): any[] {
    return [
      {
        model: EmergencyContact,
        as: 'emergencyContacts',
        where: { isActive: true },
        required: false
      },
      {
        model: StudentMedication,
        as: 'medications',
        separate: true,
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: MedicationLog,
            as: 'logs',
            separate: true,
            limit: 10,
            order: [['administeredAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'nurse',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        ]
      },
      {
        model: HealthRecord,
        as: 'healthRecords',
        separate: true,
        order: [['recordDate', 'DESC']],
        limit: 20
      },
      {
        model: Allergy,
        as: 'allergies',
        where: { active: true },
        required: false,
        separate: true,
        order: [['severity', 'DESC']]
      },
      {
        model: ChronicCondition,
        as: 'chronicConditions',
        required: false,
        separate: true,
        order: [['diagnosisDate', 'DESC']]
      },
      {
        model: Appointment,
        as: 'appointments',
        separate: true,
        order: [['scheduledAt', 'DESC']],
        limit: 10,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      },
      {
        model: IncidentReport,
        as: 'incidentReports',
        separate: true,
        order: [['occurredAt', 'DESC']],
        limit: 10,
        include: [
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      },
      {
        model: User,
        as: 'nurse',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ];
  }

  /**
   * Build basic associations include for list views
   * @returns Sequelize include array
   */
  static buildBasicInclude(): any[] {
    return [
      {
        model: EmergencyContact,
        as: 'emergencyContacts',
        where: { isActive: true },
        required: false
      },
      {
        model: Allergy,
        as: 'allergies',
        where: { active: true },
        required: false
      },
      {
        model: User,
        as: 'nurse',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ];
  }

  /**
   * Build nurse details include for after update/create
   * @returns Sequelize include array
   */
  static buildNurseDetailsInclude(): any[] {
    return [
      {
        model: User,
        as: 'nurse',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ];
  }

  /**
   * Build search query configuration
   * @param query - Search string
   * @param limit - Result limit
   * @returns Sequelize query options
   */
  static buildSearchQuery(query: string, limit: number = 20): any {
    return {
      where: {
        isActive: true,
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { studentNumber: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC']
      ],
      limit
    };
  }

  /**
   * Build grade query configuration
   * @param grade - Grade level
   * @returns Sequelize query options
   */
  static buildGradeQuery(grade: string): any {
    return {
      where: {
        grade,
        isActive: true
      },
      include: [
        {
          model: EmergencyContact,
          as: 'emergencyContacts',
          where: { isActive: true },
          required: false
        },
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC']
      ]
    };
  }

  /**
   * Build assigned students query configuration
   * @param userId - Nurse/User ID
   * @returns Sequelize query options
   */
  static buildAssignedStudentsQuery(userId: string): any {
    return {
      where: {
        isActive: true,
        nurseId: userId
      },
      attributes: ['id', 'studentNumber', 'firstName', 'lastName', 'grade', 'dateOfBirth', 'gender', 'photo'],
      order: [
        ['lastName', 'ASC'],
        ['firstName', 'ASC']
      ]
    };
  }
}
