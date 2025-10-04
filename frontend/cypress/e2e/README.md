# Student Records Cypress Test Suite

This directory contains 5 comprehensive Cypress test files for testing student records functionality in the White Cross healthcare platform.

## Test Files Overview

### 1. `student-management.cy.ts`
**Focus**: Core student management operations
- **Page Loading**: Tests basic page elements, headers, and loading states
- **Student Creation**: Form validation, successful creation, duplicate prevention
- **Student Editing**: Pre-filled forms, update operations
- **Student Deactivation**: Confirmation dialogs, bulk operations
- **Error Handling**: API errors, network failures
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **Data Persistence**: Form state management

### 2. `student-search-filtering.cy.ts`
**Focus**: Search and filtering functionality
- **Search Functionality**: Real-time search by name, ID, grade with case-insensitive matching
- **Filter Functionality**: Grade filters, status filters, combined filters
- **Combined Search and Filter**: Multiple criteria application
- **Pagination Integration**: Filter persistence across pages
- **Performance**: Debouncing, large dataset handling
- **Accessibility**: Screen reader announcements, keyboard navigation
- **Error Handling**: Search/filter API failures

### 3. `student-health-records-access.cy.ts`
**Focus**: Access control and security for health records
- **Role-Based Access Control**: Different permission levels (Nurse, Admin, Read-Only, Counselor)
- **Sensitive Record Warnings**: Additional confirmation for flagged students
- **Session Management**: Authentication validation, session expiration
- **Audit Trail**: Access logging, denied access tracking
- **HIPAA Compliance**: Privacy notices, consent requirements, data masking
- **Emergency Access Override**: Temporary access with justification
- **Multi-Factor Authentication**: Additional security for highly sensitive records
- **Cross-Browser Security**: Session management across devices

### 4. `student-details-modal.cy.ts`
**Focus**: Student details modal interactions
- **Modal Opening/Closing**: Click interactions, keyboard shortcuts, backdrop clicks
- **Medical Information Display**: Allergies, medications, severity levels
- **Emergency Contact Information**: Primary contacts, multiple contacts handling
- **Modal Navigation**: Multiple student modals, state management
- **Responsive Design**: Mobile, tablet, touch interactions
- **Data Loading**: Loading states, error handling, missing data
- **Accessibility**: Focus trapping, ARIA attributes, screen reader support
- **Integration**: Links to edit forms, health records, quick actions

### 5. `student-medical-alerts.cy.ts`
**Focus**: Medical alerts and emergency contact functionality
- **Medical Alert Indicators**: Allergy badges, medication badges, severity colors
- **Emergency Contact Display**: Primary contact info, multiple contacts, outdated warnings
- **Emergency Actions**: Quick dial, emergency notifications, contact history
- **Medical Alert Interactions**: Detailed tooltips, action plans, medication logging
- **Bulk Management**: Alert filtering, emergency broadcasts, medical reports
- **Real-time Updates**: Live medical updates, contact status, medication reminders
- **Compliance**: Audit logging, HIPAA compliance, access tracking

## Testing Standards Applied

### 🔒 **Security & Compliance**
- HIPAA compliance validation
- Role-based access control testing
- Audit trail verification
- Session management validation
- Emergency access procedures

### ♿ **Accessibility**
- Keyboard navigation testing
- Screen reader compatibility
- ARIA label validation
- Focus management
- Color contrast considerations

### 📱 **Responsive Design**
- Mobile viewport testing
- Tablet interaction testing
- Touch event handling
- Layout adaptation validation

### 🚀 **Performance**
- Large dataset handling
- Real-time search debouncing
- Loading state management
- Error state handling

### 🧪 **Test Quality**
- Comprehensive edge case coverage
- Mock API responses
- Session state management
- Error scenario testing
- User interaction simulation

## Usage Instructions

### Running Individual Test Files
```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/student-management.cy.ts"
npx cypress run --spec "cypress/e2e/student-search-filtering.cy.ts"
npx cypress run --spec "cypress/e2e/student-health-records-access.cy.ts"
npx cypress run --spec "cypress/e2e/student-details-modal.cy.ts"
npx cypress run --spec "cypress/e2e/student-medical-alerts.cy.ts"
```

### Running All Student Records Tests
```bash
# Run all student-related tests
npx cypress run --spec "cypress/e2e/student-*.cy.ts"
```

### Running in Interactive Mode
```bash
# Open Cypress Test Runner
npx cypress open
```

## Custom Commands Used

All test files utilize custom commands defined in `cypress/support/commands.ts`:

- **Authentication**: `loginAsNurse()`, `loginAsAdmin()`, `loginAsReadOnly()`, `loginAsCounselor()`
- **API Mocking**: `interceptStudentAPI()`, `interceptMedicationAPI()`
- **Utilities**: `waitForStudentTable()`, `waitForToast()`, `cleanupTestData()`
- **Session Management**: `simulateSessionExpiration()`, `expectAuthenticationRequired()`

## Healthcare-Specific Testing

These tests are specifically designed for healthcare environments:

- **Medical Alert Priority**: Life-threatening conditions get prominent display
- **Emergency Contact Validation**: Multiple contact methods and failover scenarios
- **Medication Administration**: Logging and compliance requirements
- **Privacy Protection**: Sensitive data handling and access control
- **Audit Requirements**: Comprehensive logging of all medical data access
- **Emergency Procedures**: Override mechanisms with proper justification

## Maintenance Notes

- Update API mocks when backend schemas change
- Review access control tests when roles/permissions change
- Validate HIPAA compliance requirements regularly
- Test with real-world data scenarios
- Monitor test performance with large datasets

---

**Created for White Cross Healthcare Platform**  
*Ensuring student health data security and accessibility*