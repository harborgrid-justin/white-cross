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
exports.N1QueryDetectorService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let N1QueryDetectorService = class N1QueryDetectorService extends base_1.BaseService {
    N1_DETECTION_WINDOW = 1000;
    N1_OCCURRENCE_THRESHOLD = 5;
    n1Detections = [];
    alerts = [];
    constructor() {
        super("N1QueryDetectorService");
    }
    analyzeForN1Queries(queryExecutions, model) {
        const now = Date.now();
        const recentExecutions = queryExecutions.filter(exec => now - exec.timestamp.getTime() < this.N1_DETECTION_WINDOW);
        const signatureGroups = new Map();
        recentExecutions.forEach(exec => {
            if (!signatureGroups.has(exec.signature)) {
                signatureGroups.set(exec.signature, []);
            }
            signatureGroups.get(exec.signature).push(exec);
        });
        signatureGroups.forEach((executions, signature) => {
            if (executions.length >= this.N1_OCCURRENCE_THRESHOLD) {
                this.detectAndRecordN1Pattern(signature, executions, model);
            }
        });
    }
    detectAndRecordN1Pattern(signature, executions, model) {
        const now = Date.now();
        const existingDetection = this.n1Detections.find(detection => detection.pattern === signature &&
            now - detection.timestamp.getTime() < 60000);
        if (existingDetection) {
            existingDetection.occurrences = Math.max(existingDetection.occurrences, executions.length);
            return;
        }
        const detection = {
            pattern: signature.substring(0, 200),
            occurrences: executions.length,
            withinTimeWindow: this.N1_DETECTION_WINDOW,
            likelyN1: true,
            affectedModel: model,
            timestamp: new Date(),
        };
        this.n1Detections.push(detection);
        if (this.n1Detections.length > 50) {
            this.n1Detections.shift();
        }
        this.createAlert(detection);
        this.logError(`N+1 QUERY DETECTED:`, {
            model,
            occurrences: executions.length,
            pattern: signature.substring(0, 200),
        });
    }
    createAlert(detection) {
        const alert = {
            type: 'n1_detected',
            severity: 'critical',
            message: `N+1 query pattern detected: ${detection.occurrences} similar queries in ${detection.withinTimeWindow}ms`,
            details: detection,
            timestamp: new Date(),
        };
        this.alerts.push(alert);
        if (this.alerts.length > 100) {
            this.alerts.shift();
        }
    }
    getN1Detections(limit = 10) {
        return [...this.n1Detections].slice(-limit);
    }
    getN1DetectionsInRange(startTime, endTime) {
        return this.n1Detections.filter(detection => detection.timestamp >= startTime && detection.timestamp <= endTime);
    }
    getN1DetectionsByModel(model, limit = 10) {
        return this.n1Detections
            .filter(detection => detection.affectedModel === model)
            .slice(-limit);
    }
    getN1DetectionCount() {
        return this.n1Detections.length;
    }
    getTotalN1Occurrences() {
        return this.n1Detections.reduce((total, detection) => total + detection.occurrences, 0);
    }
    getAlerts(limit = 20) {
        return [...this.alerts].slice(-limit);
    }
    hasActiveN1Patterns() {
        const now = Date.now();
        return this.n1Detections.some(detection => now - detection.timestamp.getTime() < 300000);
    }
    getN1Stats() {
        const detections = this.n1Detections;
        const total = detections.length;
        if (total === 0) {
            return {
                total: 0,
                totalOccurrences: 0,
                averageOccurrences: 0,
                modelsAffected: 0,
            };
        }
        const totalOccurrences = detections.reduce((sum, d) => sum + d.occurrences, 0);
        const averageOccurrences = totalOccurrences / total;
        const modelsAffected = new Set(detections.map(d => d.affectedModel)).size;
        return {
            total,
            totalOccurrences,
            averageOccurrences,
            modelsAffected,
        };
    }
    getMostProblematicPatterns(limit = 5) {
        return [...this.n1Detections]
            .sort((a, b) => b.occurrences - a.occurrences)
            .slice(0, limit);
    }
    reset() {
        this.n1Detections = [];
        this.alerts = [];
        this.logInfo('N+1 query detector reset');
    }
};
exports.N1QueryDetectorService = N1QueryDetectorService;
exports.N1QueryDetectorService = N1QueryDetectorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], N1QueryDetectorService);
//# sourceMappingURL=n1-query-detector.service.js.map