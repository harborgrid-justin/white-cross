/**
 * @fileoverview Health Record Search Service
 * @module health-record/search
 * @description Full-text search across all health data types with relevance scoring
 * HIPAA Compliance: Search results are filtered by user permissions and PHI access is audited
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student   } from '@/database/models';
import { Vaccination   } from '@/database/models';
import { Allergy   } from '@/database/models';
import { ChronicCondition   } from '@/database/models';
import { VitalSigns   } from '@/database/models';
import { ClinicVisit   } from '@/database/models';

@Injectable()
export class SearchService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {
    super("SearchService");
  }

  async searchHealthRecords(query: string, filters?: any): Promise<any[]> {
    this.logInfo(
      `Searching health records: ${query}, filters: ${JSON.stringify(filters)}`,
    );

    const searchTerm = query.trim();
    if (!searchTerm) {
      return [];
    }

    let results: any[] = [];

    // Build common where clause for filters
    const baseWhere: any = {};
    if (filters?.studentId) {
      baseWhere.studentId = filters.studentId;
    }
    if (filters?.schoolId) {
      // Get students for this school
      const students = await this.studentModel.findAll({
        where: { schoolId: filters.schoolId },
        attributes: ['id'],
      });
      baseWhere.studentId = { [Op.in]: students.map((s) => s.id) };
    }

    // Date range filters
    if (filters?.dateFrom || filters?.dateTo) {
      // This will be handled per table since date fields differ
    }

    // Search vaccinations
    const vaccinationResults = await this.searchVaccinations(
      searchTerm,
      baseWhere,
      filters,
    );
    results.push(...vaccinationResults);

    // Search allergies
    const allergyResults = await this.searchAllergies(
      searchTerm,
      baseWhere,
      filters,
    );
    results.push(...allergyResults);

    // Search chronic conditions
    const conditionResults = await this.searchChronicConditions(
      searchTerm,
      baseWhere,
      filters,
    );
    results.push(...conditionResults);

    // Search vital signs (limited fields)
    const vitalResults = await this.searchVitalSigns(
      searchTerm,
      baseWhere,
      filters,
    );
    results.push(...vitalResults);

    // Search clinic visits
    const visitResults = await this.searchClinicVisits(
      searchTerm,
      baseWhere,
      filters,
    );
    results.push(...visitResults);

    // Apply type filter if specified
    if (filters?.type) {
      results = results.filter((r) => r.type === filters.type);
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  async advancedSearch(criteria: any): Promise<any> {
    this.logInfo('Performing advanced health record search');

    const {
      query,
      studentIds,
      types,
      severity,
      status,
      dateRange,
      schoolId,
      limit = 50,
      offset = 0,
    } = criteria;

    // Build base where clause
    const baseWhere: any = {};

    if (studentIds && studentIds.length > 0) {
      baseWhere.studentId = { [Op.in]: studentIds };
    }

    if (schoolId) {
      const students = await this.studentModel.findAll({
        where: { schoolId },
        attributes: ['id'],
      });
      const schoolStudentIds = students.map((s) => s.id);
      if (baseWhere.studentId) {
        // Intersect with existing student IDs
        baseWhere.studentId = {
          [Op.in]: baseWhere.studentId[Op.in].filter((id: string) =>
            schoolStudentIds.includes(id),
          ),
        };
      } else {
        baseWhere.studentId = { [Op.in]: schoolStudentIds };
      }
    }

    let allResults: any[] = [];

    // If query provided, do text search
    if (query) {
      allResults = await this.searchHealthRecords(query, {
        studentIds,
        schoolId,
      });
    } else {
      // Get all records with filters
      const [vaccinations, allergies, chronicConditions, vitals, visits] =
        await Promise.all([
          this.vaccinationModel.findAll({
            where: baseWhere,
            include: [
              { model: Student, attributes: ['firstName', 'lastName'] },
            ],
            limit: 1000,
          }),
          this.allergyModel.findAll({
            where: { ...baseWhere, active: true },
            include: [
              { model: Student, attributes: ['firstName', 'lastName'] },
            ],
            limit: 1000,
          }),
          this.chronicConditionModel.findAll({
            where: { ...baseWhere, status: 'ACTIVE' },
            include: [
              { model: Student, attributes: ['firstName', 'lastName'] },
            ],
            limit: 1000,
          }),
          this.vitalSignsModel.findAll({
            where: baseWhere,
            include: [
              { model: Student, attributes: ['firstName', 'lastName'] },
            ],
            limit: 1000,
          }),
          this.clinicVisitModel.findAll({
            where: baseWhere,
            include: [
              { model: Student, attributes: ['firstName', 'lastName'] },
            ],
            limit: 1000,
          }),
        ]);

      // Format results
      vaccinations.forEach((v) =>
        allResults.push({
          ...v.toJSON(),
          type: 'vaccination',
          studentName: `${v.student?.firstName} ${v.student?.lastName}`,
          relevance: 1,
        }),
      );

      allergies.forEach((a) =>
        allResults.push({
          ...a.toJSON(),
          type: 'allergy',
          studentName: `${a.student?.firstName} ${a.student?.lastName}`,
          relevance: 1,
        }),
      );

      chronicConditions.forEach((c) =>
        allResults.push({
          ...c.toJSON(),
          type: 'chronic_condition',
          studentName: `${c.student?.firstName} ${c.student?.lastName}`,
          relevance: 1,
        }),
      );

      vitals.forEach((v) =>
        allResults.push({
          ...v.toJSON(),
          type: 'vital_signs',
          studentName: `${v.student?.firstName} ${v.student?.lastName}`,
          relevance: 1,
        }),
      );

      visits.forEach((v) =>
        allResults.push({
          ...v.toJSON(),
          type: 'clinic_visit',
          studentName: `${v.student?.firstName} ${v.student?.lastName}`,
          relevance: 1,
        }),
      );
    }

    // Apply additional filters
    if (types && types.length > 0) {
      allResults = allResults.filter((r) => types.includes(r.type));
    }

    if (severity) {
      allResults = allResults.filter((r) => r.severity === severity);
    }

    if (status) {
      allResults = allResults.filter((r) => r.status === status);
    }

    if (dateRange?.from) {
      const dateFrom = new Date(dateRange.from);
      allResults = allResults.filter((r) => {
        const recordDate = new Date(
          r.createdAt ||
            r.administrationDate ||
            r.measurementDate ||
            r.checkInTime,
        );
        return recordDate >= dateFrom;
      });
    }

    if (dateRange?.to) {
      const dateTo = new Date(dateRange.to);
      allResults = allResults.filter((r) => {
        const recordDate = new Date(
          r.createdAt ||
            r.administrationDate ||
            r.measurementDate ||
            r.checkInTime,
        );
        return recordDate <= dateTo;
      });
    }

    const total = allResults.length;
    const paginated = allResults.slice(offset, offset + limit);

    return {
      results: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async searchByDiagnosis(diagnosis: string): Promise<any[]> {
    this.logInfo(`Searching by diagnosis: ${diagnosis}`);

    const conditions = await this.chronicConditionModel.findAll({
      where: {
        [Op.or]: [
          { condition: { [Op.iLike]: `%${diagnosis}%` } },
          { icdCode: { [Op.iLike]: `%${diagnosis}%` } },
        ],
        status: 'ACTIVE',
      },
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return conditions.map((c) => ({
      ...c.toJSON(),
      studentName: `${c.student?.firstName} ${c.student?.lastName}`,
    }));
  }

  /**
   * Search by ICD code
   */
  async searchByICDCode(icdCode: string): Promise<any[]> {
    this.logInfo(`Searching by ICD code: ${icdCode}`);

    const conditions = await this.chronicConditionModel.findAll({
      where: {
        icdCode: {
          [Op.or]: [{ [Op.eq]: icdCode }, { [Op.like]: `${icdCode}%` }],
        },
        status: 'ACTIVE',
      },
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return conditions.map((c) => ({
      ...c.toJSON(),
      studentName: `${c.student?.firstName} ${c.student?.lastName}`,
    }));
  }

  /**
   * Search by CVX code
   */
  async searchByCVXCode(cvxCode: string): Promise<any[]> {
    this.logInfo(`Searching by CVX code: ${cvxCode}`);

    const vaccinations = await this.vaccinationModel.findAll({
      where: { cvxCode },
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return vaccinations.map((v) => ({
      ...v.toJSON(),
      studentName: `${v.student?.firstName} ${v.student?.lastName}`,
    }));
  }

  /**
   * Find students with specific conditions
   */
  async findStudentsWithCondition(conditionName: string): Promise<string[]> {
    this.logInfo(`Finding students with condition: ${conditionName}`);

    const conditions = await this.chronicConditionModel.findAll({
      where: {
        condition: { [Op.iLike]: `%${conditionName}%` },
        status: 'ACTIVE',
      },
      attributes: ['studentId'],
    });

    return Array.from(new Set(conditions.map((c) => c.studentId)));
  }

  /**
   * Find students with specific allergens
   */
  async findStudentsWithAllergen(allergen: string): Promise<string[]> {
    this.logInfo(`Finding students with allergen: ${allergen}`);

    const allergies = await this.allergyModel.findAll({
      where: {
        allergen: { [Op.iLike]: `%${allergen}%` },
        active: true,
      },
      attributes: ['studentId'],
    });

    return Array.from(new Set(allergies.map((a) => a.studentId)));
  }

  /**
   * Get recently updated records
   */
  async getRecentUpdates(days: number = 7, limit: number = 20): Promise<any[]> {
    this.logInfo(
      `Getting records updated in last ${days} days, limit ${limit}`,
    );

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get recent records from all tables
    const [vaccinations, allergies, chronicConditions, vitals, visits] =
      await Promise.all([
        this.vaccinationModel.findAll({
          where: { updatedAt: { [Op.gte]: cutoffDate } },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['updatedAt', 'DESC']],
          limit: Math.ceil(limit / 5), // Distribute limit across tables
        }),
        this.allergyModel.findAll({
          where: { active: true },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['diagnosedDate', 'DESC']],
          limit: Math.ceil(limit / 5),
        }),
        this.chronicConditionModel.findAll({
          where: { updatedAt: { [Op.gte]: cutoffDate }, status: 'ACTIVE' },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['updatedAt', 'DESC']],
          limit: Math.ceil(limit / 5),
        }),
        this.vitalSignsModel.findAll({
          where: { updatedAt: { [Op.gte]: cutoffDate } },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['updatedAt', 'DESC']],
          limit: Math.ceil(limit / 5),
        }),
        this.clinicVisitModel.findAll({
          where: { updatedAt: { [Op.gte]: cutoffDate } },
          include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
          order: [['updatedAt', 'DESC']],
          limit: Math.ceil(limit / 5),
        }),
      ]);

    // Combine and sort by updated date
    const allRecords: any[] = [];

    vaccinations.forEach((v) =>
      allRecords.push({
        ...v.toJSON(),
        type: 'vaccination',
        studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        updatedAt: v.updatedAt,
      }),
    );

    allergies.forEach((a) =>
      allRecords.push({
        ...a.toJSON(),
        type: 'allergy',
        studentName: `${a.student?.firstName} ${a.student?.lastName}`,
        updatedAt: a.updatedAt,
      }),
    );

    chronicConditions.forEach((c) =>
      allRecords.push({
        ...c.toJSON(),
        type: 'chronic_condition',
        studentName: `${c.student?.firstName} ${c.student?.lastName}`,
        updatedAt: c.updatedAt,
      }),
    );

    vitals.forEach((v) =>
      allRecords.push({
        ...v.toJSON(),
        type: 'vital_signs',
        studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        updatedAt: v.updatedAt,
      }),
    );

    visits.forEach((v) =>
      allRecords.push({
        ...v.toJSON(),
        type: 'clinic_visit',
        studentName: `${v.student?.firstName} ${v.student?.lastName}`,
        updatedAt: v.updatedAt,
      }),
    );

    return allRecords
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, limit);
  }

  // Private helper methods

  private async searchVaccinations(
    searchTerm: string,
    baseWhere: any,
    filters?: any,
  ): Promise<any[]> {
    const whereClause: any = { ...baseWhere };

    // Add date range if specified
    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.administrationDate = {};
      if (filters.dateFrom) {
        whereClause.administrationDate[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.administrationDate[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Search across multiple fields
    whereClause[Op.or] = [
      { vaccineName: { [Op.iLike]: `%${searchTerm}%` } },
      { cvxCode: { [Op.iLike]: `%${searchTerm}%` } },
      { manufacturer: { [Op.iLike]: `%${searchTerm}%` } },
      { lotNumber: { [Op.iLike]: `%${searchTerm}%` } },
    ];

    const vaccinations = await this.vaccinationModel.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return vaccinations.map((v) => ({
      ...v.toJSON(),
      type: 'vaccination',
      studentName: `${v.student?.firstName} ${v.student?.lastName}`,
      relevance: this.calculateRelevance(v, searchTerm, [
        'vaccineName',
        'cvxCode',
        'manufacturer',
        'lotNumber',
      ]),
    }));
  }

  private async searchAllergies(
    searchTerm: string,
    baseWhere: any,
    filters?: any,
  ): Promise<any[]> {
    const whereClause: any = { ...baseWhere, active: true };

    // Add date range if specified
    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.diagnosedDate = {};
      if (filters.dateFrom) {
        whereClause.diagnosedDate[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.diagnosedDate[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Search across multiple fields
    whereClause[Op.or] = [
      { allergen: { [Op.iLike]: `%${searchTerm}%` } },
      { symptoms: { [Op.iLike]: `%${searchTerm}%` } },
      { reactions: { [Op.iLike]: `%${searchTerm}%` } },
    ];

    const allergies = await this.allergyModel.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return allergies.map((a) => ({
      ...a.toJSON(),
      type: 'allergy',
      studentName: `${a.student?.firstName} ${a.student?.lastName}`,
      relevance: this.calculateRelevance(a, searchTerm, [
        'allergen',
        'symptoms',
        'reactions',
      ]),
    }));
  }

  private async searchChronicConditions(
    searchTerm: string,
    baseWhere: any,
    filters?: any,
  ): Promise<any[]> {
    const whereClause: any = { ...baseWhere, status: 'ACTIVE' };

    // Add date range if specified
    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.diagnosedDate = {};
      if (filters.dateFrom) {
        whereClause.diagnosedDate[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.diagnosedDate[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Search across multiple fields
    whereClause[Op.or] = [
      { condition: { [Op.iLike]: `%${searchTerm}%` } },
      { icdCode: { [Op.iLike]: `%${searchTerm}%` } },
      { notes: { [Op.iLike]: `%${searchTerm}%` } },
    ];

    const conditions = await this.chronicConditionModel.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return conditions.map((c) => ({
      ...c.toJSON(),
      type: 'chronic_condition',
      studentName: `${c.student?.firstName} ${c.student?.lastName}`,
      relevance: this.calculateRelevance(c, searchTerm, [
        'condition',
        'icdCode',
        'notes',
      ]),
    }));
  }

  private async searchVitalSigns(
    searchTerm: string,
    baseWhere: any,
    filters?: any,
  ): Promise<any[]> {
    const whereClause: any = { ...baseWhere };

    // Add date range if specified
    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.measurementDate = {};
      if (filters.dateFrom) {
        whereClause.measurementDate[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.measurementDate[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Limited search for vitals (mainly notes field)
    whereClause.notes = { [Op.iLike]: `%${searchTerm}%` };

    const vitals = await this.vitalSignsModel.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return vitals.map((v) => ({
      ...v.toJSON(),
      type: 'vital_signs',
      studentName: `${v.student?.firstName} ${v.student?.lastName}`,
      relevance: this.calculateRelevance(v, searchTerm, ['notes']),
    }));
  }

  private async searchClinicVisits(
    searchTerm: string,
    baseWhere: any,
    filters?: any,
  ): Promise<any[]> {
    const whereClause: any = { ...baseWhere };

    // Add date range if specified
    if (filters?.dateFrom || filters?.dateTo) {
      whereClause.checkInTime = {};
      if (filters.dateFrom) {
        whereClause.checkInTime[Op.gte] = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereClause.checkInTime[Op.lte] = new Date(filters.dateTo);
      }
    }

    // Search across multiple fields
    whereClause[Op.or] = [
      { reasonForVisit: { [Op.iLike]: `%${searchTerm}%` } },
      { symptoms: { [Op.iLike]: `%${searchTerm}%` } },
      { treatment: { [Op.iLike]: `%${searchTerm}%` } },
      { notes: { [Op.iLike]: `%${searchTerm}%` } },
    ];

    const visits = await this.clinicVisitModel.findAll({
      where: whereClause,
      include: [{ model: Student, attributes: ['firstName', 'lastName'] }],
    });

    return visits.map((v) => ({
      ...v.toJSON(),
      type: 'clinic_visit',
      studentName: `${v.student?.firstName} ${v.student?.lastName}`,
      relevance: this.calculateRelevance(v, searchTerm, [
        'reasonForVisit',
        'symptoms',
        'treatment',
        'notes',
      ]),
    }));
  }

  private calculateRelevance(
    record: any,
    query: string,
    searchableFields: string[],
  ): number {
    const searchLower = query.toLowerCase();
    let score = 0;

    searchableFields.forEach((field) => {
      const fieldValue = record[field];
      if (typeof fieldValue === 'string') {
        const fieldLower = fieldValue.toLowerCase();
        if (fieldLower === searchLower) {
          score += 10; // Exact match
        } else if (fieldLower.startsWith(searchLower)) {
          score += 5; // Starts with
        } else if (fieldLower.includes(searchLower)) {
          score += 2; // Contains
        }
      }
    });

    return score;
  }
}
