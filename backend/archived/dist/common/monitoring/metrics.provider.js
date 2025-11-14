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
exports.DataDogMetricsProvider = exports.PrometheusMetricsProvider = exports.HealthcareMetrics = exports.MetricType = void 0;
const common_1 = require("@nestjs/common");
var MetricType;
(function (MetricType) {
    MetricType["COUNTER"] = "counter";
    MetricType["GAUGE"] = "gauge";
    MetricType["HISTOGRAM"] = "histogram";
    MetricType["SUMMARY"] = "summary";
})(MetricType || (exports.MetricType = MetricType = {}));
var HealthcareMetrics;
(function (HealthcareMetrics) {
    HealthcareMetrics["HTTP_REQUEST_DURATION"] = "http_request_duration_seconds";
    HealthcareMetrics["HTTP_REQUEST_TOTAL"] = "http_request_total";
    HealthcareMetrics["HTTP_REQUEST_ERRORS"] = "http_request_errors_total";
    HealthcareMetrics["DB_QUERY_DURATION"] = "db_query_duration_seconds";
    HealthcareMetrics["DB_CONNECTION_POOL_SIZE"] = "db_connection_pool_size";
    HealthcareMetrics["DB_CONNECTION_ACTIVE"] = "db_connection_active";
    HealthcareMetrics["PATIENT_RECORDS_ACCESSED"] = "patient_records_accessed_total";
    HealthcareMetrics["MEDICATIONS_ADMINISTERED"] = "medications_administered_total";
    HealthcareMetrics["APPOINTMENTS_SCHEDULED"] = "appointments_scheduled_total";
    HealthcareMetrics["INCIDENTS_REPORTED"] = "incidents_reported_total";
    HealthcareMetrics["MEMORY_USAGE_BYTES"] = "memory_usage_bytes";
    HealthcareMetrics["CPU_USAGE_PERCENT"] = "cpu_usage_percent";
    HealthcareMetrics["RESPONSE_TIME_P50"] = "response_time_p50";
    HealthcareMetrics["RESPONSE_TIME_P95"] = "response_time_p95";
    HealthcareMetrics["RESPONSE_TIME_P99"] = "response_time_p99";
    HealthcareMetrics["AUTH_ATTEMPTS_TOTAL"] = "auth_attempts_total";
    HealthcareMetrics["AUTH_FAILURES_TOTAL"] = "auth_failures_total";
    HealthcareMetrics["PHI_ACCESS_TOTAL"] = "phi_access_total";
    HealthcareMetrics["AUDIT_EVENTS_TOTAL"] = "audit_events_total";
})(HealthcareMetrics || (exports.HealthcareMetrics = HealthcareMetrics = {}));
let PrometheusMetricsProvider = class PrometheusMetricsProvider {
    metrics = new Map();
    async recordMetric(metric) {
        const existing = this.metrics.get(metric.name) || [];
        existing.push(metric);
        if (existing.length > 1000) {
            existing.shift();
        }
        this.metrics.set(metric.name, existing);
    }
    async recordHistogram(name, value, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.HISTOGRAM,
            value,
            labels,
            timestamp: new Date(),
            description: `Histogram for ${name}`
        });
    }
    async recordCounter(name, value = 1, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.COUNTER,
            value,
            labels,
            timestamp: new Date(),
            description: `Counter for ${name}`
        });
    }
    async recordGauge(name, value, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.GAUGE,
            value,
            labels,
            timestamp: new Date(),
            description: `Gauge for ${name}`
        });
    }
    async incrementCounter(name, labels = {}) {
        await this.recordCounter(name, 1, labels);
    }
    async decrementGauge(name, labels = {}) {
        await this.recordGauge(name, -1, labels);
    }
    startTimer(name, labels = {}) {
        const startTime = Date.now();
        return async () => {
            const duration = (Date.now() - startTime) / 1000;
            await this.recordHistogram(`${name}_duration_seconds`, duration, labels);
        };
    }
    getPrometheusMetrics() {
        let output = '';
        for (const [metricName, metrics] of this.metrics.entries()) {
            if (metrics.length === 0)
                continue;
            const latestMetric = metrics[metrics.length - 1];
            output += `# HELP ${metricName} ${latestMetric.description || 'Metric for ' + metricName}\n`;
            output += `# TYPE ${metricName} ${latestMetric.type}\n`;
            const labels = Object.entries(latestMetric.labels)
                .map(([key, value]) => `${key}="${value}"`)
                .join(',');
            output += `${metricName}${labels ? `{${labels}}` : ''} ${latestMetric.value}\n\n`;
        }
        return output;
    }
};
exports.PrometheusMetricsProvider = PrometheusMetricsProvider;
exports.PrometheusMetricsProvider = PrometheusMetricsProvider = __decorate([
    (0, common_1.Injectable)()
], PrometheusMetricsProvider);
let DataDogMetricsProvider = class DataDogMetricsProvider {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async recordMetric(metric) {
        console.log(`[DataDog] Recording metric: ${metric.name} = ${metric.value}`);
    }
    async recordHistogram(name, value, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.HISTOGRAM,
            value,
            labels,
            timestamp: new Date()
        });
    }
    async recordCounter(name, value = 1, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.COUNTER,
            value,
            labels,
            timestamp: new Date()
        });
    }
    async recordGauge(name, value, labels = {}) {
        await this.recordMetric({
            name,
            type: MetricType.GAUGE,
            value,
            labels,
            timestamp: new Date()
        });
    }
    async incrementCounter(name, labels = {}) {
        await this.recordCounter(name, 1, labels);
    }
    async decrementGauge(name, labels = {}) {
        await this.recordGauge(name, -1, labels);
    }
    startTimer(name, labels = {}) {
        const startTime = Date.now();
        return async () => {
            const duration = (Date.now() - startTime) / 1000;
            await this.recordHistogram(`${name}_duration`, duration, labels);
        };
    }
};
exports.DataDogMetricsProvider = DataDogMetricsProvider;
exports.DataDogMetricsProvider = DataDogMetricsProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], DataDogMetricsProvider);
//# sourceMappingURL=metrics.provider.js.map