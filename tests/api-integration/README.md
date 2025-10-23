# API Integration Tests - Frontend to Backend Communication

This directory contains Playwright-based API integration tests that verify communication between the frontend server APIs and backend server APIs using 8 parallel test agents.

## Overview

The test suite uses Playwright's parallel execution capabilities to run 8 independent test agents simultaneously, each testing different API modules:

1. **Agent 1 - Authentication APIs** (`01-auth-apis.spec.ts`)
   - Login/Logout
   - Token management
   - User profile
   - Session validation

2. **Agent 2 - Students APIs** (`02-students-apis.spec.ts`)
   - Student CRUD operations
   - Student listing and search
   - Pagination

3. **Agent 3 - Health Records APIs** (`03-health-records-apis.spec.ts`)
   - Health records management
   - Vaccinations
   - Health summaries
   - Allergies

4. **Agent 4 - Medications APIs** (`04-medications-apis.spec.ts`)
   - Medication prescriptions
   - Administration history
   - Search and filtering

5. **Agent 5 - Documents APIs** (`05-documents-apis.spec.ts`)
   - Document management
   - Upload/download
   - Categories and types

6. **Agent 6 - Appointments APIs** (`06-appointments-apis.spec.ts`)
   - Appointment scheduling
   - Date range queries
   - Status filtering

7. **Agent 7 - Communications APIs** (`07-communications-apis.spec.ts`)
   - Messages
   - Broadcasts
   - Inbox/Sent items

8. **Agent 8 - Compliance & Analytics APIs** (`08-compliance-analytics-apis.spec.ts`)
   - Audit logs
   - Compliance reports
   - Analytics dashboard
   - System health

## Running the Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Ensure the backend server is running:
```bash
npm run dev:backend
```

### Run Tests

Run all 8 agents in parallel:
```bash
npm run test:api-integration
```

Run tests with UI:
```bash
npm run test:api-integration:ui
```

Run tests in debug mode:
```bash
npm run test:api-integration:debug
```

View test report:
```bash
npm run test:api-integration:report
```

### Run Specific Agent

Run a specific test agent:
```bash
npx playwright test --config=playwright.config.ts --project=authentication-apis
```

## Configuration

The test configuration is defined in `playwright.config.ts` at the root level:

- **Workers**: 8 parallel workers (one per agent)
- **Base URL**: `http://localhost:3001` (configurable via `API_BASE_URL` env var)
- **Timeout**: 30 seconds per action
- **Retries**: 2 on CI, 0 locally
- **Reporters**: List, HTML, JSON

## Environment Variables

- `API_BASE_URL`: Backend API base URL (default: `http://localhost:3001`)
- `SKIP_SERVER_START`: Skip auto-starting backend server if set
- `CI`: Enables CI-specific behaviors (retries, fail on test.only)

## Test Structure

```
tests/api-integration/
├── README.md                              # This file
├── 01-auth-apis.spec.ts                  # Agent 1: Authentication
├── 02-students-apis.spec.ts              # Agent 2: Students
├── 03-health-records-apis.spec.ts        # Agent 3: Health Records
├── 04-medications-apis.spec.ts           # Agent 4: Medications
├── 05-documents-apis.spec.ts             # Agent 5: Documents
├── 06-appointments-apis.spec.ts          # Agent 6: Appointments
├── 07-communications-apis.spec.ts        # Agent 7: Communications
├── 08-compliance-analytics-apis.spec.ts  # Agent 8: Compliance & Analytics
├── helpers/
│   └── api-client.ts                     # API client helper
└── fixtures/
    └── test-data.ts                      # Test data fixtures
```

## Helper Classes

### ApiClient

The `ApiClient` class provides a convenient interface for making authenticated API requests:

```typescript
const apiClient = new ApiClient(request, baseURL);
await apiClient.login(email, password);
const response = await apiClient.get('/api/students');
```

### Test Data Fixtures

Common test data is defined in `fixtures/test-data.ts`:

- Test users (nurse, admin, school admin)
- Sample student data
- Sample health records
- Sample medications
- Sample appointments
- And more...

## Parallel Execution

The tests are designed to run in parallel without interference:

1. Each agent tests a different API module
2. Tests use unique test data when creating records
3. Read operations are safe to run concurrently
4. Authentication is handled independently per agent

## CI/CD Integration

The tests are configured for CI/CD pipelines:

1. Auto-starts backend server if not running
2. Retries failing tests on CI
3. Generates HTML and JSON reports
4. Fails build on `test.only` usage

## Debugging

To debug a specific test:

1. Use the debug mode:
```bash
npm run test:api-integration:debug
```

2. Or run with headed browser:
```bash
npx playwright test --config=playwright.config.ts --headed
```

3. View traces for failed tests in the HTML report

## Best Practices

1. **Independent Tests**: Each test should be independent and not rely on other tests
2. **Clean State**: Use unique identifiers for created resources
3. **Error Handling**: Tests should gracefully handle missing data or API changes
4. **Timeouts**: Use appropriate timeouts for API requests
5. **Assertions**: Make clear, specific assertions about expected behavior

## Troubleshooting

### Backend Not Running

If tests fail with connection errors, ensure the backend is running:
```bash
npm run dev:backend
```

### Authentication Errors

Verify test user credentials in `fixtures/test-data.ts` match your database.

### Timeout Errors

Increase timeout in `playwright.config.ts` if needed:
```typescript
actionTimeout: 60000, // 60 seconds
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use the `ApiClient` helper for API requests
3. Add test data to fixtures if needed
4. Update this README with new agent information
5. Ensure tests run successfully in parallel
