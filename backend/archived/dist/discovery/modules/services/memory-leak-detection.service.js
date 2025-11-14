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
exports.MemoryLeakDetectionService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let MemoryLeakDetectionService = class MemoryLeakDetectionService extends base_1.BaseService {
    discoveryService;
    reflector;
    monitoredProviders = new Map();
    memorySnapshots = [];
    leakSuspects = new Map();
    detectionInterval;
    maxSnapshots = 500;
    isMonitoring = false;
    constructor(discoveryService, reflector) {
        super("MemoryLeakDetectionService");
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    addMonitoredProvider(providerName, metadata) {
        this.monitoredProviders.set(providerName, {
            ...metadata,
            addedAt: Date.now(),
            memoryHistory: [],
        });
        this.logInfo(`Added provider to leak monitoring: ${providerName}`, {
            alertThreshold: metadata.alertThreshold,
            monitoring: metadata.monitoring,
        });
    }
    startMonitoring(intervalMs = 60000) {
        if (this.isMonitoring) {
            this.logWarning('Memory leak detection already started');
            return;
        }
        this.isMonitoring = true;
        this.logInfo(`Starting memory leak detection with ${intervalMs}ms interval`);
        this.detectionInterval = setInterval(async () => {
            await this.detectMemoryLeaks();
        }, intervalMs);
    }
    stopMonitoring() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = undefined;
        }
        this.isMonitoring = false;
        this.logInfo('Memory leak detection stopped');
    }
    async detectMemoryLeaks() {
        try {
            const snapshot = await this.takeMemorySnapshot();
            this.memorySnapshots.push(snapshot);
            if (this.memorySnapshots.length > this.maxSnapshots) {
                this.memorySnapshots = this.memorySnapshots.slice(-this.maxSnapshots);
            }
            await this.analyzeMemoryPatterns();
            await this.updateLeakSuspects();
            const criticalLeaks = Array.from(this.leakSuspects.values()).filter((suspect) => suspect.confidence > 0.8);
            if (criticalLeaks.length > 0) {
                this.logWarning(`Detected ${criticalLeaks.length} potential memory leaks:`, criticalLeaks.map((leak) => ({
                    provider: leak.providerName,
                    growthRate: `${leak.memoryGrowthRate.toFixed(2)}MB/min`,
                    confidence: `${(leak.confidence * 100).toFixed(1)}%`,
                })));
            }
        }
        catch (error) {
            this.logError('Memory leak detection failed:', error);
        }
    }
    getLeakSuspects() {
        return Array.from(this.leakSuspects.values()).sort((a, b) => b.confidence - a.confidence);
    }
    getLeakReport() {
        const suspects = this.getLeakSuspects();
        const criticalLeaks = suspects.filter((s) => s.confidence > 0.8);
        const memoryTrend = this.calculateMemoryTrend();
        const recommendations = [];
        if (criticalLeaks.length > 0) {
            recommendations.push(`Investigate ${criticalLeaks.length} critical memory leaks immediately`);
            recommendations.push('Review event listeners, timers, and cache cleanup in affected providers');
        }
        if (memoryTrend === 'increasing') {
            recommendations.push('Monitor memory growth - consider implementing more aggressive cleanup');
        }
        if (suspects.length > 5) {
            recommendations.push('High number of leak suspects - review overall memory management strategy');
        }
        const summary = [
            `Suspects: ${suspects.length}`,
            `Critical: ${criticalLeaks.length}`,
            `Trend: ${memoryTrend}`,
            `Memory: ${this.getCurrentMemoryMB().toFixed(1)}MB`,
        ].join(' | ');
        return {
            summary,
            totalSuspects: suspects.length,
            criticalLeaks,
            memoryTrend,
            recommendations,
        };
    }
    getProviderMemoryAnalysis(providerName) {
        const suspect = this.leakSuspects.get(providerName);
        if (!suspect) {
            return null;
        }
        let recommendation = 'No specific issues detected';
        if (suspect.confidence > 0.8) {
            recommendation = 'Critical: Immediate investigation required';
        }
        else if (suspect.confidence > 0.6) {
            recommendation = 'Warning: Monitor closely and consider optimization';
        }
        else if (suspect.confidence > 0.4) {
            recommendation = 'Caution: Review memory usage patterns';
        }
        return {
            growthRate: suspect.memoryGrowthRate,
            patterns: suspect.suspiciousPatterns,
            recommendation,
        };
    }
    clearLeakSuspects() {
        this.leakSuspects.clear();
        this.logInfo('Cleared all leak suspects');
    }
    async takeMemorySnapshot() {
        const memoryUsage = process.memoryUsage();
        const providerMemoryMap = new Map();
        const providers = this.discoveryService.getProviders();
        let totalEstimatedMemory = 0;
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const providerName = wrapper.name || 'unknown';
            let estimatedMemory = 1024 * 1024;
            const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
            if (cacheMetadata?.enabled) {
                estimatedMemory += (cacheMetadata.maxSize || 100) * 10000;
            }
            const poolMetadata = this.reflector.get('resource-pool', wrapper.metatype);
            if (poolMetadata?.enabled) {
                estimatedMemory += (poolMetadata.maxSize || 10) * 100000;
            }
            const leakProneMetadata = this.reflector.get('leak-prone', wrapper.metatype);
            if (leakProneMetadata?.monitoring) {
                estimatedMemory *= 1.5;
            }
            providerMemoryMap.set(providerName, estimatedMemory);
            totalEstimatedMemory += estimatedMemory;
        }
        return {
            timestamp: Date.now(),
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
            external: memoryUsage.external,
            arrayBuffers: memoryUsage.arrayBuffers,
            providerMemoryMap,
        };
    }
    async analyzeMemoryPatterns() {
        if (this.memorySnapshots.length < 5) {
            return;
        }
        const recentSnapshots = this.memorySnapshots.slice(-10);
        const memoryGrowth = this.calculateMemoryGrowthRate(recentSnapshots);
        for (const [providerName, _] of this.monitoredProviders) {
            await this.analyzeProviderMemoryPattern(providerName, recentSnapshots);
        }
    }
    async analyzeProviderMemoryPattern(providerName, snapshots) {
        const providerMemoryHistory = snapshots
            .map((snapshot) => snapshot.providerMemoryMap.get(providerName) || 0)
            .filter((memory) => memory > 0);
        if (providerMemoryHistory.length < 3) {
            return;
        }
        const growthRate = this.calculateGrowthRate(providerMemoryHistory, snapshots);
        const suspiciousPatterns = this.identifySuspiciousPatterns(providerMemoryHistory);
        const confidence = this.calculateLeakConfidence(growthRate, suspiciousPatterns, providerName);
        if (confidence > 0.3) {
            const existing = this.leakSuspects.get(providerName);
            this.leakSuspects.set(providerName, {
                providerName,
                memoryGrowthRate: growthRate,
                suspiciousPatterns,
                confidence,
                firstDetected: existing?.firstDetected || Date.now(),
                lastUpdated: Date.now(),
            });
        }
    }
    calculateGrowthRate(memoryHistory, snapshots) {
        if (memoryHistory.length < 2)
            return 0;
        const firstMemory = memoryHistory[0];
        const lastMemory = memoryHistory[memoryHistory.length - 1];
        const firstTime = snapshots[0].timestamp;
        const lastTime = snapshots[snapshots.length - 1].timestamp;
        const timeDiffMinutes = (lastTime - firstTime) / (1000 * 60);
        const memoryDiffMB = (lastMemory - firstMemory) / (1024 * 1024);
        return timeDiffMinutes > 0 ? memoryDiffMB / timeDiffMinutes : 0;
    }
    identifySuspiciousPatterns(memoryHistory) {
        const patterns = [];
        let growthCount = 0;
        for (let i = 1; i < memoryHistory.length; i++) {
            if (memoryHistory[i] > memoryHistory[i - 1]) {
                growthCount++;
            }
        }
        const growthRatio = growthCount / (memoryHistory.length - 1);
        if (growthRatio > 0.8) {
            patterns.push('Consistent memory growth');
        }
        const average = memoryHistory.reduce((a, b) => a + b, 0) / memoryHistory.length;
        const hasSpike = memoryHistory.some((memory) => memory > average * 2);
        if (hasSpike) {
            patterns.push('Memory spikes detected');
        }
        let stepIncreases = 0;
        for (let i = 1; i < memoryHistory.length; i++) {
            const increase = memoryHistory[i] - memoryHistory[i - 1];
            if (increase > average * 0.5) {
                stepIncreases++;
            }
        }
        if (stepIncreases > 2) {
            patterns.push('Step-wise memory increases');
        }
        return patterns;
    }
    calculateLeakConfidence(growthRate, patterns, providerName) {
        let confidence = 0;
        if (growthRate > 10) {
            confidence += 0.4;
        }
        else if (growthRate > 5) {
            confidence += 0.3;
        }
        else if (growthRate > 1) {
            confidence += 0.2;
        }
        else if (growthRate > 0.1) {
            confidence += 0.1;
        }
        confidence += Math.min(patterns.length * 0.1, 0.3);
        const monitoredProvider = this.monitoredProviders.get(providerName);
        if (monitoredProvider) {
            if (monitoredProvider.alertThreshold && growthRate > 0) {
                confidence += 0.1;
            }
            if (monitoredProvider.knownLeakProne) {
                confidence += 0.2;
            }
        }
        return Math.min(confidence, 1.0);
    }
    async updateLeakSuspects() {
        const now = Date.now();
        const staleThreshold = 10 * 60 * 1000;
        for (const [providerName, suspect] of this.leakSuspects.entries()) {
            if (now - suspect.lastUpdated > staleThreshold) {
                this.leakSuspects.delete(providerName);
                this.logInfo(`Removed stale leak suspect: ${providerName}`);
            }
        }
    }
    calculateMemoryTrend() {
        if (this.memorySnapshots.length < 5) {
            return 'stable';
        }
        const recent = this.memorySnapshots.slice(-5);
        const memoryValues = recent.map((s) => s.heapUsed);
        const slope = this.calculateSlope(memoryValues);
        const threshold = 1024 * 1024;
        if (slope > threshold) {
            return 'increasing';
        }
        else if (slope < -threshold) {
            return 'decreasing';
        }
        else {
            return 'stable';
        }
    }
    calculateSlope(values) {
        const n = values.length;
        if (n < 2)
            return 0;
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            const xDiff = i - xMean;
            const yDiff = values[i] - yMean;
            numerator += xDiff * yDiff;
            denominator += xDiff * xDiff;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }
    getCurrentMemoryMB() {
        return process.memoryUsage().heapUsed / (1024 * 1024);
    }
    calculateMemoryGrowthRate(snapshots) {
        if (snapshots.length < 2)
            return 0;
        const first = snapshots[0];
        const last = snapshots[snapshots.length - 1];
        const timeDiffMinutes = (last.timestamp - first.timestamp) / (1000 * 60);
        const memoryDiffMB = (last.heapUsed - first.heapUsed) / (1024 * 1024);
        return timeDiffMinutes > 0 ? memoryDiffMB / timeDiffMinutes : 0;
    }
};
exports.MemoryLeakDetectionService = MemoryLeakDetectionService;
exports.MemoryLeakDetectionService = MemoryLeakDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector])
], MemoryLeakDetectionService);
//# sourceMappingURL=memory-leak-detection.service.js.map