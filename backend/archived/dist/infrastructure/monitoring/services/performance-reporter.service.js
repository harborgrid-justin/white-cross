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
exports.PerformanceReporterService = void 0;
const common_1 = require("@nestjs/common");
const query_analyzer_service_1 = require("./query-analyzer.service");
const slow_query_detector_service_1 = require("./slow-query-detector.service");
const n1_query_detector_service_1 = require("./n1-query-detector.service");
const base_1 = require("../../../common/base");
let PerformanceReporterService = class PerformanceReporterService extends base_1.BaseService {
    queryAnalyzer;
    slowQueryDetector;
    n1Detector;
    PERFORMANCE_TARGETS = {
        p50: 100,
        p95: 500,
        p99: 1000,
    };
    alerts = [];
    constructor(queryAnalyzer, slowQueryDetector, n1Detector) {
        super("PerformanceReporterService");
        this.queryAnalyzer = queryAnalyzer;
        this.slowQueryDetector = slowQueryDetector;
        this.n1Detector = n1Detector;
    }
    getPerformanceReport() {
        const allDurations = this.queryAnalyzer
            .getRecentExecutions()
            .map(exec => exec.duration)
            .sort((a, b) => a - b);
        const p50 = this.calculatePercentile(allDurations, 50);
        const p95 = this.calculatePercentile(allDurations, 95);
        const p99 = this.calculatePercentile(allDurations, 99);
        const avgDuration = allDurations.length > 0
            ? allDurations.reduce((sum, d) => sum + d, 0) / allDurations.length
            : 0;
        const topSlowQueries = this.slowQueryDetector.getTopSlowQueries(10);
        const topFrequentQueries = this.queryAnalyzer.getTopFrequentQueries(10);
        this.checkPerformanceTargets(p50, p95, p99);
        return {
            totalQueries: this.queryAnalyzer.getTotalQueries(),
            slowQueries: this.slowQueryDetector.getSlowQueryCount(),
            avgQueryTime: avgDuration,
            p50QueryTime: p50,
            p95QueryTime: p95,
            p99QueryTime: p99,
            queryDistribution: this.queryAnalyzer.getQueryDistribution(),
            topSlowQueries,
            topFrequentQueries,
            n1Detections: this.n1Detector.getN1Detections(10),
            alerts: this.getRecentAlerts(20),
            periodStart: this.queryAnalyzer.getRecentExecutions(1)[0]?.timestamp || new Date(),
            periodEnd: new Date(),
        };
    }
    generatePeriodicReport() {
        const report = this.getPerformanceReport();
        this.logInfo('Query Performance Summary:', {
            totalQueries: report.totalQueries,
            slowQueries: report.slowQueries,
            avgQueryTime: `${report.avgQueryTime.toFixed(2)}ms`,
            p50: `${report.p50QueryTime.toFixed(2)}ms`,
            p95: `${report.p95QueryTime.toFixed(2)}ms`,
            p99: `${report.p99QueryTime.toFixed(2)}ms`,
        });
        this.checkForCriticalIssues(report);
    }
    checkPerformanceTargets(p50, p95, p99) {
        const targets = this.PERFORMANCE_TARGETS;
        if (p50 > targets.p50) {
            this.createAlert({
                type: 'performance_degradation',
                severity: 'warning',
                message: `P50 query time ${p50.toFixed(2)}ms exceeds target of ${targets.p50}ms`,
                details: { current: p50, target: targets.p50 },
                timestamp: new Date(),
            });
        }
        if (p95 > targets.p95) {
            this.createAlert({
                type: 'performance_degradation',
                severity: 'warning',
                message: `P95 query time ${p95.toFixed(2)}ms exceeds target of ${targets.p95}ms`,
                details: { current: p95, target: targets.p95 },
                timestamp: new Date(),
            });
        }
        if (p99 > targets.p99) {
            this.createAlert({
                type: 'performance_degradation',
                severity: 'critical',
                message: `P99 query time ${p99.toFixed(2)}ms exceeds target of ${targets.p99}ms`,
                details: { current: p99, target: targets.p99 },
                timestamp: new Date(),
            });
        }
    }
    checkForCriticalIssues(report) {
        if (report.totalQueries > 10000) {
            this.createAlert({
                type: 'high_query_rate',
                severity: 'warning',
                message: `High query rate detected: ${report.totalQueries} queries`,
                details: { queryCount: report.totalQueries },
                timestamp: new Date(),
            });
        }
        if (report.slowQueries > report.totalQueries * 0.1) {
            this.createAlert({
                type: 'performance_degradation',
                severity: 'critical',
                message: `Excessive slow queries: ${report.slowQueries} out of ${report.totalQueries}`,
                details: {
                    slowQueryCount: report.slowQueries,
                    totalQueries: report.totalQueries,
                    percentage: (report.slowQueries / report.totalQueries) * 100,
                },
                timestamp: new Date(),
            });
        }
    }
    createAlert(alert) {
        this.alerts.push(alert);
        if (this.alerts.length > 100) {
            this.alerts.shift();
        }
    }
    calculatePercentile(sortedArray, percentile) {
        if (sortedArray.length === 0)
            return 0;
        const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
        return sortedArray[Math.max(0, index)];
    }
    getRecentAlerts(limit = 20) {
        return [...this.alerts].slice(-limit);
    }
    getAllAlerts() {
        return [...this.alerts];
    }
    getAlertsByType(type) {
        return this.alerts.filter(alert => alert.type === type);
    }
    getAlertsBySeverity(severity) {
        return this.alerts.filter(alert => alert.severity === severity);
    }
    getCriticalAlertsCount() {
        return this.alerts.filter(alert => alert.severity === 'critical').length;
    }
    getPerformanceHealthScore() {
        const report = this.getPerformanceReport();
        let score = 100;
        if (report.p99QueryTime > this.PERFORMANCE_TARGETS.p99) {
            score -= 30;
        }
        else if (report.p95QueryTime > this.PERFORMANCE_TARGETS.p95) {
            score -= 20;
        }
        else if (report.p50QueryTime > this.PERFORMANCE_TARGETS.p50) {
            score -= 10;
        }
        const slowQueryPercentage = report.totalQueries > 0 ? report.slowQueries / report.totalQueries : 0;
        if (slowQueryPercentage > 0.1) {
            score -= 20;
        }
        else if (slowQueryPercentage > 0.05) {
            score -= 10;
        }
        if (this.n1Detector.hasActiveN1Patterns()) {
            score -= 15;
        }
        return Math.max(0, score);
    }
    getPerformanceSummary() {
        const report = this.getPerformanceReport();
        const healthScore = this.getPerformanceHealthScore();
        return {
            healthScore,
            totalQueries: report.totalQueries,
            slowQueries: report.slowQueries,
            n1Detections: this.n1Detector.getN1DetectionCount(),
            criticalAlerts: this.getCriticalAlertsCount(),
            p50: report.p50QueryTime,
            p95: report.p95QueryTime,
            p99: report.p99QueryTime,
            targets: this.PERFORMANCE_TARGETS,
        };
    }
    reset() {
        this.alerts = [];
        this.logInfo('Performance reporter reset');
    }
};
exports.PerformanceReporterService = PerformanceReporterService;
exports.PerformanceReporterService = PerformanceReporterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [query_analyzer_service_1.QueryAnalyzerService,
        slow_query_detector_service_1.SlowQueryDetectorService,
        n1_query_detector_service_1.N1QueryDetectorService])
], PerformanceReporterService);
//# sourceMappingURL=performance-reporter.service.js.map