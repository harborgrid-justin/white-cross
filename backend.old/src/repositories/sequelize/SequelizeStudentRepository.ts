/**
 * Sequelize Student Repository Implementation
 * @description Concrete implementation of IStudentRepository using Sequelize ORM
 */

import { Op, fn, col, literal } from 'sequelize';
import {
  IStudentRepository,
  Student as StudentEntity,
  StudentFilters,
  StudentQueryOptions,
  GradeStatistics,
  CreateStudentData,
  UpdateStudentData
} from '../interfaces/IStudentRepository';
import { RepositoryOptions } from '../interfaces/IRepository';
import { Student, EmergencyContact, HealthRecord, StudentMedication, User } from '../../database/models';

export class SequelizeStudentRepository implements IStudentRepository {
  async findById(id: string, options?: RepositoryOptions): Promise<StudentEntity | null> {
    const student = await Student.findByPk(id, {
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return student ? this.toEntity(student) : null;
  }

  async findAll(filters?: StudentFilters, options?: RepositoryOptions): Promise<StudentEntity[]> {
    const where = this.buildWhereClause(filters);
    const students = await Student.findAll({
      where,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['lastName', 'ASC'], ['firstName', 'ASC']],
      transaction: options?.transaction
    });
    return students.map(s => this.toEntity(s));
  }

  async findOne(filters: any, options?: RepositoryOptions): Promise<StudentEntity | null> {
    const student = await Student.findOne({
      where: filters,
      include: options?.include,
      attributes: options?.attributes,
      transaction: options?.transaction
    });
    return student ? this.toEntity(student) : null;
  }

  async create(data: CreateStudentData, options?: RepositoryOptions): Promise<StudentEntity> {
    const student = await Student.create(data as any, {
      transaction: options?.transaction
    });
    return this.toEntity(student);
  }

  async update(id: string, data: UpdateStudentData, options?: RepositoryOptions): Promise<StudentEntity> {
    const student = await Student.findByPk(id, { transaction: options?.transaction });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    await student.update(data as any, { transaction: options?.transaction });
    return this.toEntity(student);
  }

  async delete(id: string, options?: RepositoryOptions): Promise<void> {
    const student = await Student.findByPk(id, { transaction: options?.transaction });
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    await student.update({ isActive: false } as any, { transaction: options?.transaction });
  }

  async count(filters?: StudentFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return await Student.count({ where });
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: StudentFilters,
    options?: RepositoryOptions
  ): Promise<{ rows: StudentEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const { rows, count } = await Student.findAndCountAll({
      where,
      limit,
      offset,
      include: options?.include,
      attributes: options?.attributes,
      order: options?.order || [['lastName', 'ASC'], ['firstName', 'ASC']],
      transaction: options?.transaction
    });
    return { rows: rows.map(s => this.toEntity(s)), count };
  }

  async findByStudentNumber(studentNumber: string): Promise<StudentEntity | null> {
    const student = await Student.findOne({ where: { studentNumber } });
    return student ? this.toEntity(student) : null;
  }

  async findByNurse(nurseId: string, options?: StudentQueryOptions): Promise<StudentEntity[]> {
    const queryOptions = this.buildQueryOptions({ nurseId: nurseId }, options);
    const students = await Student.findAll(queryOptions);
    return students.map(s => this.toEntity(s));
  }

  async findByGrade(grade: string, options?: StudentQueryOptions): Promise<StudentEntity[]> {
    const queryOptions = this.buildQueryOptions({ grade }, options);
    const students = await Student.findAll(queryOptions);
    return students.map(s => this.toEntity(s));
  }

  async searchByName(query: string, limit: number = 20): Promise<StudentEntity[]> {
    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          literal(`CONCAT(firstName, ' ', lastName) LIKE '%${query}%'`)
        ],
        isActive: true
      },
      limit,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });
    return students.map(s => this.toEntity(s));
  }

  async findByEnrollmentStatus(
    status: StudentEntity['enrollmentStatus'],
    options?: StudentQueryOptions
  ): Promise<StudentEntity[]> {
    const queryOptions = this.buildQueryOptions({ enrollmentStatus: status }, options);
    const students = await Student.findAll(queryOptions);
    return students.map(s => this.toEntity(s));
  }

  async findBySchool(schoolId: string, options?: StudentQueryOptions): Promise<StudentEntity[]> {
    const queryOptions = this.buildQueryOptions({ schoolId }, options);
    const students = await Student.findAll(queryOptions);
    return students.map(s => this.toEntity(s));
  }

  async studentNumberExists(studentNumber: string, excludeId?: string): Promise<boolean> {
    const where: any = { studentNumber };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await Student.count({ where });
    return count > 0;
  }

  async findWithHealthInfo(id: string): Promise<StudentEntity | null> {
    const student = await Student.findByPk(id, {
      include: [
        { model: HealthRecord, as: 'healthRecords' },
        { model: EmergencyContact, as: 'emergencyContacts' }
      ]
    });
    return student ? this.toEntity(student) : null;
  }

  async findWithEmergencyContacts(id: string): Promise<StudentEntity | null> {
    const student = await Student.findByPk(id, {
      include: [{ model: EmergencyContact, as: 'emergencyContacts' }]
    });
    return student ? this.toEntity(student) : null;
  }

  async findWithMedications(id: string): Promise<StudentEntity | null> {
    const student = await Student.findByPk(id, {
      include: [{ model: StudentMedication, as: 'medications' }]
    });
    return student ? this.toEntity(student) : null;
  }

  async findUpcomingBirthdays(daysAhead: number): Promise<StudentEntity[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    // Get month and day for comparison
    const startMonth = today.getMonth() + 1;
    const startDay = today.getDate();
    const endMonth = futureDate.getMonth() + 1;
    const endDay = futureDate.getDate();

    const students = await Student.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          literal(`MONTH(dateOfBirth) = ${startMonth} AND DAY(dateOfBirth) >= ${startDay}`),
          literal(`MONTH(dateOfBirth) = ${endMonth} AND DAY(dateOfBirth) <= ${endDay}`)
        ]
      },
      order: [[literal('MONTH(dateOfBirth)'), 'ASC'], [literal('DAY(dateOfBirth)'), 'ASC']]
    });

    return students.map(s => this.toEntity(s));
  }

  async getStatisticsByGrade(): Promise<GradeStatistics[]> {
    const results = await Student.findAll({
      attributes: [
        'grade',
        [fn('COUNT', col('id')), 'totalStudents'],
        [fn('SUM', literal('CASE WHEN isActive = 1 THEN 1 ELSE 0 END')), 'activeStudents'],
        [fn('AVG', literal('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE())')), 'averageAge']
      ],
      group: ['grade'],
      order: [['grade', 'ASC']],
      raw: true
    });

    return results.map((r: any) => ({
      grade: r.grade,
      totalStudents: parseInt(r.totalStudents),
      activeStudents: parseInt(r.activeStudents),
      averageAge: parseFloat(r.averageAge)
    }));
  }

  async getCountByNurse(): Promise<Record<string, number>> {
    const results = await Student.findAll({
      attributes: [
        'nurseId',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        isActive: true,
        nurseId: { [Op.not]: null }
      },
      group: ['nurseId'],
      raw: true
    });

    const counts: Record<string, number> = {};
    results.forEach((r: any) => {
      counts[r.nurseId] = parseInt(r.count);
    });
    return counts;
  }

  async findRequiringMedication(date: Date = new Date()): Promise<StudentEntity[]> {
    const students = await Student.findAll({
      include: [
        {
          model: StudentMedication,
          as: 'medications',
          required: true,
          where: {
            isActive: true,
            startDate: { [Op.lte]: date },
            [Op.or]: [
              { endDate: null },
              { endDate: { [Op.gte]: date } }
            ]
          }
        }
      ],
      where: { isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    return students.map(s => this.toEntity(s));
  }

  private buildWhereClause(filters?: StudentFilters): any {
    const where: any = {};
    if (!filters) return where;

    if (filters.grade) {
      where.grade = Array.isArray(filters.grade) ? { [Op.in]: filters.grade } : filters.grade;
    }
    if (filters.enrollmentStatus) {
      where.enrollmentStatus = Array.isArray(filters.enrollmentStatus)
        ? { [Op.in]: filters.enrollmentStatus }
        : filters.enrollmentStatus;
    }
    if (filters.assignedNurseId) where.nurseId = filters.assignedNurseId;
    if (filters.schoolId) where.schoolId = filters.schoolId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.gender) where.gender = filters.gender;
    if (filters.bloodType) where.bloodType = filters.bloodType;

    return where;
  }

  private buildQueryOptions(filters: any, options?: StudentQueryOptions): any {
    const queryOptions: any = {
      where: filters,
      order: [[options?.orderBy || 'lastName', options?.orderDirection || 'ASC']]
    };

    const include: any[] = [];
    if (options?.includeHealthRecords) {
      include.push({ model: HealthRecord, as: 'healthRecords' });
    }
    if (options?.includeEmergencyContacts) {
      include.push({ model: EmergencyContact, as: 'emergencyContacts' });
    }
    if (options?.includeMedications) {
      include.push({ model: StudentMedication, as: 'medications' });
    }
    if (options?.includeNurse) {
      include.push({ model: User, as: 'assignedNurse' });
    }
    if (include.length > 0) {
      queryOptions.include = include;
    }

    if (options?.limit) {
      queryOptions.limit = options.limit;
    }
    if (options?.page && options?.limit) {
      queryOptions.offset = (options.page - 1) * options.limit;
    }

    return queryOptions;
  }

  private toEntity(model: any): StudentEntity {
    const plain = model.get({ plain: true });
    return {
      id: plain.id,
      studentNumber: plain.studentNumber,
      firstName: plain.firstName,
      lastName: plain.lastName,
      middleName: plain.middleName,
      preferredName: plain.preferredName,
      dateOfBirth: plain.dateOfBirth,
      grade: plain.grade,
      gender: plain.gender,
      bloodType: plain.bloodType,
      assignedNurseId: plain.nurseId,
      schoolId: plain.schoolId,
      enrollmentStatus: plain.enrollmentStatus,
      enrollmentDate: plain.enrollmentDate,
      photoUrl: plain.photoUrl,
      notes: plain.notes,
      isActive: plain.isActive,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt
    };
  }
}
