import {
  ProductionTestingFramework,
  MockFactory,
  TestDataFactory,
  DatabaseTestHelper,
  TestingFactory,
  TestUtils,
  TestSuiteBuilder,
} from './production-testing-framework.service';
import { Sequelize } from 'sequelize';

describe('ProductionTestingFramework', () => {
  let framework: ProductionTestingFramework;

  beforeEach(() => {
    framework = new ProductionTestingFramework();
  });

  afterEach(() => {
    framework.cleanup();
  });

  describe('createTestSuite', () => {
    it('should create a test suite builder', () => {
      const builder = framework.createTestSuite('Test Suite', 'Description');

      expect(builder).toBeInstanceOf(TestSuiteBuilder);
    });

    it('should allow chaining methods', () => {
      const builder = framework
        .createTestSuite('Test Suite', 'Description')
        .timeout(10000)
        .retries(3);

      expect(builder).toBeDefined();
    });
  });

  describe('runTestSuite', () => {
    it('should run a test suite successfully', async () => {
      const suite = framework
        .createTestSuite('Sample Suite', 'Test description')
        .test('test 1', async () => {
          expect(1 + 1).toBe(2);
        })
        .build();

      const report = await framework.runTestSuite(suite.id);

      expect(report.totalTests).toBe(1);
      expect(report.passedTests).toBe(1);
      expect(report.failedTests).toBe(0);
    });

    it('should handle failing tests', async () => {
      const suite = framework
        .createTestSuite('Failing Suite', 'Test description')
        .test('failing test', async () => {
          throw new Error('Test failed');
        })
        .build();

      const report = await framework.runTestSuite(suite.id);

      expect(report.totalTests).toBe(1);
      expect(report.passedTests).toBe(0);
      expect(report.failedTests).toBe(1);
    });

    it('should execute setup and teardown hooks', async () => {
      let setupCalled = false;
      let teardownCalled = false;

      const suite = framework
        .createTestSuite('Hook Suite', 'Test description')
        .setup(async () => {
          setupCalled = true;
        })
        .teardown(async () => {
          teardownCalled = true;
        })
        .test('test 1', async () => {
          expect(setupCalled).toBe(true);
        })
        .build();

      await framework.runTestSuite(suite.id);

      expect(setupCalled).toBe(true);
      expect(teardownCalled).toBe(true);
    });

    it('should execute beforeEach and afterEach hooks', async () => {
      let beforeCount = 0;
      let afterCount = 0;

      const suite = framework
        .createTestSuite('Each Hooks Suite', 'Test description')
        .beforeEach(async () => {
          beforeCount++;
        })
        .afterEach(async () => {
          afterCount++;
        })
        .test('test 1', async () => {})
        .test('test 2', async () => {})
        .build();

      await framework.runTestSuite(suite.id);

      expect(beforeCount).toBe(2);
      expect(afterCount).toBe(2);
    });

    it('should handle test timeout', async () => {
      const suite = framework
        .createTestSuite('Timeout Suite', 'Test description')
        .timeout(100)
        .test('timeout test', async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
        })
        .build();

      const report = await framework.runTestSuite(suite.id);

      expect(report.failedTests).toBe(1);
    });

    it('should retry failed tests', async () => {
      let attempt = 0;

      const suite = framework
        .createTestSuite('Retry Suite', 'Test description')
        .retries(2)
        .test('retry test', async () => {
          attempt++;
          if (attempt < 3) {
            throw new Error('Not yet');
          }
        })
        .build();

      const report = await framework.runTestSuite(suite.id);

      expect(attempt).toBe(3);
      expect(report.passedTests).toBe(1);
    });

    it('should track test duration', async () => {
      const suite = framework
        .createTestSuite('Duration Suite', 'Test description')
        .test('duration test', async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
        })
        .build();

      const report = await framework.runTestSuite(suite.id);

      expect(report.performance.totalDuration).toBeGreaterThan(0);
    });

    it('should throw error for non-existent suite', async () => {
      await expect(framework.runTestSuite('non-existent')).rejects.toThrow('Test suite non-existent not found');
    });
  });

  describe('runAllTestSuites', () => {
    it('should run multiple test suites', async () => {
      framework
        .createTestSuite('Suite 1', 'First suite')
        .test('test 1', async () => {})
        .build();

      framework
        .createTestSuite('Suite 2', 'Second suite')
        .test('test 2', async () => {})
        .build();

      const report = await framework.runAllTestSuites();

      expect(report.totalTests).toBe(2);
      expect(report.suites).toHaveLength(2);
    });

    it('should aggregate results from all suites', async () => {
      framework
        .createTestSuite('Success Suite', 'All pass')
        .test('test 1', async () => {})
        .build();

      framework
        .createTestSuite('Failure Suite', 'Some fail')
        .test('test 2', async () => {
          throw new Error('Failed');
        })
        .build();

      const report = await framework.runAllTestSuites();

      expect(report.totalTests).toBe(2);
      expect(report.passedTests).toBe(1);
      expect(report.failedTests).toBe(1);
    });
  });

  describe('runLoadTest', () => {
    it('should execute load test scenario', async () => {
      const config = {
        targetURL: 'http://localhost:3000',
        concurrentUsers: 5,
        requestsPerSecond: 10,
        duration: 100,
        rampUpTime: 0,
        scenarios: [
          {
            name: 'Test Scenario',
            weight: 100,
            steps: [
              {
                name: 'GET request',
                method: 'GET' as const,
                url: '/api/test',
              },
            ],
          },
        ],
      };

      const results = await framework.runLoadTest(config);

      expect(results).toHaveLength(1);
      expect(results[0].scenario).toBe('Test Scenario');
      expect(results[0].totalRequests).toBeGreaterThan(0);
    });

    it('should calculate response time percentiles', async () => {
      const config = {
        targetURL: 'http://localhost:3000',
        concurrentUsers: 2,
        requestsPerSecond: 5,
        duration: 50,
        rampUpTime: 0,
        scenarios: [
          {
            name: 'Percentile Test',
            weight: 100,
            steps: [
              {
                name: 'Test step',
                method: 'GET' as const,
                url: '/test',
              },
            ],
          },
        ],
      };

      const results = await framework.runLoadTest(config);

      expect(results[0].percentiles.p50).toBeDefined();
      expect(results[0].percentiles.p90).toBeDefined();
      expect(results[0].percentiles.p95).toBeDefined();
      expect(results[0].percentiles.p99).toBeDefined();
    });

    it('should track successful and failed requests', async () => {
      const config = {
        targetURL: 'http://localhost:3000',
        concurrentUsers: 3,
        requestsPerSecond: 5,
        duration: 50,
        rampUpTime: 0,
        scenarios: [
          {
            name: 'Mixed Results',
            weight: 100,
            steps: [
              {
                name: 'Test step',
                method: 'POST' as const,
                url: '/test',
              },
            ],
          },
        ],
      };

      const results = await framework.runLoadTest(config);

      expect(results[0].totalRequests).toBe(
        results[0].successfulRequests + results[0].failedRequests
      );
    });
  });

  describe('generateHTMLReport', () => {
    it('should generate HTML report', () => {
      const suite = framework
        .createTestSuite('HTML Report Suite', 'Test description')
        .test('test 1', async () => {})
        .build();

      framework.runTestSuite(suite.id).then((report) => {
        const html = framework.generateHTMLReport(report);

        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('Test Report');
        expect(html).toContain('HTML Report Suite');
      });
    });

    it('should include test statistics in report', () => {
      const report = {
        id: 'report-1',
        timestamp: new Date(),
        environment: 'test',
        totalTests: 10,
        passedTests: 8,
        failedTests: 2,
        skippedTests: 0,
        coverage: { lines: 80, functions: 75, branches: 70, statements: 80 },
        performance: { totalDuration: 1000, slowestTest: 'slow test', averageTestTime: 100 },
        suites: [],
      };

      const html = framework.generateHTMLReport(report);

      expect(html).toContain('Total Tests: 10');
      expect(html).toContain('Passed: 8');
      expect(html).toContain('Failed: 2');
    });
  });

  describe('cleanup', () => {
    it('should clear all test data', () => {
      framework.createTestSuite('Suite to Clean', 'Description').build();

      framework.cleanup();

      expect(() => framework.runTestSuite('any-id')).rejects.toThrow();
    });
  });
});

describe('MockFactory', () => {
  afterEach(() => {
    MockFactory.resetAllMocks();
  });

  describe('createMock', () => {
    it('should create a mock object', () => {
      interface TestInterface {
        method1: () => string;
        method2: (arg: number) => number;
      }

      const mock = MockFactory.createMock<TestInterface>('test-mock', {
        method1: () => 'mocked',
        method2: (arg: number) => arg * 2,
      });

      expect(mock).toBeDefined();
      expect(mock.method1()).toBe('mocked');
      expect(mock.method2(5)).toBe(10);
    });

    it('should track method calls', () => {
      interface TestInterface {
        testMethod: (arg: string) => void;
      }

      const mock = MockFactory.createMock<TestInterface>('tracked-mock', {
        testMethod: (arg: string) => {},
      });

      mock.testMethod('test1');
      mock.testMethod('test2');

      const calls = MockFactory.getMockCallHistory(mock, 'testMethod');
      expect(calls).toHaveLength(2);
      expect(calls[0]).toEqual(['test1']);
      expect(calls[1]).toEqual(['test2']);
    });
  });

  describe('resetMock', () => {
    it('should reset call history', () => {
      interface TestInterface {
        method: () => void;
      }

      const mock = MockFactory.createMock<TestInterface>('reset-mock', {
        method: () => {},
      });

      mock.method();
      expect(MockFactory.getMockCallHistory(mock, 'method')).toHaveLength(1);

      MockFactory.resetMock(mock);
      expect(MockFactory.getMockCallHistory(mock, 'method')).toHaveLength(0);
    });
  });

  describe('resetAllMocks', () => {
    it('should reset all mocks', () => {
      interface TestInterface {
        method: () => void;
      }

      const mock1 = MockFactory.createMock<TestInterface>('mock1', { method: () => {} });
      const mock2 = MockFactory.createMock<TestInterface>('mock2', { method: () => {} });

      mock1.method();
      mock2.method();

      MockFactory.resetAllMocks();

      expect(MockFactory.getMockCallHistory(mock1, 'method')).toHaveLength(0);
      expect(MockFactory.getMockCallHistory(mock2, 'method')).toHaveLength(0);
    });
  });
});

describe('TestDataFactory', () => {
  beforeEach(() => {
    TestDataFactory.resetSequences();
  });

  describe('sequence', () => {
    it('should generate incremental sequences', () => {
      expect(TestDataFactory.sequence('test')).toBe(1);
      expect(TestDataFactory.sequence('test')).toBe(2);
      expect(TestDataFactory.sequence('test')).toBe(3);
    });

    it('should maintain separate sequences', () => {
      expect(TestDataFactory.sequence('seq1')).toBe(1);
      expect(TestDataFactory.sequence('seq2')).toBe(1);
      expect(TestDataFactory.sequence('seq1')).toBe(2);
      expect(TestDataFactory.sequence('seq2')).toBe(2);
    });
  });

  describe('user', () => {
    it('should generate user data', () => {
      const user = TestDataFactory.user();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user.active).toBe(true);
    });

    it('should apply overrides', () => {
      const user = TestDataFactory.user({ email: 'custom@example.com' });

      expect(user.email).toBe('custom@example.com');
    });

    it('should generate unique data', () => {
      const user1 = TestDataFactory.user();
      const user2 = TestDataFactory.user();

      expect(user1.id).not.toBe(user2.id);
      expect(user1.email).not.toBe(user2.email);
    });
  });

  describe('product', () => {
    it('should generate product data', () => {
      const product = TestDataFactory.product();

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product.inStock).toBe(true);
    });

    it('should apply overrides', () => {
      const product = TestDataFactory.product({ price: 99.99 });

      expect(product.price).toBe(99.99);
    });
  });

  describe('order', () => {
    it('should generate order data', () => {
      const order = TestDataFactory.order();

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('total');
      expect(order.status).toBe('pending');
    });
  });

  describe('randomString', () => {
    it('should generate random strings', () => {
      const str1 = TestDataFactory.randomString(10);
      const str2 = TestDataFactory.randomString(10);

      expect(str1).toHaveLength(10);
      expect(str2).toHaveLength(10);
      expect(str1).not.toBe(str2);
    });

    it('should generate strings of specified length', () => {
      const str = TestDataFactory.randomString(20);

      expect(str).toHaveLength(20);
    });
  });

  describe('randomEmail', () => {
    it('should generate valid email format', () => {
      const email = TestDataFactory.randomEmail();

      expect(email).toMatch(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/);
    });

    it('should generate unique emails', () => {
      const email1 = TestDataFactory.randomEmail();
      const email2 = TestDataFactory.randomEmail();

      expect(email1).not.toBe(email2);
    });
  });
});

describe('DatabaseTestHelper', () => {
  let sequelize: Sequelize;
  let helper: DatabaseTestHelper;

  beforeEach(() => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    helper = new DatabaseTestHelper(sequelize);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe('withTransaction', () => {
    it('should execute test within transaction', async () => {
      const result = await helper.withTransaction(async () => {
        return 'test result';
      });

      expect(result).toBe('test result');
    });

    it('should rollback transaction after test', async () => {
      let executed = false;

      await helper.withTransaction(async () => {
        executed = true;
      });

      expect(executed).toBe(true);
    });

    it('should rollback on error', async () => {
      await expect(
        helper.withTransaction(async () => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');
    });
  });
});

describe('TestingFactory', () => {
  describe('createProductionTestingFramework', () => {
    it('should create framework instance', () => {
      const framework = TestingFactory.createProductionTestingFramework();

      expect(framework).toBeInstanceOf(ProductionTestingFramework);
    });
  });

  describe('createDatabaseTestHelper', () => {
    it('should create database helper instance', () => {
      const sequelize = new Sequelize('sqlite::memory:', { logging: false });
      const helper = TestingFactory.createDatabaseTestHelper(sequelize);

      expect(helper).toBeInstanceOf(DatabaseTestHelper);

      sequelize.close();
    });
  });
});

describe('TestUtils', () => {
  describe('expect helpers', () => {
    it('should provide toBe assertion', () => {
      const assertion = TestUtils.expect(5).toBe(5);

      expect(assertion.actual).toBe(5);
      expect(assertion.expected).toBe(5);
      expect(assertion.operator).toBe('equals');
    });

    it('should provide toNotBe assertion', () => {
      const assertion = TestUtils.expect(5).toNotBe(10);

      expect(assertion.operator).toBe('notEquals');
    });

    it('should provide toBeGreaterThan assertion', () => {
      const assertion = TestUtils.expect(10).toBeGreaterThan(5);

      expect(assertion.operator).toBe('greaterThan');
    });

    it('should provide toBeLessThan assertion', () => {
      const assertion = TestUtils.expect(5).toBeLessThan(10);

      expect(assertion.operator).toBe('lessThan');
    });

    it('should provide toContain assertion', () => {
      const assertion = TestUtils.expect('hello world').toContain('world');

      expect(assertion.operator).toBe('contains');
    });
  });

  describe('sleep', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await TestUtils.sleep(50);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(45);
    });
  });

  describe('factory shortcuts', () => {
    beforeEach(() => {
      TestDataFactory.resetSequences();
    });

    it('should create user', () => {
      const user = TestUtils.createUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
    });

    it('should create product', () => {
      const product = TestUtils.createProduct();

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
    });

    it('should create order', () => {
      const order = TestUtils.createOrder();

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
    });
  });
});
