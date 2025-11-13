import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Import services
import { DistrictService } from './services/district.service';
import { SchoolService } from './services/school.service';
import { LicenseService } from './services/license.service';
import { ConfigurationService } from './services/configuration.service';
import { AuditService } from './services/audit.service';
import { BackupService } from './services/backup.service';

// Import DTOs
import { AuditQueryDto } from './dto/audit.dto';
import { BackupQueryDto, CreateBackupDto } from './dto/backup.dto';
import { ConfigurationDto } from './dto/configuration.dto';
import { CreateDistrictDto, DistrictQueryDto, UpdateDistrictDto } from './dto/district.dto';
import { CreateLicenseDto, LicenseQueryDto, UpdateLicenseDto } from './dto/license.dto';
import { CreateSchoolDto, SchoolQueryDto, UpdateSchoolDto } from './dto/school.dto';

import { BaseController } from '../common/base';
/**
 * AdministrationController
 *
 * Handles all administration-related API endpoints
 */
@ApiTags('Administration')
@ApiBearerAuth()
@Controller('administration')
export class AdministrationController extends BaseController {
  constructor(
    private readonly districtService: DistrictService,
    private readonly schoolService: SchoolService,
    private readonly licenseService: LicenseService,
    private readonly configurationService: ConfigurationService,
    private readonly auditService: AuditService,
    private readonly backupService: BackupService,
  ) {}

  // ==================== District Endpoints ====================

  @Post('districts')
  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({ status: 201, description: 'District created successfully' })
  createDistrict(@Body() dto: CreateDistrictDto) {
    return this.districtService.createDistrict(dto);
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts with pagination' })
  @ApiResponse({ status: 200, description: 'Districts retrieved successfully' })
  getDistricts(@Query() query: DistrictQueryDto) {
    return this.districtService.getDistricts(query);
  }

  @Get('districts/:id')
  @ApiOperation({ summary: 'Get district by ID' })
  @ApiResponse({ status: 200, description: 'District retrieved successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  getDistrictById(@Param('id') id: string) {
    return this.districtService.getDistrictById(id);
  }

  @Patch('districts/:id')
  @ApiOperation({ summary: 'Update district' })
  @ApiResponse({ status: 200, description: 'District updated successfully' })
  updateDistrict(@Param('id') id: string, @Body() dto: UpdateDistrictDto) {
    return this.districtService.updateDistrict(id, dto);
  }

  @Delete('districts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete district (soft delete)' })
  @ApiResponse({ status: 204, description: 'District deleted successfully' })
  deleteDistrict(@Param('id') id: string) {
    return this.districtService.deleteDistrict(id);
  }

  // ==================== School Endpoints ====================

  @Post('schools')
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  createSchool(@Body() dto: CreateSchoolDto) {
    return this.schoolService.createSchool(dto);
  }

  @Get('schools')
  @ApiOperation({ summary: 'Get all schools with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Schools retrieved successfully' })
  getSchools(@Query() query: SchoolQueryDto) {
    return this.schoolService.getSchools(query);
  }

  @Get('schools/:id')
  @ApiOperation({ summary: 'Get school by ID' })
  @ApiResponse({ status: 200, description: 'School retrieved successfully' })
  @ApiResponse({ status: 404, description: 'School not found' })
  getSchoolById(@Param('id') id: string) {
    return this.schoolService.getSchoolById(id);
  }

  @Patch('schools/:id')
  @ApiOperation({ summary: 'Update school' })
  @ApiResponse({ status: 200, description: 'School updated successfully' })
  updateSchool(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.updateSchool(id, dto);
  }

  @Delete('schools/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete school (soft delete)' })
  @ApiResponse({ status: 204, description: 'School deleted successfully' })
  deleteSchool(@Param('id') id: string) {
    return this.schoolService.deleteSchool(id);
  }

  // ==================== License Endpoints ====================

  @Post('licenses')
  @ApiOperation({ summary: 'Create a new license' })
  @ApiResponse({ status: 201, description: 'License created successfully' })
  createLicense(@Body() dto: CreateLicenseDto) {
    return this.licenseService.createLicense(dto);
  }

  @Get('licenses')
  @ApiOperation({ summary: 'Get all licenses with pagination' })
  @ApiResponse({ status: 200, description: 'Licenses retrieved successfully' })
  getLicenses(@Query() query: LicenseQueryDto) {
    return this.licenseService.getLicenses(query);
  }

  @Get('licenses/:id')
  @ApiOperation({ summary: 'Get license by ID' })
  @ApiResponse({ status: 200, description: 'License retrieved successfully' })
  @ApiResponse({ status: 404, description: 'License not found' })
  getLicenseById(@Param('id') id: string) {
    return this.licenseService.getLicenseById(id);
  }

  @Patch('licenses/:id')
  @ApiOperation({ summary: 'Update license' })
  @ApiResponse({ status: 200, description: 'License updated successfully' })
  updateLicense(@Param('id') id: string, @Body() dto: UpdateLicenseDto) {
    return this.licenseService.updateLicense(id, dto);
  }

  @Delete('licenses/:id')
  @ApiOperation({ summary: 'Deactivate license' })
  @ApiResponse({ status: 200, description: 'License deactivated successfully' })
  deactivateLicense(@Param('id') id: string) {
    return this.licenseService.deactivateLicense(id);
  }

  // ==================== Configuration Endpoints ====================

  @Get('config/:key')
  @ApiOperation({ summary: 'Get configuration by key' })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully',
  })
  getConfiguration(@Param('key') key: string) {
    return this.configurationService.getConfiguration(key);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get all configurations' })
  @ApiResponse({
    status: 200,
    description: 'Configurations retrieved successfully',
  })
  getAllConfigurations() {
    return this.configurationService.getAllConfigurations();
  }

  @Post('config')
  @ApiOperation({ summary: 'Set configuration value' })
  @ApiResponse({ status: 201, description: 'Configuration set successfully' })
  setConfiguration(@Body() dto: ConfigurationDto) {
    return this.configurationService.setConfiguration(dto);
  }

  @Delete('config/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete configuration' })
  @ApiResponse({
    status: 204,
    description: 'Configuration deleted successfully',
  })
  deleteConfiguration(@Param('key') key: string) {
    return this.configurationService.deleteConfiguration(key);
  }

  @Get('config/:key/history')
  @ApiOperation({ summary: 'Get configuration change history' })
  @ApiResponse({
    status: 200,
    description: 'Configuration history retrieved successfully',
  })
  getConfigurationHistory(@Param('key') key: string) {
    return this.configurationService.getConfigurationHistory(key);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get system settings grouped by category' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  getSystemSettings() {
    return this.configurationService.getSystemSettings();
  }

  // ==================== Audit Log Endpoints ====================

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  getAuditLogs(@Query() query: AuditQueryDto) {
    return this.auditService.getAuditLogs(query);
  }

  // ==================== Backup Endpoints ====================

  @Post('backups')
  @ApiOperation({ summary: 'Create a new backup' })
  @ApiResponse({ status: 201, description: 'Backup initiated successfully' })
  createBackup(@Body() dto: CreateBackupDto) {
    return this.backupService.createBackup(dto);
  }

  @Get('backups')
  @ApiOperation({ summary: 'Get backup logs with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Backup logs retrieved successfully',
  })
  getBackupLogs(@Query() query: BackupQueryDto) {
    return this.backupService.getBackupLogs(query);
  }

  @Get('backups/:id')
  @ApiOperation({ summary: 'Get backup by ID' })
  @ApiResponse({ status: 200, description: 'Backup retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Backup not found' })
  getBackupById(@Param('id') id: string) {
    return this.backupService.getBackupById(id);
  }
}
