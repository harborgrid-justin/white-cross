import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiKeyEntity } from './entities/api-key.entity';
import { ApiKeyResponseDto } from './dto/api-key-response.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import * as crypto from 'crypto';
import { AppConfigService } from '../config/app-config.service';

import { BaseService } from '../../common/base';
/**
 * API Key Authentication Service
 *
 * Manages API key creation, validation, and lifecycle.
 * Implements secure hashing and comprehensive audit logging.
 *
 * @service ApiKeyAuthService
 */
@Injectable()
export class ApiKeyAuthService extends BaseService {
  constructor(
    @InjectModel(ApiKeyEntity)
    private readonly apiKeyModel: typeof ApiKeyEntity,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Generate a new API key
   *
   * Format: wc_live_<random_32_bytes> or wc_test_<random_32_bytes>
   *
   * @param createDto - API key creation data
   * @param userId - User creating the key
   * @returns API key (plaintext, only shown once) and metadata
   */
  async generateApiKey(
    createDto: CreateApiKeyDto,
    userId: string,
  ): Promise<ApiKeyResponseDto> {
    try {
      // Generate secure random API key
      const randomBytes = crypto.randomBytes(32).toString('hex');
      const environment = this.configService.isProduction ? 'live' : 'test';
      const apiKey = `wc_${environment}_${randomBytes}`;

      // Hash the API key for storage (SHA-256)
      const keyHash = this.hashApiKey(apiKey);

      // Extract prefix for identification (first 12 characters)
      const keyPrefix = apiKey.substring(0, 12);

      // Set expiration if provided, default to 1 year
      const expiresAt = createDto.expiresInDays
        ? new Date(Date.now() + createDto.expiresInDays * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      // Create API key record
      const apiKeyRecord = await this.apiKeyModel.create({
        name: createDto.name,
        keyHash,
        keyPrefix,
        description: createDto.description,
        scopes: createDto.scopes || ['api:read'],
        isActive: true,
        expiresAt,
        createdBy: userId,
        ipRestriction: createDto.ipRestriction,
        rateLimit: createDto.rateLimit || 1000, // Default 1000 req/min
        usageCount: 0,
      });

      this.logInfo(`API key created: ${keyPrefix}... for user ${userId}`);

      return {
        apiKey, // Plaintext key (only returned once)
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        keyPrefix: apiKeyRecord.keyPrefix,
        scopes: apiKeyRecord.scopes,
        expiresAt: apiKeyRecord.expiresAt,
        createdAt: apiKeyRecord.createdAt,
      };
    } catch (error) {
      this.logError('Error generating API key', { error, userId });
      throw new BadRequestException('Failed to generate API key');
    }
  }

  /**
   * Validate an API key
   *
   * @param apiKey - Plaintext API key from request
   * @returns API key entity if valid
   * @throws UnauthorizedException if invalid
   */
  async validateApiKey(apiKey: string): Promise<ApiKeyEntity> {
    try {
      // Hash the provided API key
      const keyHash = this.hashApiKey(apiKey);

      // Find the API key in database
      const apiKeyRecord = await this.apiKeyModel.findOne({
        where: { keyHash },
      });

      if (!apiKeyRecord) {
        this.logWarning('Invalid API key attempted', {
          keyPrefix: apiKey.substring(0, 12),
        });
        throw new UnauthorizedException('Invalid API key');
      }

      // Check if key is active
      if (!apiKeyRecord.isActive) {
        this.logWarning('Inactive API key attempted', {
          keyPrefix: apiKeyRecord.keyPrefix,
          id: apiKeyRecord.id,
        });
        throw new UnauthorizedException('API key is inactive');
      }

      // Check if key is expired
      if (apiKeyRecord.isExpired()) {
        this.logWarning('Expired API key attempted', {
          keyPrefix: apiKeyRecord.keyPrefix,
          id: apiKeyRecord.id,
          expiresAt: apiKeyRecord.expiresAt,
        });
        throw new UnauthorizedException('API key has expired');
      }

      // Update last used timestamp and usage count
      await apiKeyRecord.update({
        lastUsedAt: new Date(),
        usageCount: apiKeyRecord.usageCount + 1,
      });

      this.logInfo('API key validated successfully', {
        keyPrefix: apiKeyRecord.keyPrefix,
        id: apiKeyRecord.id,
      });

      return apiKeyRecord;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logError('Error validating API key', { error });
      throw new UnauthorizedException('Invalid API key');
    }
  }

  /**
   * Revoke an API key
   *
   * @param apiKeyId - API key ID to revoke
   * @param userId - User revoking the key
   */
  async revokeApiKey(apiKeyId: string, userId: string): Promise<void> {
    const apiKeyRecord = await this.apiKeyModel.findByPk(apiKeyId);

    if (!apiKeyRecord) {
      throw new BadRequestException('API key not found');
    }

    await apiKeyRecord.update({ isActive: false });

    this.logInfo(
      `API key revoked: ${apiKeyRecord.keyPrefix}... by user ${userId}`,
    );
  }

  /**
   * List all API keys for a user
   *
   * @param userId - User ID
   * @returns List of API keys (without plaintext keys)
   */
  async listApiKeys(userId: string): Promise<Partial<ApiKeyEntity>[]> {
    const apiKeys = await this.apiKeyModel.findAll({
      where: { createdBy: userId },
      attributes: [
        'id',
        'name',
        'keyPrefix',
        'description',
        'scopes',
        'isActive',
        'expiresAt',
        'lastUsedAt',
        'usageCount',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    return apiKeys.map((key) => key.toJSON());
  }

  /**
   * Rotate an API key (create new key, revoke old key)
   *
   * @param apiKeyId - Old API key ID
   * @param userId - User rotating the key
   * @returns New API key
   */
  async rotateApiKey(
    apiKeyId: string,
    userId: string,
  ): Promise<ApiKeyResponseDto> {
    const oldKey = await this.apiKeyModel.findByPk(apiKeyId);

    if (!oldKey) {
      throw new BadRequestException('API key not found');
    }

    if (oldKey.createdBy !== userId) {
      throw new BadRequestException('Not authorized to rotate this API key');
    }

    // Create new key with same properties
    const newKey = await this.generateApiKey(
      {
        name: oldKey.name,
        description: oldKey.description,
        scopes: oldKey.scopes,
        ipRestriction: oldKey.ipRestriction,
        rateLimit: oldKey.rateLimit,
      },
      userId,
    );

    // Revoke old key
    await oldKey.update({ isActive: false });

    this.logInfo(
      `API key rotated: ${oldKey.keyPrefix}... -> ${newKey.keyPrefix}...`,
    );

    return newKey;
  }

  /**
   * Hash an API key using SHA-256
   *
   * @param apiKey - Plaintext API key
   * @returns Hexadecimal hash
   */
  private hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Check if API key has required scope
   *
   * @param apiKey - API key entity
   * @param requiredScope - Required scope
   * @returns True if key has scope
   */
  hasScope(apiKey: ApiKeyEntity, requiredScope: string): boolean {
    if (!apiKey.scopes) return false;

    // Check for wildcard scope
    if (apiKey.scopes.includes('api:*')) return true;

    // Check for specific scope
    return apiKey.scopes.includes(requiredScope);
  }
}
