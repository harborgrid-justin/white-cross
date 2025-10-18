/**
 * WC-GEN-185 | districtOperations.ts - General utility functions and operations
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
 * District Operations Module
 *
 * @module services/administration/districtOperations
 */

import { logger } from '../../utils/logger';
import { District, School, License, sequelize } from '../../database/models';
import { AuditAction, LicenseStatus } from '../../database/types/enums';
import { CreateDistrictData, UpdateDistrictData } from './types';
import { createAuditLog } from './auditOperations';

/**
 * Create a new district
 */
export async function createDistrict(data: CreateDistrictData) {
  try {
    // Normalize and validate district code
    const normalizedCode = data.code.toUpperCase().trim();

    // Check for duplicate district code
    const existingDistrict = await District.findOne({
      where: { code: normalizedCode }
    });

    if (existingDistrict) {
      throw new Error(`District with code '${normalizedCode}' already exists`);
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

    const district = await District.create({
      ...data,
      code: normalizedCode
    });

    // Create audit log
    await createAuditLog(
      AuditAction.CREATE,
      'District',
      district.id,
      undefined,
      { name: district.name, code: district.code }
    );

    logger.info(`District created: ${district.name} (${district.code})`);
    return district;
  } catch (error) {
    logger.error('Error creating district:', error);
    throw error;
  }
}

/**
 * Get districts with pagination
 */
export async function getDistricts(page: number = 1, limit: number = 20) {
  try {
    const offset = (page - 1) * limit;

    const { rows: districts, count: total } = await District.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: School,
          as: 'schools',
          attributes: ['id', 'name', 'code', 'isActive']
        }
      ],
      order: [['name', 'ASC']],
      distinct: true
    });

    return {
      districts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error fetching districts:', error);
    throw new Error('Failed to fetch districts');
  }
}

/**
 * Get district by ID with associated data
 */
export async function getDistrictById(id: string) {
  try {
    const district = await District.findByPk(id, {
      include: [
        {
          model: School,
          as: 'schools',
          where: { isActive: true },
          required: false
        },
        {
          model: License,
          as: 'licenses',
          where: { status: LicenseStatus.ACTIVE },
          required: false,
          order: [['expiresAt', 'DESC']]
        }
      ]
    });

    if (!district) {
      throw new Error('District not found');
    }

    return district;
  } catch (error) {
    logger.error('Error fetching district:', error);
    throw error;
  }
}

/**
 * Update district information
 */
export async function updateDistrict(id: string, data: UpdateDistrictData) {
  try {
    const district = await District.findByPk(id);

    if (!district) {
      throw new Error('District not found');
    }

    // Validate email format if provided
    if (data.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
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

    // Store old values for audit
    const oldValues = {
      name: district.name,
      address: district.address,
      city: district.city,
      state: district.state,
      zipCode: district.zipCode,
      phone: district.phone,
      email: district.email,
      isActive: district.isActive
    };

    await district.update(data);

    // Create audit log
    await createAuditLog(
      AuditAction.UPDATE,
      'District',
      district.id,
      undefined,
      { old: oldValues, new: data }
    );

    logger.info(`District updated: ${district.name} (${id})`);
    return district;
  } catch (error) {
    logger.error('Error updating district:', error);
    throw error;
  }
}

/**
 * Delete district (soft delete by setting isActive to false)
 */
export async function deleteDistrict(id: string) {
  const transaction = await sequelize.transaction();

  try {
    const district = await District.findByPk(id, { transaction });

    if (!district) {
      throw new Error('District not found');
    }

    // Check for active schools under this district
    const activeSchoolCount = await School.count({
      where: {
        districtId: id,
        isActive: true
      },
      transaction
    });

    if (activeSchoolCount > 0) {
      throw new Error(`Cannot delete district with ${activeSchoolCount} active school(s). Please deactivate schools first.`);
    }

    // Check for active licenses
    const activeLicenseCount = await License.count({
      where: {
        districtId: id,
        status: LicenseStatus.ACTIVE
      },
      transaction
    });

    if (activeLicenseCount > 0) {
      throw new Error(`Cannot delete district with ${activeLicenseCount} active license(s). Please deactivate licenses first.`);
    }

    // Soft delete
    await district.update({ isActive: false }, { transaction });

    // Create audit log
    await createAuditLog(
      AuditAction.DELETE,
      'District',
      district.id,
      undefined,
      { name: district.name, deactivated: true }
    );

    await transaction.commit();

    logger.info(`District deactivated: ${district.name} (${id})`);
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    logger.error('Error deleting district:', error);
    throw error;
  }
}
