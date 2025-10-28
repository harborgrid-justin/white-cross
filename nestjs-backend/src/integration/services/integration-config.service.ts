import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationConfig, IntegrationStatus } from '../entities/integration-config.entity';
import { IntegrationLog } from '../entities/integration-log.entity';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto';
import { IntegrationValidationService } from './integration-validation.service';
import { IntegrationEncryptionService } from './integration-encryption.service';
import { IntegrationLogService } from './integration-log.service';

/**
 * Integration Configuration Service
 * Handles CRUD operations for integration configurations
 */
@Injectable()
export class IntegrationConfigService {
  private readonly logger = new Logger(IntegrationConfigService.name);

  constructor(
    @InjectRepository(IntegrationConfig)
    private readonly configRepository: Repository<IntegrationConfig>,
    private readonly validationService: IntegrationValidationService,
    private readonly encryptionService: IntegrationEncryptionService,
    private readonly logService: IntegrationLogService,
  ) {}

  /**
   * Get all integration configurations with optional type filtering
   */
  async findAll(type?: string): Promise<IntegrationConfig[]> {
    try {
      const query = this.configRepository.createQueryBuilder('integration')
        .leftJoinAndSelect('integration.logs', 'logs')
        .orderBy('integration.type', 'ASC')
        .addOrderBy('integration.name', 'ASC')
        .addOrderBy('logs.createdAt', 'DESC')
        .limit(5);

      if (type) {
        query.where('integration.type = :type', { type });
      }

      const integrations = await query.getMany();

      // Mask sensitive data
      return integrations.map(integration => this.maskSensitiveData(integration));
    } catch (error) {
      this.logger.error('Error fetching integrations', error);
      throw error;
    }
  }

  /**
   * Get integration configuration by ID
   */
  async findById(id: string, includeSensitive: boolean = false): Promise<IntegrationConfig> {
    try {
      const integration = await this.configRepository.findOne({
        where: { id },
        relations: ['logs'],
      });

      if (!integration) {
        throw new NotFoundException(`Integration with ID ${id} not found`);
      }

      if (!includeSensitive) {
        return this.maskSensitiveData(integration);
      }

      return integration;
    } catch (error) {
      this.logger.error(`Error fetching integration ${id}`, error);
      throw error;
    }
  }

  /**
   * Create new integration configuration
   */
  async create(data: CreateIntegrationDto): Promise<IntegrationConfig> {
    try {
      // Validate integration data
      this.validationService.validateIntegrationData(data);

      // Check for duplicate names
      const existingIntegration = await this.configRepository.findOne({
        where: { name: data.name },
      });

      if (existingIntegration) {
        throw new BadRequestException(`Integration with name "${data.name}" already exists`);
      }

      // Validate endpoint if provided
      if (data.endpoint) {
        this.validationService.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials
      this.validationService.validateAuthenticationCredentials(data);

      // Validate settings if provided
      if (data.settings) {
        this.validationService.validateIntegrationSettings(data.settings, data.type);
      }

      // Encrypt sensitive data
      const encryptedData = this.encryptionService.encryptSensitiveData({
        apiKey: data.apiKey,
        password: data.password,
      });

      // Create integration
      const integration = this.configRepository.create({
        ...data,
        apiKey: encryptedData.apiKey,
        password: encryptedData.password,
        status: IntegrationStatus.INACTIVE,
        isActive: true,
      });

      const saved = await this.configRepository.save(integration);

      this.logger.log(`Integration created: ${data.name} (${data.type})`);

      // Log the creation
      await this.logService.create({
        integrationId: saved.id,
        integrationType: data.type,
        action: 'create',
        status: 'success',
        details: {
          message: 'Integration configuration created',
        },
      });

      return this.maskSensitiveData(saved);
    } catch (error) {
      this.logger.error('Error creating integration', error);
      throw error;
    }
  }

  /**
   * Update integration configuration
   */
  async update(id: string, data: UpdateIntegrationDto): Promise<IntegrationConfig> {
    try {
      const existing = await this.findById(id, true);

      // Check for name conflicts if name is being updated
      if (data.name && data.name !== existing.name) {
        const duplicate = await this.configRepository.findOne({
          where: { name: data.name },
        });

        if (duplicate) {
          throw new BadRequestException(`Integration with name "${data.name}" already exists`);
        }
      }

      // Validate endpoint if being updated
      if (data.endpoint) {
        this.validationService.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials if being updated
      if (data.apiKey || data.username || data.password) {
        this.validationService.validateAuthenticationCredentials({
          ...existing,
          ...data,
        } as CreateIntegrationDto);
      }

      // Validate settings if being updated
      if (data.settings) {
        this.validationService.validateIntegrationSettings(data.settings, existing.type);
      }

      // Validate sync frequency if being updated
      if (data.syncFrequency !== undefined) {
        this.validationService.validateSyncFrequency(data.syncFrequency);
      }

      // Encrypt sensitive data if being updated
      const updateData: Partial<IntegrationConfig> = { ...data };
      if (data.apiKey) {
        updateData.apiKey = this.encryptionService.encryptCredential(data.apiKey);
      }
      if (data.password) {
        updateData.password = this.encryptionService.encryptCredential(data.password);
      }

      // Update integration
      await this.configRepository.update(id, updateData);
      const updated = await this.findById(id, false);

      this.logger.log(`Integration updated: ${updated.name} (${updated.type})`);

      // Log the update
      await this.logService.create({
        integrationId: id,
        integrationType: updated.type,
        action: 'update',
        status: 'success',
        details: {
          message: 'Integration configuration updated',
          updatedFields: Object.keys(data),
        },
      });

      return updated;
    } catch (error) {
      this.logger.error(`Error updating integration ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete integration configuration
   */
  async delete(id: string): Promise<void> {
    try {
      const integration = await this.findById(id, false);

      await this.configRepository.delete(id);

      this.logger.log(`Integration deleted: ${integration.name} (${integration.type})`);
    } catch (error) {
      this.logger.error(`Error deleting integration ${id}`, error);
      throw error;
    }
  }

  /**
   * Mask sensitive data in integration configuration
   */
  private maskSensitiveData(integration: IntegrationConfig): IntegrationConfig {
    return {
      ...integration,
      apiKey: integration.apiKey ? '***MASKED***' : null,
      password: integration.password ? '***MASKED***' : null,
    };
  }
}
