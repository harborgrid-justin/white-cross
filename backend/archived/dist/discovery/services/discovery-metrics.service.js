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
exports.DiscoveryMetricsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let DiscoveryMetricsService = class DiscoveryMetricsService extends base_1.BaseService {
    constructor() {
        super("DiscoveryMetricsService");
    }
    counters = new Map();
    histograms = new Map();
    gauges = new Map();
    maxHistogramEntries = 1000;
    incrementCounter(name, labels = {}) {
        const labelKey = this.createLabelKey(labels);
        if (!this.counters.has(name)) {
            this.counters.set(name, new Map());
        }
        const counter = this.counters.get(name);
        const currentValue = counter.get(labelKey) || 0;
        counter.set(labelKey, currentValue + 1);
    }
    recordHistogram(name, value, labels = {}) {
        if (!this.histograms.has(name)) {
            this.histograms.set(name, []);
        }
        const histogram = this.histograms.get(name);
        histogram.push({
            value,
            labels,
            timestamp: Date.now(),
        });
        if (histogram.length > this.maxHistogramEntries) {
            histogram.splice(0, histogram.length - this.maxHistogramEntries);
        }
    }
    recordGauge(name, value, labels = {}) {
        this.gauges.set(name, {
            value,
            labels,
            timestamp: Date.now(),
        });
    }
    getMetrics() {
        return {
            counters: this.serializeCounters(),
            histograms: this.serializeHistograms(),
            gauges: this.serializeGauges(),
            timestamp: Date.now(),
        };
    }
    calculateAverageResponseTimes(timeWindowMs = 300000) {
        const averages = {};
        const cutoff = Date.now() - timeWindowMs;
        for (const [name, entries] of this.histograms.entries()) {
            if (name.includes('duration')) {
                const recentEntries = entries.filter((entry) => entry.timestamp > cutoff);
                if (recentEntries.length > 0) {
                    const sum = recentEntries.reduce((total, entry) => total + entry.value, 0);
                    averages[name] = sum / recentEntries.length;
                }
            }
        }
        return averages;
    }
    calculateErrorRates(timeWindowMs = 300000) {
        const errorRates = {};
        const errorCounter = this.counters.get('discovery_errors_total');
        const requestCounter = this.counters.get('discovery_requests_total');
        if (errorCounter && requestCounter) {
            const totalErrors = Array.from(errorCounter.values()).reduce((sum, count) => sum + count, 0);
            const totalRequests = Array.from(requestCounter.values()).reduce((sum, count) => sum + count, 0);
            if (totalRequests > 0) {
                errorRates['overall'] = (totalErrors / totalRequests) * 100;
            }
        }
        return errorRates;
    }
    async exportPrometheusMetrics() {
        let prometheusOutput = '';
        const timestamp = Date.now();
        for (const [name, counterMap] of this.counters.entries()) {
            prometheusOutput += `# HELP ${name} Counter metric\n`;
            prometheusOutput += `# TYPE ${name} counter\n`;
            for (const [labelKey, value] of counterMap.entries()) {
                const labels = this.parseLabelKey(labelKey);
                const labelString = this.formatPrometheusLabels(labels);
                prometheusOutput += `${name}${labelString} ${value} ${timestamp}\n`;
            }
        }
        for (const [name, gauge] of this.gauges.entries()) {
            prometheusOutput += `# HELP ${name} Gauge metric\n`;
            prometheusOutput += `# TYPE ${name} gauge\n`;
            const labelString = this.formatPrometheusLabels(gauge.labels);
            prometheusOutput += `${name}${labelString} ${gauge.value} ${gauge.timestamp}\n`;
        }
        for (const [name, entries] of this.histograms.entries()) {
            if (entries.length === 0)
                continue;
            prometheusOutput += `# HELP ${name} Histogram metric\n`;
            prometheusOutput += `# TYPE ${name} histogram\n`;
            const values = entries.map((e) => e.value).sort((a, b) => a - b);
            const percentiles = [0.5, 0.95, 0.99];
            for (const p of percentiles) {
                const index = Math.floor(values.length * p);
                const value = values[index] || 0;
                prometheusOutput += `${name}{quantile="${p}"} ${value} ${timestamp}\n`;
            }
            prometheusOutput += `${name}_count ${values.length} ${timestamp}\n`;
            prometheusOutput += `${name}_sum ${values.reduce((sum, v) => sum + v, 0)} ${timestamp}\n`;
        }
        return prometheusOutput;
    }
    clearMetrics() {
        this.counters.clear();
        this.histograms.clear();
        this.gauges.clear();
        this.logInfo('All metrics cleared');
    }
    getMetricsStats() {
        const totalHistogramEntries = Array.from(this.histograms.values()).reduce((total, entries) => total + entries.length, 0);
        return {
            counters: this.counters.size,
            histograms: this.histograms.size,
            gauges: this.gauges.size,
            totalHistogramEntries,
        };
    }
    createLabelKey(labels) {
        return JSON.stringify(labels);
    }
    parseLabelKey(labelKey) {
        try {
            return JSON.parse(labelKey);
        }
        catch {
            return {};
        }
    }
    formatPrometheusLabels(labels) {
        const labelPairs = Object.entries(labels)
            .map(([key, value]) => `${key}="${value}"`)
            .join(',');
        return labelPairs ? `{${labelPairs}}` : '';
    }
    serializeCounters() {
        const result = {};
        for (const [name, counterMap] of this.counters.entries()) {
            result[name] = Object.fromEntries(counterMap.entries());
        }
        return result;
    }
    serializeHistograms() {
        return Object.fromEntries(this.histograms.entries());
    }
    serializeGauges() {
        return Object.fromEntries(this.gauges.entries());
    }
};
exports.DiscoveryMetricsService = DiscoveryMetricsService;
exports.DiscoveryMetricsService = DiscoveryMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DiscoveryMetricsService);
//# sourceMappingURL=discovery-metrics.service.js.map