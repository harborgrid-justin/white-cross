import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { AuditService } from '@/database/services/audit.service';
import { ExecutionContext } from '../../database/types/execution-context.interface';
import { AccessControlCreateIpRestrictionDto, IpRestrictionType } from '../dto/create-ip-restriction.dto';
import { IpRestrictionCheckResult } from '../interfaces/ip-restriction-check.interface';
import { IpRestrictionInstance, SequelizeModelClass } from '../types/sequelize-models.types';

import { BaseService } from '@/common/base';
/**
 * IP Restriction Management Service
 *
 * Handles all IP restriction operations including:
 * - IP restriction creation and removal
 * - IP restriction validation
 * - IP restriction checking with blacklist/whitelist support
 * - Audit logging for IP restriction operations
 */
@Injectable()
export class IpRestrictionManagementService extends BaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject('IAuditLogger') private readonly auditService: AuditService,
  ) {}

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

  /**
   * Get all active IP restrictions
   */
  async getIpRestrictions(): Promise<IpRestrictionInstance[]> {
    try {
      const IpRestriction = this.getModel('IpRestriction');
      const restrictions = await IpRestriction.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });

      this.logInfo(`Retrieved ${restrictions.length} IP restrictions`);
      return restrictions;
    } catch (error) {
      this.logError('Error getting IP restrictions:', error);
      throw error;
    }
  }

  /**
   * Add IP restriction
   */
  async addIpRestriction(
    data: AccessControlCreateIpRestrictionDto,
  ): Promise<any> {
    try {
      const IpRestriction = this.getModel('IpRestriction');

      // Check if restriction already exists for this IP
      const existingRestriction = await IpRestriction.findOne({
        where: {
          ipAddress: data.ipAddress,
          isActive: true,
        },
      });

      if (existingRestriction) {
        throw new BadRequestException(
          'IP restriction already exists for this address',
        );
      }

      const restriction = await IpRestriction.create({
        ipAddress: data.ipAddress,
        type: data.type,
        reason: data.reason,
        isActive: true,
        createdBy: data.createdBy,
      });

      this.logInfo(`Added IP restriction: ${data.ipAddress} (${data.type})`);
      return restriction;
    } catch (error) {
      this.logError('Error adding IP restriction:', error);
      throw error;
    }
  }

  /**
   * Remove IP restriction (soft delete)
   */
  async removeIpRestriction(id: string): Promise<{ success: boolean }> {
    try {
      const IpRestriction = this.getModel('IpRestriction');
      const restriction = await this.findEntityOrFail(IpRestriction, id, 'IP');

      await restriction.update({
        isActive: false,
      });

      this.logInfo(`Removed IP restriction: ${id}`);
      return { success: true };
    } catch (error) {
      this.logError(`Error removing IP restriction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if IP is restricted with audit logging
   */
  async checkIpRestriction(
    ipAddress: string,
    userId?: string,
  ): Promise<IpRestrictionCheckResult> {
    try {
      const IpRestriction = this.getModel('IpRestriction');

      // If IpRestriction model doesn't exist, skip IP restriction check
      if (!IpRestriction) {
        this.logWarning(
          'IpRestriction model not found, skipping IP restriction check',
        );
        return {
          isRestricted: false,
          reason: undefined,
        };
      }

      const restriction = await IpRestriction.findOne({
        where: {
          ipAddress,
          isActive: true,
        },
      });

      const isRestricted = restriction
        ? restriction.type === IpRestrictionType.BLACKLIST
        : false;

      // Audit logging for IP restriction checks
      if (restriction) {
        await this.auditService.logRead('IpRestriction', restriction.id, {
          userId: userId || null,
          userName: userId ? 'User' : 'Anonymous',
          userRole: userId ? 'USER' : ('ANONYMOUS' as any),
          ipAddress: ipAddress,
          userAgent: null,
          timestamp: new Date(),
        } as ExecutionContext);
      }

      if (!restriction) {
        return { isRestricted: false };
      }

      return {
        isRestricted,
        type: restriction.type,
        reason: restriction.reason || undefined,
      };
    } catch (error) {
      this.logError('Error checking IP restriction:', error);
      return { isRestricted: false };
    }
  }
}
