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
var SisApiClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SisApiClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const base_api_client_1 = require("./base-api.client");
let SisApiClient = SisApiClient_1 = class SisApiClient extends base_api_client_1.BaseApiClient {
    httpService;
    constructor(httpService, configService) {
        const baseURL = configService.get('SIS_API_URL') || 'https://sis-api.example.com';
        const apiKey = configService.get('SIS_API_KEY') || '';
        super('SIS', baseURL, httpService, new common_1.Logger(SisApiClient_1.name), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'X-API-Version': '2.0',
            },
            circuitBreaker: {
                failureThreshold: 5,
                successThreshold: 2,
                timeout: 90000,
            },
            rateLimit: {
                maxRequests: 1000,
                windowMs: 3600000,
            },
            retryAttempts: 3,
            retryDelay: 1000,
        });
        this.httpService = httpService;
    }
    async getEnrolledStudents(organizationId) {
        try {
            this.logger.log(`Fetching enrolled students from SIS for organization: ${organizationId}`);
            const response = await this.get(`/organizations/${organizationId}/students`, {
                params: {
                    status: 'ACTIVE',
                    includeInactive: false,
                },
            });
            const students = response.data.students;
            this.logger.log(`Fetched ${students.length} students from SIS`);
            return students;
        }
        catch (error) {
            this.logger.error(`Error fetching students from SIS for organization: ${organizationId}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async getStudentBySisId(sisId) {
        try {
            this.logger.log(`Fetching student from SIS with ID: ${sisId}`);
            const response = await this.get(`/students/${sisId}`);
            return response.data;
        }
        catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error;
                if (axiosError.response?.status === 404) {
                    this.logger.warn(`Student not found in SIS with ID: ${sisId}`);
                    return null;
                }
            }
            this.logger.error(`Error fetching student from SIS with ID: ${sisId}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async getAttendanceRecords(organizationId, startDate, endDate) {
        try {
            this.logger.log(`Fetching attendance records from SIS. Organization: ${organizationId}, Date range: ${startDate} to ${endDate}`);
            const response = await this.get(`/organizations/${organizationId}/attendance`, {
                params: {
                    startDate,
                    endDate,
                },
            });
            const attendance = response.data.attendance;
            this.logger.log(`Fetched ${attendance.length} attendance records from SIS`);
            return attendance;
        }
        catch (error) {
            this.logger.error(`Error fetching attendance from SIS. Organization: ${organizationId}, Date range: ${startDate} to ${endDate}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async updateEnrollmentStatus(sisId, status) {
        try {
            this.logger.log(`Updating student enrollment status in SIS. Student: ${sisId}, New status: ${status}`);
            await this.put(`/students/${sisId}/enrollment`, { status });
            this.logger.log(`Student enrollment status updated successfully. Student: ${sisId}, Status: ${status}`);
        }
        catch (error) {
            this.logger.error(`Error updating enrollment status in SIS. Student: ${sisId}, Status: ${status}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async syncStudents(organizationId) {
        try {
            this.logger.log(`Starting SIS student sync for organization: ${organizationId}`);
            const sisStudents = await this.getEnrolledStudents(organizationId);
            this.logger.log(`SIS sync complete. Retrieved ${sisStudents.length} students for organization: ${organizationId}`);
            return sisStudents;
        }
        catch (error) {
            this.logger.error(`Error syncing students from SIS for organization: ${organizationId}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
};
exports.SisApiClient = SisApiClient;
exports.SisApiClient = SisApiClient = SisApiClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], SisApiClient);
//# sourceMappingURL=sis-api.client.js.map