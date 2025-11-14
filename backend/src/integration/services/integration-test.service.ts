import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IntegrationConfig, IntegrationStatus } from '@/database/models';
import { IntegrationConfigService } from './integration-config.service';
import { IntegrationLogService } from './integration-log.service';
import type { IntegrationTestDetails } from '../types/test-details.types';

import { BaseService } from '@/common/base';
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
export class IntegrationTestService extends BaseService {
  constructor(
    @InjectModel(IntegrationConfig)
    private readonly configModel: typeof IntegrationConfig,
    private readonly configService: IntegrationConfigService,
    private readonly logService: IntegrationLogService,
  ) {
    super("IntegrationTestService");
  }

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

      this.logInfo(
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

      this.logError('Error testing connection', error);

      return {
        success: false,
        message: (error as Error).message,
        responseTime,
      };
    }
  }

  /**
   * Perform actual connection test based on integration type
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

    const endpoint = integration.endpoint || '';
    const timeout = (integration.timeout as number) || 5000;

    try {
      // Perform actual HTTP health check for most integration types
      const connectionSuccess = await this.testHttpEndpoint(endpoint, timeout);

      if (!connectionSuccess) {
        return {
          success: false,
          message: `Failed to connect to ${integration.type} endpoint: ${endpoint}`,
        };
      }

      // Build success response based on type
      const details = await this.buildIntegrationDetails(integration);

      return {
        success: true,
        message: `Successfully connected to ${this.getIntegrationTypeName(integration.type)}`,
        details,
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Tests HTTP endpoint connectivity
   */
  private async testHttpEndpoint(endpoint: string, timeout: number): Promise<boolean> {
    if (!endpoint) return false;

    return new Promise(async (resolve) => {
      try {
        const https = await import('https');
        const http = await import('http');
        const { URL } = await import('url');

        const parsedUrl = new URL(endpoint);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.request(
          {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname || '/',
            method: 'HEAD', // Use HEAD for lightweight check
            timeout,
            headers: {
              'User-Agent': 'WhiteCross-Integration-Test/1.0',
            },
          },
          (res) => {
            res.on('data', () => {}); // Consume response
            res.on('end', () => {
              resolve(res.statusCode ? res.statusCode < 500 : false);
            });
          }
        );

        req.on('error', () => resolve(false));
        req.on('timeout', () => {
          req.destroy();
          resolve(false);
        });
        req.end();
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Builds integration-specific details
   */
  private async buildIntegrationDetails(
    integration: IntegrationConfig,
  ): Promise<IntegrationTestDetails> {
    const baseDetails: IntegrationTestDetails = {
      testedAt: new Date().toISOString(),
      endpointUrl: integration.endpoint || 'N/A',
    };

    const settings = integration.settings as Record<string, unknown> || {};

    // Add type-specific details based on configuration
    switch (integration.type) {
      case 'SIS':
        return {
          ...baseDetails,
          systemName: settings.systemName as string || 'Student Information System',
          version: settings.version as string || 'Unknown',
        };

      case 'EHR':
        return {
          ...baseDetails,
          systemName: settings.systemName as string || 'Electronic Health Record',
          integrationVersion: settings.integrationVersion as string || 'HL7 FHIR R4',
          version: settings.version as string || 'Unknown',
        };

      case 'PHARMACY':
        return {
          ...baseDetails,
          pharmacyName: settings.pharmacyName as string || 'Pharmacy System',
          systemName: 'Pharmacy Management',
        };

      case 'LABORATORY':
        return {
          ...baseDetails,
          labName: settings.labName as string || 'Laboratory System',
          systemName: 'Laboratory Information System',
        };

      case 'INSURANCE':
        return {
          ...baseDetails,
          provider: settings.provider as string || 'Insurance Provider',
          systemName: 'Insurance Verification System',
        };

      case 'PARENT_PORTAL':
        return {
          ...baseDetails,
          portalVersion: settings.portalVersion as string || '1.0.0',
          systemName: 'Parent Portal',
        };

      default:
        return baseDetails;
    }
  }

  /**
   * Gets human-readable integration type name
   */
  private getIntegrationTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      SIS: 'Student Information System',
      EHR: 'Electronic Health Record System',
      PHARMACY: 'Pharmacy Management System',
      LABORATORY: 'Laboratory Information System',
      INSURANCE: 'Insurance Verification System',
      PARENT_PORTAL: 'Parent Portal',
      GOVERNMENT_REPORTING: 'Government Reporting System',
    };

    return typeNames[type] || type;
  }
}
