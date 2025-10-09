# Cypress E2E Test Reorganization

This document describes the reorganization of Cypress end-to-end tests from monolithic files into smaller, more manageable test suites.

## Overview

The Cypress test suite has been reorganized from large monolithic test files (100-230 tests each) into smaller, focused test files organized in folders. Each file now contains approximately 10-15 tests grouped by functional area.

## Benefits

- **Better Maintainability**: Smaller files are easier to understand and modify
- **Faster Test Execution**: Enables running specific test suites in isolation
- **Parallel Execution**: Facilitates parallel test execution for faster CI/CD pipelines
- **Improved Organization**: Tests are logically grouped by feature and functionality
- **Easier Debugging**: Smaller test scopes make it easier to identify and fix failures

## Reorganized Test Modules

### Module 01: Authentication (8 files, ~80 tests)
**Location**: `cypress/e2e/01-authentication/`

1. `01-login-page.cy.ts` - Login page UI and basic functionality
2. `02-login-validation.cy.ts` - Login form validation
3. `03-login-success-failure.cy.ts` - Login success and failure scenarios
4. `04-logout.cy.ts` - Logout functionality
5. `05-session-management.cy.ts` - Session persistence and management
6. `06-password-reset.cy.ts` - Password reset functionality
7. `07-registration.cy.ts` - User registration
8. `08-security.cy.ts` - Security features and protections

### Module 02: Student Management (12 files, ~120 tests)
**Location**: `cypress/e2e/02-student-management/`

1. `01-page-ui-structure.cy.ts` - Page load and UI structure
2. `02-student-list.cy.ts` - Student listing and display
3. `03-student-creation.cy.ts` - Adding new students
4. `04-student-editing.cy.ts` - Editing student information
5. `05-student-deletion.cy.ts` - Deleting students
6. `06-student-search.cy.ts` - Search functionality
7. `07-student-filtering.cy.ts` - Filtering and sorting
8. `08-student-details.cy.ts` - Student detail view
9. `09-emergency-contacts.cy.ts` - Emergency contact management
10. `10-batch-operations.cy.ts` - Bulk operations
11. `11-validation-errors.cy.ts` - Data validation
12. `12-accessibility.cy.ts` - Accessibility features

### Module 03: Appointment Scheduling (9 files, ~90 tests)
**Location**: `cypress/e2e/03-appointment-scheduling/`

1. `01-page-load-ui.cy.ts` - Page load and structure
2. `02-calendar-view.cy.ts` - Calendar display
3. `03-appointment-creation.cy.ts` - Creating appointments
4. `04-appointment-editing.cy.ts` - Editing appointments
5. `05-appointment-deletion.cy.ts` - Deleting appointments
6. `06-appointment-filters.cy.ts` - Filtering and search
7. `07-notifications-reminders.cy.ts` - Notifications
8. `08-recurring-appointments.cy.ts` - Recurring appointments
9. `09-validation-accessibility.cy.ts` - Validation and accessibility

### Module 04: Medication Management (14 files, ~140 tests)
**Location**: `cypress/e2e/04-medication-management/`

1. `01-page-ui-structure.cy.ts` - Page load and UI
2. `02-medication-creation.cy.ts` - Creating medications
3. `03-medication-viewing.cy.ts` - Viewing medications
4. `04-medication-editing.cy.ts` - Editing medications
5. `05-medication-deletion.cy.ts` - Deleting medications
6. `06-prescription-management.cy.ts` - Prescription management
7. `07-medication-administration.cy.ts` - Administration logging
8. `08-inventory-management.cy.ts` - Inventory tracking
9. `09-medication-reminders.cy.ts` - Reminder functionality
10. `10-adverse-reactions.cy.ts` - Adverse reaction reporting
11. `11-search-filtering.cy.ts` - Search and filtering
12. `12-validation-error-handling.cy.ts` - Data validation
13. `13-hipaa-security.cy.ts` - HIPAA compliance and security
14. `14-accessibility.cy.ts` - Accessibility features

### Module 05: Health Records Management (15 files, ~220 tests)
**Location**: `cypress/e2e/05-health-records-management/`

1. `01-page-loading.cy.ts` - Page load and initialization
2. `02-tab-navigation.cy.ts` - Tab switching
3. `03-search-filter.cy.ts` - Search and filtering
4. `04-allergies-tab.cy.ts` - Allergy management
5. `05-chronic-conditions-tab.cy.ts` - Chronic conditions
6. `06-vaccinations-tab.cy.ts` - Vaccination tracking
7. `07-growth-charts-tab.cy.ts` - Growth measurements
8. `08-screenings-tab.cy.ts` - Health screenings
9. `09-action-buttons.cy.ts` - Action buttons
10. `10-admin-features.cy.ts` - Admin-specific features
11. `11-rbac-permissions.cy.ts` - Role-based access control
12. `12-data-validation.cy.ts` - Data validation
13. `13-accessibility.cy.ts` - Accessibility compliance
14. `14-performance.cy.ts` - Performance testing
15. `15-error-handling.cy.ts` - Error handling

### Module 08: Administration Features (12 files, ~215 tests)
**Location**: `cypress/e2e/08-administration-features/`

1. `01-page-load-navigation.cy.ts` - Page load and navigation
2. `02-tab-navigation.cy.ts` - Tab switching (11 admin tabs)
3. `03-overview-tab.cy.ts` - System overview
4. `04-districts-tab.cy.ts` - District management
5. `05-schools-tab.cy.ts` - School management
6. `06-users-tab.cy.ts` - User management
7. `07-configuration-tab.cy.ts` - System configuration
8. `08-integrations-backups.cy.ts` - Integrations and backups
9. `09-monitoring-tab.cy.ts` - System health monitoring
10. `10-licenses-training.cy.ts` - Licenses and training
11. `11-audit-logs-tab.cy.ts` - Audit logging
12. `12-responsive-design.cy.ts` - Responsive behavior

### Module 11: User Management (12 files, ~150 tests)
**Location**: `cypress/e2e/11-user-management/`

1. `01-page-load-structure.cy.ts` - Page load and structure
2. `02-tab-navigation.cy.ts` - Tab navigation
3. `03-users-tab-basic.cy.ts` - Users tab basic functionality
4. `04-districts-tab.cy.ts` - Districts tab
5. `05-schools-tab.cy.ts` - Schools tab
6. `06-configuration-tab.cy.ts` - Configuration tab
7. `07-integrations-tab.cy.ts` - Integrations tab
8. `08-backups-monitoring-tabs.cy.ts` - Backups and monitoring
9. `09-licenses-training-tabs.cy.ts` - Licenses and training
10. `10-audit-logs-tab.cy.ts` - Audit logs tab
11. `11-accessibility.cy.ts` - Accessibility features
12. `12-responsiveness.cy.ts` - Responsive design

### Module 09: Dashboard Functionality (15 files, 150 tests)
**Location**: `cypress/e2e/09-dashboard-functionality/`

1. `01-page-load-structure.cy.ts` - Page load and structure (15 tests)
2. `02-metrics-cards.cy.ts` - Metrics and statistics cards (15 tests)
3. `03-charts-visualizations.cy.ts` - Charts and data visualizations (15 tests)
4. `04-recent-activity-feed.cy.ts` - Activity timeline and feed (15 tests)
5. `05-quick-actions.cy.ts` - Quick action buttons (15 tests)
6. `06-alerts-notifications.cy.ts` - Alerts and notifications (15 tests)
7. `07-upcoming-appointments.cy.ts` - Upcoming appointments widget (15 tests)
8. `08-medication-reminders.cy.ts` - Medication due list (15 tests)
9. `09-student-summary.cy.ts` - Student population statistics (15 tests)
10. `10-incident-reports-widget.cy.ts` - Recent incidents widget (15 tests)
11. `11-role-based-widgets.cy.ts` - Role-based dashboard content (15 tests)
12. `12-search-navigation.cy.ts` - Global search and navigation (15 tests)
13. `13-performance-loading.cy.ts` - Performance and loading (15 tests)
14. `14-responsive-mobile.cy.ts` - Responsive design (15 tests)
15. `15-accessibility-a11y.cy.ts` - Accessibility features (15 tests)

### Module 12: RBAC Permissions (11 files, ~160 tests)
**Location**: `cypress/e2e/12-rbac-permissions/`

1. `01-admin-navigation.cy.ts` - Admin navigation access (10 tests)
2. `02-admin-crud-operations.cy.ts` - Admin CRUD permissions (15 tests)
3. `03-admin-auth-dashboard.cy.ts` - Admin auth and dashboard (15 tests)
4. `04-nurse-allowed-access.cy.ts` - Nurse allowed permissions (15 tests)
5. `05-nurse-restricted-access.cy.ts` - Nurse restrictions (15 tests)
6. `06-counselor-allowed-access.cy.ts` - Counselor allowed access (15 tests)
7. `07-counselor-restricted-access.cy.ts` - Counselor restrictions (10 tests)
8. `08-viewer-read-access.cy.ts` - Viewer read permissions (15 tests)
9. `09-viewer-no-write-access.cy.ts` - Viewer write restrictions (10 tests)
10. `10-cross-role-comparison-1.cy.ts` - Role comparison part 1 (10 tests)
11. `11-cross-role-comparison-2.cy.ts` - Role comparison part 2 (10 tests)

### Module 18: Data Validation (15 files, 150 tests)
**Location**: `cypress/e2e/18-data-validation/`

1. `01-student-form-validation.cy.ts` - Student form validation rules (15 tests)
2. `02-medication-form-validation.cy.ts` - Medication form validation (15 tests)
3. `03-appointment-form-validation.cy.ts` - Appointment form validation (15 tests)
4. `04-health-record-validation.cy.ts` - Health record validation (15 tests)
5. `05-incident-report-validation.cy.ts` - Incident report validation (15 tests)
6. `06-input-sanitization.cy.ts` - Input sanitization and XSS prevention (15 tests)
7. `07-file-upload-validation.cy.ts` - File upload validation and security (15 tests)
8. `08-numeric-validation.cy.ts` - Numeric field validation (15 tests)
9. `09-date-time-validation.cy.ts` - Date and time validation (15 tests)
10. `11-text-field-validation.cy.ts` - Text field validation (15 tests)
11. `11-email-phone-validation.cy.ts` - Email and phone validation (15 tests)
12. `12-dropdown-selection-validation.cy.ts` - Dropdown and selection validation (15 tests)
13. `13-checkbox-radio-validation.cy.ts` - Checkbox and radio validation (15 tests)
14. `14-password-security-validation.cy.ts` - Password and security validation (15 tests)
15. `15-cross-field-validation.cy.ts` - Cross-field and business rules validation (15 tests)

## Unchanged Test Files

The following test files remain as standalone files because they are already appropriately sized (< 50 lines, < 15 tests):

- `06-incident-reporting.cy.ts` (5 tests)
- `07-integration-testing.cy.ts` (5 tests)
- `10-reports-analytics.cy.ts`
- `12-system-configuration.cy.ts`
- `13-data-export-import.cy.ts`
- `14-mobile-responsiveness.cy.ts`
- `15-performance-testing.cy.ts`
- `16-accessibility-testing.cy.ts`
- `17-error-handling.cy.ts`
- `19-workflow-testing.cy.ts`
- `20-api-integration-testing.cy.ts`

## Test Organization Patterns

### File Naming Convention
- Files use numbered prefixes (01-, 02-, etc.) for logical ordering
- Descriptive names indicate the feature or functionality being tested
- All test files use the `.cy.ts` extension

### Test Structure
Each test file follows this pattern:

```typescript
/// <reference types="cypress" />

/**
 * Module Name - Feature Description (X tests)
 *
 * Brief description of what this test file covers
 */

describe('Module Name - Feature Description', () => {
  beforeEach(() => {
    // Setup - typically login and navigation
    cy.login('role')
    cy.visit('/route')
  })

  it('should test specific behavior', () => {
    // Test implementation
  })

  // Additional tests...
})
```

### Test Categories
Tests are organized by:
- **Feature area**: Each folder represents a major feature (authentication, students, etc.)
- **Functionality**: Within folders, files group related functionality (creation, editing, deletion)
- **User role**: RBAC tests are organized by role and permission type

## Running Tests

### Run all tests in a module
```bash
# Run all authentication tests
npx cypress run --spec "cypress/e2e/01-authentication/**/*.cy.ts"

# Run all medication management tests
npx cypress run --spec "cypress/e2e/04-medication-management/**/*.cy.ts"
```

### Run specific test file
```bash
# Run only login page tests
npx cypress run --spec "cypress/e2e/01-authentication/01-login-page.cy.ts"

# Run RBAC admin tests
npx cypress run --spec "cypress/e2e/12-rbac-permissions/01-admin-navigation.cy.ts"
```

### Run tests in parallel
```bash
# Using Cypress Dashboard (requires setup)
npx cypress run --record --parallel

# Or split test files across multiple CI jobs
# Job 1: Authentication & Student Management
# Job 2: Appointments & Medications
# Job 3: Health Records & Administration
# Job 4: User Management & RBAC
```

## Migration Summary

### Total Tests Reorganized: ~1,475 tests
- **Module 01**: 80 tests → 8 files
- **Module 02**: 120 tests → 12 files
- **Module 03**: 90 tests → 9 files
- **Module 04**: 140 tests → 14 files
- **Module 05**: 220 tests → 15 files
- **Module 08**: 215 tests → 12 files
- **Module 09**: 150 tests → 15 files (Dashboard)
- **Module 11**: 150 tests → 12 files
- **Module 12**: 160 tests → 11 files
- **Module 18**: 150 tests → 15 files (Data Validation)

### Original vs New Structure
- **Before**: 10 large files (5-1,429 lines each)
- **After**: 123 smaller files (~10-15 tests each)
- **Average file size**: Reduced from ~148 tests to ~12 tests per file

## Best Practices

1. **Keep test files focused**: Each file should test one specific feature or aspect
2. **Use descriptive names**: File names should clearly indicate what is being tested
3. **Maintain independence**: Tests should be able to run in any order
4. **Use beforeEach hooks**: Set up test state consistently in each file
5. **Group related tests**: Use nested describe blocks for sub-features when appropriate
6. **Follow naming patterns**: Consistent naming makes tests easier to find and understand

## Future Considerations

1. **Test Data Management**: Consider implementing fixture files for shared test data
2. **Custom Commands**: Extract common operations into Cypress custom commands
3. **Test Utilities**: Create helper functions for repeated test logic
4. **Page Objects**: Implement page object pattern for complex UI interactions
5. **Test Reports**: Configure detailed test reporting for better CI/CD integration
6. **Coverage Tracking**: Track which features are covered by E2E tests

## Maintenance

When adding new tests:
1. Identify the appropriate module/folder
2. If the file would exceed ~15 tests, create a new file
3. Use consistent naming: `XX-descriptive-name.cy.ts`
4. Follow the established test structure pattern
5. Update this documentation if creating new modules

## Related Documentation

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [White Cross CLAUDE.md](../CLAUDE.md) - Project overview and conventions
- [Frontend Testing Guide](../frontend/README.md#testing) - Frontend-specific test information
