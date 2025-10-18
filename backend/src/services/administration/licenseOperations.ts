/**
 * LOC: A5B1D551BD
 * WC-GEN-187 | licenseOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/administration/types.ts)
 *   - auditOperations.ts (services/administration/auditOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/administration/index.ts)
 */

/**
 * WC-GEN-187 | licenseOperations.ts - General utility functions and operations
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
 * License Operations Module
 *
 * @module services/administration/licenseOperations
 */

import { logger } from '../../utils/logger';
import { District, License } from '../../database/models';
import { AuditAction, LicenseType, LicenseStatus } from '../../database/types/enums';
import { CreateLicenseData } from './types';
import { createAuditLog } from './auditOperations';

/**
 * Create a new license
 */
export async function createLicense(data: CreateLicenseData) {
  try {
    // Verify district exists and is active if districtId is provided
    if (data.districtId) {
      const district = await District.findByPk(data.districtId);
      if (!district) {
        throw new Error('District not found');
      }
      if (!district.isActive) {
        throw new Error('Cannot create license for an inactive district');
      }
    }

    // Validate license key format
    const normalizedKey = data.licenseKey.toUpperCase().trim();
    if (!/^[A-Z0-9-]+$/.test(normalizedKey)) {
      throw new Error('License key can only contain uppercase letters, numbers, and hyphens');
    }

    // Check for duplicate license key
    const existingLicense = await License.findOne({
      where: { licenseKey: normalizedKey }
    });

    if (existingLicense) {
      throw new Error(`License with key '${normalizedKey}' already exists`);
    }

    // Validate license type limits
    switch (data.type) {
      case LicenseType.TRIAL:
        if (!data.maxUsers || data.maxUsers > 10) {
          throw new Error('Trial license cannot have more than 10 users');
        }
        if (!data.maxSchools || data.maxSchools > 2) {
          throw new Error('Trial license cannot have more than 2 schools');
        }
        if (!data.expiresAt) {
          throw new Error('Trial license must have an expiration date');
        }
        break;
      case LicenseType.BASIC:
        if (data.maxUsers && data.maxUsers > 50) {
          throw new Error('Basic license cannot have more than 50 users');
        }
        if (data.maxSchools && data.maxSchools > 5) {
          throw new Error('Basic license cannot have more than 5 schools');
        }
        break;
      case LicenseType.PROFESSIONAL:
        if (data.maxUsers && data.maxUsers > 500) {
          throw new Error('Professional license cannot have more than 500 users');
        }
        if (data.maxSchools && data.maxSchools > 50) {
          throw new Error('Professional license cannot have more than 50 schools');
        }
        break;
    }

    // Validate features array
    if (!data.features || data.features.length === 0) {
      throw new Error('At least one feature must be specified for the license');
    }

    // Validate expiration date
    if (data.expiresAt) {
      const expirationDate = new Date(data.expiresAt);
      if (expirationDate < new Date()) {
        throw new Error('Expiration date must be in the future');
      }
    }

    const license = await License.create({
      ...data,
      licenseKey: normalizedKey,
      type: data.type as any,
      status: LicenseStatus.ACTIVE,
      issuedAt: new Date(),
      activatedAt: new Date()
    });

    // Reload with associations
    if (data.districtId) {
      await license.reload({
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
    }

    // Create audit log
    await createAuditLog(
      AuditAction.CREATE,
      'License',
      license.id,
      undefined,
      { licenseKey: license.licenseKey, type: license.type, districtId: license.districtId }
    );

    logger.info(`License created: ${license.licenseKey} (${license.type})`);
    return license;
  } catch (error) {
    logger.error('Error creating license:', error);
    throw error;
  }
}

/**
 * Get licenses with pagination
 */
export async function getLicenses(page: number = 1, limit: number = 20) {
  try {
    const offset = (page - 1) * limit;

    const { rows: licenses, count: total } = await License.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    return {
      licenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error fetching licenses:', error);
    throw new Error('Failed to fetch licenses');
  }
}

/**
 * Get license by ID
 */
export async function getLicenseById(id: string) {
  try {
    const license = await License.findByPk(id, {
      include: [
        {
          model: District,
          as: 'district',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!license) {
      throw new Error('License not found');
    }

    return license;
  } catch (error) {
    logger.error('Error fetching license:', error);
    throw error;
  }
}

/**
 * Update license
 */
export async function updateLicense(
  id: string,
  data: Partial<CreateLicenseData> & { status?: LicenseStatus }
) {
  try {
    const license = await License.findByPk(id);

    if (!license) {
      throw new Error('License not found');
    }

    await license.update({
      ...data,
      type: data.type ? data.type as any : undefined
    });

    // Reload with associations
    if (license.districtId) {
      await license.reload({
        include: [
          {
            model: District,
            as: 'district',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
    }

    logger.info(`License updated: ${license.licenseKey} (${id})`);
    return license;
  } catch (error) {
    logger.error('Error updating license:', error);
    throw error;
  }
}

/**
 * Deactivate license
 */
export async function deactivateLicense(id: string) {
  try {
    const license = await License.findByPk(id);

    if (!license) {
      throw new Error('License not found');
    }

    await license.update({
      status: LicenseStatus.SUSPENDED,
      deactivatedAt: new Date()
    });

    logger.info(`License deactivated: ${license.licenseKey} (${id})`);
    return license;
  } catch (error) {
    logger.error('Error deactivating license:', error);
    throw error;
  }
}
