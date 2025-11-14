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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const health_check_interface_1 = require("../interfaces/health-check.interface");
let HealthAnalyzerService = class HealthAnalyzerService extends base_1.BaseService {
    constructor() {
        super("HealthAnalyzerService");
    }
    determineEnhancedStatus(baseHealth, resources, externalServices, security) {
        const criticalIssues = [];
        const warnings = [];
        const recommendations = [];
        if (baseHealth.status === health_check_interface_1.HealthStatus.UNHEALTHY) {
            criticalIssues.push('Core infrastructure components are unhealthy');
        }
        else if (baseHealth.status === health_check_interface_1.HealthStatus.DEGRADED) {
            warnings.push('Some infrastructure components are degraded');
        }
        if (resources.cpu.usage > 90) {
            criticalIssues.push(`Critical CPU usage: ${resources.cpu.usage}%`);
            recommendations.push('Scale up compute resources or optimize application performance');
        }
        else if (resources.cpu.usage > 80) {
            warnings.push(`High CPU usage: ${resources.cpu.usage}%`);
        }
        if (resources.memory.usage > 95) {
            criticalIssues.push(`Critical memory usage: ${resources.memory.usage}%`);
            recommendations.push('Scale up memory or investigate memory leaks');
        }
        else if (resources.memory.usage > 90) {
            warnings.push(`High memory usage: ${resources.memory.usage}%`);
        }
        const downServices = externalServices.filter((s) => s.status === 'DOWN');
        const degradedServices = externalServices.filter((s) => s.status === 'DEGRADED');
        if (downServices.length > 0) {
            criticalIssues.push(`External services down: ${downServices.map((s) => s.name).join(', ')}`);
            recommendations.push('Check external service connectivity and status');
        }
        if (degradedServices.length > 0) {
            warnings.push(`External services degraded: ${degradedServices.map((s) => s.name).join(', ')}`);
        }
        if (security?.threatLevel === 'HIGH') {
            criticalIssues.push('High security threat level detected');
            recommendations.push('Review security logs and implement additional protection measures');
        }
        else if (security?.threatLevel === 'MEDIUM') {
            warnings.push('Medium security threat level detected');
        }
        let status = health_check_interface_1.HealthStatus.HEALTHY;
        if (criticalIssues.length > 0 || baseHealth.status === health_check_interface_1.HealthStatus.UNHEALTHY) {
            status = health_check_interface_1.HealthStatus.UNHEALTHY;
        }
        else if (warnings.length > 0 || baseHealth.status === health_check_interface_1.HealthStatus.DEGRADED) {
            status = health_check_interface_1.HealthStatus.DEGRADED;
        }
        return {
            status,
            criticalIssues,
            warnings,
            recommendations,
        };
    }
    getHealthTrends(history) {
        const availabilityTrend = history.slice(-20).map((h) => h.metrics.availability);
        const responseTimeTrend = history.slice(-20).map((h) => h.performance.responseTime);
        const errorSpikes = history
            .filter((h) => h.metrics.criticalIssues.length > 0)
            .map((h) => ({
            timestamp: h.timestamp,
            errors: h.metrics.criticalIssues,
        }))
            .slice(-10);
        return {
            availabilityTrend,
            responseTimeTrend,
            errorSpikes,
        };
    }
    analyzePerformance(history) {
        if (history.length === 0) {
            return {
                averageAvailability: 0,
                averageResponseTime: 0,
                uptimePercentage: 0,
                mostCommonIssues: [],
            };
        }
        const totalAvailability = history.reduce((sum, h) => sum + h.metrics.availability, 0);
        const averageAvailability = totalAvailability / history.length;
        const totalResponseTime = history.reduce((sum, h) => sum + h.performance.responseTime, 0);
        const averageResponseTime = totalResponseTime / history.length;
        const healthyChecks = history.filter(h => h.status === health_check_interface_1.HealthStatus.HEALTHY).length;
        const uptimePercentage = (healthyChecks / history.length) * 100;
        const allIssues = history.flatMap(h => h.metrics.criticalIssues);
        const issueCounts = allIssues.reduce((counts, issue) => {
            counts[issue] = (counts[issue] || 0) + 1;
            return counts;
        }, {});
        const mostCommonIssues = Object.entries(issueCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([issue]) => issue);
        return {
            averageAvailability,
            averageResponseTime,
            uptimePercentage,
            mostCommonIssues,
        };
    }
    generateRecommendations(currentHealth, trends) {
        const recommendations = [];
        if (currentHealth.resources.cpu.usage > 80) {
            recommendations.push('Consider scaling compute resources or optimizing CPU-intensive operations');
        }
        if (currentHealth.resources.memory.usage > 85) {
            recommendations.push('Monitor memory usage patterns and consider memory optimization');
        }
        const downServices = currentHealth.externalServices.filter(s => s.status === 'DOWN');
        if (downServices.length > 0) {
            recommendations.push(`Investigate connectivity issues with: ${downServices.map(s => s.name).join(', ')}`);
        }
        const avgAvailability = trends.availabilityTrend.reduce((a, b) => a + b, 0) / trends.availabilityTrend.length;
        if (avgAvailability < 95) {
            recommendations.push('Overall system availability is below 95% - review recent outages');
        }
        const avgResponseTime = trends.responseTimeTrend.reduce((a, b) => a + b, 0) / trends.responseTimeTrend.length;
        if (avgResponseTime > 1000) {
            recommendations.push('Average response time exceeds 1 second - consider performance optimization');
        }
        return recommendations;
    }
};
exports.HealthAnalyzerService = HealthAnalyzerService;
exports.HealthAnalyzerService = HealthAnalyzerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HealthAnalyzerService);
//# sourceMappingURL=health-analyzer.service.js.map