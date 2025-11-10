module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.spec.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/scripts/**',
    '!**/tests/**',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // TIER 1: Patient Safety Systems - CRITICAL (95%+ required)
    './server/health/composites/downstream/medication-administration-record-mar.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './server/health/composites/downstream/e-prescribing-services-surescripts.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './server/health/composites/downstream/clinical-decision-support-systems.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './server/health/composites/downstream/controlled-substance-monitoring-programs.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './server/health/composites/downstream/hipaa-compliance-modules.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    // TIER 2: High Priority Clinical Systems (90%+ required)
    './server/health/composites/downstream/epic-ehr-integration-services.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './server/health/composites/downstream/cerner-millennium-integration-services.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './server/health/composites/downstream/laboratory-information-system-lis-services.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './server/health/composites/downstream/pharmacy-information-systems.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
