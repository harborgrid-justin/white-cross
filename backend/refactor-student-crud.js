#!/usr/bin/env node

/**
 * Manual refactoring of StudentCrudService.findAll method
 * Demonstrates the pagination refactoring pattern
 */

const fs = require('fs');

// Read the file
const filePath = './src/student/services/student-crud.service.ts';
console.log(`Refactoring ${filePath}...`);

let content = fs.readFileSync(filePath, 'utf8');

// The old findAll method (from the file we just read)
const oldFindAll = `  /**
   * Find all students with pagination and filters
   */
  async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    try {
      const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;

      const where: any = {};

      // Apply filters
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: \`%\${search}%\` } },
          { lastName: { [Op.iLike]: \`%\${search}%\` } },
          { studentNumber: { [Op.iLike]: \`%\${search}%\` } },
        ];
      }

      if (grade) {
        where.grade = grade;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (nurseId) {
        where.nurseId = nurseId;
      }

      if (gender) {
        where.gender = gender;
      }

      // Pagination
      const offset = (page - 1) * limit;

      // Execute query with eager loading
      const { rows: data, count: total } = await this.studentModel.findAndCountAll({
        where,
        offset,
        limit,
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
        attributes: {
          exclude: ['schoolId', 'districtId'],
        },
        distinct: true,
      });

      return {
        data,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handleError('Failed to fetch students', error);
    }
  }`;

const newFindAll = `  /**
   * Find all students with pagination and filters
   */
  async findAll(filterDto: StudentFilterDto): Promise<PaginatedResponse<Student>> {
    try {
      const { page = 1, limit = 20, search, grade, isActive, nurseId, gender } = filterDto;

      const where: any = {};

      // Apply filters
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: \`%\${search}%\` } },
          { lastName: { [Op.iLike]: \`%\${search}%\` } },
          { studentNumber: { [Op.iLike]: \`%\${search}%\` } },
        ];
      }

      if (grade) {
        where.grade = grade;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (nurseId) {
        where.nurseId = nurseId;
      }

      if (gender) {
        where.gender = gender;
      }

      // Execute query with pagination using BaseService method
      const result = await this.createPaginatedQuery(this.studentModel, {
        page,
        limit,
        where,
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            required: false,
          },
        ],
        attributes: {
          exclude: ['schoolId', 'districtId'],
        },
        distinct: true,
      });

      return {
        data: result.data,
        meta: result.pagination,
      };
    } catch (error) {
      this.handleError('Failed to fetch students', error);
    }
  }`;

// Replace the method
content = content.replace(oldFindAll, newFindAll);

// Write the updated file
fs.writeFileSync(filePath, content);

console.log('✅ Successfully refactored StudentCrudService.findAll method!');
console.log('🔧 Changes made:');
console.log('  - Replaced manual offset calculation with BaseService.createPaginatedQuery()');
console.log('  - Simplified pagination response handling');
console.log('  - Removed manual Math.ceil calculation for total pages');
