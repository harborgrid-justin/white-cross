/**
 * User Repository Implementation
 * Injectable NestJS repository for user data access with authentication support
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';
import { User } from '../../models/user.model';

export interface UserAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: string;
}

export interface UpdateUserDTO {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roleId?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

@Injectable()
export class UserRepository
  extends BaseRepository<any, UserAttributes, CreateUserDTO>
{
  constructor(
    @InjectModel(User) model: typeof User,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'User');
  }

  async findByEmail(email: string): Promise<UserAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(this.entityName, email, 'by-email');
      const cached = await this.cacheManager.get<UserAttributes>(cacheKey);

      if (cached) {
        this.logger.debug(`Cache hit for user email: ${email}`);
        return cached;
      }

      const user = await this.model.findOne({ where: { email } });
      if (!user) return null;

      const entity = this.mapToEntity(user);
      await this.cacheManager.set(cacheKey, entity, 1800);
      return entity;
    } catch (error) {
      this.logger.error('Error finding user by email:', error);
      throw new RepositoryError(
        'Failed to find user by email',
        'FIND_BY_EMAIL_ERROR',
        500,
        { email, error: (error as Error).message }
      );
    }
  }

  async findByUsername(username: string): Promise<UserAttributes | null> {
    try {
      const user = await this.model.findOne({ where: { username } });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error finding user by username:', error);
      throw new RepositoryError(
        'Failed to find user by username',
        'FIND_BY_USERNAME_ERROR',
        500,
        { username, error: (error as Error).message }
      );
    }
  }

  async findByRole(roleId: string): Promise<UserAttributes[]> {
    try {
      const users = await this.model.findAll({
        where: { roleId, isActive: true },
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });
      return users.map((u: any) => this.mapToEntity(u));
    } catch (error) {
      this.logger.error('Error finding users by role:', error);
      throw new RepositoryError(
        'Failed to find users by role',
        'FIND_BY_ROLE_ERROR',
        500,
        { roleId, error: (error as Error).message }
      );
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.model.update(
        { lastLoginAt: new Date(), failedLoginAttempts: 0 },
        { where: { id: userId } }
      );
      await this.invalidateCaches(await this.model.findByPk(userId));
    } catch (error) {
      this.logger.error('Error updating last login:', error);
    }
  }

  async incrementFailedLogins(userId: string): Promise<number> {
    try {
      const user = await this.model.findByPk(userId);
      if (!user) throw new RepositoryError('User not found', 'NOT_FOUND', 404);

      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updates: any = { failedLoginAttempts: failedAttempts };

      if (failedAttempts >= 5) {
        updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await this.model.update(updates, { where: { id: userId } });
      await this.invalidateCaches(user);

      return failedAttempts;
    } catch (error) {
      this.logger.error('Error incrementing failed logins:', error);
      throw new RepositoryError(
        'Failed to increment failed logins',
        'INCREMENT_FAILED_LOGINS_ERROR',
        500,
        { userId, error: (error as Error).message }
      );
    }
  }

  async unlockAccount(userId: string): Promise<void> {
    try {
      await this.model.update(
        { lockedUntil: null, failedLoginAttempts: 0 },
        { where: { id: userId } }
      );
      await this.invalidateCaches(await this.model.findByPk(userId));
    } catch (error) {
      this.logger.error('Error unlocking account:', error);
      throw new RepositoryError(
        'Failed to unlock account',
        'UNLOCK_ACCOUNT_ERROR',
        500,
        { userId, error: (error as Error).message }
      );
    }
  }

  protected async validateCreate(data: CreateUserDTO): Promise<void> {
    const existingEmail = await this.model.findOne({ where: { email: data.email } });
    if (existingEmail) {
      throw new RepositoryError(
        'Email already exists',
        'DUPLICATE_EMAIL',
        409,
        { email: data.email }
      );
    }

    const existingUsername = await this.model.findOne({ where: { username: data.username } });
    if (existingUsername) {
      throw new RepositoryError(
        'Username already exists',
        'DUPLICATE_USERNAME',
        409,
        { username: data.username }
      );
    }
  }

  protected async validateUpdate(id: string, data: UpdateUserDTO): Promise<void> {
    if (data.email) {
      const existing = await this.model.findOne({
        where: { email: data.email, id: { [Op.ne]: id } }
      });
      if (existing) {
        throw new RepositoryError(
          'Email already exists',
          'DUPLICATE_EMAIL',
          409,
          { email: data.email }
        );
      }
    }

    if (data.username) {
      const existing = await this.model.findOne({
        where: { username: data.username, id: { [Op.ne]: id } }
      });
      if (existing) {
        throw new RepositoryError(
          'Username already exists',
          'DUPLICATE_USERNAME',
          409,
          { username: data.username }
        );
      }
    }
  }

  protected async invalidateCaches(user: any): Promise<void> {
    try {
      const userData = user.get();
      await this.cacheManager.delete(this.cacheKeyBuilder.entity(this.entityName, userData.id));

      if (userData.email) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(this.entityName, userData.email, 'by-email')
        );
      }

      if (userData.username) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(this.entityName, userData.username, 'by-username')
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating user caches:', error);
    }
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData({
      ...data,
      passwordHash: '[REDACTED]'
    });
  }
}


