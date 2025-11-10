/**
 * LOC: DEVSECPIPE001
 * File: /reuse/threat/composites/downstream/devsecops-security-pipelines.ts
 *
 * UPSTREAM (imports from):
 *   - ../security-operations-automation-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CI/CD platforms
 *   - Build automation systems
 *   - Security gate controllers
 *   - DevOps teams
 */

/**
 * File: /reuse/threat/composites/downstream/devsecops-security-pipelines.ts
 * Locator: WC-DOWN-DEVSECPIPE-001
 * Purpose: DevSecOps Security Pipelines - Automated security in software delivery
 *
 * Upstream: security-operations-automation-composite.ts
 * Downstream: CI/CD systems, Security gates, Build pipelines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: Pipeline security automation, security gates, compliance validation
 *
 * LLM Context: Enterprise-grade DevSecOps pipeline security for White Cross healthcare platform.
 * Provides automated security scanning, security gate enforcement, compliance validation,
 * vulnerability management, and HIPAA-compliant secure software delivery.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  scanPipelineSecurity,
  monitorPipelinesSecurity,
  scanSourceCodeVulnerabilities,
  scanDependencyVulnerabilities,
  detectExposedSecrets,
  evaluateDeploymentSecurityGate,
  validateHIPAACompliance,
  generateComplianceAuditReport,
} from '../security-operations-automation-composite';

@ApiTags('devsecops-pipelines')
@Controller('api/v1/devsecops/pipelines')
@ApiBearerAuth()
export class DevSecOpsPipelineController {
  private readonly logger = new Logger(DevSecOpsPipelineController.name);

  constructor(private readonly service: DevSecOpsPipelineService) {}

  @Post(':pipelineId/scan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Scan pipeline for security vulnerabilities' })
  async scanPipeline(
    @Param('pipelineId') pipelineId: string,
    @Body() scanConfig: any,
  ): Promise<any> {
    return this.service.scanPipeline(pipelineId, scanConfig);
  }

  @Get('monitor')
  @ApiOperation({ summary: 'Monitor multiple pipelines' })
  async monitorPipelines(@Query('pipelineIds') ids: string): Promise<any> {
    return this.service.monitorPipelines(ids.split(','));
  }

  @Post('code/scan')
  @ApiOperation({ summary: 'Scan source code for vulnerabilities' })
  async scanCode(@Body() scanData: any): Promise<any> {
    return this.service.scanSourceCode(scanData);
  }

  @Post('dependencies/scan')
  @ApiOperation({ summary: 'Scan dependencies for vulnerabilities' })
  async scanDependencies(@Body() scanData: any): Promise<any> {
    return this.service.scanDependencies(scanData);
  }

  @Post('secrets/detect')
  @ApiOperation({ summary: 'Detect exposed secrets in code' })
  async detectSecrets(@Body() scanData: any): Promise<any> {
    return this.service.detectSecrets(scanData);
  }

  @Post('gate/evaluate')
  @ApiOperation({ summary: 'Evaluate security gate for deployment' })
  async evaluateGate(@Body() gateData: any): Promise<any> {
    return this.service.evaluateSecurityGate(gateData);
  }

  @Post('compliance/hipaa')
  @ApiOperation({ summary: 'Validate HIPAA compliance' })
  async validateCompliance(@Body() data: any): Promise<any> {
    return this.service.validateHIPAA(data);
  }
}

@Injectable()
export class DevSecOpsPipelineService {
  private readonly logger = new Logger(DevSecOpsPipelineService.name);

  async scanPipeline(pipelineId: string, config: any): Promise<any> {
    return scanPipelineSecurity(pipelineId, config.buildId, config.options);
  }

  async monitorPipelines(pipelineIds: string[]): Promise<any> {
    return monitorPipelinesSecurity(pipelineIds, {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    });
  }

  async scanSourceCode(data: any): Promise<any> {
    return scanSourceCodeVulnerabilities(data.repository, data.branch, data.tool);
  }

  async scanDependencies(data: any): Promise<any> {
    return scanDependencyVulnerabilities(data.projectPath, data.packageManager);
  }

  async detectSecrets(data: any): Promise<any> {
    return detectExposedSecrets(data.repository, data.tool);
  }

  async evaluateSecurityGate(data: any): Promise<any> {
    return evaluateDeploymentSecurityGate(data.buildId, data.environment, data.criteria);
  }

  async validateHIPAA(data: any): Promise<any> {
    return validateHIPAACompliance(data.pipelineId, data.buildId);
  }
}

export default { DevSecOpsPipelineController, DevSecOpsPipelineService };
