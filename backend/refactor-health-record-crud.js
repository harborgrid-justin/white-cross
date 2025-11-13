#!/usr/bin/env node

/**
 * Refactor HealthRecordCrudService to use BaseService pagination methods
 * This demonstrates how to refactor one service as an example
 */

const fs = require('fs');

// Read the file
const filePath = './src/health-record/services/health-record-crud.service.ts';
console.log(`Refactoring ${filePath}...`);

let content = fs.readFileSync(filePath, 'utf8');

// Refactor getStudentHealthRecords method
const oldGetStudentHealthRecords = `
  /**
   * Get paginated health records for a student with filtering
   * @param studentId - Student UUID
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records with metadata
   */
  async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const offset = (page - 1) * limit;

    const whereClause: any = { studentId };

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = {};
      if (filters.dateFrom) {
        whereClause.recordDate[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        whereClause.recordDate[Op.lte] = filters.dateTo;
      }
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: \`%\${filters.provider}%\` };
    }

    // Execute query with pagination
    const { rows: records, count: total } =
      await this.healthRecordModel.findAndCountAll({
        where: whereClause,
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
        limit,
        offset,
      });

    // PHI Access Audit Log
    this.logInfo(
      \`PHI Access: Health records retrieved for student \${studentId}, count: \${records.length}\`,
    );

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }`;

const newGetStudentHealthRecords = `
  /**
   * Get paginated health records for a student with filtering
   * @param studentId - Student UUID
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records with metadata
   */
  async getStudentHealthRecords(
    studentId: string,
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const whereClause: any = { studentId };

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: \`%\${filters.provider}%\` };
    }

    // Execute query with pagination using BaseService method
    const result = await this.createPaginatedQuery(this.healthRecordModel, {
      page,
      limit,
      where: whereClause,
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(
      \`PHI Access: Health records retrieved for student \${studentId}, count: \${result.data.length}\`,
    );

    return {
      records: result.data,
      pagination: result.pagination,
    };
  }`;

// Replace the method
content = content.replace(oldGetStudentHealthRecords, newGetStudentHealthRecords);

// Refactor getAllHealthRecords method
const oldGetAllHealthRecords = `
  /**
   * Get all health records with optional filtering and pagination
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records across all students
   */
  async getAllHealthRecords(
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
      studentId?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = {};
      if (filters.dateFrom) {
        whereClause.recordDate[Op.gte] = filters.dateFrom;
      }
      if (filters.dateTo) {
        whereClause.recordDate[Op.lte] = filters.dateTo;
      }
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: \`%\${filters.provider}%\` };
    }

    // Execute query with pagination
    const { rows: records, count: total } =
      await this.healthRecordModel.findAndCountAll({
        where: whereClause,
        include: [{ model: this.studentModel, as: 'student' }],
        order: [['recordDate', 'DESC']],
        limit,
        offset,
      });

    // PHI Access Audit Log
    this.logInfo(
      \`PHI Access: All health records retrieved, count: \${records.length}, filters: \${JSON.stringify(filters)}\`,
    );

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }`;

const newGetAllHealthRecords = `
  /**
   * Get all health records with optional filtering and pagination
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 20)
   * @param filters - Optional filtering criteria
   * @returns Paginated health records across all students
   */
  async getAllHealthRecords(
    page: number = 1,
    limit: number = 20,
    filters: {
      type?: string;
      dateFrom?: Date;
      dateTo?: Date;
      provider?: string;
      studentId?: string;
    } = {},
  ): Promise<PaginatedHealthRecords<HealthRecord>> {
    const whereClause: any = {};

    // Apply filters
    if (filters.type) {
      whereClause.recordType = filters.type;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.dateFrom || filters.dateTo) {
      whereClause.recordDate = this.buildDateRangeClause('recordDate', filters.dateFrom, filters.dateTo);
    }
    if (filters.provider) {
      whereClause.provider = { [Op.iLike]: \`%\${filters.provider}%\` };
    }

    // Execute query with pagination using BaseService method
    const result = await this.createPaginatedQuery(this.healthRecordModel, {
      page,
      limit,
      where: whereClause,
      include: [{ model: this.studentModel, as: 'student' }],
      order: [['recordDate', 'DESC']],
    });

    // PHI Access Audit Log
    this.logInfo(
      \`PHI Access: All health records retrieved, count: \${result.data.length}, filters: \${JSON.stringify(filters)}\`,
    );

    return {
      records: result.data,
      pagination: result.pagination,
    };
  }`;

// Replace the method
content = content.replace(oldGetAllHealthRecords, newGetAllHealthRecords);

// Write the updated file
fs.writeFileSync(filePath, content);

console.log('✅ Successfully refactored HealthRecordCrudService pagination methods!');
console.log('🔧 Changes made:');
console.log('  - Replaced manual offset calculation with BaseService.createPaginatedQuery()');
console.log('  - Used BaseService.buildDateRangeClause() for date filtering');
console.log('  - Simplified pagination response handling');
