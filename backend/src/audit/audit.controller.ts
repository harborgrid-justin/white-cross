import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';
import { AuditLogSearchDto } from './dto/audit-log-search.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { PaginatedAuditLogsDto } from './dto/paginated-audit-logs.dto';
import { PHIAccessFilterDto } from './dto/phi-access-filter.dto';
import { CreateBasicAuditLogDto } from './dto/create-audit-log.dto';
import { CreatePHIAccessLogDto } from './dto/create-phi-access-log.dto';

import { BaseController } from '../../common/base';
/**
 * Audit Controller
 *
 * Provides REST endpoints for querying audit logs, PHI access logs,
 * generating compliance reports, and security analysis.
 *
 * HIPAA Compliance: All endpoints are secured and require authentication.
 * Access to audit logs should be restricted to administrators and compliance officers.
 */
@ApiTags('Audit')
@Controller('audit')
@ApiBearerAuth()
export class AuditController extends BaseController {
  constructor(private readonly auditService: AuditService) {}

  // ========== AUDIT LOG CREATION ENDPOINTS ==========

  @Post('log')
  @ApiOperation({ 
    summary: 'Create audit log entry',
    description: 'Log a general system action for audit trail compliance'
  })
  @ApiBody({ type: CreateBasicAuditLogDto })
  @ApiResponse({
    status: 201,
    description: 'Audit log created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid audit log data',
  })
  async createAuditLog(@Body() createAuditLogDto: CreateBasicAuditLogDto) {
    await this.auditService.logAction({
      userId: createAuditLogDto.userId,
      action: createAuditLogDto.action,
      entityType: createAuditLogDto.entityType,
      entityId: createAuditLogDto.entityId,
      changes: createAuditLogDto.changes,
      ipAddress: createAuditLogDto.ipAddress,
      userAgent: createAuditLogDto.userAgent,
      success: createAuditLogDto.success,
      errorMessage: createAuditLogDto.errorMessage,
    });
    return {
      success: true,
      message: 'Audit log created successfully',
    };
  }

  @Post('phi-access')
  @ApiOperation({ 
    summary: 'Log PHI access (HIPAA required)',
    description: 'Log access to Protected Health Information for HIPAA compliance'
  })
  @ApiBody({ type: CreatePHIAccessLogDto })
  @ApiResponse({
    status: 201,
    description: 'PHI access log created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid PHI access log data',
  })
  async createPHIAccessLog(@Body() createPHIAccessLogDto: CreatePHIAccessLogDto) {
    await this.auditService.logPHIAccess({
      userId: createPHIAccessLogDto.userId,
      action: createPHIAccessLogDto.action,
      entityType: createPHIAccessLogDto.entityType,
      entityId: createPHIAccessLogDto.entityId,
      changes: createPHIAccessLogDto.changes,
      ipAddress: createPHIAccessLogDto.ipAddress,
      userAgent: createPHIAccessLogDto.userAgent,
      success: createPHIAccessLogDto.success,
      errorMessage: createPHIAccessLogDto.errorMessage,
      studentId: createPHIAccessLogDto.studentId,
      accessType: createPHIAccessLogDto.accessType,
      dataCategory: createPHIAccessLogDto.dataCategory,
    });
    return {
      success: true,
      message: 'PHI access log created successfully',
    };
  }

  // ========== AUDIT LOG QUERY ENDPOINTS ==========

  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs with filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated audit logs',
    type: PaginatedAuditLogsDto,
  })
  async getAuditLogs(@Query() filters: AuditLogFilterDto) {
    try {
      return await this.auditService.getAuditLogs({
        ...filters,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch audit logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('logs/recent')
  @ApiOperation({ summary: 'Get recent audit logs' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns recent audit logs' })
  async getRecentLogs(@Query('limit') limit?: number) {
    return this.auditService.getRecentAuditLogs(limit || 50);
  }

  @Get('logs/search')
  @ApiOperation({ summary: 'Search audit logs by keyword' })
  @ApiResponse({
    status: 200,
    description: 'Returns search results',
    type: PaginatedAuditLogsDto,
  })
  async searchLogs(@Query() searchDto: AuditLogSearchDto) {
    return this.auditService.searchAuditLogs(searchDto);
  }

  @Get('logs/entity/:type/:id')
  @ApiOperation({ summary: 'Get audit history for a specific entity' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns entity audit history',
    type: PaginatedAuditLogsDto,
  })
  async getEntityHistory(
    @Param('type') entityType: string,
    @Param('id') entityId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getEntityAuditHistory(
      entityType,
      entityId,
      page || 1,
      limit || 20,
    );
  }

  @Get('logs/user/:userId')
  @ApiOperation({ summary: 'Get audit history for a specific user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns user audit history',
    type: PaginatedAuditLogsDto,
  })
  async getUserHistory(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getUserAuditHistory(
      userId,
      page || 1,
      limit || 20,
    );
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get specific audit log by ID' })
  @ApiResponse({ status: 200, description: 'Returns audit log details' })
  @ApiResponse({ status: 404, description: 'Audit log not found' })
  async getAuditLogById(@Param('id') id: string) {
    const log = await this.auditService.getAuditLogById(id);
    if (!log) {
      throw new HttpException('Audit log not found', HttpStatus.NOT_FOUND);
    }
    return log;
  }

  // ========== PHI ACCESS ENDPOINTS ==========

  @Get('phi-access')
  @ApiOperation({ summary: 'Get PHI access logs with filters (HIPAA)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated PHI access logs',
  })
  async getPHIAccessLogs(@Query() filters: PHIAccessFilterDto) {
    try {
      return await this.auditService.getPHIAccessLogs({
        ...filters,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch PHI access logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('phi-access/student/:studentId')
  @ApiOperation({ summary: 'Get PHI access logs for a specific student' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns student PHI access logs' })
  async getStudentPHIAccess(
    @Param('studentId') studentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getStudentPHIAccessLogs(
      studentId,
      page || 1,
      limit || 20,
    );
  }

  @Get('phi-access/user/:userId')
  @ApiOperation({ summary: 'Get PHI access logs for a specific user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns user PHI access logs' })
  async getUserPHIAccess(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getUserPHIAccessLogs(
      userId,
      page || 1,
      limit || 20,
    );
  }

  // ========== COMPLIANCE ENDPOINTS ==========

  @Get('compliance/report')
  @ApiOperation({ summary: 'Generate HIPAA compliance report' })
  @ApiResponse({ status: 200, description: 'Returns compliance report' })
  async getComplianceReport(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.getComplianceReport(startDate, endDate);
  }

  @Get('compliance/phi-summary')
  @ApiOperation({ summary: 'Get PHI access summary for compliance' })
  @ApiResponse({ status: 200, description: 'Returns PHI access summary' })
  async getPHIAccessSummary(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.getPHIAccessSummary(startDate, endDate);
  }

  // ========== STATISTICS ENDPOINTS ==========

  @Get('statistics')
  @ApiOperation({ summary: 'Get audit statistics' })
  @ApiResponse({ status: 200, description: 'Returns audit statistics' })
  async getStatistics(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.getAuditStatistics(startDate, endDate);
  }

  @Get('statistics/dashboard')
  @ApiOperation({ summary: 'Get comprehensive audit dashboard data' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  async getDashboard(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.getAuditDashboard(startDate, endDate);
  }

  // ========== SECURITY ENDPOINTS ==========

  @Get('security/suspicious-logins')
  @ApiOperation({ summary: 'Detect suspicious login patterns' })
  @ApiResponse({
    status: 200,
    description: 'Returns suspicious login analysis',
  })
  async detectSuspiciousLogins(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.detectSuspiciousLogins(startDate, endDate);
  }

  @Get('security/report')
  @ApiOperation({ summary: 'Generate comprehensive security report' })
  @ApiResponse({ status: 200, description: 'Returns security analysis report' })
  async getSecurityReport(@Query() dateRange: DateRangeDto) {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    return this.auditService.generateSecurityReport(startDate, endDate);
  }
}
