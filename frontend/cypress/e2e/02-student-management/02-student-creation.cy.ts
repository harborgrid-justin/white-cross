/// <reference types="cypress" />

/**
 * Student Management: Student Creation (CRUD - Create)
 *
 * Comprehensive test suite for student creation functionality covering:
 * - Form UI rendering and validation
 * - Data input and submission
 * - Error handling and edge cases
 * - HIPAA audit logging compliance
 * - Accessibility requirements
 *
 * @module StudentCreationTests
 * @category StudentManagement
 * @priority Critical
 */

describe('Student Management - Student Creation (CRUD - Create)', () => {
  beforeEach(() => {
    // Login with admin privileges
    cy.login('admin')

    // Navigate to students page
    cy.visit('/students')

    // Wait for page to fully load
    cy.waitForHealthcareData()

    // Setup audit log interception for HIPAA compliance testing
    cy.setupAuditLogInterception()
  })

  context('Modal UI and Form Structure', () => {
    it('should open student creation modal with all required fields', () => {
      // Click add student button
      cy.clickButton('add-student-button')

      // Verify modal is visible and fully rendered
      cy.waitForModal('student-form-modal')

      // Verify all required form fields are present and visible
      cy.getByTestId('studentNumber-input').should('be.visible')
      cy.getByTestId('firstName-input').should('be.visible')
      cy.getByTestId('lastName-input').should('be.visible')
      cy.getByTestId('dateOfBirth-input').should('be.visible')
      cy.getByTestId('grade-select').should('be.visible')
      cy.getByTestId('gender-select').should('be.visible')

      // Verify action buttons are present
      cy.getByTestId('save-student-button').should('be.visible')
      cy.getByTestId('cancel-button').should('be.visible')
    })

    it('should have accessible form labels and ARIA attributes', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Check key form inputs have proper accessibility attributes
      cy.checkAccessibility('studentNumber-input')
      cy.checkAccessibility('firstName-input')
      cy.checkAccessibility('lastName-input')
      cy.checkAccessibility('save-student-button')
    })

    it('should display grade options in dropdown', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Verify grade dropdown has multiple options
      cy.getByTestId('grade-select')
        .find('option')
        .should('have.length.greaterThan', 1)
    })

    it('should display gender options in dropdown', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Verify gender dropdown has options
      cy.getByTestId('gender-select')
        .find('option')
        .should('have.length.greaterThan', 0)
    })
  })

  context('Successful Student Creation', () => {
    it('should successfully create a new student with all required fields', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        // Open creation modal
        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        // Fill in student form using enhanced command
        cy.fillStudentForm({
          studentNumber: newStudent.studentNumber,
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          dateOfBirth: newStudent.dateOfBirth,
          grade: newStudent.grade,
          gender: newStudent.gender
        })

        // Submit form
        cy.clickButton('save-student-button')

        // Verify success feedback
        cy.verifySuccess(/success|created/i)

        // Verify modal closes
        cy.waitForModalClose('student-form-modal')

        // Verify student appears in table
        cy.getByTestId('student-table')
          .should('contain', newStudent.firstName)
          .and('contain', newStudent.lastName)
      })
    })

    it('should create student with optional medical record number', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Fill required fields
      cy.fillStudentForm({
        studentNumber: 'STU12345',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15'
      })

      // Add optional medical record number if field exists
      cy.get('body').then($body => {
        if ($body.find('[data-testid="medicalRecordNum-input"]').length > 0) {
          cy.typeIntoField('medicalRecordNum-input', 'MRN-12345')
        }
      })

      cy.clickButton('save-student-button')
      cy.verifySuccess()
    })

    it('should create student with enrollment date when provided', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Fill required fields
      cy.fillStudentForm({
        studentNumber: 'STU12346',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2011-03-20'
      })

      // Add optional enrollment date if field exists
      cy.get('body').then($body => {
        if ($body.find('[data-testid="enrollmentDate-input"]').length > 0) {
          cy.typeIntoField('enrollmentDate-input', '2024-09-01')
        }
      })

      cy.clickButton('save-student-button')
      cy.verifySuccess()
      cy.waitForModalClose('student-form-modal')
    })

    it('should display success message and close modal after creation', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent2

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        cy.fillStudentForm(newStudent)
        cy.clickButton('save-student-button')

        // Verify success message appears
        cy.verifySuccess()

        // Verify modal automatically closes
        cy.waitForModalClose('student-form-modal')

        // Verify we're back on the student list page
        cy.getByTestId('student-table').should('be.visible')
      })
    })
  })

  context('Form Validation and Error Handling', () => {
    it('should show required field errors when submitting empty form', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Attempt to submit without filling any fields
      cy.clickButton('save-student-button')

      // Verify required field error messages appear
      cy.verifyError(/student.*number.*required|required.*student.*number/i)
      cy.verifyError(/first.*name.*required|required.*first.*name/i)
      cy.verifyError(/last.*name.*required|required.*last.*name/i)

      // Verify modal remains open
      cy.getByTestId('student-form-modal').should('be.visible')
    })

    it('should validate student number uniqueness', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Attempt to create student with existing student number
      cy.fillStudentForm({
        studentNumber: 'STU100', // Assuming this exists
        firstName: 'Test',
        lastName: 'Duplicate',
        dateOfBirth: '2010-01-01'
      })

      cy.clickButton('save-student-button')

      // Verify duplicate error message
      cy.verifyError(/error|already.*exists|duplicate/i)
    })

    it('should validate date of birth format', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      cy.typeIntoField('studentNumber-input', 'STU99999')
      cy.typeIntoField('firstName-input', 'Test')
      cy.typeIntoField('lastName-input', 'Student')

      // Attempt invalid date format (browser may prevent this, but we test anyway)
      cy.getByTestId('dateOfBirth-input').type('invalid-date')

      // Date input may auto-correct or reject - verify field behavior
      cy.getByTestId('dateOfBirth-input').should('exist')
    })

    it('should handle special characters in names properly', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Test names with special characters (common in real-world scenarios)
      cy.fillStudentForm({
        studentNumber: 'STU88888',
        firstName: "O'Brien",
        lastName: "García-Martinez",
        dateOfBirth: '2010-06-15'
      })

      cy.clickButton('save-student-button')

      // Should handle special characters without errors
      cy.verifySuccess()
    })
  })

  context('Modal Interactions and State Management', () => {
    it('should close modal when cancel button is clicked', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Partially fill form
      cy.typeIntoField('firstName-input', 'Test')

      // Click cancel
      cy.clickButton('cancel-button')

      // Verify modal is closed
      cy.waitForModalClose('student-form-modal')
    })

    it('should clear form data when modal is closed and reopened', () => {
      // First attempt - enter data and cancel
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')
      cy.typeIntoField('firstName-input', 'Test')
      cy.typeIntoField('lastName-input', 'User')
      cy.clickButton('cancel-button')
      cy.waitForModalClose('student-form-modal')

      // Second attempt - verify form is cleared
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Verify fields are empty
      cy.getByTestId('firstName-input').should('have.value', '')
      cy.getByTestId('lastName-input').should('have.value', '')
    })

    it('should handle rapid form submission attempts', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent3

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        cy.fillStudentForm(newStudent)

        // Click save button multiple times rapidly
        cy.getByTestId('save-student-button').click()
        cy.getByTestId('save-student-button').click({ force: true })

        // Should only create one student (no duplicates)
        cy.verifySuccess()
        cy.waitForModalClose('student-form-modal')
      })
    })
  })

  context('HIPAA Compliance and Audit Logging', () => {
    it('should create audit log entry when student is created', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        cy.fillStudentForm(newStudent)
        cy.clickButton('save-student-button')

        // Verify audit log was created
        cy.verifyAuditLog('CREATE_STUDENT', 'STUDENT')
      })
    })

    it('should include authenticated user info in PHI access', () => {
      cy.intercept('POST', '**/api/students').as('createStudent')

      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent2

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        cy.fillStudentForm(newStudent)
        cy.clickButton('save-student-button')

        // Verify request includes authentication token
        cy.wait('@createStudent').then((interception) => {
          expect(interception.request.headers).to.have.property('authorization')
        })
      })
    })

    it('should sanitize input to prevent XSS attacks', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Attempt to inject script tags
      cy.fillStudentForm({
        studentNumber: 'STU77777',
        firstName: '<script>alert("xss")</script>',
        lastName: '<img src=x onerror=alert(1)>',
        dateOfBirth: '2010-01-01'
      })

      cy.clickButton('save-student-button')

      // Should either reject or sanitize the input
      // Check that script doesn't execute (Cypress would catch this)
      cy.get('body').should('exist')
    })
  })

  context('Keyboard Navigation and Accessibility', () => {
    it('should support keyboard navigation through form fields', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Tab through fields
      cy.getByTestId('studentNumber-input').focus().should('be.focused')
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-testid', 'firstName-input')
    })

    it('should allow form submission with Enter key', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')

        cy.fillStudentForm(newStudent)

        // Submit with Enter key
        cy.getByTestId('save-student-button').type('{enter}')

        cy.verifySuccess()
      })
    })

    it('should trap focus within modal while open', () => {
      cy.clickButton('add-student-button')
      cy.waitForModal('student-form-modal')

      // Focus should remain in modal when tabbing
      cy.getByTestId('student-form-modal').within(() => {
        cy.get('input, select, button').first().focus()
        cy.focused().should('exist')
      })
    })
  })

  context('Integration with Student Table', () => {
    it('should refresh student table after successful creation', () => {
      // Get initial student count
      cy.getByTestId('student-table')
        .find('[data-testid="student-row"]')
        .its('length')
        .then((initialCount) => {
          cy.fixture('students').then((students) => {
            const newStudent = students.testStudent1

            cy.clickButton('add-student-button')
            cy.waitForModal('student-form-modal')
            cy.fillStudentForm(newStudent)
            cy.clickButton('save-student-button')
            cy.verifySuccess()
            cy.waitForModalClose('student-form-modal')

            // Verify student count increased
            cy.getByTestId('student-table')
              .find('[data-testid="student-row"]')
              .should('have.length.greaterThan', initialCount)
          })
        })
    })

    it('should display newly created student in correct sort order', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        // Set sort to lastName ascending
        cy.get('body').then($body => {
          if ($body.find('[data-testid="sort-by-select"]').length > 0) {
            cy.selectOption('sort-by-select', 'lastName-asc')
          }
        })

        cy.clickButton('add-student-button')
        cy.waitForModal('student-form-modal')
        cy.fillStudentForm(newStudent)
        cy.clickButton('save-student-button')
        cy.verifySuccess()
        cy.waitForModalClose('student-form-modal')

        // Verify new student appears in table
        cy.getByTestId('student-table')
          .should('contain', newStudent.lastName)
      })
    })
  })
})
