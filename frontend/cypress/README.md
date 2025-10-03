# Cypress E2E Tests for White Cross Students Module

This directory contains comprehensive end-to-end tests for the White Cross healthcare platform's student management functionality.

## Test Structure

### Test Files (30 Tests Total)

1. **01-students-crud.cy.ts** (Tests 1-10)
   - Core CRUD operations for student management
   - Form validation and error handling
   - Student creation, editing, deletion
   - Bulk operations

2. **02-students-search-filter.cy.ts** (Tests 11-20)
   - Search functionality by name, ID, grade
   - Advanced filtering capabilities
   - Filter combinations and clearing
   - Pagination and sorting

3. **03-students-medical-info.cy.ts** (Tests 21-30)
   - Medical information management
   - Allergy and medication tracking
   - Vaccination records
   - Medical document uploads
   - Emergency alerts and protocols

## Running Tests

### Interactive Mode (Cypress UI)
```bash
# Open Cypress Test Runner
npm run cypress:open

# Open with specific browser
npm run test:e2e:dev
```

### Headless Mode (CI/CD)
```bash
# Run all tests
npm run cypress:run

# Run only students tests
npm run cypress:run:students

# Run with specific browser
npm run cypress:run:chrome
npm run cypress:run:edge

# Run with headed browser (see execution)
npm run test:e2e:headed
```

## Test Configuration

### Environment Variables
```bash
# cypress.config.ts includes these environment variables:
API_URL=http://localhost:3001
TEST_USER_EMAIL=test.nurse@school.edu
TEST_USER_PASSWORD=TestPassword123!
```

### Custom Commands

The tests use custom Cypress commands defined in `support/commands.ts`:

- `cy.loginAsNurse()` - Authenticate as a nurse user
- `cy.loginAsAdmin()` - Authenticate as an admin user
- `cy.waitForStudentTable()` - Wait for student table to load
- `cy.interceptStudentAPI()` - Mock API responses
- `cy.createTestStudent()` - Create a test student
- `cy.deleteTestStudent()` - Remove test student
- `cy.seedStudentData()` - Seed test data
- `cy.cleanupTestData()` - Clean up after tests

### Data Test IDs

Tests rely on `data-testid` attributes for element selection. Key identifiers include:

**Navigation & Layout:**
- `page-title` - Page header title
- `add-student-button` - Primary action button
- `search-input` - Search input field
- `filter-button` - Filter dropdown trigger

**Student Table:**
- `student-table` - Main data table
- `student-row` - Individual student rows
- `student-actions` - Action menu for each student
- `pagination` - Pagination controls

**Forms & Modals:**
- `student-form-modal` - Student creation/edit form
- `firstName-input`, `lastName-input` - Form fields
- `save-student-button` - Form submit button
- `cancel-button` - Form cancel button

**Medical Information:**
- `medical-info-tab` - Medical information tab
- `allergy-list` - List of student allergies
- `medication-list` - List of student medications
- `add-allergy-button` - Add new allergy
- `critical-allergy-alert` - Emergency allergy warning

### Fixtures

Test data is stored in `fixtures/` directory:

- `students.json` - Sample student records
- `student.json` - Single student record template
- `healthRecords.json` - Medical history data
- `medications.json` - Medication and administration data

## Healthcare Compliance Testing

These tests ensure compliance with:

- **HIPAA**: Protected health information handling
- **FERPA**: Educational record privacy
- **Data Security**: Proper authentication and authorization
- **Audit Trails**: All actions are logged and traceable

### Security Test Scenarios

- Authentication requirements for all operations
- Role-based access control verification
- Data validation and sanitization
- Secure handling of sensitive medical information
- Audit logging for compliance

## Test Best Practices

### 1. Data Isolation
- Each test should create its own test data
- Clean up data after test completion
- Use unique identifiers to avoid conflicts

### 2. Error Handling
- Test both success and failure scenarios
- Verify proper error messages and handling
- Test network failures and timeouts

### 3. Accessibility
- Verify screen reader compatibility
- Test keyboard navigation
- Check color contrast and visual indicators

### 4. Performance
- Monitor page load times
- Test with large datasets
- Verify smooth scrolling and pagination

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify test user credentials in cypress.config.ts
   - Check that authentication endpoints are available
   - Ensure session management is working

2. **API Mocking Issues**
   - Verify intercept patterns match actual API calls
   - Check fixture data structure matches API responses
   - Ensure proper wait conditions

3. **Element Selection**
   - Confirm data-testid attributes exist in components
   - Use cy.debug() to inspect element states
   - Check for dynamic content loading

### Debugging Commands

```bash
# Run tests with debug output
DEBUG=cypress:* npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/01-students-crud.cy.ts"

# Run with video recording disabled (faster)
npx cypress run --config video=false
```

## Contributing

When adding new tests:

1. Follow the existing naming convention
2. Add appropriate data-testid attributes to components
3. Update fixture data as needed
4. Include both positive and negative test cases
5. Document any new custom commands
6. Ensure tests are deterministic and not flaky

## Healthcare Context

These tests are designed for a school nurse platform handling sensitive student health information. All tests must consider:

- Privacy and confidentiality requirements
- Emergency response scenarios
- Medication administration protocols
- Parent/guardian communication needs
- Regulatory compliance obligations

The test coverage ensures that critical healthcare workflows function correctly and securely.