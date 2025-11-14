/**
 * Worker Thread for CPU-Intensive Health Calculations
 *
 * Handles:
 * - BMI calculations (single and batch)
 * - Vital sign trend analysis
 * - Statistical aggregations
 *
 * This worker runs in a separate thread to prevent blocking the main event loop
 * during CPU-intensive calculations.
 */

import { parentPort } from 'worker_threads';

/**
 * Task types supported by this worker
 */
type CalculationType = 'bmi' | 'bmi_batch' | 'vital_trends' | 'aggregations';

/**
 * Task message structure
 */
interface CalculationTask {
  type: CalculationType;
  data: any;
}

/**
 * Calculate BMI from height and weight
 *
 * @param heightCm - Height in centimeters
 * @param weightKg - Weight in kilograms
 * @returns BMI value rounded to 1 decimal place
 */
function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Batch BMI calculations
 *
 * @param records - Array of height/weight pairs
 * @returns Array of BMI values
 */
function batchCalculateBMI(
  records: Array<{ height: number; weight: number }>,
): number[] {
  return records.map((r) => calculateBMI(r.height, r.weight));
}

/**
 * Analyze vital sign trends over time
 *
 * @param vitals - Array of vital measurements with dates
 * @returns Trend analysis with statistics
 */
function analyzeVitalTrends(vitals: Array<{ date: Date; value: number }>) {
  if (vitals.length < 2) {
    return {
      trend: 'stable' as const,
      changeRate: 0,
      average: vitals[0]?.value || 0,
    };
  }

  // Sort by date
  const sorted = vitals.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Calculate average
  const average = sorted.reduce((sum, v) => sum + v.value, 0) / sorted.length;

  // Simple linear trend analysis
  const firstValue = sorted[0]!.value;
  const lastValue = sorted[sorted.length - 1]!.value;
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
 * Calculate statistical aggregations for a set of values
 *
 * @param values - Array of numeric values
 * @returns Statistical measures (count, sum, average, min, max, median, stdDev)
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

  // Calculate median
  const mid = Math.floor(count / 2);
  const median =
    count % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;

  // Calculate standard deviation
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
 * Processes incoming calculation tasks and sends results back to main thread
 */
if (parentPort) {
  parentPort.on('message', (task: CalculationTask) => {
    try {
      let result: any;

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
          throw new Error(`Unknown calculation type: ${(task as any).type}`);
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
