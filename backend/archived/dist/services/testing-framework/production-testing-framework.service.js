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
exports.TestingFactory = exports.TestUtils = exports.TestSuiteBuilder = exports.ProductionTestingFramework = exports.DatabaseTestHelper = exports.TestDataFactory = exports.MockFactory = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const perf_hooks_1 = require("perf_hooks");
class MockFactory {
    static mocks = new Map();
    static createMock(name, methods = {}) {
        const mock = {
            ...methods,
            __isMock: true,
            __mockName: name,
            __calls: new Map(),
            ...Object.keys(methods).reduce((acc, key) => {
                const originalMethod = methods[key];
                if (typeof originalMethod === 'function') {
                    acc[key] = (...args) => {
                        const calls = mock.__calls.get(key) || [];
                        calls.push(args);
                        mock.__calls.set(key, calls);
                        return originalMethod.apply(mock, args);
                    };
                }
                return acc;
            }, {})
        };
        this.mocks.set(name, mock);
        return mock;
    }
    static getMockCallHistory(mock, methodName) {
        return mock.__calls?.get(methodName) || [];
    }
    static resetMock(mock) {
        if (mock.__calls) {
            mock.__calls.clear();
        }
    }
    static resetAllMocks() {
        this.mocks.forEach(mock => this.resetMock(mock));
    }
}
exports.MockFactory = MockFactory;
class TestDataFactory {
    static sequences = new Map();
    static sequence(name) {
        const current = this.sequences.get(name) || 0;
        const next = current + 1;
        this.sequences.set(name, next);
        return next;
    }
    static user(overrides = {}) {
        return {
            id: this.sequence('user'),
            email: `user${this.sequence('email')}@example.com`,
            name: `Test User ${this.sequence('userName')}`,
            createdAt: new Date(),
            active: true,
            ...overrides
        };
    }
    static product(overrides = {}) {
        return {
            id: this.sequence('product'),
            name: `Test Product ${this.sequence('productName')}`,
            price: Math.floor(Math.random() * 1000) + 10,
            description: 'A test product for testing purposes',
            inStock: true,
            createdAt: new Date(),
            ...overrides
        };
    }
    static order(overrides = {}) {
        return {
            id: this.sequence('order'),
            userId: this.sequence('orderUser'),
            total: Math.floor(Math.random() * 500) + 50,
            status: 'pending',
            items: [],
            createdAt: new Date(),
            ...overrides
        };
    }
    static randomString(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    static randomEmail() {
        return `${this.randomString(8)}@${this.randomString(6)}.com`;
    }
    static resetSequences() {
        this.sequences.clear();
    }
}
exports.TestDataFactory = TestDataFactory;
class DatabaseTestHelper {
    sequelize;
    backupData = new Map();
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async cleanDatabase() {
        const tables = await this.sequelize.query(`SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`, { type: 'SELECT' });
        await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const table of tables) {
            await this.sequelize.query(`TRUNCATE TABLE ${table.table_name}`);
        }
        await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    async seedTestData(tableName, data) {
        for (const record of data) {
            await this.sequelize.query(`INSERT INTO ${tableName} (${Object.keys(record).join(', ')}) VALUES (${Object.keys(record).map(() => '?').join(', ')})`, {
                replacements: Object.values(record),
                type: 'INSERT'
            });
        }
    }
    async backupTable(tableName) {
        const data = await this.sequelize.query(`SELECT * FROM ${tableName}`, { type: 'SELECT' });
        this.backupData.set(tableName, data);
    }
    async restoreTable(tableName) {
        const data = this.backupData.get(tableName);
        if (data) {
            await this.sequelize.query(`DELETE FROM ${tableName}`);
            await this.seedTestData(tableName, data);
        }
    }
    async withTransaction(testFn) {
        const transaction = await this.sequelize.transaction();
        try {
            const result = await testFn();
            await transaction.rollback();
            return result;
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
exports.DatabaseTestHelper = DatabaseTestHelper;
let ProductionTestingFramework = class ProductionTestingFramework extends events_1.EventEmitter {
    logger = new common_1.Logger('TestingFramework');
    testSuites = new Map();
    testResults = new Map();
    currentTest = null;
    loadTestResults = [];
    constructor() {
        super();
    }
    createTestSuite(name, description) {
        return new TestSuiteBuilder(name, description, this);
    }
    addTestSuite(suite) {
        this.testSuites.set(suite.id, suite);
    }
    async runTestSuite(suiteId) {
        const suite = this.testSuites.get(suiteId);
        if (!suite) {
            throw new Error(`Test suite ${suiteId} not found`);
        }
        this.logger.log(`Running test suite: ${suite.name}`);
        const startTime = perf_hooks_1.performance.now();
        if (suite.setup) {
            await suite.setup();
        }
        let passed = 0;
        let failed = 0;
        let skipped = 0;
        for (const test of suite.tests) {
            try {
                if (suite.beforeEach) {
                    await suite.beforeEach();
                }
                await this.runTest(test, suite.timeout, suite.retries);
                if (test.status === 'passed')
                    passed++;
                else if (test.status === 'failed')
                    failed++;
                else if (test.status === 'skipped')
                    skipped++;
                if (suite.afterEach) {
                    await suite.afterEach();
                }
            }
            catch (error) {
                test.status = 'failed';
                test.error = error.message;
                failed++;
                this.logger.error(`Test failed: ${test.name}`, error);
            }
        }
        if (suite.teardown) {
            await suite.teardown();
        }
        const endTime = perf_hooks_1.performance.now();
        const duration = endTime - startTime;
        const report = {
            id: `report_${Date.now()}`,
            timestamp: new Date(),
            environment: process.env.NODE_ENV || 'test',
            totalTests: suite.tests.length,
            passedTests: passed,
            failedTests: failed,
            skippedTests: skipped,
            coverage: {
                lines: 0,
                functions: 0,
                branches: 0,
                statements: 0
            },
            performance: {
                totalDuration: duration,
                slowestTest: this.findSlowestTest(suite.tests),
                averageTestTime: suite.tests.length > 0 ? duration / suite.tests.length : 0
            },
            suites: [suite]
        };
        this.emit('testSuiteCompleted', report);
        return report;
    }
    async runAllTestSuites() {
        const allSuites = Array.from(this.testSuites.values());
        const startTime = perf_hooks_1.performance.now();
        let totalPassed = 0;
        let totalFailed = 0;
        let totalSkipped = 0;
        for (const suite of allSuites) {
            const report = await this.runTestSuite(suite.id);
            totalPassed += report.passedTests;
            totalFailed += report.failedTests;
            totalSkipped += report.skippedTests;
        }
        const endTime = perf_hooks_1.performance.now();
        const aggregatedReport = {
            id: `report_all_${Date.now()}`,
            timestamp: new Date(),
            environment: process.env.NODE_ENV || 'test',
            totalTests: totalPassed + totalFailed + totalSkipped,
            passedTests: totalPassed,
            failedTests: totalFailed,
            skippedTests: totalSkipped,
            coverage: { lines: 0, functions: 0, branches: 0, statements: 0 },
            performance: {
                totalDuration: endTime - startTime,
                slowestTest: this.findSlowestTestAcrossAllSuites(),
                averageTestTime: 0
            },
            suites: allSuites
        };
        this.emit('allTestsCompleted', aggregatedReport);
        return aggregatedReport;
    }
    async runTest(test, timeout, retries) {
        this.currentTest = test;
        test.status = 'running';
        test.startTime = new Date();
        let attempt = 0;
        let lastError = null;
        while (attempt <= retries) {
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Test timeout')), timeout);
                });
                await Promise.race([
                    this.executeTestFunction(test),
                    timeoutPromise
                ]);
                test.status = 'passed';
                test.endTime = new Date();
                test.duration = test.endTime.getTime() - test.startTime.getTime();
                this.testResults.set(test.id, test);
                this.emit('testCompleted', test);
                return;
            }
            catch (error) {
                lastError = error;
                attempt++;
                if (attempt <= retries) {
                    this.logger.warn(`Test ${test.name} failed, retrying (${attempt}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, 100 * attempt));
                }
            }
        }
        test.status = 'failed';
        test.error = lastError?.message || 'Unknown error';
        test.endTime = new Date();
        test.duration = test.endTime.getTime() - test.startTime.getTime();
        this.testResults.set(test.id, test);
        this.emit('testFailed', test);
    }
    async executeTestFunction(test) {
        if (test.metadata.testFunction) {
            await test.metadata.testFunction();
        }
        for (const assertion of test.assertions) {
            this.validateAssertion(assertion);
        }
    }
    async runLoadTest(config) {
        this.logger.log(`Starting load test with ${config.concurrentUsers} users for ${config.duration}ms`);
        const results = [];
        for (const scenario of config.scenarios) {
            const scenarioResult = await this.executeLoadTestScenario(scenario, config);
            results.push(scenarioResult);
        }
        this.loadTestResults = results;
        this.emit('loadTestCompleted', results);
        return results;
    }
    async executeLoadTestScenario(scenario, config) {
        const usersForScenario = Math.floor((config.concurrentUsers * scenario.weight) / 100);
        const responseTimes = [];
        const errors = [];
        let successfulRequests = 0;
        let failedRequests = 0;
        const startTime = Date.now();
        const endTime = startTime + config.duration;
        const userPromises = Array.from({ length: usersForScenario }, async (_, userIndex) => {
            while (Date.now() < endTime) {
                for (const step of scenario.steps) {
                    try {
                        const stepStartTime = perf_hooks_1.performance.now();
                        await this.simulateHTTPRequest(step);
                        const stepEndTime = perf_hooks_1.performance.now();
                        responseTimes.push(stepEndTime - stepStartTime);
                        successfulRequests++;
                        if (step.thinkTime) {
                            await new Promise(resolve => setTimeout(resolve, step.thinkTime));
                        }
                    }
                    catch (error) {
                        errors.push(error.message);
                        failedRequests++;
                    }
                }
            }
        });
        await Promise.all(userPromises);
        responseTimes.sort((a, b) => a - b);
        const totalRequests = successfulRequests + failedRequests;
        return {
            scenario: scenario.name,
            totalRequests,
            successfulRequests,
            failedRequests,
            averageResponseTime: responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length,
            minResponseTime: responseTimes[0] || 0,
            maxResponseTime: responseTimes[responseTimes.length - 1] || 0,
            requestsPerSecond: totalRequests / (config.duration / 1000),
            errors: [...new Set(errors)],
            percentiles: {
                p50: this.calculatePercentile(responseTimes, 50),
                p90: this.calculatePercentile(responseTimes, 90),
                p95: this.calculatePercentile(responseTimes, 95),
                p99: this.calculatePercentile(responseTimes, 99)
            }
        };
    }
    async simulateHTTPRequest(step) {
        const delay = Math.random() * 100 + 50;
        await new Promise(resolve => setTimeout(resolve, delay));
        if (Math.random() < 0.05) {
            throw new Error(`HTTP ${step.method} ${step.url} failed`);
        }
    }
    calculatePercentile(sortedArray, percentile) {
        const index = Math.ceil(sortedArray.length * (percentile / 100)) - 1;
        return sortedArray[index] || 0;
    }
    validateAssertion(assertion) {
        let passed = false;
        switch (assertion.operator) {
            case 'equals':
                passed = assertion.actual === assertion.expected;
                break;
            case 'notEquals':
                passed = assertion.actual !== assertion.expected;
                break;
            case 'greaterThan':
                passed = assertion.actual > assertion.expected;
                break;
            case 'lessThan':
                passed = assertion.actual < assertion.expected;
                break;
            case 'contains':
                passed = String(assertion.actual).includes(String(assertion.expected));
                break;
            case 'throws':
                passed = assertion.actual instanceof Error;
                break;
        }
        assertion.passed = passed;
        if (!passed) {
            throw new Error(`Assertion failed: ${assertion.description}. Expected: ${assertion.expected}, Actual: ${assertion.actual}`);
        }
    }
    findSlowestTest(tests) {
        let slowest = tests[0];
        for (const test of tests) {
            if (test.duration && slowest.duration && test.duration > slowest.duration) {
                slowest = test;
            }
        }
        return slowest?.name || '';
    }
    findSlowestTestAcrossAllSuites() {
        let slowestTest = '';
        let slowestTime = 0;
        for (const suite of this.testSuites.values()) {
            for (const test of suite.tests) {
                if (test.duration && test.duration > slowestTime) {
                    slowestTime = test.duration;
                    slowestTest = test.name;
                }
            }
        }
        return slowestTest;
    }
    generateHTMLReport(report) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${report.timestamp.toISOString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        .skipped { color: orange; }
        .test-case { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>Test Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Environment: ${report.environment}</p>
        <p>Total Tests: ${report.totalTests}</p>
        <p class="passed">Passed: ${report.passedTests}</p>
        <p class="failed">Failed: ${report.failedTests}</p>
        <p class="skipped">Skipped: ${report.skippedTests}</p>
        <p>Duration: ${report.performance.totalDuration.toFixed(2)}ms</p>
        <p>Average Test Time: ${report.performance.averageTestTime.toFixed(2)}ms</p>
    </div>
    
    ${report.suites.map(suite => `
        <div class="test-suite">
            <h3>${suite.name}</h3>
            <p>${suite.description}</p>
            ${suite.tests.map(test => `
                <div class="test-case ${test.status}">
                    <h4>${test.name}</h4>
                    <p>Status: ${test.status}</p>
                    <p>Duration: ${test.duration || 0}ms</p>
                    ${test.error ? `<p>Error: ${test.error}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>
    `;
    }
    cleanup() {
        this.testSuites.clear();
        this.testResults.clear();
        this.loadTestResults = [];
        MockFactory.resetAllMocks();
        TestDataFactory.resetSequences();
    }
};
exports.ProductionTestingFramework = ProductionTestingFramework;
exports.ProductionTestingFramework = ProductionTestingFramework = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductionTestingFramework);
class TestSuiteBuilder {
    suite;
    framework;
    constructor(name, description, framework) {
        this.framework = framework;
        this.suite = {
            id: `suite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            tests: [],
            timeout: 5000,
            retries: 0
        };
    }
    timeout(ms) {
        this.suite.timeout = ms;
        return this;
    }
    retries(count) {
        this.suite.retries = count;
        return this;
    }
    setup(fn) {
        this.suite.setup = fn;
        return this;
    }
    teardown(fn) {
        this.suite.teardown = fn;
        return this;
    }
    beforeEach(fn) {
        this.suite.beforeEach = fn;
        return this;
    }
    afterEach(fn) {
        this.suite.afterEach = fn;
        return this;
    }
    test(name, testFn) {
        const test = {
            id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description: name,
            category: 'unit',
            status: 'pending',
            assertions: [],
            metadata: { testFunction: testFn }
        };
        this.suite.tests.push(test);
        return this;
    }
    build() {
        this.framework.addTestSuite(this.suite);
        return this.suite;
    }
}
exports.TestSuiteBuilder = TestSuiteBuilder;
exports.TestUtils = {
    expect: (actual) => ({
        toBe: (expected) => ({ actual, expected, operator: 'equals' }),
        toNotBe: (expected) => ({ actual, expected, operator: 'notEquals' }),
        toBeGreaterThan: (expected) => ({ actual, expected, operator: 'greaterThan' }),
        toBeLessThan: (expected) => ({ actual, expected, operator: 'lessThan' }),
        toContain: (expected) => ({ actual, expected, operator: 'contains' }),
        toThrow: () => ({ actual, expected: true, operator: 'throws' })
    }),
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    createUser: TestDataFactory.user.bind(TestDataFactory),
    createProduct: TestDataFactory.product.bind(TestDataFactory),
    createOrder: TestDataFactory.order.bind(TestDataFactory)
};
class TestingFactory {
    static createProductionTestingFramework() {
        return new ProductionTestingFramework();
    }
    static createDatabaseTestHelper(sequelize) {
        return new DatabaseTestHelper(sequelize);
    }
}
exports.TestingFactory = TestingFactory;
//# sourceMappingURL=production-testing-framework.service.js.map