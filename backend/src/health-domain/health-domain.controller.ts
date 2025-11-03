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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HealthDomainService } from './health-domain.service';
import {
  HealthDomainCreateRecordDto,
  HealthDomainUpdateRecordDto,
  CreateAllergyDto,
  HealthDomainUpdateAllergyDto,
  CreateImmunizationDto,
  UpdateImmunizationDto,
  HealthDomainCreateChronicConditionDto,
  HealthDomainUpdateChronicConditionDto,
  HealthRecordFiltersDto,
  AllergyFiltersDto,
  VaccinationFiltersDto,
  ChronicConditionFiltersDto,
  PaginationDto,
} from './dto';
import {
  CreateExemptionDto,
  UpdateExemptionDto,
  ExemptionFilterDto,
} from './dto/exemption.dto';
import {
  GetScheduleByAgeDto,
  GetCatchUpScheduleDto,
  SchoolEntryRequirementsDto,
  CheckContraindicationsDto,
  VaccinationRatesQueryDto,
  StateReportingExportDto,
  OverdueVaccinationsQueryDto,
} from './dto/schedule.dto';

@ApiTags('health-domain')
@Controller('health-domain')
export class HealthDomainController {
  constructor(private readonly healthDomainService: HealthDomainService) {}

  // ============================================================================
  // HEALTH RECORDS ENDPOINTS
  // ============================================================================

  @Post('records')
  @ApiOperation({ summary: 'Create a new health record' })
  @ApiResponse({ status: 201, description: 'Health record created successfully' })
  async createHealthRecord(@Body() createDto: HealthDomainCreateRecordDto) {
    return this.healthDomainService.createHealthRecord(createDto);
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'Get health record by ID' })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 200, description: 'Health record retrieved successfully' })
  async getHealthRecord(@Param('id') id: string) {
    return this.healthDomainService.getHealthRecord(id);
  }

  @Put('records/:id')
  @ApiOperation({ summary: 'Update health record' })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 200, description: 'Health record updated successfully' })
  async updateHealthRecord(
    @Param('id') id: string,
    @Body() updateDto: HealthDomainUpdateRecordDto,
  ) {
    return this.healthDomainService.updateHealthRecord(id, updateDto);
  }

  @Delete('records/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete health record' })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 204, description: 'Health record deleted successfully' })
  async deleteHealthRecord(@Param('id') id: string) {
    await this.healthDomainService.deleteHealthRecord(id);
  }

  @Get('records/student/:studentId')
  @ApiOperation({ summary: 'Get health records for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Health records retrieved successfully' })
  async getStudentHealthRecords(
    @Param('studentId') studentId: string,
    @Query() filters: HealthRecordFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getHealthRecords(
      studentId,
      filters,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('records/search')
  @ApiOperation({ summary: 'Search health records' })
  @ApiQuery({ name: 'query', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchHealthRecords(
    @Query('query') query: string,
    @Query() filters: HealthRecordFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.searchHealthRecords(
      query,
      filters,
      pagination.page,
      pagination.limit,
    );
  }

  @Delete('records/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk delete health records' })
  @ApiResponse({ status: 200, description: 'Records deleted successfully' })
  async bulkDeleteHealthRecords(@Body('ids') ids: string[]) {
    return this.healthDomainService.bulkDeleteHealthRecords(ids);
  }

  // ============================================================================
  // ALLERGIES ENDPOINTS
  // ============================================================================

  @Post('allergies')
  @ApiOperation({ summary: 'Create a new allergy record' })
  @ApiResponse({ status: 201, description: 'Allergy record created successfully' })
  async createAllergy(@Body() createDto: CreateAllergyDto) {
    return this.healthDomainService.createAllergy(createDto);
  }

  @Put('allergies/:id')
  @ApiOperation({ summary: 'Update allergy record' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 200, description: 'Allergy record updated successfully' })
  async updateAllergy(
    @Param('id') id: string,
    @Body() updateDto: HealthDomainUpdateAllergyDto,
  ) {
    return this.healthDomainService.updateAllergy(id, updateDto);
  }

  @Delete('allergies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete allergy record' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 204, description: 'Allergy record deleted successfully' })
  async deleteAllergy(@Param('id') id: string) {
    await this.healthDomainService.deleteAllergy(id);
  }

  @Get('allergies/student/:studentId')
  @ApiOperation({ summary: 'Get allergies for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Allergies retrieved successfully' })
  async getStudentAllergies(
    @Param('studentId') studentId: string,
    @Query() filters: AllergyFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getStudentAllergies(
      studentId,
      filters,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('allergies/critical')
  @ApiOperation({ summary: 'Get critical allergies across all students' })
  @ApiResponse({ status: 200, description: 'Critical allergies retrieved successfully' })
  async getCriticalAllergies() {
    return this.healthDomainService.getCriticalAllergies();
  }

  @Post('allergies/:id/verify')
  @ApiOperation({ summary: 'Verify an allergy' })
  @ApiParam({ name: 'id', description: 'Allergy ID' })
  @ApiResponse({ status: 200, description: 'Allergy verified successfully' })
  async verifyAllergy(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
  ) {
    return this.healthDomainService.verifyAllergy(id, verifiedBy);
  }

  // ============================================================================
  // IMMUNIZATIONS ENDPOINTS
  // ============================================================================

  @Post('immunizations')
  @ApiOperation({ summary: 'Create a new immunization record' })
  @ApiResponse({ status: 201, description: 'Immunization record created successfully' })
  async createImmunization(@Body() createDto: CreateImmunizationDto) {
    return this.healthDomainService.createImmunization(createDto);
  }

  @Put('immunizations/:id')
  @ApiOperation({ summary: 'Update immunization record' })
  @ApiParam({ name: 'id', description: 'Immunization ID' })
  @ApiResponse({ status: 200, description: 'Immunization record updated successfully' })
  async updateImmunization(
    @Param('id') id: string,
    @Body() updateDto: UpdateImmunizationDto,
  ) {
    return this.healthDomainService.updateImmunization(id, updateDto);
  }

  @Delete('immunizations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete immunization record' })
  @ApiParam({ name: 'id', description: 'Immunization ID' })
  @ApiResponse({ status: 204, description: 'Immunization record deleted successfully' })
  async deleteImmunization(@Param('id') id: string) {
    await this.healthDomainService.deleteImmunization(id);
  }

  @Get('immunizations/student/:studentId')
  @ApiOperation({ summary: 'Get immunizations for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Immunizations retrieved successfully' })
  async getStudentImmunizations(
    @Param('studentId') studentId: string,
    @Query() filters: VaccinationFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getStudentImmunizations(
      studentId,
      filters,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('immunizations/compliance/:studentId')
  @ApiOperation({ summary: 'Get immunization compliance report for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Compliance report retrieved successfully' })
  async getImmunizationCompliance(@Param('studentId') studentId: string) {
    return this.healthDomainService.getImmunizationCompliance(studentId);
  }

  @Get('immunizations/overdue')
  @ApiOperation({ summary: 'Get overdue immunizations across all students' })
  @ApiResponse({ status: 200, description: 'Overdue immunizations retrieved successfully' })
  async getOverdueImmunizations(@Query() queryDto: OverdueVaccinationsQueryDto) {
    return this.healthDomainService.getOverdueImmunizations(queryDto);
  }

  // ============================================================================
  // IMMUNIZATION EXEMPTIONS ENDPOINTS
  // ============================================================================

  @Post('immunizations/exemptions')
  @ApiOperation({
    summary: 'Record vaccine exemption',
    description:
      'Creates a new vaccine exemption request. Medical exemptions require provider documentation.',
  })
  @ApiResponse({ status: 201, description: 'Exemption created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid exemption data' })
  async createExemption(@Body() createDto: CreateExemptionDto) {
    return this.healthDomainService.createExemption(createDto);
  }

  @Get('immunizations/exemptions')
  @ApiOperation({ summary: 'List vaccine exemptions with filters' })
  @ApiResponse({ status: 200, description: 'Exemptions retrieved successfully' })
  async getExemptions(
    @Query() filterDto: ExemptionFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getExemptions(filterDto, pagination.page, pagination.limit);
  }

  @Get('immunizations/exemptions/:id')
  @ApiOperation({ summary: 'Get exemption by ID' })
  @ApiParam({ name: 'id', description: 'Exemption UUID' })
  @ApiResponse({ status: 200, description: 'Exemption retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Exemption not found' })
  async getExemption(@Param('id') id: string) {
    return this.healthDomainService.getExemption(id);
  }

  @Put('immunizations/exemptions/:id')
  @ApiOperation({
    summary: 'Update exemption',
    description: 'Updates exemption details or status (approve/deny)',
  })
  @ApiParam({ name: 'id', description: 'Exemption UUID' })
  @ApiResponse({ status: 200, description: 'Exemption updated successfully' })
  @ApiResponse({ status: 404, description: 'Exemption not found' })
  async updateExemption(@Param('id') id: string, @Body() updateDto: UpdateExemptionDto) {
    return this.healthDomainService.updateExemption(id, updateDto);
  }

  @Delete('immunizations/exemptions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete exemption' })
  @ApiParam({ name: 'id', description: 'Exemption UUID' })
  @ApiResponse({ status: 204, description: 'Exemption deleted successfully' })
  async deleteExemption(@Param('id') id: string) {
    await this.healthDomainService.deleteExemption(id);
  }

  @Get('immunizations/exemptions/student/:studentId')
  @ApiOperation({ summary: 'Get all exemptions for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Student exemptions retrieved successfully' })
  async getStudentExemptions(@Param('studentId') studentId: string) {
    return this.healthDomainService.getStudentExemptions(studentId);
  }

  // ============================================================================
  // CDC SCHEDULE ENDPOINTS
  // ============================================================================

  @Get('immunizations/schedules/age')
  @ApiOperation({
    summary: 'Get vaccination schedule by age',
    description: 'Returns CDC-recommended vaccination schedule for specific age',
  })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully' })
  async getScheduleByAge(@Query() queryDto: GetScheduleByAgeDto) {
    return this.healthDomainService.getScheduleByAge(queryDto);
  }

  @Get('immunizations/schedules/catch-up')
  @ApiOperation({
    summary: 'Get catch-up vaccination schedule',
    description: 'Calculates catch-up schedule for students who are behind on vaccinations',
  })
  @ApiResponse({ status: 200, description: 'Catch-up schedule retrieved successfully' })
  async getCatchUpSchedule(@Query() queryDto: GetCatchUpScheduleDto) {
    return this.healthDomainService.getCatchUpSchedule(queryDto);
  }

  @Get('immunizations/schedules/school-entry')
  @ApiOperation({
    summary: 'Get school entry requirements',
    description: 'Returns state-specific vaccination requirements for school entry by grade level',
  })
  @ApiResponse({ status: 200, description: 'School entry requirements retrieved successfully' })
  async getSchoolEntryRequirements(@Query() queryDto: SchoolEntryRequirementsDto) {
    return this.healthDomainService.getSchoolEntryRequirements(queryDto);
  }

  @Post('immunizations/schedules/check-contraindications')
  @ApiOperation({
    summary: 'Check contraindications for vaccine',
    description: 'Checks student allergies and conditions for vaccine contraindications',
  })
  @ApiResponse({ status: 200, description: 'Contraindications check completed' })
  async checkContraindications(@Body() queryDto: CheckContraindicationsDto) {
    return this.healthDomainService.checkContraindications(queryDto);
  }

  // ============================================================================
  // VACCINATION REPORTING ENDPOINTS
  // ============================================================================

  @Get('immunizations/reports/vaccination-rates')
  @ApiOperation({
    summary: 'Get vaccination rates report',
    description: 'Generates vaccination coverage rates by school, grade, or vaccine type',
  })
  @ApiResponse({ status: 200, description: 'Vaccination rates retrieved successfully' })
  async getVaccinationRates(@Query() queryDto: VaccinationRatesQueryDto) {
    return this.healthDomainService.getVaccinationRates(queryDto);
  }

  @Post('immunizations/reports/state-export')
  @ApiOperation({
    summary: 'Generate state registry export',
    description: 'Exports vaccination data in state-required format (HL7, CSV, etc.) for registry submission',
  })
  @ApiResponse({ status: 200, description: 'State report generated successfully' })
  async generateStateReport(@Body() exportDto: StateReportingExportDto) {
    return this.healthDomainService.generateStateReport(exportDto);
  }

  @Get('immunizations/reports/compliance-summary')
  @ApiOperation({
    summary: 'Get compliance summary report',
    description: 'Returns overall compliance statistics across schools/grades',
  })
  @ApiResponse({ status: 200, description: 'Compliance summary retrieved successfully' })
  async getComplianceSummary(
    @Query('schoolId') schoolId?: string,
    @Query('gradeLevel') gradeLevel?: string,
  ) {
    return this.healthDomainService.getComplianceSummary(schoolId, gradeLevel);
  }

  @Get('immunizations/reports/exemption-rates')
  @ApiOperation({
    summary: 'Get exemption rates report',
    description: 'Returns exemption statistics by type, school, and vaccine',
  })
  @ApiResponse({ status: 200, description: 'Exemption rates retrieved successfully' })
  async getExemptionRates(
    @Query('schoolId') schoolId?: string,
    @Query('vaccineName') vaccineName?: string,
  ) {
    return this.healthDomainService.getExemptionRates(schoolId, vaccineName);
  }

  // ============================================================================
  // CHRONIC CONDITIONS ENDPOINTS
  // ============================================================================

  @Post('chronic-conditions')
  @ApiOperation({ summary: 'Create a new chronic condition record' })
  @ApiResponse({ status: 201, description: 'Chronic condition record created successfully' })
  async createChronicCondition(@Body() createDto: HealthDomainCreateChronicConditionDto) {
    return this.healthDomainService.createChronicCondition(createDto);
  }

  @Put('chronic-conditions/:id')
  @ApiOperation({ summary: 'Update chronic condition record' })
  @ApiParam({ name: 'id', description: 'Chronic condition ID' })
  @ApiResponse({ status: 200, description: 'Chronic condition record updated successfully' })
  async updateChronicCondition(
    @Param('id') id: string,
    @Body() updateDto: HealthDomainUpdateChronicConditionDto,
  ) {
    return this.healthDomainService.updateChronicCondition(id, updateDto);
  }

  @Delete('chronic-conditions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete chronic condition record' })
  @ApiParam({ name: 'id', description: 'Chronic condition ID' })
  @ApiResponse({ status: 204, description: 'Chronic condition record deleted successfully' })
  async deleteChronicCondition(@Param('id') id: string) {
    await this.healthDomainService.deleteChronicCondition(id);
  }

  @Get('chronic-conditions/student/:studentId')
  @ApiOperation({ summary: 'Get chronic conditions for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Chronic conditions retrieved successfully' })
  async getStudentChronicConditions(
    @Param('studentId') studentId: string,
    @Query() filters: ChronicConditionFiltersDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getStudentChronicConditions(
      studentId,
      filters,
      pagination.page,
      pagination.limit,
    );
  }

  // ============================================================================
  // VITAL SIGNS ENDPOINTS
  // ============================================================================

  @Post('vital-signs')
  @ApiOperation({ summary: 'Record vital signs' })
  @ApiResponse({ status: 201, description: 'Vital signs recorded successfully' })
  async recordVitalSigns(
    @Body('studentId') studentId: string,
    @Body('vitals') vitals: any,
    @Body('notes') notes?: string,
  ) {
    return this.healthDomainService.recordVitalSigns(studentId, vitals, notes);
  }

  @Get('vital-signs/latest/:studentId')
  @ApiOperation({ summary: 'Get latest vital signs for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Latest vital signs retrieved successfully' })
  async getLatestVitalSigns(@Param('studentId') studentId: string) {
    return this.healthDomainService.getLatestVitalSigns(studentId);
  }

  @Get('vital-signs/student/:studentId')
  @ApiOperation({ summary: 'Get vital signs history for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Vital signs history retrieved successfully' })
  async getVitalSignsHistory(
    @Param('studentId') studentId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.healthDomainService.getVitalSignsHistory(
      studentId,
      pagination.page,
      pagination.limit,
    );
  }

  @Get('vital-signs/growth/:studentId')
  @ApiOperation({ summary: 'Get growth chart data for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Growth data retrieved successfully' })
  async getGrowthData(@Param('studentId') studentId: string) {
    return this.healthDomainService.getGrowthData(studentId);
  }

  @Get('vital-signs/abnormal/:studentId')
  @ApiOperation({ summary: 'Check for abnormal vital signs' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Abnormal vitals check completed' })
  async checkAbnormalVitals(@Param('studentId') studentId: string) {
    return this.healthDomainService.checkAbnormalVitals(studentId);
  }

  // ============================================================================
  // ANALYTICS ENDPOINTS
  // ============================================================================

  @Get('analytics/summary/:studentId')
  @ApiOperation({ summary: 'Get health summary for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Health summary retrieved successfully' })
  async getHealthSummary(@Param('studentId') studentId: string) {
    return this.healthDomainService.getHealthSummary(studentId);
  }

  @Get('analytics/statistics')
  @ApiOperation({ summary: 'Get health statistics' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Optional student ID' })
  @ApiResponse({ status: 200, description: 'Health statistics retrieved successfully' })
  async getHealthStatistics(@Query('studentId') studentId?: string) {
    return this.healthDomainService.getHealthStatistics(studentId);
  }

  // ============================================================================
  // IMPORT/EXPORT ENDPOINTS
  // ============================================================================

  @Post('export/:studentId')
  @ApiOperation({ summary: 'Export student health data' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  async exportStudentData(
    @Param('studentId') studentId: string,
    @Body() options: any,
  ) {
    return this.healthDomainService.exportStudentData(studentId, options);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import student health data' })
  @ApiResponse({ status: 201, description: 'Data imported successfully' })
  async importStudentData(
    @Body('importData') importData: any,
    @Body('options') options: any,
  ) {
    return this.healthDomainService.importStudentData(importData, options);
  }
}
