"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTestService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../../database/models");
const integration_config_service_1 = require("./integration-config.service");
const integration_log_service_1 = require("./integration-log.service");
const base_1 = require("../../common/base");
let IntegrationTestService = class IntegrationTestService extends base_1.BaseService {
    configModel;
    configService;
    logService;
    constructor(configModel, configService, logService) {
        super("IntegrationTestService");
        this.configModel = configModel;
        this.configService = configService;
        this.logService = logService;
    }
    async testConnection(id) {
        const startTime = Date.now();
        try {
            const integration = await this.configService.findById(id, true);
            await this.configModel.update({ status: models_1.IntegrationStatus.TESTING }, { where: { id } });
            const testResult = await this.performConnectionTest(integration);
            const responseTime = Date.now() - startTime;
            await this.configModel.update({
                status: testResult.success
                    ? models_1.IntegrationStatus.ACTIVE
                    : models_1.IntegrationStatus.ERROR,
                lastSyncStatus: testResult.success ? 'success' : 'failed',
            }, { where: { id } });
            await this.logService.create({
                integrationId: id,
                integrationType: integration.type,
                action: 'test_connection',
                status: testResult.success ? 'success' : 'failed',
                duration: responseTime,
                errorMessage: testResult.success ? undefined : testResult.message,
                details: testResult.details,
            });
            this.logInfo(`Connection test ${testResult.success ? 'succeeded' : 'failed'} for ${integration.name}`);
            return {
                ...testResult,
                responseTime,
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            await this.configModel.update({
                status: models_1.IntegrationStatus.ERROR,
                lastSyncStatus: 'failed',
            }, { where: { id } });
            this.logError('Error testing connection', error);
            return {
                success: false,
                message: error.message,
                responseTime,
            };
        }
    }
    async performConnectionTest(integration) {
        if (!integration.endpoint && integration.type !== 'GOVERNMENT_REPORTING') {
            return {
                success: false,
                message: 'Endpoint URL is required',
            };
        }
        const endpoint = integration.endpoint || '';
        const timeout = integration.timeout || 5000;
        try {
            const connectionSuccess = await this.testHttpEndpoint(endpoint, timeout);
            if (!connectionSuccess) {
                return {
                    success: false,
                    message: `Failed to connect to ${integration.type} endpoint: ${endpoint}`,
                };
            }
            const details = await this.buildIntegrationDetails(integration);
            return {
                success: true,
                message: `Successfully connected to ${this.getIntegrationTypeName(integration.type)}`,
                details,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Connection test failed: ${error.message}`,
            };
        }
    }
    async testHttpEndpoint(endpoint, timeout) {
        if (!endpoint)
            return false;
        return new Promise(async (resolve) => {
            try {
                const https = await Promise.resolve().then(() => __importStar(require('https')));
                const http = await Promise.resolve().then(() => __importStar(require('http')));
                const { URL } = await Promise.resolve().then(() => __importStar(require('url')));
                const parsedUrl = new URL(endpoint);
                const isHttps = parsedUrl.protocol === 'https:';
                const client = isHttps ? https : http;
                const req = client.request({
                    hostname: parsedUrl.hostname,
                    port: parsedUrl.port || (isHttps ? 443 : 80),
                    path: parsedUrl.pathname || '/',
                    method: 'HEAD',
                    timeout,
                    headers: {
                        'User-Agent': 'WhiteCross-Integration-Test/1.0',
                    },
                }, (res) => {
                    res.on('data', () => { });
                    res.on('end', () => {
                        resolve(res.statusCode ? res.statusCode < 500 : false);
                    });
                });
                req.on('error', () => resolve(false));
                req.on('timeout', () => {
                    req.destroy();
                    resolve(false);
                });
                req.end();
            }
            catch {
                resolve(false);
            }
        });
    }
    async buildIntegrationDetails(integration) {
        const baseDetails = {
            testedAt: new Date().toISOString(),
            endpointUrl: integration.endpoint || 'N/A',
        };
        const settings = integration.settings || {};
        switch (integration.type) {
            case 'SIS':
                return {
                    ...baseDetails,
                    systemName: settings.systemName || 'Student Information System',
                    version: settings.version || 'Unknown',
                };
            case 'EHR':
                return {
                    ...baseDetails,
                    systemName: settings.systemName || 'Electronic Health Record',
                    integrationVersion: settings.integrationVersion || 'HL7 FHIR R4',
                    version: settings.version || 'Unknown',
                };
            case 'PHARMACY':
                return {
                    ...baseDetails,
                    pharmacyName: settings.pharmacyName || 'Pharmacy System',
                    systemName: 'Pharmacy Management',
                };
            case 'LABORATORY':
                return {
                    ...baseDetails,
                    labName: settings.labName || 'Laboratory System',
                    systemName: 'Laboratory Information System',
                };
            case 'INSURANCE':
                return {
                    ...baseDetails,
                    provider: settings.provider || 'Insurance Provider',
                    systemName: 'Insurance Verification System',
                };
            case 'PARENT_PORTAL':
                return {
                    ...baseDetails,
                    portalVersion: settings.portalVersion || '1.0.0',
                    systemName: 'Parent Portal',
                };
            default:
                return baseDetails;
        }
    }
    getIntegrationTypeName(type) {
        const typeNames = {
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
};
exports.IntegrationTestService = IntegrationTestService;
exports.IntegrationTestService = IntegrationTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.IntegrationConfig)),
    __metadata("design:paramtypes", [Object, integration_config_service_1.IntegrationConfigService,
        integration_log_service_1.IntegrationLogService])
], IntegrationTestService);
//# sourceMappingURL=integration-test.service.js.map