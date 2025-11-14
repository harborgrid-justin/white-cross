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
exports.QueryMonitorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const query_analyzer_service_1 = require("./services/query-analyzer.service");
const slow_query_detector_service_1 = require("./services/slow-query-detector.service");
const n1_query_detector_service_1 = require("./services/n1-query-detector.service");
const performance_reporter_service_1 = require("./services/performance-reporter.service");
const base_1 = require("../../common/base");
let QueryMonitorService = class QueryMonitorService extends base_1.BaseService {
    sequelize;
    queryAnalyzer;
    slowQueryDetector;
    n1Detector;
    performanceReporter;
    isMonitoring = false;
    reportInterval = null;
    constructor(sequelize, queryAnalyzer, slowQueryDetector, n1Detector, performanceReporter) {
        super("QueryMonitorService");
        this.sequelize = sequelize;
        this.queryAnalyzer = queryAnalyzer;
        this.slowQueryDetector = slowQueryDetector;
        this.n1Detector = n1Detector;
        this.performanceReporter = performanceReporter;
    }
    async onModuleInit() {
        this.logInfo('Initializing Query Monitor Service');
        this.startMonitoring();
    }
    startMonitoring() {
        if (this.isMonitoring) {
            this.logWarning('Query monitoring already started');
            return;
        }
        this.isMonitoring = true;
        this.sequelize.addHook('beforeQuery', (options, query) => {
            query.startTime = Date.now();
            query.model = options.model?.name;
        });
        this.sequelize.addHook('afterQuery', (options, query) => {
            const duration = Date.now() - query.startTime;
            this.recordQuery(options.sql, duration, query.model);
        });
        this.reportInterval = setInterval(() => {
            this.performanceReporter.generatePeriodicReport();
        }, 60000);
        this.logInfo('Query performance monitoring started');
    }
    recordQuery(sql, duration, model) {
        this.queryAnalyzer.recordQuery(sql, duration, model);
        this.slowQueryDetector.checkAndRecordSlowQuery(sql, duration, model);
        this.n1Detector.analyzeForN1Queries(this.queryAnalyzer.getRecentExecutions(100), model);
    }
    stopMonitoring() {
        if (!this.isMonitoring) {
            return;
        }
        this.isMonitoring = false;
        if (this.reportInterval) {
            clearInterval(this.reportInterval);
            this.reportInterval = null;
        }
        this.logInfo('Query performance monitoring stopped');
    }
    async onModuleDestroy() {
        this.stopMonitoring();
    }
    getPerformanceReport() {
        return this.performanceReporter.getPerformanceReport();
    }
    getQueryMetrics(signature) {
        return this.queryAnalyzer.getQueryMetrics(signature);
    }
    getSlowQueries(limit = 20) {
        return this.slowQueryDetector.getSlowQueries(limit);
    }
    getN1Detections(limit = 10) {
        return this.n1Detector.getN1Detections(limit);
    }
    getAlerts(limit = 20) {
        return this.performanceReporter.getRecentAlerts(limit);
    }
    getPerformanceSummary() {
        return this.performanceReporter.getPerformanceSummary();
    }
    getPerformanceHealthScore() {
        return this.performanceReporter.getPerformanceHealthScore();
    }
    resetMetrics() {
        this.queryAnalyzer.resetMetrics();
        this.slowQueryDetector.reset();
        this.n1Detector.reset();
        this.performanceReporter.reset();
        this.logInfo('Query monitor metrics reset');
    }
    isMonitoringActive() {
        return this.isMonitoring;
    }
};
exports.QueryMonitorService = QueryMonitorService;
exports.QueryMonitorService = QueryMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize,
        query_analyzer_service_1.QueryAnalyzerService,
        slow_query_detector_service_1.SlowQueryDetectorService,
        n1_query_detector_service_1.N1QueryDetectorService,
        performance_reporter_service_1.PerformanceReporterService])
], QueryMonitorService);
//# sourceMappingURL=query-monitor.service.js.map