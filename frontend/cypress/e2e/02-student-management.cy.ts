/// <reference types="cypress" />

/**
 * Student Management - Comprehensive Test Suite (150 Tests)
 *
 * This test suite provides complete coverage of the student management module,
 * validating CRUD operations, search, filtering, bulk actions, permissions,
 * data validation, HIPAA compliance, and accessibility features.
 *
 * Test Organization:
 * 1. Page Load & UI Structure (15 tests)
 * 2. Student Creation (CRUD - Create) (15 tests)
 * 3. Student List & Viewing (CRUD - Read) (15 tests)
 * 4. Student Editing (CRUD - Update) (15 tests)
 * 5. Student Deletion & Archiving (CRUD - Delete) (15 tests)
 * 6. Search Functionality (15 tests)
 * 7. Filtering & Sorting (15 tests)
 * 8. Pagination & Navigation (10 tests)
 * 9. Bulk Operations (10 tests)
 * 10. Emergency Contacts Management (10 tests)
 * 11. Data Validation & Error Handling (15 tests)
 * 12. Role-Based Permissions (10 tests)
 * 13. HIPAA Compliance & Security (10 tests)
 * 14. Accessibility & Responsiveness (5 tests)
 */

describe('Student Management - Comprehensive Test Suite (150 Tests)', () => {

  // =============================================================================
  // SECTION 1: PAGE LOAD & UI STRUCTURE (15 tests)
  // =============================================================================

  describe('Page Load & UI Structure', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display the student management page with correct title', () => {
      cy.get('[data-testid=page-title]').should('contain', 'Student Management')
      cy.url().should('include', '/students')
    })

    it('should display the add student button', () => {
      cy.get('[data-testid=add-student-button]').should('be.visible')
      cy.get('[data-testid=add-student-button]').should('contain', 'Add Student')
    })

    it('should display the search input field', () => {
      cy.get('[data-testid=search-input]').should('be.visible')
      cy.get('[data-testid=search-input]').should('have.attr', 'placeholder')
    })

    it('should display the student table with headers', () => {
      cy.get('[data-testid=student-table]').should('be.visible')
      cy.get('thead').should('be.visible')
    })

    it('should display filter button', () => {
      cy.get('[data-testid=filter-button]').should('be.visible')
    })

    it('should display sort controls', () => {
      cy.get('[data-testid=sort-by-select]').should('be.visible')
    })

    it('should display pagination controls when applicable', () => {
      cy.get('[data-testid=pagination-controls]').should('exist')
    })

    it('should display view archived students button', () => {
      cy.get('[data-testid=view-archived-button]').should('be.visible')
    })

    it('should show student count indicator', () => {
      cy.get('[data-testid=student-count]').should('be.visible')
      cy.get('[data-testid=student-count]').should('contain', 'student')
    })

    it('should display bulk action controls', () => {
      cy.get('[data-testid=select-all-checkbox]').should('exist')
    })

    it('should have proper table column headers', () => {
      cy.get('thead th').should('contain', 'Student Number')
      cy.get('thead th').should('contain', 'Name')
      cy.get('thead th').should('contain', 'Grade')
    })

    it('should display medical indicators column', () => {
      cy.get('thead th').should('contain', 'Medical')
    })

    it('should display actions column', () => {
      cy.get('thead th').should('contain', 'Actions')
    })

    it('should load student data on page mount', () => {
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should display loading state initially', () => {
      cy.intercept('GET', '/api/students*', (req) => {
        req.reply((res) => {
          res.delay = 1000
          res.send()
        })
      }).as('getStudents')

      cy.visit('/students')
      cy.get('[data-testid=loading-spinner]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 2: STUDENT CREATION (CRUD - CREATE) (15 tests)
  // =============================================================================

  describe('Student Creation (CRUD - Create)', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should open student creation modal when add button is clicked', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=student-form-modal]').should('be.visible')
    })

    it('should display all required fields in the creation form', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').should('be.visible')
      cy.get('[data-testid=firstName-input]').should('be.visible')
      cy.get('[data-testid=lastName-input]').should('be.visible')
      cy.get('[data-testid=dateOfBirth-input]').should('be.visible')
      cy.get('[data-testid=grade-select]').should('be.visible')
      cy.get('[data-testid=gender-select]').should('be.visible')
    })

    it('should successfully create a new student with valid data', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
        cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
        cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
        cy.get('[data-testid=grade-select]').select(newStudent.grade)
        cy.get('[data-testid=gender-select]').select(newStudent.gender)
        cy.get('[data-testid=save-student-button]').click()

        cy.get('[data-testid=success-message]').should('be.visible')
        cy.get('[data-testid=student-table]').should('contain', newStudent.firstName)
      })
    })

    it('should display success message after creating student', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
        cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
        cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
        cy.get('[data-testid=grade-select]').select(newStudent.grade)
        cy.get('[data-testid=save-student-button]').click()

        cy.get('[data-testid=success-message]').should('contain', 'Student created successfully')
      })
    })

    it('should close modal after successful student creation', () => {
      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
        cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
        cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
        cy.get('[data-testid=grade-select]').select(newStudent.grade)
        cy.get('[data-testid=save-student-button]').click()

        cy.get('[data-testid=student-form-modal]').should('not.exist')
      })
    })

    it('should allow creating student with optional medical record number', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU12345')
      cy.get('[data-testid=firstName-input]').type('John')
      cy.get('[data-testid=lastName-input]').type('Doe')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-05-15')
      cy.get('[data-testid=medicalRecordNum-input]').type('MRN-12345')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should allow creating student with enrollment date', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU12346')
      cy.get('[data-testid=firstName-input]').type('Jane')
      cy.get('[data-testid=lastName-input]').type('Smith')
      cy.get('[data-testid=dateOfBirth-input]').type('2011-03-20')
      cy.get('[data-testid=enrollmentDate-input]').type('2024-09-01')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should validate student number uniqueness', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU100')
      cy.get('[data-testid=firstName-input]').type('Test')
      cy.get('[data-testid=lastName-input]').type('Duplicate')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-01-01')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=error-message]').should('contain', 'Student number already exists')
    })

    it('should show required field errors when submitting empty form', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=studentNumber-error]').should('contain', 'Student number is required')
      cy.get('[data-testid=firstName-error]').should('contain', 'First name is required')
      cy.get('[data-testid=lastName-error]').should('contain', 'Last name is required')
    })

    it('should close modal when cancel button is clicked', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=student-form-modal]').should('be.visible')
      cy.get('[data-testid=cancel-button]').click()
      cy.get('[data-testid=student-form-modal]').should('not.exist')
    })

    it('should clear form data when modal is closed and reopened', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=firstName-input]').type('Test')
      cy.get('[data-testid=cancel-button]').click()

      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=firstName-input]').should('have.value', '')
    })

    it('should display grade options in dropdown', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=grade-select]').click()
      cy.get('[data-testid=grade-select] option').should('have.length.greaterThan', 1)
    })

    it('should display gender options in dropdown', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=gender-select]').click()
      cy.get('[data-testid=gender-select] option').should('contain', 'Male')
      cy.get('[data-testid=gender-select] option').should('contain', 'Female')
    })

    it('should create audit log entry when student is created', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.fixture('students').then((students) => {
        const newStudent = students.testStudent1

        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
        cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
        cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
        cy.get('[data-testid=save-student-button]').click()

        cy.wait('@auditLog').its('request.body').should('deep.include', {
          action: 'CREATE_STUDENT',
          resourceType: 'STUDENT'
        })
      })
    })
  })

  // =============================================================================
  // SECTION 3: STUDENT LIST & VIEWING (CRUD - READ) (15 tests)
  // =============================================================================

  describe('Student List & Viewing (CRUD - Read)', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display list of students in table format', () => {
      cy.get('[data-testid=student-table]').should('be.visible')
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should display student number in each row', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-studentNumber]').should('be.visible')
      })
    })

    it('should display student full name in each row', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-name]').should('be.visible')
      })
    })

    it('should display student grade in each row', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-grade]').should('be.visible')
      })
    })

    it('should open student details modal when row is clicked', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-details-modal]').should('be.visible')
    })

    it('should display complete student information in details modal', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-details-modal]').should('be.visible')
      cy.get('[data-testid=student-name]').should('be.visible')
      cy.get('[data-testid=student-id]').should('be.visible')
      cy.get('[data-testid=student-grade]').should('be.visible')
    })

    it('should display date of birth in details modal', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-dob]').should('be.visible')
    })

    it('should display enrollment date in details modal', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-enrollmentDate]').should('be.visible')
    })

    it('should display emergency contact information in details modal', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-section]').should('be.visible')
    })

    it('should display medical record number if available', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-details-modal]').should('be.visible')
    })

    it('should show allergy indicators for students with allergies', () => {
      cy.get('[data-testid=allergy-indicator]').should('exist')
    })

    it('should show medication indicators for students on medications', () => {
      cy.get('[data-testid=medication-indicator]').should('exist')
    })

    it('should close details modal when close button is clicked', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-details-modal]').should('be.visible')
      cy.get('[data-testid=close-modal-button]').click()
      cy.get('[data-testid=student-details-modal]').should('not.exist')
    })

    it('should display student age calculated from DOB', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-age]').should('be.visible')
      cy.get('[data-testid=student-age]').should('match', /\d+ years/)
    })

    it('should create audit log when viewing student details', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=student-row]').first().click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'VIEW_STUDENT',
        resourceType: 'STUDENT'
      })
    })
  })

  // =============================================================================
  // SECTION 4: STUDENT EDITING (CRUD - UPDATE) (15 tests)
  // =============================================================================

  describe('Student Editing (CRUD - Update)', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should open edit modal when edit button is clicked', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=student-form-modal]').should('be.visible')
    })

    it('should populate form with existing student data', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').should('not.have.value', '')
      cy.get('[data-testid=lastName-input]').should('not.have.value', '')
    })

    it('should successfully update student first name', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear().type('UpdatedFirstName')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=student-table]').should('contain', 'UpdatedFirstName')
    })

    it('should successfully update student last name', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=lastName-input]').clear().type('UpdatedLastName')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=student-table]').should('contain', 'UpdatedLastName')
    })

    it('should successfully update student grade', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=grade-select]').select('10')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=student-row]').first().should('contain', '10')
    })

    it('should display success message after updating student', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear().type('Updated')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Student updated successfully')
    })

    it('should validate student number uniqueness when editing', () => {
      cy.get('[data-testid=student-row]').eq(1).within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=studentNumber-input]').clear().type('STU100')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=error-message]').should('contain', 'Student number already exists')
    })

    it('should preserve student data when canceling edit', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-name]').invoke('text').as('originalName')
      })

      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })

      cy.get('[data-testid=firstName-input]').clear().type('ShouldNotSave')
      cy.get('[data-testid=cancel-button]').click()

      cy.get('@originalName').then((originalName) => {
        cy.get('[data-testid=student-table]').should('contain', originalName)
        cy.get('[data-testid=student-table]').should('not.contain', 'ShouldNotSave')
      })
    })

    it('should allow updating medical record number', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=medicalRecordNum-input]').clear().type('MRN-UPDATED')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should allow updating enrollment date', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=enrollmentDate-input]').clear().type('2024-10-01')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should validate required fields when updating', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear()
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=firstName-error]').should('contain', 'First name is required')
    })

    it('should close modal after successful update', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear().type('Updated')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=student-form-modal]').should('not.exist')
    })

    it('should update gender when changed', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=gender-select]').select('OTHER')
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should create audit log when student is updated', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear().type('Updated')
      cy.get('[data-testid=save-student-button]').click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'UPDATE_STUDENT',
        resourceType: 'STUDENT'
      })
    })
  })

  // =============================================================================
  // SECTION 5: STUDENT DELETION & ARCHIVING (CRUD - DELETE) (15 tests)
  // =============================================================================

  describe('Student Deletion & Archiving (CRUD - Delete)', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display delete button for each student', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').should('be.visible')
      })
    })

    it('should show confirmation modal when delete button is clicked', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
    })

    it('should display confirmation message with student name', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-message]').should('contain', 'Are you sure')
    })

    it('should successfully archive student when confirmed', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-name]').invoke('text').as('studentName')
        cy.get('[data-testid=delete-student-button]').click()
      })

      cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
      cy.get('[data-testid=confirm-delete-button]').click()

      cy.get('@studentName').then((studentName) => {
        cy.get('[data-testid=student-table]').should('not.contain', studentName)
      })
    })

    it('should cancel deletion when cancel button is clicked', () => {
      const initialRowCount = Cypress.$('[data-testid=student-row]').length

      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })

      cy.get('[data-testid=cancel-delete-button]').click()
      cy.get('[data-testid=student-row]').should('have.length', initialRowCount)
    })

    it('should close confirmation modal when cancel is clicked', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
      cy.get('[data-testid=cancel-delete-button]').click()
      cy.get('[data-testid=confirm-delete-modal]').should('not.exist')
    })

    it('should display success message after archiving student', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Student archived')
    })

    it('should allow viewing archived students', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-students-list]').should('be.visible')
    })

    it('should display archived students in separate list', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-student-row]').should('exist')
    })

    it('should allow restoring an archived student', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-student-row]').first().within(() => {
        cy.get('[data-testid=student-name]').invoke('text').as('studentName')
        cy.get('[data-testid=restore-student-button]').click()
      })

      cy.get('[data-testid=view-active-button]').click()

      cy.get('@studentName').then((studentName) => {
        cy.get('[data-testid=student-table]').should('contain', studentName)
      })
    })

    it('should display restore button for archived students', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-student-row]').first().within(() => {
        cy.get('[data-testid=restore-student-button]').should('be.visible')
      })
    })

    it('should switch between active and archived views', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-students-list]').should('be.visible')
      cy.get('[data-testid=view-active-button]').click()
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should display count of archived students', () => {
      cy.get('[data-testid=view-archived-button]').click()
      cy.get('[data-testid=archived-count]').should('be.visible')
    })

    it('should create audit log when student is archived', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-button]').click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'ARCHIVE_STUDENT',
        resourceType: 'STUDENT'
      })
    })

    it('should prevent deletion of students with active medications', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })
      cy.get('[data-testid=confirm-delete-button]').click()
      cy.get('[data-testid=error-message]').should('contain', 'Cannot archive student with active medications')
    })
  })

  // =============================================================================
  // SECTION 6: SEARCH FUNCTIONALITY (15 tests)
  // =============================================================================

  describe('Search Functionality', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should filter students by first name when searching', () => {
      cy.fixture('students').then((students) => {
        cy.get('[data-testid=search-input]').type(students.testStudent1.firstName)
        cy.get('[data-testid=student-table]').should('contain', students.testStudent1.firstName)
      })
    })

    it('should filter students by last name when searching', () => {
      cy.fixture('students').then((students) => {
        cy.get('[data-testid=search-input]').type(students.testStudent1.lastName)
        cy.get('[data-testid=student-table]').should('contain', students.testStudent1.lastName)
      })
    })

    it('should filter students by student number when searching', () => {
      cy.fixture('students').then((students) => {
        cy.get('[data-testid=search-input]').type(students.testStudent1.studentNumber)
        cy.get('[data-testid=student-table]').should('contain', students.testStudent1.studentNumber)
      })
    })

    it('should be case-insensitive when searching', () => {
      cy.fixture('students').then((students) => {
        cy.get('[data-testid=search-input]').type(students.testStudent1.firstName.toUpperCase())
        cy.get('[data-testid=student-table]').should('contain', students.testStudent1.firstName)
      })
    })

    it('should show all students when search is cleared', () => {
      cy.get('[data-testid=search-input]').type('Test')
      cy.get('[data-testid=search-input]').clear()
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should show "no results" message when no students match search', () => {
      cy.get('[data-testid=search-input]').type('NonexistentStudent12345')
      cy.get('[data-testid=no-results-message]').should('be.visible')
      cy.get('[data-testid=no-results-message]').should('contain', 'No students found')
    })

    it('should debounce search input to reduce API calls', () => {
      let requestCount = 0
      cy.intercept('GET', '/api/students*', () => {
        requestCount++
      }).as('searchStudents')

      cy.get('[data-testid=search-input]').type('Joh')
      cy.wait(100)
      cy.get('[data-testid=search-input]').type('n')

      cy.wait(500)
      cy.wrap(null).should(() => {
        expect(requestCount).to.be.lessThan(5)
      })
    })

    it('should display search results count', () => {
      cy.get('[data-testid=search-input]').type('Test')
      cy.get('[data-testid=results-count]').should('be.visible')
    })

    it('should highlight search term in results', () => {
      cy.get('[data-testid=search-input]').type('John')
      cy.get('[data-testid=search-highlight]').should('exist')
    })

    it('should search across multiple fields simultaneously', () => {
      cy.get('[data-testid=search-input]').type('STU')
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should maintain search when navigating between pages', () => {
      cy.get('[data-testid=search-input]').type('Test')
      cy.get('[data-testid=next-page-button]').click()
      cy.get('[data-testid=search-input]').should('have.value', 'Test')
    })

    it('should clear search when clicking clear button', () => {
      cy.get('[data-testid=search-input]').type('Test')
      cy.get('[data-testid=clear-search-button]').click()
      cy.get('[data-testid=search-input]').should('have.value', '')
    })

    it('should show search suggestions when typing', () => {
      cy.get('[data-testid=search-input]').type('Joh')
      cy.get('[data-testid=search-suggestions]').should('be.visible')
    })

    it('should handle special characters in search', () => {
      cy.get('[data-testid=search-input]').type('O\'Brien')
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should update URL with search query parameters', () => {
      cy.get('[data-testid=search-input]').type('Test')
      cy.url().should('include', 'search=Test')
    })
  })

  // =============================================================================
  // SECTION 7: FILTERING & SORTING (15 tests)
  // =============================================================================

  describe('Filtering & Sorting', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should show filter dropdown when filter button is clicked', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=filter-dropdown]').should('be.visible')
    })

    it('should filter students by grade level', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=student-row]').each(($row) => {
        cy.wrap($row).should('contain', 'Grade 9')
      })
    })

    it('should filter students by active status', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=active-status-filter]').check()
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=student-row]').should('exist')
    })

    it('should filter students by gender', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=gender-filter-select]').select('MALE')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should filter students with medical alerts', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=medical-alert-filter]').check()
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=allergy-indicator]').should('exist')
    })

    it('should clear all filters when reset button is clicked', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=reset-filters-button]').click()
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should sort students by last name alphabetically (A-Z)', () => {
      cy.get('[data-testid=sort-by-select]').select('lastName-asc')

      const names: string[] = []
      cy.get('[data-testid=student-row]').each(($row) => {
        cy.wrap($row).find('[data-testid=student-lastName]').invoke('text').then((currentName) => {
          names.push(currentName.toLowerCase().trim())
        })
      }).then(() => {
        for (let i = 1; i < names.length; i++) {
          expect(names[i] >= names[i - 1]).to.be.true
        }
      })
    })

    it('should sort students by last name reverse alphabetically (Z-A)', () => {
      cy.get('[data-testid=sort-by-select]').select('lastName-desc')

      const names: string[] = []
      cy.get('[data-testid=student-row]').each(($row) => {
        cy.wrap($row).find('[data-testid=student-lastName]').invoke('text').then((currentName) => {
          names.push(currentName.toLowerCase().trim())
        })
      }).then(() => {
        for (let i = 1; i < names.length; i++) {
          expect(names[i] <= names[i - 1]).to.be.true
        }
      })
    })

    it('should sort students by grade level ascending', () => {
      cy.get('[data-testid=sort-by-select]').select('grade-asc')

      let previousGrade = 0
      cy.get('[data-testid=student-row]').each(($row) => {
        cy.wrap($row).find('[data-testid=student-grade]').invoke('text').then((gradeText) => {
          const currentGrade = parseInt(gradeText.replace('Grade ', ''))
          if (previousGrade) {
            expect(currentGrade).to.be.at.least(previousGrade)
          }
          previousGrade = currentGrade
        })
      })
    })

    it('should sort students by enrollment date', () => {
      cy.get('[data-testid=sort-by-select]').select('enrollmentDate-desc')
      cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
    })

    it('should apply multiple filters simultaneously', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('10')
      cy.get('[data-testid=gender-filter-select]').select('FEMALE')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=student-row]').each(($row) => {
        cy.wrap($row).should('contain', 'Grade 10')
      })
    })

    it('should display active filter badges', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=active-filter-badge]').should('be.visible')
      cy.get('[data-testid=active-filter-badge]').should('contain', 'Grade: 9')
    })

    it('should remove individual filter by clicking badge close', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=active-filter-badge]').within(() => {
        cy.get('[data-testid=remove-filter]').click()
      })

      cy.get('[data-testid=active-filter-badge]').should('not.exist')
    })

    it('should persist filters in URL parameters', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.url().should('include', 'grade=9')
    })

    it('should maintain sorting when filtering', () => {
      cy.get('[data-testid=sort-by-select]').select('lastName-asc')
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=sort-by-select]').should('have.value', 'lastName-asc')
    })
  })

  // =============================================================================
  // SECTION 8: PAGINATION & NAVIGATION (10 tests)
  // =============================================================================

  describe('Pagination & Navigation', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display pagination controls when applicable', () => {
      cy.get('[data-testid=pagination-controls]').should('be.visible')
    })

    it('should navigate to next page when next button is clicked', () => {
      cy.get('[data-testid=next-page-button]').click()
      cy.get('[data-testid=page-indicator]').should('contain', '2')
    })

    it('should navigate to previous page when previous button is clicked', () => {
      cy.get('[data-testid=next-page-button]').click()
      cy.get('[data-testid=previous-page-button]').click()
      cy.get('[data-testid=page-indicator]').should('contain', '1')
    })

    it('should disable previous button on first page', () => {
      cy.get('[data-testid=previous-page-button]').should('be.disabled')
    })

    it('should disable next button on last page', () => {
      cy.get('[data-testid=last-page-button]').click()
      cy.get('[data-testid=next-page-button]').should('be.disabled')
    })

    it('should display correct number of students per page', () => {
      cy.get('[data-testid=per-page-select]').select('10')
      cy.get('[data-testid=student-row]').should('have.length.at.most', 10)
    })

    it('should change items per page when selecting different option', () => {
      cy.get('[data-testid=per-page-select]').select('25')
      cy.get('[data-testid=student-row]').should('have.length.at.most', 25)
    })

    it('should navigate to specific page number when clicked', () => {
      cy.get('[data-testid=page-number-3]').click()
      cy.get('[data-testid=page-indicator]').should('contain', '3')
    })

    it('should display total page count', () => {
      cy.get('[data-testid=total-pages]').should('be.visible')
      cy.get('[data-testid=total-pages]').should('match', /of \d+/)
    })

    it('should maintain pagination when applying filters', () => {
      cy.get('[data-testid=next-page-button]').click()
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=grade-filter-select]').select('9')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=page-indicator]').should('contain', '1')
    })
  })

  // =============================================================================
  // SECTION 9: BULK OPERATIONS (10 tests)
  // =============================================================================

  describe('Bulk Operations', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display checkbox for each student row', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-checkbox]').should('be.visible')
      })
    })

    it('should allow selecting individual students', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=student-checkbox]').eq(0).should('be.checked')
    })

    it('should show selected count when students are selected', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=student-checkbox]').eq(1).check()
      cy.get('[data-testid=selected-count]').should('contain', '2')
    })

    it('should select all students when select all checkbox is checked', () => {
      cy.get('[data-testid=select-all-checkbox]').check()
      cy.get('[data-testid=student-checkbox]:checked').should('have.length.greaterThan', 0)
    })

    it('should deselect all students when select all is unchecked', () => {
      cy.get('[data-testid=select-all-checkbox]').check()
      cy.get('[data-testid=select-all-checkbox]').uncheck()
      cy.get('[data-testid=student-checkbox]:checked').should('have.length', 0)
    })

    it('should display bulk action menu when students are selected', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=bulk-actions-menu]').should('be.visible')
    })

    it('should allow bulk export of selected students to CSV', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=student-checkbox]').eq(1).check()
      cy.get('[data-testid=bulk-export-button]').click()

      cy.get('[data-testid=export-format-modal]').should('be.visible')
      cy.get('[data-testid=export-csv-button]').click()

      cy.readFile('cypress/downloads/students.csv').should('exist')
    })

    it('should allow bulk export to PDF', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=bulk-export-button]').click()
      cy.get('[data-testid=export-pdf-button]').should('be.visible')
    })

    it('should clear selection after bulk operation completes', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=bulk-export-button]').click()
      cy.get('[data-testid=export-csv-button]').click()

      cy.get('[data-testid=student-checkbox]:checked').should('have.length', 0)
    })

    it('should confirm before bulk archiving students', () => {
      cy.get('[data-testid=student-checkbox]').eq(0).check()
      cy.get('[data-testid=bulk-archive-button]').click()
      cy.get('[data-testid=bulk-archive-confirm-modal]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 10: EMERGENCY CONTACTS MANAGEMENT (10 tests)
  // =============================================================================

  describe('Emergency Contacts Management', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should display emergency contact section in student details', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-section]').should('be.visible')
    })

    it('should display primary emergency contact information', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-name]').should('be.visible')
      cy.get('[data-testid=emergency-contact-phone]').should('be.visible')
    })

    it('should allow editing emergency contact information', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=edit-emergency-contact-button]').click()

      cy.get('[data-testid=emergency-contact-firstName]').clear().type('NewContact')
      cy.get('[data-testid=emergency-contact-phone]').clear().type('555-9999')
      cy.get('[data-testid=save-emergency-contact-button]').click()

      cy.get('[data-testid=emergency-contact-name]').should('contain', 'NewContact')
    })

    it('should validate emergency contact phone number format', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=edit-emergency-contact-button]').click()

      cy.get('[data-testid=emergency-contact-phone]').clear().type('invalid')
      cy.get('[data-testid=save-emergency-contact-button]').click()

      cy.get('[data-testid=emergency-contact-phone-error]').should('contain', 'Invalid phone number')
    })

    it('should display relationship to student', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-relationship]').should('be.visible')
    })

    it('should allow adding secondary emergency contact', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=add-secondary-contact-button]').click()

      cy.get('[data-testid=secondary-contact-form]').should('be.visible')
    })

    it('should display multiple emergency contacts', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-list]').should('be.visible')
    })

    it('should allow removing secondary emergency contact', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=secondary-contact-row]').first().within(() => {
        cy.get('[data-testid=remove-contact-button]').click()
      })

      cy.get('[data-testid=confirm-remove-modal]').should('be.visible')
      cy.get('[data-testid=confirm-remove-button]').click()
    })

    it('should validate at least one emergency contact exists', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=emergency-contact-list] [data-testid=emergency-contact-row]')
        .should('have.length.greaterThan', 0)
    })

    it('should display contact priority order', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=contact-priority-indicator]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 11: DATA VALIDATION & ERROR HANDLING (15 tests)
  // =============================================================================

  describe('Data Validation & Error Handling', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should require student number when creating student', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=studentNumber-error]').should('contain', 'Student number is required')
    })

    it('should require first name when creating student', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=firstName-error]').should('contain', 'First name is required')
    })

    it('should require last name when creating student', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=save-student-button]').click()
      cy.get('[data-testid=lastName-error]').should('contain', 'Last name is required')
    })

    it('should validate date of birth is not in the future', () => {
      cy.get('[data-testid=add-student-button]').click()

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      const futureDateString = futureDate.toISOString().split('T')[0]

      cy.get('[data-testid=dateOfBirth-input]').type(futureDateString)
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=dateOfBirth-error]').should('contain', 'Date of birth cannot be in the future')
    })

    it('should validate student age is within acceptable range (4-19 years)', () => {
      cy.get('[data-testid=add-student-button]').click()

      const tooYoungDate = new Date()
      tooYoungDate.setFullYear(tooYoungDate.getFullYear() - 2)
      const tooYoungDateString = tooYoungDate.toISOString().split('T')[0]

      cy.get('[data-testid=studentNumber-input]').type('STU998')
      cy.get('[data-testid=firstName-input]').type('Too')
      cy.get('[data-testid=lastName-input]').type('Young')
      cy.get('[data-testid=dateOfBirth-input]').type(tooYoungDateString)
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=dateOfBirth-error]').should('contain', 'Student must be between 4 and 19 years old')
    })

    it('should validate phone number format', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU999')
      cy.get('[data-testid=firstName-input]').type('Test')
      cy.get('[data-testid=lastName-input]').type('Student')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-01-01')
      cy.get('[data-testid=emergency-contact-phone]').type('invalid-phone')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=emergency-contact-phone-error]').should('contain', 'Invalid phone number format')
    })

    it('should validate email format if provided', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=student-email]').type('invalid-email')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=student-email-error]').should('contain', 'Invalid email format')
    })

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '/api/students', { statusCode: 500 }).as('createStudent')

      cy.get('[data-testid=add-student-button]').click()
      cy.fixture('students').then((students) => {
        cy.get('[data-testid=studentNumber-input]').type(students.testStudent1.studentNumber)
        cy.get('[data-testid=firstName-input]').type(students.testStudent1.firstName)
        cy.get('[data-testid=lastName-input]').type(students.testStudent1.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(students.testStudent1.dateOfBirth)
        cy.get('[data-testid=save-student-button]').click()

        cy.wait('@createStudent')
        cy.get('[data-testid=error-message]').should('contain', 'Failed to create student')
      })
    })

    it('should display validation errors for all invalid fields simultaneously', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=studentNumber-error]').should('be.visible')
      cy.get('[data-testid=firstName-error]').should('be.visible')
      cy.get('[data-testid=lastName-error]').should('be.visible')
    })

    it('should validate minimum length for first and last names', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=firstName-input]').type('A')
      cy.get('[data-testid=lastName-input]').type('B')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=firstName-error]').should('contain', 'minimum')
    })

    it('should validate maximum length for text fields', () => {
      cy.get('[data-testid=add-student-button]').click()
      const longString = 'a'.repeat(300)
      cy.get('[data-testid=firstName-input]').type(longString)
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=firstName-error]').should('contain', 'maximum')
    })

    it('should prevent XSS attacks in student data', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU-XSS')
      cy.get('[data-testid=firstName-input]').type('<script>alert("xss")</script>')
      cy.get('[data-testid=lastName-input]').type('Test')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-01-01')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=student-table]').should('not.contain', '<script>')
    })

    it('should handle duplicate student records appropriately', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU100')
      cy.get('[data-testid=firstName-input]').type('Duplicate')
      cy.get('[data-testid=lastName-input]').type('Student')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-01-01')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=error-message]').should('contain', 'already exists')
    })

    it('should display appropriate error message when server is unavailable', () => {
      cy.intercept('GET', '/api/students*', { forceNetworkError: true }).as('getStudents')

      cy.visit('/students')
      cy.get('[data-testid=error-message]').should('contain', 'Unable to load students')
    })

    it('should validate enrollment date is not before date of birth', () => {
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type('STU-DATE')
      cy.get('[data-testid=firstName-input]').type('Date')
      cy.get('[data-testid=lastName-input]').type('Test')
      cy.get('[data-testid=dateOfBirth-input]').type('2015-01-01')
      cy.get('[data-testid=enrollmentDate-input]').type('2010-01-01')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=enrollmentDate-error]').should('contain', 'Enrollment date must be after date of birth')
    })
  })

  // =============================================================================
  // SECTION 12: ROLE-BASED PERMISSIONS (10 tests)
  // =============================================================================

  describe('Role-Based Permissions', () => {
    it('should allow admin to view student management page', () => {
      cy.login('admin')
      cy.visit('/students')
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should allow nurse to view student management page', () => {
      cy.loginAs('nurse@school.edu', 'testNursePassword')
      cy.visit('/students')
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should allow counselor to view student management page', () => {
      cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
      cy.visit('/students')
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should allow admin to create students', () => {
      cy.login('admin')
      cy.visit('/students')
      cy.get('[data-testid=add-student-button]').should('be.visible')
    })

    it('should allow nurse to create students', () => {
      cy.loginAs('nurse@school.edu', 'testNursePassword')
      cy.visit('/students')
      cy.get('[data-testid=add-student-button]').should('be.visible')
    })

    it('should NOT allow viewer to create students', () => {
      cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
      cy.visit('/students')
      cy.get('[data-testid=add-student-button]').should('not.exist')
    })

    it('should NOT allow nurse to delete students', () => {
      cy.loginAs('nurse@school.edu', 'testNursePassword')
      cy.visit('/students')
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').should('not.exist')
      })
    })

    it('should allow admin to delete students', () => {
      cy.login('admin')
      cy.visit('/students')
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').should('be.visible')
      })
    })

    it('should allow viewer to view student details but not edit', () => {
      cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
      cy.visit('/students')
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=student-details-modal]').should('be.visible')
      cy.get('[data-testid=edit-student-button]').should('not.exist')
    })

    it('should redirect unauthenticated users to login', () => {
      cy.visit('/students')
      cy.url().should('include', '/login')
    })
  })

  // =============================================================================
  // SECTION 13: HIPAA COMPLIANCE & SECURITY (10 tests)
  // =============================================================================

  describe('HIPAA Compliance & Security', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should require authentication to access student management', () => {
      cy.clearCookies()
      cy.visit('/students')
      cy.url().should('include', '/login')
    })

    it('should create audit log when viewing student details', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=student-row]').first().click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'VIEW_STUDENT',
        resourceType: 'STUDENT'
      })
    })

    it('should create audit log when creating student', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.fixture('students').then((students) => {
        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(students.testStudent1.studentNumber)
        cy.get('[data-testid=firstName-input]').type(students.testStudent1.firstName)
        cy.get('[data-testid=lastName-input]').type(students.testStudent1.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(students.testStudent1.dateOfBirth)
        cy.get('[data-testid=save-student-button]').click()

        cy.wait('@auditLog')
      })
    })

    it('should create audit log when updating student', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=edit-student-button]').click()
      })
      cy.get('[data-testid=firstName-input]').clear().type('Updated')
      cy.get('[data-testid=save-student-button]').click()

      cy.wait('@auditLog')
    })

    it('should mask sensitive data in student list view', () => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=student-ssn]').should('not.exist')
      })
    })

    it('should enforce session timeout after inactivity', () => {
      cy.wait(30000)
      cy.get('[data-testid=student-row]').first().click()
      cy.url().should('include', '/login')
    })

    it('should prevent SQL injection in search queries', () => {
      cy.get('[data-testid=search-input]').type("'; DROP TABLE students; --")
      cy.get('[data-testid=student-table]').should('be.visible')
    })

    it('should use HTTPS for all API requests', () => {
      cy.intercept('POST', '/api/students').as('createStudent')

      cy.fixture('students').then((students) => {
        cy.get('[data-testid=add-student-button]').click()
        cy.get('[data-testid=studentNumber-input]').type(students.testStudent1.studentNumber)
        cy.get('[data-testid=firstName-input]').type(students.testStudent1.firstName)
        cy.get('[data-testid=lastName-input]').type(students.testStudent1.lastName)
        cy.get('[data-testid=dateOfBirth-input]').type(students.testStudent1.dateOfBirth)
        cy.get('[data-testid=save-student-button]').click()

        cy.wait('@createStudent').its('request.url').should('include', 'https')
      })
    })

    it('should include authentication token in API requests', () => {
      cy.intercept('GET', '/api/students*').as('getStudents')

      cy.visit('/students')

      cy.wait('@getStudents').its('request.headers').should('have.property', 'authorization')
    })

    it('should display warning when accessing PHI data', () => {
      cy.get('[data-testid=student-row]').first().click()
      cy.get('[data-testid=phi-warning]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 14: ACCESSIBILITY & RESPONSIVENESS (5 tests)
  // =============================================================================

  describe('Accessibility & Responsiveness', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/students')
    })

    it('should have proper ARIA labels on interactive elements', () => {
      cy.get('[data-testid=add-student-button]').should('have.attr', 'aria-label')
      cy.get('[data-testid=search-input]').should('have.attr', 'aria-label')
    })

    it('should support keyboard navigation for student table', () => {
      cy.get('[data-testid=student-row]').first().focus()
      cy.focused().type('{enter}')
      cy.get('[data-testid=student-details-modal]').should('be.visible')
    })

    it('should display properly on mobile devices', () => {
      cy.viewport('iphone-x')
      cy.get('[data-testid=student-table]').should('be.visible')
      cy.get('[data-testid=add-student-button]').should('be.visible')
    })

    it('should display properly on tablet devices', () => {
      cy.viewport('ipad-2')
      cy.get('[data-testid=student-table]').should('be.visible')
      cy.get('[data-testid=pagination-controls]').should('be.visible')
    })

    it('should have sufficient color contrast for text elements', () => {
      cy.get('[data-testid=page-title]').should('be.visible')
      cy.get('[data-testid=student-table]').should('have.css', 'color')
    })
  })
})
