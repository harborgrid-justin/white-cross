# Cypress Test Platform - White Cross Healthcare Management System

This directory contains a comprehensive, standardized Cypress test platform for the White Cross Healthcare Management System. The test suite provides end-to-end testing for critical healthcare workflows with proper TypeScript support, consistent code standards, and healthcare-specific testing utilities.

## ✅ Standardization Features

- **Full TypeScript Support**: Proper type definitions for all custom commands and test data
- **Consistent Code Structure**: Standardized file organization and naming conventions
- **Healthcare-Specific Commands**: Custom commands tailored for healthcare workflows
- **Comprehensive Error Handling**: Graceful handling of common React/healthcare app issues
- **Proper ESLint Compliance**: Clean, maintainable code following project standards
- **Session Management**: Efficient authentication and session handling
- **Accessibility Testing**: Built-in accessibility checks for healthcare compliance

## Directory Structure

```
frontend/cypress/
├── e2e/                    # End-to-end test specifications
│   ├── 01-authentication.cy.ts
│   ├── 02-student-management.cy.ts
│   ├── 03-appointment-scheduling.cy.ts
│   └── 04-medication-management.cy.ts
├── fixtures/               # Test data files
│   ├── users.json
│   ├── students.json
│   ├── appointments.json
│   └── medications.json
├── support/                # Support files and custom commands
│   ├── e2e.ts             # E2E test support file
│   ├── commands.ts        # Custom Cypress commands
│   └── component.ts       # Component test support file
└── README.md              # This documentation file
```

## Test Specifications

### 1. Authentication Flow (`01-authentication.cy.ts`)
Tests the complete authentication system including:
- Login page redirection for unauthenticated users
- Form validation and error handling
- Successful authentication and dashboard navigation
- Logout functionality
- Session persistence across page refreshes

### 2. Student Management (`02-student-management.cy.ts`)
Comprehensive testing of student management features:
- Student list display and navigation
- Adding new students with form validation
- Student search and filtering functionality
- Viewing and editing student details
- Bulk operations on multiple students

### 3. Appointment Scheduling (`03-appointment-scheduling.cy.ts`)
End-to-end testing of appointment system:
- Appointment creation and scheduling
- Calendar view and appointment details
- Date-based filtering and search
- Appointment rescheduling and cancellation
- Conflict detection and resolution
- Reminder system functionality

### 4. Medication Management (`04-medication-management.cy.ts`)
Complete medication workflow testing:
- Adding and managing student medications
- Recording medication administration
- Medication alerts and warnings system
- Administration history tracking
- Emergency medication protocols
- Report generation functionality

## Test Data and Fixtures

### Users (`fixtures/users.json`)
Contains test user accounts for different roles:
- **Nurse**: Primary healthcare provider account
- **Admin**: System administrator account  
- **Doctor**: Medical professional account

### Students (`fixtures/students.json`)
Sample student data for testing student management features:
- Complete student profiles with contact information
- Emergency contact details
- Grade level information

### Appointments (`fixtures/appointments.json`)
Test appointment data covering various scenarios:
- Annual checkups and routine visits
- Medication reviews
- Emergency appointments

### Medications (`fixtures/medications.json`)
Comprehensive medication test data:
- Common school medications (inhalers, insulin, EpiPens)
- Dosage and administration instructions
- Emergency medication protocols

## Custom Commands

The test platform includes custom Cypress commands for common operations:

- `cy.login(userType)` - Authenticate as different user types
- `cy.createStudent(studentData)` - Add new student records
- `cy.createAppointment(appointmentData)` - Schedule appointments
- `cy.addMedication(medicationData)` - Add medication records
- `cy.navigateTo(page)` - Navigate to application pages

## Running Tests

### Prerequisites
1. Ensure the backend API is running on `http://localhost:3001`
2. Ensure the frontend application is running on `http://localhost:5173`
3. Database should be seeded with test data

### Execute All E2E Tests
```bash
# From the frontend directory
npx cypress run
```

### Run Tests in Interactive Mode
```bash
# From the frontend directory
npx cypress open
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/01-authentication.cy.ts"
```

### Run Tests in Different Browsers
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Configuration

The test platform is configured via `cypress.config.ts` with healthcare-specific settings:

- **Base URL**: `http://localhost:5173`
- **API URL**: `http://localhost:3001`
- **Viewport**: 1280x720 (optimized for healthcare workflows)
- **Timeouts**: Extended for complex healthcare operations
- **Session Management**: Enabled for efficient test execution

## Test Best Practices

### Data Attributes
All tests use `data-cy` attributes for reliable element selection:
```html
<button data-cy="add-student-button">Add Student</button>
```

### Test Isolation
Each test is independent and includes proper setup/cleanup:
- Uses `beforeEach()` for consistent state
- Leverages Cypress sessions for authentication
- Includes proper test data management

### Real API Testing
Tests interact with actual backend APIs for realistic validation:
- Full database integration
- Real authentication flows
- Actual data persistence verification

### Error Handling
Comprehensive error scenario testing:
- Form validation errors
- Network failure handling
- Permission and access control testing

## Healthcare Compliance

The test suite validates HIPAA and healthcare compliance requirements:
- Access control and authentication
- Data privacy and security
- Audit trail verification
- Emergency protocol testing

## Continuous Integration

Tests are designed for CI/CD pipeline integration:
- Headless execution support
- Parallel test execution
- Comprehensive reporting
- Screenshot and video capture on failures

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify test user accounts exist in database
   - Check API connectivity
   - Confirm session management is working

2. **Element Not Found Errors**
   - Ensure `data-cy` attributes are present in components
   - Check for dynamic content loading delays
   - Verify element visibility conditions

3. **Test Data Issues**
   - Confirm database is properly seeded
   - Check fixture data format and content
   - Verify test data cleanup between runs

### Debug Commands

```bash
# Run with debug output
DEBUG=cypress:* npx cypress run

# Run with browser console logs
npx cypress run --browser chrome --headed

# Generate detailed reports
npx cypress run --reporter mochawesome
```

## Extending Tests

### Adding New Test Cases
1. Create new `.cy.ts` file in `e2e/` directory
2. Follow existing naming convention (`05-new-feature.cy.ts`)
3. Include comprehensive test coverage
4. Add necessary fixture data
5. Update this README with new test information

### Adding Custom Commands
1. Add command implementation to `support/commands.ts`
2. Include TypeScript type definitions
3. Document command usage and parameters
4. Add examples in test specifications

## Maintenance

### Regular Updates
- Keep Cypress version updated
- Review and update test data fixtures
- Maintain compatibility with application changes
- Update documentation as features evolve

### Performance Optimization
- Monitor test execution times
- Optimize selectors and waits
- Implement efficient test data strategies
- Use session management effectively

---

For additional support or questions about the test platform, refer to the main project documentation or contact the development team.
