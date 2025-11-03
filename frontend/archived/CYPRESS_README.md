# Cypress Testing Setup - White Cross Healthcare Platform

## Overview

This document provides comprehensive information about the Cypress end-to-end testing setup for the White Cross Healthcare Platform Next.js application.

## 📁 Directory Structure

```
nextjs/
├── cypress/
│   ├── e2e/
│   │   └── login/
│   │       ├── 01-successful-login.cy.ts
│   │       ├── 02-failed-login.cy.ts
│   │       ├── 03-form-validation.cy.ts
│   │       ├── 04-accessibility.cy.ts
│   │       ├── 05-security.cy.ts
│   │       ├── 06-session-management.cy.ts
│   │       ├── 07-ui-ux.cy.ts
│   │       ├── 08-edge-cases.cy.ts
│   │       ├── 09-performance.cy.ts
│   │       └── 10-integration.cy.ts
│   ├── fixtures/
│   │   └── users.json
│   ├── support/
│   │   ├── commands.ts
│   │   ├── component.ts
│   │   └── e2e.ts
│   ├── screenshots/
│   └── videos/
├── cypress.config.ts
└── cypress.env.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 8.0.0
- Backend server running on `http://localhost:3001`
- Frontend server running on `http://localhost:3000`

### Installation

Cypress and all dependencies are already installed. To verify:

```bash
cd nextjs
npm run cypress:verify
```

### Running Tests

#### Interactive Mode (Cypress Test Runner)

```bash
npm run cypress
```

This opens the Cypress Test Runner where you can:
- Select and run individual tests
- Watch tests run in real-time
- Debug tests interactively
- View screenshots and videos

#### Headless Mode (CI/CD)

```bash
# Run all tests
npm run cypress:run

# Run specific browser
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge

# Run with headed browser
npm run cypress:headed

# Run only login tests
npm run cypress:login

# Run specific test file
npm run cypress:spec "cypress/e2e/login/01-successful-login.cy.ts"
```

## 🧪 Test Suites

### 1. Successful Login Tests (01-successful-login.cy.ts)
- ✅ Valid credentials login
- ✅ Remember me functionality
- ✅ Loading states
- ✅ Password visibility toggle
- ✅ Redirect after login

### 2. Failed Login Tests (02-failed-login.cy.ts)
- ✅ Invalid credentials
- ✅ Empty field validation
- ✅ Network error handling
- ✅ Server error handling
- ✅ Error message display

### 3. Form Validation Tests (03-form-validation.cy.ts)
- ✅ Email format validation
- ✅ Required field validation
- ✅ Autocomplete attributes
- ✅ Input types
- ✅ Special character handling

### 4. Accessibility Tests (04-accessibility.cy.ts)
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Focus indicators
- ✅ Color contrast

### 5. Security Tests (05-security.cy.ts)
- ✅ Password masking
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ Secure cookie flags
- ✅ No credential storage in localStorage

### 6. Session Management Tests (06-session-management.cy.ts)
- ✅ Session creation
- ✅ Session persistence
- ✅ Session expiration
- ✅ Token refresh
- ✅ Logout functionality

### 7. UI/UX Tests (07-ui-ux.cy.ts)
- ✅ Element visibility
- ✅ Responsive design
- ✅ Loading spinners
- ✅ Button states
- ✅ Error styling

### 8. Edge Cases Tests (08-edge-cases.cy.ts)
- ✅ Rapid submissions
- ✅ Long inputs
- ✅ Unicode characters
- ✅ Browser autofill
- ✅ Offline mode

### 9. Performance Tests (09-performance.cy.ts)
- ✅ Page load time
- ✅ Form responsiveness
- ✅ Memory leak detection
- ✅ Network request optimization
- ✅ Layout stability

### 10. Integration Tests (10-integration.cy.ts)
- ✅ API integration
- ✅ OAuth flows
- ✅ Multi-page navigation
- ✅ Role-based access
- ✅ Analytics tracking

## 🔐 Test Credentials

The following test accounts are seeded in the backend database:

### Test Accounts (Recommended for Cypress)
```json
{
  "admin": {
    "email": "admin@school.edu",
    "password": "AdminPassword123!",
    "role": "admin"
  },
  "nurse": {
    "email": "nurse@school.edu",
    "password": "NursePassword123!",
    "role": "nurse"
  },
  "counselor": {
    "email": "counselor@school.edu",
    "password": "CounselorPassword123!",
    "role": "counselor"
  },
  "readonly": {
    "email": "readonly@school.edu",
    "password": "ReadOnlyPassword123!",
    "role": "readonly"
  }
}
```

### Production Accounts (Use with caution)
```json
{
  "admin": {
    "email": "admin@whitecross.health",
    "password": "AdminPassword123!"
  },
  "nurse": {
    "email": "nurse@whitecross.health",
    "password": "AdminPassword123!"
  }
}
```

## 🛠️ Custom Commands

### cy.login(email, password, rememberMe?)
Performs complete login flow with session caching.

```typescript
cy.login('admin@school.edu', 'AdminPassword123!', true);
```

### cy.logout()
Clears session and navigates to login page.

```typescript
cy.logout();
```

### cy.fillLoginForm(email, password, rememberMe?)
Fills login form without submitting.

```typescript
cy.fillLoginForm('nurse@school.edu', 'testNursePassword');
```

### cy.checkAuthenticated()
Verifies user is authenticated.

```typescript
cy.checkAuthenticated();
```

### cy.waitForPageLoad()
Waits for page to fully load.

```typescript
cy.waitForPageLoad();
```

## ⚙️ Configuration

### cypress.config.ts
Main Cypress configuration file with:
- Base URL: `http://localhost:3000`
- API URL: `http://localhost:3001`
- Timeouts and retries
- Video and screenshot settings
- Code coverage setup

### cypress.env.json
Environment-specific configuration:
- Viewport dimensions
- Timeout values
- Feature flags

## 📊 Test Reports

### Videos
Test execution videos are saved to `cypress/videos/` after each run.

### Screenshots
Screenshots of failed tests are saved to `cypress/screenshots/`.

### Code Coverage
Code coverage reports are generated when enabled:
```bash
CYPRESS_COVERAGE=true npm run cypress:run
```

## 🔧 Troubleshooting

### Tests Failing Due to Backend Not Running
```bash
# Start backend server first
cd backend
npm run dev

# Then run Cypress tests
cd nextjs
npm run cypress
```

### Port Conflicts
If ports 3000 or 3001 are in use, update:
- `cypress.config.ts` - baseUrl and apiUrl
- `cypress.env.json` - baseUrl and apiUrl

### Database Not Seeded
```bash
# Seed the database
cd backend
npm run seed
```

### Clear Test Data
```bash
# Reset database
cd backend
npm run db:reset
npm run seed
```

## 📝 Writing New Tests

### Test File Template
```typescript
/// <reference types="cypress" />

describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/page-url');
    cy.waitForPageLoad();
  });

  it('should do something', () => {
    // Arrange
    cy.fixture('users').then((users) => {
      const { email, password } = users.validUser;

      // Act
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('button[type="submit"]').click();

      // Assert
      cy.url().should('not.include', '/login');
    });
  });
});
```

### Best Practices
1. Use data-testid attributes for stable selectors
2. Use fixtures for test data
3. Use custom commands for common operations
4. Keep tests independent and isolated
5. Use meaningful test descriptions
6. Add comments for complex logic
7. Use proper waiting strategies (avoid cy.wait with hardcoded times)

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd nextjs
          npm ci
      
      - name: Start servers
        run: |
          cd backend && npm run dev &
          cd nextjs && npm run dev &
          sleep 10
      
      - name: Run Cypress tests
        run: |
          cd nextjs
          npm run cypress:run
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: nextjs/cypress/screenshots
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Cypress TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)

## 🤝 Contributing

When adding new tests:
1. Follow the existing test structure
2. Add appropriate comments and documentation
3. Update this README if adding new features
4. Ensure tests pass locally before committing
5. Use meaningful commit messages

## 📞 Support

For issues or questions:
- Check existing test files for examples
- Review Cypress documentation
- Contact the development team

---

**Last Updated:** 2025-10-27
**Cypress Version:** 15.5.0
**Test Count:** 10 test suites, 100+ individual tests
