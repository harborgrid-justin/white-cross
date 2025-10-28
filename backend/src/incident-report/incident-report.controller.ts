import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  IncidentCoreService,
  IncidentFollowUpService,
  IncidentWitnessService,
  IncidentStatisticsService,
  IncidentNotificationService,
} from './services';
import {
  CreateIncidentReportDto,
  UpdateIncidentReportDto,
  CreateFollowUpActionDto,
  UpdateFollowUpActionDto,
  CreateWitnessStatementDto,
  IncidentFiltersDto,
} from './dto';

@ApiTags('incident-report')
@Controller('incident-report')
// @UseGuards(JwtAuthGuard) // Uncomment when auth is set up
// @ApiBearerAuth()
export class IncidentReportController {
  constructor(
    private readonly coreService: IncidentCoreService,
    private readonly followUpService: IncidentFollowUpService,
    private readonly witnessService: IncidentWitnessService,
    private readonly statisticsService: IncidentStatisticsService,
    private readonly notificationService: IncidentNotificationService,
  ) {}

  // ==================== INCIDENT REPORTS ====================

  @Get()
  @ApiOperation({ summary: 'Get all incident reports with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated incident reports' })
  async getIncidentReports(@Query() filters: IncidentFiltersDto) {
    return this.coreService.getIncidentReports(filters);
  }

  @Get('follow-up/required')
  @ApiOperation({ summary: 'Get incidents requiring follow-up' })
  @ApiResponse({ status: 200, description: 'Returns incidents requiring follow-up' })
  async getIncidentsRequiringFollowUp() {
    return this.coreService.getIncidentsRequiringFollowUp();
  }

  @Get('student/:studentId/recent')
  @ApiOperation({ summary: 'Get recent incidents for a student' })
  @ApiParam({ name: 'studentId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 5 })
  @ApiResponse({ status: 200, description: 'Returns recent student incidents' })
  async getStudentRecentIncidents(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('limit') limit?: number,
  ) {
    return this.coreService.getStudentRecentIncidents(
      studentId,
      limit ? parseInt(limit.toString()) : 5,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get incident statistics' })
  @ApiQuery({ name: 'dateFrom', required: false, type: 'string' })
  @ApiQuery({ name: 'dateTo', required: false, type: 'string' })
  @ApiQuery({ name: 'studentId', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns incident statistics' })
  async getStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.statisticsService.getIncidentStatistics(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
      studentId,
    );
  }

  @Get('statistics/by-type')
  @ApiOperation({ summary: 'Get incidents grouped by type' })
  @ApiQuery({ name: 'dateFrom', required: false, type: 'string' })
  @ApiQuery({ name: 'dateTo', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns incidents by type' })
  async getIncidentsByType(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.statisticsService.getIncidentsByType(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('statistics/by-severity')
  @ApiOperation({ summary: 'Get incidents grouped by severity' })
  @ApiQuery({ name: 'dateFrom', required: false, type: 'string' })
  @ApiQuery({ name: 'dateTo', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns incidents by severity' })
  async getIncidentsBySeverity(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.statisticsService.getIncidentsBySeverity(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('statistics/severity-trends')
  @ApiOperation({ summary: 'Get severity trends over time' })
  @ApiQuery({ name: 'dateFrom', required: true, type: 'string' })
  @ApiQuery({ name: 'dateTo', required: true, type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns severity trends' })
  async getSeverityTrends(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.statisticsService.getSeverityTrends(
      new Date(dateFrom),
      new Date(dateTo),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident report by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns incident report' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async getIncidentReportById(@Param('id', ParseUUIDPipe) id: string) {
    return this.coreService.getIncidentReportById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new incident report' })
  @ApiResponse({ status: 201, description: 'Incident report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  async createIncidentReport(@Body() dto: CreateIncidentReportDto) {
    return this.coreService.createIncidentReport(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident report' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Incident report updated successfully' })
  @ApiResponse({ status: 404, description: 'Incident report not found' })
  async updateIncidentReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentReportDto,
  ) {
    return this.coreService.updateIncidentReport(id, dto);
  }

  @Post(':id/follow-up-notes')
  @ApiOperation({ summary: 'Add follow-up notes to incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Follow-up notes added successfully' })
  async addFollowUpNotes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('notes') notes: string,
    @Body('completedBy') completedBy: string,
  ) {
    return this.coreService.addFollowUpNotes(id, notes, completedBy);
  }

  @Post(':id/parent-notified')
  @ApiOperation({ summary: 'Mark parent as notified' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Parent marked as notified' })
  async markParentNotified(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('method') method: string,
    @Body('notifiedBy') notifiedBy: string,
  ) {
    return this.coreService.markParentNotified(id, method, notifiedBy);
  }

  @Post(':id/evidence')
  @ApiOperation({ summary: 'Add evidence to incident report' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Evidence added successfully' })
  async addEvidence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('evidenceType') evidenceType: 'photo' | 'video' | 'attachment',
    @Body('evidenceUrls') evidenceUrls: string[],
  ) {
    return this.coreService.addEvidence(id, evidenceType, evidenceUrls);
  }

  @Patch(':id/insurance')
  @ApiOperation({ summary: 'Update insurance claim information' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Insurance claim updated successfully' })
  async updateInsuranceClaim(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('claimNumber') claimNumber: string,
    @Body('status') status: string,
  ) {
    return this.coreService.updateInsuranceClaim(id, claimNumber, status);
  }

  @Patch(':id/compliance')
  @ApiOperation({ summary: 'Update compliance status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Compliance status updated successfully' })
  async updateComplianceStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.coreService.updateComplianceStatus(id, status);
  }

  @Post(':id/notify-emergency')
  @ApiOperation({ summary: 'Notify emergency contacts for incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Emergency contacts notified' })
  async notifyEmergencyContacts(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.notifyEmergencyContacts(id);
  }

  @Post(':id/notify-parent')
  @ApiOperation({ summary: 'Send parent notification' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Parent notified successfully' })
  async notifyParent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('method') method: string,
    @Body('notifiedBy') notifiedBy: string,
  ) {
    return this.notificationService.notifyParent(id, method, notifiedBy);
  }

  // ==================== FOLLOW-UP ACTIONS ====================

  @Get(':id/follow-up-actions')
  @ApiOperation({ summary: 'Get follow-up actions for incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns follow-up actions' })
  async getFollowUpActions(@Param('id', ParseUUIDPipe) id: string) {
    return this.followUpService.getFollowUpActions(id);
  }

  @Post(':id/follow-up-action')
  @ApiOperation({ summary: 'Add follow-up action to incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Follow-up action created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async addFollowUpAction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateFollowUpActionDto,
  ) {
    return this.followUpService.addFollowUpAction(id, dto);
  }

  @Patch('follow-up-action/:actionId')
  @ApiOperation({ summary: 'Update follow-up action' })
  @ApiParam({ name: 'actionId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Follow-up action updated successfully' })
  async updateFollowUpAction(
    @Param('actionId', ParseUUIDPipe) actionId: string,
    @Body() dto: UpdateFollowUpActionDto,
  ) {
    return this.followUpService.updateFollowUpAction(actionId, dto);
  }

  @Delete('follow-up-action/:actionId')
  @ApiOperation({ summary: 'Delete follow-up action' })
  @ApiParam({ name: 'actionId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Follow-up action deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteFollowUpAction(@Param('actionId', ParseUUIDPipe) actionId: string) {
    return this.followUpService.deleteFollowUpAction(actionId);
  }

  @Get('follow-up-actions/overdue')
  @ApiOperation({ summary: 'Get overdue follow-up actions' })
  @ApiResponse({ status: 200, description: 'Returns overdue follow-up actions' })
  async getOverdueActions() {
    return this.followUpService.getOverdueActions();
  }

  @Get('follow-up-actions/urgent')
  @ApiOperation({ summary: 'Get urgent follow-up actions (due within 24 hours)' })
  @ApiResponse({ status: 200, description: 'Returns urgent follow-up actions' })
  async getUrgentActions() {
    return this.followUpService.getUrgentActions();
  }

  @Get('follow-up-actions/user/:userId')
  @ApiOperation({ summary: 'Get pending follow-up actions for a user' })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns user pending actions' })
  async getUserPendingActions(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followUpService.getUserPendingActions(userId);
  }

  @Get('follow-up-actions/statistics')
  @ApiOperation({ summary: 'Get follow-up action statistics' })
  @ApiQuery({ name: 'dateFrom', required: false, type: 'string' })
  @ApiQuery({ name: 'dateTo', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns follow-up statistics' })
  async getFollowUpStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.followUpService.getFollowUpStatistics(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  // ==================== WITNESS STATEMENTS ====================

  @Get(':id/witness-statements')
  @ApiOperation({ summary: 'Get witness statements for incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns witness statements' })
  async getWitnessStatements(@Param('id', ParseUUIDPipe) id: string) {
    return this.witnessService.getWitnessStatements(id);
  }

  @Post(':id/witness-statement')
  @ApiOperation({ summary: 'Add witness statement to incident' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Witness statement created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async addWitnessStatement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateWitnessStatementDto,
  ) {
    return this.witnessService.addWitnessStatement(id, dto);
  }

  @Patch('witness-statement/:statementId')
  @ApiOperation({ summary: 'Update witness statement' })
  @ApiParam({ name: 'statementId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Witness statement updated successfully' })
  async updateWitnessStatement(
    @Param('statementId', ParseUUIDPipe) statementId: string,
    @Body() data: Partial<CreateWitnessStatementDto>,
  ) {
    return this.witnessService.updateWitnessStatement(statementId, data);
  }

  @Post('witness-statement/:statementId/verify')
  @ApiOperation({ summary: 'Verify witness statement' })
  @ApiParam({ name: 'statementId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Witness statement verified successfully' })
  async verifyWitnessStatement(
    @Param('statementId', ParseUUIDPipe) statementId: string,
    @Body('verifiedBy') verifiedBy: string,
  ) {
    return this.witnessService.verifyWitnessStatement(statementId, verifiedBy);
  }

  @Delete('witness-statement/:statementId')
  @ApiOperation({ summary: 'Delete witness statement' })
  @ApiParam({ name: 'statementId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Witness statement deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteWitnessStatement(
    @Param('statementId', ParseUUIDPipe) statementId: string,
  ) {
    return this.witnessService.deleteWitnessStatement(statementId);
  }

  @Get('witness-statements/unverified')
  @ApiOperation({ summary: 'Get unverified witness statements' })
  @ApiResponse({ status: 200, description: 'Returns unverified witness statements' })
  async getUnverifiedStatements() {
    return this.witnessService.getUnverifiedStatements();
  }
}
