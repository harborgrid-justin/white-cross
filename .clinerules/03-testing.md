# Cypress Testing Standards and Best Practices

## General Cypress Guidelines
- Write tests that simulate real user interactions and workflows
- Use descriptive test names that clearly explain the test scenario
- Keep tests independent and avoid test interdependencies
- Focus on end-to-end testing of critical user journeys
- Organize tests logically in the `frontend/cypress/` directory

## Cypress Test Structure
- Follow the Arrange-Act-Assert (AAA) pattern for test structure
- Use `beforeEach()` and `afterEach()` hooks for setup and cleanup
- Group related tests using `describe()` blocks
- Use meaningful assertions that validate expected behavior
- Include proper wait strategies to handle asynchronous operations

## Test Organization in frontend/cypress/
- **e2e/**: End-to-end test specifications
- **fixtures/**: Test data and mock responses
- **support/**: Custom commands and utility functions
- **plugins/**: Cypress plugins and configuration extensions
- Use descriptive file names that reflect the feature being tested

## Cypress Best Practices
- Use actual API calls to test real backend integration and data flow
- Implement custom commands in `support/commands.js` for reusable actions
- Use data attributes (`data-cy`) for reliable element selection
- Avoid using CSS classes or IDs that may change for element selection
- Test user workflows from start to finish, not just individual components
- Ensure test environment has clean, predictable data for consistent results

## Authentication and Session Management
- Use `cy.session()` for efficient login state management
- Store authentication tokens securely using Cypress environment variables
- Test both authenticated and unauthenticated user scenarios
- Implement proper logout and session cleanup procedures

## Test Data Management
- Store test data in `fixtures/` directory as JSON files
- Use `cy.fixture()` to load test data in specifications
- Create realistic test data that mirrors production scenarios
- Avoid hardcoded values in test specifications

## Error Handling and Debugging
- Use `cy.screenshot()` and `cy.debug()` for troubleshooting
- Implement proper error handling for flaky tests
- Use retry logic for tests that may be affected by timing issues
- Configure appropriate timeouts for different types of operations

## Continuous Integration
- Run Cypress tests in headless mode for CI/CD pipelines
- Generate test reports and artifacts for build processes
- Configure parallel test execution for faster feedback
- Set up proper test environments that mirror production
