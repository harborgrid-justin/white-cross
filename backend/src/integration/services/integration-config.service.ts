import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IntegrationConfig, IntegrationStatus } from '../../database/models/integration-config.model';
import { IntegrationLog } from '../../database/models/integration-log.model';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';
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
    @InjectModel(IntegrationConfig)
    private readonly configModel: typeof IntegrationConfig,
    private readonly validationService: IntegrationValidationService,
    private readonly encryptionService: IntegrationEncryptionService,
    private readonly logService: IntegrationLogService,
  ) {}

  /**
   * Get all integration configurations with optional type filtering
   */
  async findAll(type?: string): Promise<IntegrationConfig[]> {
    try {
      const whereClause: Record<string, string> = {};
      if (type) {
        whereClause.type = type;
      }

      const integrations = await this.configModel.findAll({
        where: whereClause,
        include: [
          {
            model: IntegrationLog,
            as: 'logs',
            limit: 5,
            order: [['createdAt', 'DESC']],
          },
        ],
        order: [
          ['type', 'ASC'],
          ['name', 'ASC'],
        ],
      });

      // Mask sensitive data
      return integrations.map((integration) =>
        this.maskSensitiveData(integration),
      );
    } catch (error) {
      this.logger.error('Error fetching integrations', error);
      throw error;
    }
  }

  /**
   * Get integration configuration by ID
   */
  async findById(
    id: string,
    includeSensitive: boolean = false,
  ): Promise<IntegrationConfig> {
    try {
      const integration = await this.configModel.findByPk(id, {
        include: [
          {
            model: IntegrationLog,
            as: 'logs',
          },
        ],
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
      const existingIntegration = await this.configModel.findOne({
        where: { name: data.name },
      });

      if (existingIntegration) {
        throw new BadRequestException(
          `Integration with name "${data.name}" already exists`,
        );
      }

      // Validate endpoint if provided
      if (data.endpoint) {
        this.validationService.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials
      this.validationService.validateAuthenticationCredentials(data);

      // Validate settings if provided
      if (data.settings) {
        this.validationService.validateIntegrationSettings(
          data.settings as Record<string, unknown>,
          data.type,
        );
      }

      // Encrypt sensitive data
      const encryptedData = this.encryptionService.encryptSensitiveData({
        apiKey: data.apiKey,
        password: data.password,
      });

      // Create integration
      const integration = await this.configModel.create({
        ...data,
        apiKey: encryptedData.apiKey,
        password: encryptedData.password,
        status: IntegrationStatus.INACTIVE,
        isActive: true,
      });

      this.logger.log(`Integration created: ${data.name} (${data.type})`);

      // Log the creation
      await this.logService.create({
        integrationId: integration.id,
        integrationType: data.type,
        action: 'create',
        status: 'success',
        details: {
          message: 'Integration configuration created',
        },
      });

      return this.maskSensitiveData(integration);
    } catch (error) {
      this.logger.error('Error creating integration', error);
      throw error;
    }
  }

  /**
   * Update integration configuration
   */
  async update(
    id: string,
    data: UpdateIntegrationDto,
  ): Promise<IntegrationConfig> {
    try {
      const existing = await this.findById(id, true);

      // Check for name conflicts if name is being updated
      if (data.name && data.name !== existing.name) {
        const duplicate = await this.configModel.findOne({
          where: { name: data.name },
        });

        if (duplicate) {
          throw new BadRequestException(
            `Integration with name "${data.name}" already exists`,
          );
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
        this.validationService.validateIntegrationSettings(
          data.settings as Record<string, unknown>,
          existing.type,
        );
      }

      // Validate sync frequency if being updated
      if (data.syncFrequency !== undefined) {
        this.validationService.validateSyncFrequency(data.syncFrequency);
      }

      // Encrypt sensitive data if being updated
      const updateData: Partial<IntegrationConfig> = { ...data };
      if (data.apiKey) {
        updateData.apiKey = this.encryptionService.encryptCredential(
          data.apiKey,
        );
      }
      if (data.password) {
        updateData.password = this.encryptionService.encryptCredential(
          data.password,
        );
      }

      // Update integration
      await this.configModel.update(updateData, { where: { id } });
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

      await this.configModel.destroy({ where: { id } });

      this.logger.log(
        `Integration deleted: ${integration.name} (${integration.type})`,
      );
    } catch (error) {
      this.logger.error(`Error deleting integration ${id}`, error);
      throw error;
    }
  }

  /**
   * Mask sensitive data in integration configuration
   */
  private maskSensitiveData(integration: IntegrationConfig): IntegrationConfig {
    const plainIntegration = integration.get({ plain: true });
    return {
      ...plainIntegration,
      apiKey: plainIntegration.apiKey ? '***MASKED***' : null,
      password: plainIntegration.password ? '***MASKED***' : null,
    };
  }
}
