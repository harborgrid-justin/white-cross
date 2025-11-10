# Package.json Scripts Reference for SAN Testing

Add these scripts to your `package.json` to run SAN tests efficiently.

## Scripts to Add

```json
{
  "scripts": {
    "test:san": "jest --config=reuse/san/jest.config.san-testing.js",
    "test:san:watch": "jest --config=reuse/san/jest.config.san-testing.js --watch",
    "test:san:coverage": "jest --config=reuse/san/jest.config.san-testing.js --coverage",
    "test:san:unit": "jest --config=reuse/san/jest.config.san-testing.js --testPathPattern='.spec.ts$'",
    "test:san:integration": "jest --config=reuse/san/jest.config.san-testing.js --testPathPattern='integration.spec.ts$'",
    "test:san:e2e": "jest --config=reuse/san/jest.config.san-testing.js --testPathPattern='e2e.spec.ts$'",
    "test:san:performance": "RUN_PERFORMANCE_TESTS=true jest --config=reuse/san/jest.config.san-testing.js --testPathPattern='performance.spec.ts$'",
    "test:san:verbose": "jest --config=reuse/san/jest.config.san-testing.js --verbose",
    "test:san:debug": "node --inspect-brk node_modules/.bin/jest --config=reuse/san/jest.config.san-testing.js --runInBand",
    "test:san:ci": "jest --config=reuse/san/jest.config.san-testing.js --ci --coverage --maxWorkers=2"
  }
}
```

## Usage Examples

### Run all SAN tests
```bash
npm run test:san
```

### Run tests in watch mode (for development)
```bash
npm run test:san:watch
```

### Run tests with coverage report
```bash
npm run test:san:coverage
```

### Run only unit tests
```bash
npm run test:san:unit
```

### Run only integration tests
```bash
npm run test:san:integration
```

### Run only E2E tests
```bash
npm run test:san:e2e
```

### Run performance tests
```bash
npm run test:san:performance
```

### Run with verbose output
```bash
npm run test:san:verbose
```

### Debug tests in VS Code or Chrome DevTools
```bash
npm run test:san:debug
```

### Run tests in CI/CD environment
```bash
npm run test:san:ci
```

## Advanced Usage

### Run specific test file
```bash
npm run test:san -- volume.service.spec.ts
```

### Run tests matching a pattern
```bash
npm run test:san -- --testNamePattern="should create volume"
```

### Update snapshots
```bash
npm run test:san -- -u
```

### Run tests in band (one at a time, useful for debugging)
```bash
npm run test:san -- --runInBand
```

### Run tests with specific test environment variable
```bash
TEST_ENV=staging npm run test:san
```

### Generate coverage report and open in browser
```bash
npm run test:san:coverage && open coverage/san/index.html
```

## Yarn Equivalents

If you're using Yarn:

```bash
yarn test:san
yarn test:san:watch
yarn test:san:coverage
# etc.
```

## PNPM Equivalents

If you're using PNPM:

```bash
pnpm test:san
pnpm test:san:watch
pnpm test:san:coverage
# etc.
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: SAN Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run SAN unit tests
        run: npm run test:san:unit

      - name: Run SAN integration tests
        run: npm run test:san:integration

      - name: Run SAN E2E tests
        run: npm run test:san:e2e

      - name: Generate coverage report
        run: npm run test:san:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          directory: ./coverage/san
          flags: san-tests
```

### GitLab CI Example

```yaml
test:san:
  stage: test
  image: node:18
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run test:san:ci
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/san/cobertura-coverage.xml
      junit:
        - coverage/san/junit-san.xml
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test SAN Unit') {
            steps {
                sh 'npm run test:san:unit'
            }
        }

        stage('Test SAN Integration') {
            steps {
                sh 'npm run test:san:integration'
            }
        }

        stage('Test SAN E2E') {
            steps {
                sh 'npm run test:san:e2e'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run test:san:coverage'
                publishHTML([
                    reportDir: 'coverage/san',
                    reportFiles: 'index.html',
                    reportName: 'SAN Coverage Report'
                ])
            }
        }
    }
}
```

## Pre-commit Hook

Add to `.husky/pre-commit` or `package.json`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run SAN unit tests before commit
npm run test:san:unit
```

## Docker Support

### Dockerfile for testing

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Run SAN tests
CMD ["npm", "run", "test:san:ci"]
```

### Docker Compose for testing

```yaml
version: '3.8'

services:
  san-tests:
    build: .
    command: npm run test:san:ci
    environment:
      - NODE_ENV=test
      - CI=true
    volumes:
      - ./coverage/san:/app/coverage/san
```

## Performance Optimization

### Run tests in parallel (multiple workers)

```bash
npm run test:san -- --maxWorkers=4
```

### Run only changed tests (with git)

```bash
npm run test:san -- --onlyChanged
```

### Run tests related to changed files

```bash
npm run test:san -- --changedSince=origin/main
```

## Debugging Tips

### Run single test with full output

```bash
npm run test:san -- --testNamePattern="should create volume" --verbose
```

### Run with Node.js inspector

```bash
node --inspect-brk ./node_modules/.bin/jest --config=reuse/san/jest.config.san-testing.js --runInBand
```

Then open `chrome://inspect` in Chrome and click "inspect".

### VS Code Debug Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest SAN Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "--config=reuse/san/jest.config.san-testing.js",
        "--runInBand"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Environment Variables

Useful environment variables for testing:

```bash
# Run in CI mode
CI=true npm run test:san

# Enable performance tests
RUN_PERFORMANCE_TESTS=true npm run test:san

# Set log level
LOG_LEVEL=debug npm run test:san

# Set test timeout
JEST_TIMEOUT=30000 npm run test:san

# Skip E2E tests in watch mode
JEST_WATCH_MODE=true npm run test:san:watch
```

## Coverage Thresholds

Override coverage thresholds from command line:

```bash
npm run test:san -- --coverageThreshold='{"global":{"branches":90,"functions":95,"lines":95,"statements":95}}'
```

## Tips

1. **Use watch mode during development** for instant feedback
2. **Run coverage regularly** to identify untested code
3. **Run tests in CI/CD** on every commit and PR
4. **Use performance tests** to catch regressions
5. **Debug with VS Code** for better developer experience
6. **Parallelize in CI** for faster builds
7. **Cache node_modules** in CI to speed up builds
8. **Generate coverage reports** for visibility
