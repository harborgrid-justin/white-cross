"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const district_service_1 = require("./services/district.service");
const school_service_1 = require("./services/school.service");
const license_service_1 = require("./services/license.service");
const configuration_service_1 = require("./services/configuration.service");
const audit_service_1 = require("./services/audit.service");
const backup_service_1 = require("./services/backup.service");
const audit_dto_1 = require("./dto/audit.dto");
const backup_dto_1 = require("./dto/backup.dto");
const configuration_dto_1 = require("./dto/configuration.dto");
const district_dto_1 = require("./dto/district.dto");
const license_dto_1 = require("./dto/license.dto");
const school_dto_1 = require("./dto/school.dto");
const base_1 = require("../../common/base");
let AdministrationController = class AdministrationController extends base_1.BaseController {
    districtService;
    schoolService;
    licenseService;
    configurationService;
    auditService;
    backupService;
    constructor(districtService, schoolService, licenseService, configurationService, auditService, backupService) {
        super();
        this.districtService = districtService;
        this.schoolService = schoolService;
        this.licenseService = licenseService;
        this.configurationService = configurationService;
        this.auditService = auditService;
        this.backupService = backupService;
    }
    createDistrict(dto) {
        return this.districtService.createDistrict(dto);
    }
    getDistricts(query) {
        return this.districtService.getDistricts(query);
    }
    getDistrictById(id) {
        return this.districtService.getDistrictById(id);
    }
    updateDistrict(id, dto) {
        return this.districtService.updateDistrict(id, dto);
    }
    deleteDistrict(id) {
        return this.districtService.deleteDistrict(id);
    }
    createSchool(dto) {
        return this.schoolService.createSchool(dto);
    }
    getSchools(query) {
        return this.schoolService.getSchools(query);
    }
    getSchoolById(id) {
        return this.schoolService.getSchoolById(id);
    }
    updateSchool(id, dto) {
        return this.schoolService.updateSchool(id, dto);
    }
    deleteSchool(id) {
        return this.schoolService.deleteSchool(id);
    }
    createLicense(dto) {
        return this.licenseService.createLicense(dto);
    }
    getLicenses(query) {
        return this.licenseService.getLicenses(query);
    }
    getLicenseById(id) {
        return this.licenseService.getLicenseById(id);
    }
    updateLicense(id, dto) {
        return this.licenseService.updateLicense(id, dto);
    }
    deactivateLicense(id) {
        return this.licenseService.deactivateLicense(id);
    }
    getConfiguration(key) {
        return this.configurationService.getConfiguration(key);
    }
    getAllConfigurations() {
        return this.configurationService.getAllConfigurations();
    }
    setConfiguration(dto) {
        return this.configurationService.setConfiguration(dto);
    }
    deleteConfiguration(key) {
        return this.configurationService.deleteConfiguration(key);
    }
    getConfigurationHistory(key) {
        return this.configurationService.getConfigurationHistory(key);
    }
    getSystemSettings() {
        return this.configurationService.getSystemSettings();
    }
    getAuditLogs(query) {
        return this.auditService.getAuditLogs(query);
    }
    createBackup(dto) {
        return this.backupService.createBackup(dto);
    }
    getBackupLogs(query) {
        return this.backupService.getBackupLogs(query);
    }
    getBackupById(id) {
        return this.backupService.getBackupById(id);
    }
};
exports.AdministrationController = AdministrationController;
__decorate([
    (0, common_1.Post)('districts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new district' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'District created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/district.model").District }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [district_dto_1.CreateDistrictDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "createDistrict", null);
__decorate([
    (0, common_1.Get)('districts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all districts with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Districts retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [district_dto_1.DistrictQueryDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('districts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get district by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'District retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'District not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/district.model").District }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getDistrictById", null);
__decorate([
    (0, common_1.Patch)('districts/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update district' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'District updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/district.model").District }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, district_dto_1.UpdateDistrictDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "updateDistrict", null);
__decorate([
    (0, common_1.Delete)('districts/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete district (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'District deleted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "deleteDistrict", null);
__decorate([
    (0, common_1.Post)('schools'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new school' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'School created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/school.model").School }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [school_dto_1.CreateSchoolDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "createSchool", null);
__decorate([
    (0, common_1.Get)('schools'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all schools with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schools retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [school_dto_1.SchoolQueryDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Get)('schools/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get school by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'School retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'School not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/school.model").School }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getSchoolById", null);
__decorate([
    (0, common_1.Patch)('schools/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update school' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'School updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/school.model").School }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, school_dto_1.UpdateSchoolDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "updateSchool", null);
__decorate([
    (0, common_1.Delete)('schools/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete school (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'School deleted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "deleteSchool", null);
__decorate([
    (0, common_1.Post)('licenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new license' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'License created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/license.model").License }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [license_dto_1.CreateLicenseDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "createLicense", null);
__decorate([
    (0, common_1.Get)('licenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all licenses with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Licenses retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [license_dto_1.LicenseQueryDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getLicenses", null);
__decorate([
    (0, common_1.Get)('licenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get license by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'License retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'License not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/license.model").License }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getLicenseById", null);
__decorate([
    (0, common_1.Patch)('licenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update license' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'License updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/license.model").License }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, license_dto_1.UpdateLicenseDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "updateLicense", null);
__decorate([
    (0, common_1.Delete)('licenses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate license' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'License deactivated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/license.model").License }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "deactivateLicense", null);
__decorate([
    (0, common_1.Get)('config/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configuration by key' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getConfiguration", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all configurations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configurations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/system-config.model").SystemConfig] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getAllConfigurations", null);
__decorate([
    (0, common_1.Post)('config'),
    (0, swagger_1.ApiOperation)({ summary: 'Set configuration value' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Configuration set successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/system-config.model").SystemConfig }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_dto_1.ConfigurationDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "setConfiguration", null);
__decorate([
    (0, common_1.Delete)('config/:key'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Configuration deleted successfully',
    }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "deleteConfiguration", null);
__decorate([
    (0, common_1.Get)('config/:key/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configuration change history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration history retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/configuration-history.model").ConfigurationHistory] }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getConfigurationHistory", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system settings grouped by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getSystemSettings", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs with filters and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit logs retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_dto_1.AuditQueryDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('backups'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new backup' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Backup initiated successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [backup_dto_1.CreateBackupDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)('backups'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup logs with pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Backup logs retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [backup_dto_1.BackupQueryDto]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getBackupLogs", null);
__decorate([
    (0, common_1.Get)('backups/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Backup not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdministrationController.prototype, "getBackupById", null);
exports.AdministrationController = AdministrationController = __decorate([
    (0, swagger_1.ApiTags)('Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('administration'),
    __metadata("design:paramtypes", [district_service_1.DistrictService,
        school_service_1.SchoolService,
        license_service_1.LicenseService,
        configuration_service_1.ConfigurationService,
        audit_service_1.AuditService,
        backup_service_1.BackupService])
], AdministrationController);
//# sourceMappingURL=administration.controller.js.map