import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IntegrationConfig, IntegrationStatus } from '../../database/models/integration-config.model';
import { IntegrationConfigService } from './integration-config.service';
import { IntegrationLogService } from './integration-log.service';
import type { IntegrationTestDetails } from '../types/test-details.types';

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  details?: IntegrationTestDetails;
}

/**
 * Integration Test Service
 * Tests connectivity and validates integration configurations
 */
@Injectable()
export class IntegrationTestService {
  private readonly logger = new Logger(IntegrationTestService.name);

  constructor(
    @InjectModel(IntegrationConfig)
    private readonly configModel: typeof IntegrationConfig,
    private readonly configService: IntegrationConfigService,
    private readonly logService: IntegrationLogService,
  ) {}

  /**
   * Test integration connection
   */
  async testConnection(id: string): Promise<IntegrationTestResult> {
    const startTime = Date.now();

    try {
      const integration = await this.configService.findById(id, true);

      // Update status to TESTING
      await this.configModel.update(
        { status: IntegrationStatus.TESTING },
        { where: { id } },
      );

      // Simulate connection test based on integration type
      const testResult = await this.performConnectionTest(integration);

      const responseTime = Date.now() - startTime;

      // Update status based on result
      await this.configModel.update(
        {
          status: testResult.success
            ? IntegrationStatus.ACTIVE
            : IntegrationStatus.ERROR,
          lastSyncStatus: testResult.success ? 'success' : 'failed',
        },
        { where: { id } },
      );

      // Log the test
      await this.logService.create({
        integrationId: id,
        integrationType: integration.type,
        action: 'test_connection',
        status: testResult.success ? 'success' : 'failed',
        duration: responseTime,
        errorMessage: testResult.success ? undefined : testResult.message,
        details: testResult.details as any,
      });

      this.logger.log(
        `Connection test ${testResult.success ? 'succeeded' : 'failed'} for ${integration.name}`,
      );

      return {
        ...testResult,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      await this.configModel.update(
        {
          status: IntegrationStatus.ERROR,
          lastSyncStatus: 'failed',
        },
        { where: { id } },
      );

      this.logger.error('Error testing connection', error);

      return {
        success: false,
        message: (error as Error).message,
        responseTime,
      };
    }
  }

  /**
   * Perform actual connection test based on integration type
   * Mock implementation - in production, this would make real API calls
   */
  private async performConnectionTest(
    integration: IntegrationConfig,
  ): Promise<IntegrationTestResult> {
    // Validate required fields
    if (!integration.endpoint && integration.type !== 'GOVERNMENT_REPORTING') {
      return {
        success: false,
        message: 'Endpoint URL is required',
      };
    }

    // Simulate different test scenarios based on type
    switch (integration.type) {
      case 'SIS':
        return {
          success: true,
          message: 'Successfully connected to Student Information System',
          details: {
            version: '2.1.0',
            studentCount: 1542,
            lastSync: new Date().toISOString(),
          },
        };

      case 'EHR':
        return {
          success: true,
          message: 'Successfully connected to Electronic Health Record system',
          details: {
            version: '3.4.2',
            recordsAvailable: 1542,
            integrationVersion: 'HL7 FHIR R4',
          },
        };

      case 'PHARMACY':
        return {
          success: true,
          message: 'Successfully connected to Pharmacy Management System',
          details: {
            pharmacyName: integration.settings?.pharmacyName || 'Main Pharmacy',
            activeOrders: 45,
          },
        };

      case 'LABORATORY':
        return {
          success: true,
          message: 'Successfully connected to Laboratory Information System',
          details: {
            labName: integration.settings?.labName || 'Central Lab',
            pendingResults: 12,
          },
        };

      case 'INSURANCE':
        return {
          success: true,
          message: 'Successfully connected to Insurance Verification System',
          details: {
            provider: integration.settings?.provider || 'Insurance Provider',
            apiVersion: '2.0',
          },
        };

      case 'PARENT_PORTAL':
        return {
          success: true,
          message: 'Successfully connected to Parent Portal',
          details: {
            activeParents: 1200,
            portalVersion: '1.8.3',
          },
        };

      default:
        return {
          success: false,
          message: 'Unknown integration type',
        };
    }
  }
}
