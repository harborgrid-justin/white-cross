"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
function calculateBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
}
function batchCalculateBMI(records) {
    return records.map((r) => calculateBMI(r.height, r.weight));
}
function analyzeVitalTrends(vitals) {
    if (vitals.length < 2) {
        return {
            trend: 'stable',
            changeRate: 0,
            average: vitals[0]?.value || 0,
        };
    }
    const sorted = vitals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const average = sorted.reduce((sum, v) => sum + v.value, 0) / sorted.length;
    const firstValue = sorted[0].value;
    const lastValue = sorted[sorted.length - 1].value;
    const changeRate = ((lastValue - firstValue) / firstValue) * 100;
    let trend = 'stable';
    if (changeRate > 5)
        trend = 'increasing';
    else if (changeRate < -5)
        trend = 'decreasing';
    return {
        trend,
        changeRate: Math.round(changeRate * 10) / 10,
        average: Math.round(average * 10) / 10,
        min: Math.min(...sorted.map((v) => v.value)),
        max: Math.max(...sorted.map((v) => v.value)),
    };
}
function calculateAggregations(values) {
    if (values.length === 0) {
        return {
            count: 0,
            sum: 0,
            average: 0,
            min: 0,
            max: 0,
            median: 0,
            stdDev: 0,
        };
    }
    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const mid = Math.floor(count / 2);
    const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const squaredDiffs = values.map((v) => Math.pow(v - average, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / count;
    const stdDev = Math.sqrt(variance);
    return {
        count,
        sum: Math.round(sum * 100) / 100,
        average: Math.round(average * 100) / 100,
        min: sorted[0],
        max: sorted[count - 1],
        median: Math.round(median * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
    };
}
if (worker_threads_1.parentPort) {
    worker_threads_1.parentPort.on('message', (task) => {
        try {
            let result;
            switch (task.type) {
                case 'bmi':
                    result = calculateBMI(task.data.height, task.data.weight);
                    break;
                case 'bmi_batch':
                    result = batchCalculateBMI(task.data);
                    break;
                case 'vital_trends':
                    result = analyzeVitalTrends(task.data);
                    break;
                case 'aggregations':
                    result = calculateAggregations(task.data);
                    break;
                default:
                    throw new Error(`Unknown calculation type: ${task.type}`);
            }
            worker_threads_1.parentPort.postMessage({ success: true, result });
        }
        catch (error) {
            worker_threads_1.parentPort.postMessage({
                success: false,
                error: error.message,
            });
        }
    });
}
//# sourceMappingURL=healthCalculations.worker.js.map