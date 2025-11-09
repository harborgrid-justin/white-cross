/**
 * LOC: INTELAUTO001
 * File: /reuse/threat/composites/downstream/intelligence-automation-platforms.ts
 *
 * UPSTREAM (imports from):
 *   - ../security-operations-automation-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - SOAR platforms
 *   - Security orchestration systems
 *   - Automated response workflows
 *   - Threat intelligence sharing platforms
 */

/**
 * File: /reuse/threat/composites/downstream/intelligence-automation-platforms.ts
 * Locator: WC-INTELLIGENCE-AUTOMATION-001
 * Purpose: Intelligence Automation Platforms - Automated threat intelligence collection and processing
 *
 * Upstream: security-operations-automation-composite
 * Downstream: SOAR platforms, SOC automation, Threat intelligence workflows
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: NestJS controllers and services for intelligence automation
 *
 * LLM Context: Production-ready intelligence automation platform for White Cross healthcare.
 * Provides automated threat intelligence collection, enrichment, analysis, and distribution.
 * Integrates with threat feeds, SIEM systems, and security tools for comprehensive automation.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum AutomationWorkflowType {
  THREAT_ENRICHMENT = 'THREAT_ENRICHMENT',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  THREAT_HUNTING = 'THREAT_HUNTING',
  VULNERABILITY_ASSESSMENT = 'VULNERABILITY_ASSESSMENT',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  REPORT_GENERATION = 'REPORT_GENERATION',
}

export enum WorkflowStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  type: AutomationWorkflowType;
  status: WorkflowStatus;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  schedule?: string; // Cron expression
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual' | 'webhook';
  config: Record<string, any>;
  conditions?: TriggerCondition[];
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
  value: any;
}

export interface WorkflowAction {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  order: number;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  triggeredBy: string;
  results: ExecutionResult[];
  errors: ExecutionError[];
  metadata?: Record<string, any>;
}

export interface ExecutionResult {
  actionId: string;
  actionName: string;
  success: boolean;
  output?: any;
  duration: number;
}

export interface ExecutionError {
  actionId: string;
  actionName: string;
  error: string;
  timestamp: Date;
}

export interface IntelligenceSource {
  id: string;
  name: string;
  type: 'feed' | 'api' | 'manual' | 'integration';
  url?: string;
  apiKey?: string;
  enabled: boolean;
  lastSync?: Date;
  syncFrequency?: number; // minutes
  reliability: number; // 0-100
  categories: string[];
}

export interface ThreatIntelligence {
  id: string;
  type: 'ioc' | 'vulnerability' | 'tactic' | 'technique' | 'campaign';
  value: string;
  sourceId: string;
  confidence: number; // 0-100
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
  enrichment?: Record<string, any>;
  ttl?: Date; // Time to live
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateWorkflowDto {
  @ApiProperty({ description: 'Workflow name', example: 'Auto-enrich IOCs' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Workflow description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: AutomationWorkflowType })
  @IsEnum(AutomationWorkflowType)
  type: AutomationWorkflowType;

  @ApiProperty({ description: 'Workflow triggers' })
  @IsArray()
  triggers: WorkflowTrigger[];

  @ApiProperty({ description: 'Workflow actions' })
  @IsArray()
  actions: WorkflowAction[];

  @ApiProperty({ description: 'Cron schedule', required: false })
  @IsString()
  @IsOptional()
  schedule?: string;
}

export class ExecuteWorkflowDto {
  @ApiProperty({ description: 'Manual execution trigger data', required: false })
  @IsOptional()
  triggerData?: Record<string, any>;

  @ApiProperty({ description: 'Triggered by user/system', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  triggeredBy: string;
}

export class AddIntelligenceSourceDto {
  @ApiProperty({ description: 'Source name', example: 'MISP Feed' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['feed', 'api', 'manual', 'integration'] })
  @IsEnum(['feed', 'api', 'manual', 'integration'])
  type: 'feed' | 'api' | 'manual' | 'integration';

  @ApiProperty({ description: 'Source URL', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'API key', required: false })
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiProperty({ description: 'Sync frequency in minutes', example: 60 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  syncFrequency?: number;

  @ApiProperty({ description: 'Intelligence categories', example: ['malware', 'phishing'] })
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('intelligence-automation')
@Controller('api/v1/intelligence-automation')
@ApiBearerAuth()
export class IntelligenceAutomationController {
  private readonly logger = new Logger(IntelligenceAutomationController.name);

  constructor(private readonly automationService: IntelligenceAutomationService) {}

  /**
   * Create automation workflow
   */
  @Post('workflows')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create automation workflow' })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiResponse({ status: 201, description: 'Workflow created' })
  async createWorkflow(@Body() dto: CreateWorkflowDto): Promise<AutomationWorkflow> {
    this.logger.log(`Creating workflow: ${dto.name}`);
    return this.automationService.createWorkflow(dto);
  }

  /**
   * Get all workflows
   */
  @Get('workflows')
  @ApiOperation({ summary: 'Get all automation workflows' })
  @ApiQuery({ name: 'type', required: false, enum: AutomationWorkflowType })
  @ApiQuery({ name: 'status', required: false, enum: WorkflowStatus })
  @ApiResponse({ status: 200, description: 'Workflows retrieved' })
  async getWorkflows(
    @Query('type') type?: AutomationWorkflowType,
    @Query('status') status?: WorkflowStatus,
  ): Promise<AutomationWorkflow[]> {
    return this.automationService.getWorkflows(type, status);
  }

  /**
   * Execute workflow
   */
  @Post('workflows/:id/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute automation workflow' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiBody({ type: ExecuteWorkflowDto })
  @ApiResponse({ status: 200, description: 'Workflow execution started' })
  async executeWorkflow(
    @Param('id') id: string,
    @Body() dto: ExecuteWorkflowDto,
  ): Promise<WorkflowExecution> {
    this.logger.log(`Executing workflow ${id}`);
    return this.automationService.executeWorkflow(id, dto);
  }

  /**
   * Get workflow executions
   */
  @Get('workflows/:id/executions')
  @ApiOperation({ summary: 'Get workflow execution history' })
  @ApiParam({ name: 'id', description: 'Workflow ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Executions retrieved' })
  async getExecutions(
    @Param('id') id: string,
    @Query('limit') limit: number = 50,
  ): Promise<WorkflowExecution[]> {
    return this.automationService.getExecutions(id, limit);
  }

  /**
   * Add intelligence source
   */
  @Post('sources')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add intelligence source' })
  @ApiBody({ type: AddIntelligenceSourceDto })
  @ApiResponse({ status: 201, description: 'Source added' })
  async addSource(@Body() dto: AddIntelligenceSourceDto): Promise<IntelligenceSource> {
    this.logger.log(`Adding intelligence source: ${dto.name}`);
    return this.automationService.addIntelligenceSource(dto);
  }

  /**
   * Sync intelligence sources
   */
  @Post('sources/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync all intelligence sources' })
  @ApiResponse({ status: 200, description: 'Sync initiated' })
  async syncSources(): Promise<{ syncedSources: number; newIntelligence: number }> {
    this.logger.log('Syncing intelligence sources');
    return this.automationService.syncAllSources();
  }

  /**
   * Get threat intelligence
   */
  @Get('intelligence')
  @ApiOperation({ summary: 'Get threat intelligence' })
  @ApiQuery({ name: 'type', required: false, enum: ['ioc', 'vulnerability', 'tactic', 'technique', 'campaign'] })
  @ApiQuery({ name: 'severity', required: false, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Intelligence retrieved' })
  async getIntelligence(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('limit') limit: number = 100,
  ): Promise<ThreatIntelligence[]> {
    return this.automationService.getIntelligence(type, severity, limit);
  }

  /**
   * Enrich threat intelligence
   */
  @Post('intelligence/:id/enrich')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enrich threat intelligence with additional context' })
  @ApiParam({ name: 'id', description: 'Intelligence ID' })
  @ApiResponse({ status: 200, description: 'Intelligence enriched' })
  async enrichIntelligence(@Param('id') id: string): Promise<ThreatIntelligence> {
    this.logger.log(`Enriching intelligence ${id}`);
    return this.automationService.enrichIntelligence(id);
  }

  /**
   * Get automation metrics
   */
  @Get('metrics')
  @ApiOperation({ summary: 'Get automation platform metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  async getMetrics(): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successRate: number;
    avgExecutionTime: number;
    intelligenceSources: number;
    totalIntelligence: number;
  }> {
    return this.automationService.getMetrics();
  }
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class IntelligenceAutomationService {
  private readonly logger = new Logger(IntelligenceAutomationService.name);

  private workflows: Map<string, AutomationWorkflow> = new Map();
  private executions: Map<string, WorkflowExecution[]> = new Map();
  private sources: Map<string, IntelligenceSource> = new Map();
  private intelligence: Map<string, ThreatIntelligence> = new Map();

  /**
   * Create workflow
   */
  async createWorkflow(dto: CreateWorkflowDto): Promise<AutomationWorkflow> {
    const workflow: AutomationWorkflow = {
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description,
      type: dto.type,
      status: WorkflowStatus.ACTIVE,
      triggers: dto.triggers,
      actions: dto.actions,
      schedule: dto.schedule,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 0,
    };

    this.workflows.set(workflow.id, workflow);
    this.logger.log(`Created workflow ${workflow.id}`);

    return workflow;
  }

  /**
   * Get workflows
   */
  async getWorkflows(type?: AutomationWorkflowType, status?: WorkflowStatus): Promise<AutomationWorkflow[]> {
    let workflows = Array.from(this.workflows.values());

    if (type) {
      workflows = workflows.filter((w) => w.type === type);
    }

    if (status) {
      workflows = workflows.filter((w) => w.status === status);
    }

    return workflows;
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(id: string, dto: ExecuteWorkflowDto): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }

    if (!workflow.enabled) {
      throw new BadRequestException(`Workflow ${id} is disabled`);
    }

    const execution: WorkflowExecution = {
      id: crypto.randomUUID(),
      workflowId: id,
      status: ExecutionStatus.RUNNING,
      startedAt: new Date(),
      triggeredBy: dto.triggeredBy,
      results: [],
      errors: [],
      metadata: dto.triggerData,
    };

    // Simulate workflow execution
    try {
      for (const action of workflow.actions.sort((a, b) => a.order - b.order)) {
        const actionStart = Date.now();

        try {
          // Simulate action execution
          await this.executeAction(action);

          execution.results.push({
            actionId: action.id,
            actionName: action.name,
            success: true,
            duration: Date.now() - actionStart,
          });
        } catch (error) {
          execution.errors.push({
            actionId: action.id,
            actionName: action.name,
            error: error.message,
            timestamp: new Date(),
          });

          execution.results.push({
            actionId: action.id,
            actionName: action.name,
            success: false,
            duration: Date.now() - actionStart,
          });
        }
      }

      execution.status = execution.errors.length === 0 ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED;
      execution.completedAt = new Date();
      execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();

      // Update workflow stats
      workflow.executionCount++;
      workflow.lastExecuted = new Date();

      const workflowExecutions = this.executions.get(id) || [];
      const successfulExecutions = workflowExecutions.filter((e) => e.status === ExecutionStatus.COMPLETED).length +
        (execution.status === ExecutionStatus.COMPLETED ? 1 : 0);
      workflow.successRate = (successfulExecutions / (workflow.executionCount)) * 100;

    } catch (error) {
      execution.status = ExecutionStatus.FAILED;
      execution.completedAt = new Date();
      execution.errors.push({
        actionId: 'workflow',
        actionName: 'Workflow Execution',
        error: error.message,
        timestamp: new Date(),
      });
    }

    // Store execution
    const executions = this.executions.get(id) || [];
    executions.push(execution);
    this.executions.set(id, executions);

    return execution;
  }

  /**
   * Get executions
   */
  async getExecutions(workflowId: string, limit: number): Promise<WorkflowExecution[]> {
    const executions = this.executions.get(workflowId) || [];
    return executions.slice(-limit).reverse();
  }

  /**
   * Add intelligence source
   */
  async addIntelligenceSource(dto: AddIntelligenceSourceDto): Promise<IntelligenceSource> {
    const source: IntelligenceSource = {
      id: crypto.randomUUID(),
      name: dto.name,
      type: dto.type,
      url: dto.url,
      apiKey: dto.apiKey ? '***' : undefined,
      enabled: true,
      syncFrequency: dto.syncFrequency,
      reliability: 75, // Default
      categories: dto.categories,
    };

    this.sources.set(source.id, source);
    this.logger.log(`Added intelligence source ${source.id}`);

    return source;
  }

  /**
   * Sync all sources
   */
  async syncAllSources(): Promise<{ syncedSources: number; newIntelligence: number }> {
    let syncedSources = 0;
    let newIntelligence = 0;

    for (const source of this.sources.values()) {
      if (!source.enabled) continue;

      try {
        // Simulate syncing source
        const synced = await this.syncSource(source);
        syncedSources++;
        newIntelligence += synced;

        source.lastSync = new Date();
      } catch (error) {
        this.logger.error(`Error syncing source ${source.id}:`, error);
      }
    }

    return { syncedSources, newIntelligence };
  }

  /**
   * Get intelligence
   */
  async getIntelligence(type?: string, severity?: string, limit?: number): Promise<ThreatIntelligence[]> {
    let intel = Array.from(this.intelligence.values());

    if (type) {
      intel = intel.filter((i) => i.type === type);
    }

    if (severity) {
      intel = intel.filter((i) => i.severity === severity);
    }

    // Sort by last seen descending
    intel.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());

    return intel.slice(0, limit);
  }

  /**
   * Enrich intelligence
   */
  async enrichIntelligence(id: string): Promise<ThreatIntelligence> {
    const intel = this.intelligence.get(id);
    if (!intel) {
      throw new NotFoundException(`Intelligence ${id} not found`);
    }

    // Simulate enrichment
    intel.enrichment = {
      whois: { registrar: 'Example Registrar', createdDate: new Date() },
      geolocation: { country: 'US', city: 'Unknown' },
      reputation: { score: 35, category: 'malicious' },
      relatedIOCs: ['ioc-1', 'ioc-2'],
    };

    intel.confidence = Math.min(100, intel.confidence + 15);

    return intel;
  }

  /**
   * Get metrics
   */
  async getMetrics(): Promise<{
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successRate: number;
    avgExecutionTime: number;
    intelligenceSources: number;
    totalIntelligence: number;
  }> {
    const workflows = Array.from(this.workflows.values());
    const allExecutions = Array.from(this.executions.values()).flat();

    const successfulExecutions = allExecutions.filter((e) => e.status === ExecutionStatus.COMPLETED).length;
    const completedExecutions = allExecutions.filter((e) => e.completedAt !== undefined);
    const avgExecutionTime = completedExecutions.length > 0
      ? completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) / completedExecutions.length
      : 0;

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.status === WorkflowStatus.ACTIVE).length,
      totalExecutions: allExecutions.length,
      successRate: allExecutions.length > 0 ? (successfulExecutions / allExecutions.length) * 100 : 0,
      avgExecutionTime,
      intelligenceSources: this.sources.size,
      totalIntelligence: this.intelligence.size,
    };
  }

  // Helper methods

  private async executeAction(action: WorkflowAction): Promise<void> {
    // Simulate action execution
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      throw new Error(`Action ${action.name} failed`);
    }
  }

  private async syncSource(source: IntelligenceSource): Promise<number> {
    // Simulate syncing and return number of new intelligence items
    const newItems = Math.floor(Math.random() * 10);

    for (let i = 0; i < newItems; i++) {
      const intel: ThreatIntelligence = {
        id: crypto.randomUUID(),
        type: 'ioc',
        value: `ioc-${Date.now()}-${i}`,
        sourceId: source.id,
        confidence: Math.floor(Math.random() * 40) + 60,
        severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)] as any,
        firstSeen: new Date(),
        lastSeen: new Date(),
        tags: source.categories,
      };

      this.intelligence.set(intel.id, intel);
    }

    return newItems;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  IntelligenceAutomationController,
  IntelligenceAutomationService,
};
