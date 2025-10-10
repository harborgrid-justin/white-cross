/**
 * Load Testing Script for Medication Service Performance
 *
 * Tests performance against targets:
 * - Medication search: <100ms
 * - Medication schedule: <300ms
 * - Inventory alerts: <200ms
 * - Medication reminders: <500ms
 *
 * Usage:
 *   npm install -D autocannon
 *   ts-node tests/load/medication-performance.test.ts
 */

import autocannon from 'autocannon';
import { logger } from '../../src/utils/logger';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || '';

interface LoadTestConfig {
  name: string;
  url: string;
  target: number; // Target latency in ms
  connections: number;
  duration: number; // Duration in seconds
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

interface LoadTestResult {
  name: string;
  target: number;
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number;
  totalRequests: number;
  errors: number;
  passed: boolean;
}

const tests: LoadTestConfig[] = [
  {
    name: 'Medication Search',
    url: `${BASE_URL}/api/medications?search=aspirin&page=1&limit=20`,
    target: 100,
    connections: 50,
    duration: 30
  },
  {
    name: 'Medication Autocomplete',
    url: `${BASE_URL}/api/medications/autocomplete?query=asp`,
    target: 50,
    connections: 100,
    duration: 30
  },
  {
    name: 'Medication Schedule (7 days)',
    url: `${BASE_URL}/api/medications/schedule?startDate=2024-01-01&endDate=2024-01-07`,
    target: 300,
    connections: 20,
    duration: 30
  },
  {
    name: 'Inventory Alerts',
    url: `${BASE_URL}/api/medications/inventory/alerts`,
    target: 200,
    connections: 30,
    duration: 30
  },
  {
    name: 'Medication Reminders',
    url: `${BASE_URL}/api/medications/reminders`,
    target: 500,
    connections: 10,
    duration: 30
  },
  {
    name: 'Student Medications',
    url: `${BASE_URL}/api/medications/student/student_123`,
    target: 200,
    connections: 25,
    duration: 30
  },
  {
    name: 'Medication by ID',
    url: `${BASE_URL}/api/medications/med_123`,
    target: 50,
    connections: 50,
    duration: 30
  }
];

/**
 * Run a single load test
 */
async function runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
  logger.info(`Running load test: ${config.name}`);
  logger.info(`  Target: <${config.target}ms`);
  logger.info(`  Connections: ${config.connections}`);
  logger.info(`  Duration: ${config.duration}s`);

  const result = await autocannon({
    url: config.url,
    connections: config.connections,
    duration: config.duration,
    method: config.method || 'GET',
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: config.body ? JSON.stringify(config.body) : undefined
  });

  const avgLatency = result.latency.mean;
  const p50Latency = result.latency.p50;
  const p95Latency = result.latency.p95;
  const p99Latency = result.latency.p99;
  const throughput = result.throughput.mean;
  const totalRequests = result.requests.total;
  const errors = result.errors;
  const passed = avgLatency <= config.target;

  logger.info(`  Result: ${passed ? 'PASS' : 'FAIL'}`);
  logger.info(`  Avg Latency: ${avgLatency.toFixed(2)}ms`);
  logger.info(`  P95 Latency: ${p95Latency}ms`);
  logger.info(`  Throughput: ${(throughput / 1024 / 1024).toFixed(2)} MB/s`);
  logger.info(`  Total Requests: ${totalRequests}`);
  if (errors > 0) {
    logger.warn(`  Errors: ${errors}`);
  }
  logger.info('');

  return {
    name: config.name,
    target: config.target,
    avgLatency,
    p50Latency,
    p95Latency,
    p99Latency,
    throughput,
    totalRequests,
    errors,
    passed
  };
}

/**
 * Run all load tests
 */
async function runAllTests() {
  console.log('=====================================');
  console.log('Medication Service Load Testing');
  console.log('=====================================\n');

  const results: LoadTestResult[] = [];

  for (const test of tests) {
    const result = await runLoadTest(test);
    results.push(result);

    // Wait 5 seconds between tests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Print summary table
  console.log('\n=====================================');
  console.log('SUMMARY');
  console.log('=====================================\n');

  console.table(
    results.map(r => ({
      'Test': r.name,
      'Target (ms)': r.target,
      'Avg (ms)': r.avgLatency.toFixed(2),
      'P95 (ms)': r.p95Latency,
      'P99 (ms)': r.p99Latency,
      'Requests': r.totalRequests,
      'Errors': r.errors,
      'Status': r.passed ? '✓ PASS' : '✗ FAIL'
    }))
  );

  // Calculate overall statistics
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const passRate = (passedTests / totalTests) * 100;

  console.log(`\nOverall Pass Rate: ${passedTests}/${totalTests} (${passRate.toFixed(1)}%)\n`);

  // Performance comparison
  console.log('=====================================');
  console.log('PERFORMANCE IMPROVEMENTS');
  console.log('=====================================\n');

  const improvements = [
    { operation: 'Medication Search', before: 800, after: results.find(r => r.name === 'Medication Search')?.avgLatency || 0 },
    { operation: 'Medication Schedule', before: 2000, after: results.find(r => r.name === 'Medication Schedule (7 days)')?.avgLatency || 0 },
    { operation: 'Inventory Alerts', before: 1200, after: results.find(r => r.name === 'Inventory Alerts')?.avgLatency || 0 },
    { operation: 'Medication Reminders', before: 3000, after: results.find(r => r.name === 'Medication Reminders')?.avgLatency || 0 }
  ];

  console.table(
    improvements.map(i => ({
      'Operation': i.operation,
      'Before (ms)': i.before,
      'After (ms)': i.after.toFixed(2),
      'Improvement': `${((i.before - i.after) / i.before * 100).toFixed(1)}%`,
      'Speedup': `${(i.before / i.after).toFixed(1)}x`
    }))
  );

  return results;
}

/**
 * Warm-up test to prepare the system
 */
async function warmUp() {
  console.log('Warming up system...\n');

  await autocannon({
    url: `${BASE_URL}/api/health`,
    connections: 10,
    duration: 5,
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });

  console.log('Warm-up complete\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
}

/**
 * Main execution
 */
if (require.main === module) {
  (async () => {
    try {
      // Warm up
      await warmUp();

      // Run tests
      const results = await runAllTests();

      // Exit with appropriate code
      const allPassed = results.every(r => r.passed);
      process.exit(allPassed ? 0 : 1);
    } catch (error) {
      logger.error('Load testing failed', error);
      process.exit(1);
    }
  })();
}

export { runAllTests, runLoadTest };
