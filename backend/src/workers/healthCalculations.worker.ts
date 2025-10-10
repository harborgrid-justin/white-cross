/**
 * Worker Thread for CPU-Intensive Health Calculations
 *
 * Handles:
 * - BMI calculations
 * - Growth percentile calculations
 * - Vital sign trend analysis
 * - Statistical aggregations
 *
 * This prevents blocking the main event loop
 */

import { parentPort, workerData } from 'worker_threads';

interface CalculationTask {
  type: 'bmi' | 'growth_percentile' | 'vital_trends' | 'aggregations';
  data: any;
}

/**
 * Calculate BMI from height and weight
 */
function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Calculate growth percentile based on CDC charts
 * Simplified implementation - real implementation would use CDC data tables
 */
function calculateGrowthPercentile(
  age: number,
  gender: 'MALE' | 'FEMALE',
  measurement: number,
  type: 'height' | 'weight' | 'bmi'
): number {
  // This is a placeholder - real implementation would use CDC growth charts
  // For demonstration, returning a mock percentile
  return Math.min(99, Math.max(1, Math.round(Math.random() * 100)));
}

/**
 * Analyze vital sign trends
 */
function analyzeVitalTrends(vitals: Array<{ date: Date; value: number }>) {
  if (vitals.length < 2) {
    return {
      trend: 'stable',
      changeRate: 0,
      average: vitals[0]?.value || 0,
    };
  }

  // Sort by date
  const sorted = vitals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate average
  const average = sorted.reduce((sum, v) => sum + v.value, 0) / sorted.length;

  // Simple linear trend
  const firstValue = sorted[0].value;
  const lastValue = sorted[sorted.length - 1].value;
  const changeRate = ((lastValue - firstValue) / firstValue) * 100;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (changeRate > 5) trend = 'increasing';
  else if (changeRate < -5) trend = 'decreasing';

  return {
    trend,
    changeRate: Math.round(changeRate * 10) / 10,
    average: Math.round(average * 10) / 10,
    min: Math.min(...sorted.map((v) => v.value)),
    max: Math.max(...sorted.map((v) => v.value)),
  };
}

/**
 * Batch BMI calculations
 */
function batchCalculateBMI(records: Array<{ height: number; weight: number }>): number[] {
  return records.map((r) => calculateBMI(r.height, r.weight));
}

/**
 * Statistical aggregations
 */
function calculateAggregations(values: number[]) {
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

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Standard deviation
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

/**
 * Main message handler
 */
if (parentPort) {
  parentPort.on('message', (task: CalculationTask) => {
    try {
      let result: any;

      switch (task.type) {
        case 'bmi':
          if (Array.isArray(task.data)) {
            result = batchCalculateBMI(task.data);
          } else {
            result = calculateBMI(task.data.height, task.data.weight);
          }
          break;

        case 'growth_percentile':
          result = calculateGrowthPercentile(
            task.data.age,
            task.data.gender,
            task.data.measurement,
            task.data.type
          );
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

      parentPort!.postMessage({ success: true, result });
    } catch (error) {
      parentPort!.postMessage({
        success: false,
        error: (error as Error).message,
      });
    }
  });
}
