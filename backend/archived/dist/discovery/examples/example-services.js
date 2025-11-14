"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentHealthService = exports.RegularService = exports.ExternalApiService = exports.ReportCacheService = exports.UserAnalyticsService = exports.AiDiagnosisService = exports.ExperimentalHealthService = void 0;
const common_1 = require("@nestjs/common");
const metadata_decorator_1 = require("../decorators/metadata.decorator");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
let ExperimentalHealthService = class ExperimentalHealthService {
    getExperimentalFeature() {
        return 'This is an experimental health feature';
    }
};
exports.ExperimentalHealthService = ExperimentalHealthService;
exports.ExperimentalHealthService = ExperimentalHealthService = __decorate([
    (0, common_1.Injectable)(),
    (0, metadata_decorator_1.FeatureFlag)('experimental'),
    (0, metadata_decorator_1.Analytics)(true),
    (0, metadata_decorator_1.Domain)('health-records'),
    (0, metadata_decorator_1.Monitored)('detailed')
], ExperimentalHealthService);
let AiDiagnosisService = class AiDiagnosisService {
    diagnose(symptoms) {
        return `AI diagnosis for symptoms: ${symptoms.join(', ')}`;
    }
};
exports.AiDiagnosisService = AiDiagnosisService;
exports.AiDiagnosisService = AiDiagnosisService = __decorate([
    (0, common_1.Injectable)(),
    (0, metadata_decorator_1.ExperimentalFeature)('ai-diagnosis'),
    (0, metadata_decorator_1.Domain)('clinical'),
    (0, metadata_decorator_1.Cacheable)(300)
], AiDiagnosisService);
let UserAnalyticsService = class UserAnalyticsService {
    trackUserActivity(userId, activity) {
        console.log(`Tracking activity for user ${userId}: ${activity}`);
    }
};
exports.UserAnalyticsService = UserAnalyticsService;
exports.UserAnalyticsService = UserAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    (0, metadata_decorator_1.Analytics)(true),
    (0, metadata_decorator_1.Domain)('user-management'),
    (0, rate_limit_decorator_1.RateLimit)(100, 60000),
    (0, metadata_decorator_1.Monitored)('basic')
], UserAnalyticsService);
let ReportCacheService = class ReportCacheService {
    generateReport(reportId) {
        return `Generated report ${reportId}`;
    }
};
exports.ReportCacheService = ReportCacheService;
exports.ReportCacheService = ReportCacheService = __decorate([
    (0, common_1.Injectable)(),
    (0, metadata_decorator_1.Cacheable)(600),
    (0, metadata_decorator_1.Domain)('reporting'),
    (0, metadata_decorator_1.Analytics)(false)
], ReportCacheService);
let ExternalApiService = class ExternalApiService {
    callExternalApi(endpoint) {
        return Promise.resolve({ data: `Response from ${endpoint}` });
    }
};
exports.ExternalApiService = ExternalApiService;
exports.ExternalApiService = ExternalApiService = __decorate([
    (0, common_1.Injectable)(),
    (0, rate_limit_decorator_1.RateLimit)(50, 60000),
    (0, metadata_decorator_1.Domain)('external-api'),
    (0, metadata_decorator_1.Monitored)('detailed')
], ExternalApiService);
let RegularService = class RegularService {
    doSomething() {
        return 'Regular service functionality';
    }
};
exports.RegularService = RegularService;
exports.RegularService = RegularService = __decorate([
    (0, common_1.Injectable)()
], RegularService);
let StudentHealthService = class StudentHealthService {
    getStudentHealthRecord(studentId) {
        return `Health record for student ${studentId}`;
    }
};
exports.StudentHealthService = StudentHealthService;
exports.StudentHealthService = StudentHealthService = __decorate([
    (0, common_1.Injectable)(),
    (0, metadata_decorator_1.Domain)('student-health'),
    (0, metadata_decorator_1.Analytics)(true),
    (0, metadata_decorator_1.Cacheable)(120),
    (0, metadata_decorator_1.Monitored)('basic')
], StudentHealthService);
//# sourceMappingURL=example-services.js.map