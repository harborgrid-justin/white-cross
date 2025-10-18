/**
 * WC-GEN-189 | schoolOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * School Operations Module
 *
 * @module services/administration/schoolOperations
 */

import { logger } from '../../utils/logger';
import { District, School } from '../../database/models';
import { AuditAction } from '../../database/types/enums';
import { CreateSchoolData, UpdateSchoolData } from './types';
import { createAuditLog } from './auditOperations';

/**
 * Create a new school
 */
export async function createSchool(data: CreateSchoolData) {
  try {
    // Verify district exists and is active
    const district = await District.findByPk(data.districtId);

    if (!district) {
      throw new Error('District not found');
    }

    if (!district.isActive) {
      throw new Error('Cannot create school under an inactive district');
    }

    // Normalize and validate school code
    const normalizedCode = data.code.toUpperCase().trim();

    // Check for duplicate school code
    const existingSchool = await School.findOne({
      where: { code: normalizedCode }
    });

    if (existingSchool) {
      throw new Error(`School with code '${normalizedCode}' already exists`);
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email address format');
    }

    // Validate phone format if provided
    if (data.phone && !/^[\d\s\-\(\)\+\.]+$/.test(data.phone)) {
      throw new Error('Invalid phone number format');
    }

    // Validate ZIP code format if provided
    if (data.zipCode && !/^[0-9]{5}(-[0-9]{4})?$/.test(data.zipCode)) {
      throw new Error('ZIP code must be in format 12345 or 12345-6789');
    }

    // Validate state format if provided
    if (data.state && (data.state.length !== 2 || data.state !== data.state.toUpperCase())) {
      throw new Error('State must be a 2-letter uppercase abbreviation');
    }

    // Validate enrollment if provided
    if (data.totalEnrollment !== undefined) {
      if (data.totalEnrollment < 0) {
        throw new Error('Total enrollment cannot be negative');
      }
      if (data.totalEnrollment > 50000) {
        throw new Error('Total enrollment cannot exceed 50,000');
      }
    }

    const school = await School.create({
      ...data,
      code: normalizedCode
    });

    // Reload with associations
    await school.reload({
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    // Create audit log
    await createAuditLog(
      AuditAction.CREATE,
      'School',
      school.id,
      undefined,
      { name: school.name, code: school.code, districtId: school.districtId }
    );

    logger.info(`School created: ${school.name} (${school.code})`);
    return school;
  } catch (error) {
    logger.error('Error creating school:', error);
    throw error;
  }
}

/**
 * Get schools with pagination and optional district filter
 */
export async function getSchools(page: number = 1, limit: number = 20, districtId?: string) {
  try {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (districtId) {
      whereClause.districtId = districtId;
    }

    const { rows: schools, count: total } = await School.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['name', 'ASC']],
      distinct: true
    });

    return {
      schools,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error fetching schools:', error);
    throw new Error('Failed to fetch schools');
  }
}

/**
 * Get school by ID with associated data
 */
export async function getSchoolById(id: string) {
  try {
    const school = await School.findByPk(id, {
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!school) {
      throw new Error('School not found');
    }

    return school;
  } catch (error) {
    logger.error('Error fetching school:', error);
    throw error;
  }
}

/**
 * Update school information
 */
export async function updateSchool(id: string, data: UpdateSchoolData) {
  try {
    const school = await School.findByPk(id, {
      include: [
        {
          model: District,
          as: 'district'
        }
      ]
    });

    if (!school) {
      throw new Error('School not found');
    }

    await school.update(data);

    // Reload with associations
    await school.reload({
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    logger.info(`School updated: ${school.name} (${id})`);
    return school;
  } catch (error) {
    logger.error('Error updating school:', error);
    throw error;
  }
}

/**
 * Delete school (soft delete by setting isActive to false)
 */
export async function deleteSchool(id: string) {
  try {
    const school = await School.findByPk(id);

    if (!school) {
      throw new Error('School not found');
    }

    // Soft delete
    await school.update({ isActive: false });

    logger.info(`School deactivated: ${school.name} (${id})`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting school:', error);
    throw error;
  }
}
