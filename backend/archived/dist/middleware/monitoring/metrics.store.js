"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsStore = void 0;
class MetricsStore {
    batchSize;
    flushInterval;
    onFlush;
    metrics = [];
    flushTimer;
    constructor(batchSize, flushInterval, onFlush) {
        this.batchSize = batchSize;
        this.flushInterval = flushInterval;
        this.onFlush = onFlush;
        this.startFlushTimer();
    }
    add(metric) {
        this.metrics.push(metric);
        if (this.metrics.length >= this.batchSize) {
            this.flush();
        }
    }
    startFlushTimer() {
        this.flushTimer = setInterval(() => {
            if (this.metrics.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }
    async flush() {
        if (this.metrics.length === 0)
            return;
        const metricsToFlush = [...this.metrics];
        this.metrics = [];
        try {
            await this.onFlush(metricsToFlush);
        }
        catch (error) {
            console.error('[MetricsStore] Error flushing metrics:', error);
            this.metrics.unshift(...metricsToFlush);
        }
    }
    async forceFlush() {
        await this.flush();
    }
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush();
    }
}
exports.MetricsStore = MetricsStore;
//# sourceMappingURL=metrics.store.js.map