/// <reference types="cypress" />

describe('Student Management', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display the students page with proper elements', () => {
    cy.get('[data-testid=page-title]').should('contain', 'Student Management')
    cy.get('[data-testid=add-student-button]').should('be.visible')
    cy.get('[data-testid=search-input]').should('be.visible')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should allow adding a new student', () => {
    cy.fixture('students').then((students) => {
      const newStudent = students.testStudent1

      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=student-form-modal]').should('be.visible')

      cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
      cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
      cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
      cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
      cy.get('[data-testid=grade-select]').select(newStudent.grade)
      cy.get('[data-testid=gender-select]').select(newStudent.gender)

      cy.get('[data-testid=save-student-button]').click()

      // Verify student appears in the table
      cy.get('[data-testid=student-table]').should('contain', newStudent.firstName)
      cy.get('[data-testid=student-table]').should('contain', newStudent.lastName)
      cy.get('[data-testid=student-table]').should('contain', newStudent.studentNumber)
    })
  })

  it('should allow searching for students', () => {
    cy.fixture('students').then((students) => {
      const student = students.testStudent2

      // First add a student
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type(student.studentNumber)
      cy.get('[data-testid=firstName-input]').type(student.firstName)
      cy.get('[data-testid=lastName-input]').type(student.lastName)
      cy.get('[data-testid=dateOfBirth-input]').type(student.dateOfBirth)
      cy.get('[data-testid=grade-select]').select(student.grade)
      cy.get('[data-testid=save-student-button]').click()

      // Test search functionality
      cy.get('[data-testid=search-input]').type(student.firstName)
      cy.get('[data-testid=student-table]').should('contain', student.firstName)
      cy.get('[data-testid=student-table]').should('contain', student.lastName)

      // Clear search and verify all students are shown
      cy.get('[data-testid=search-input]').clear()
      cy.get('[data-testid=student-table]').should('be.visible')
    })
  })

  it('should allow viewing student details', () => {
    // Click on existing student row to view details
    cy.get('[data-testid=student-row]').first().click()

    // Verify student details modal
    cy.get('[data-testid=student-details-modal]').should('be.visible')
    cy.get('[data-testid=student-name]').should('be.visible')
    cy.get('[data-testid=student-id]').should('be.visible')
    cy.get('[data-testid=student-grade]').should('be.visible')
  })

  it('should handle form validation errors', () => {
    cy.get('[data-testid=add-student-button]').click()
    cy.get('[data-testid=student-form-modal]').should('be.visible')

    // Try to save without required fields
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=studentNumber-error]').should('contain', 'Student number is required')
    cy.get('[data-testid=firstName-error]').should('contain', 'First name is required')
    cy.get('[data-testid=lastName-error]').should('contain', 'Last name is required')
  })

  it('should show filters when filter button is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=filter-dropdown]').should('be.visible')
    cy.get('[data-testid=grade-filter-select]').should('be.visible')
    cy.get('[data-testid=active-status-filter]').should('be.visible')
  })

  it('should display medical alerts for students with allergies', () => {
    // Verify allergy indicators are shown
    cy.get('[data-testid=allergy-indicator]').should('exist')
  })

  it('should display medication indicators for students on medications', () => {
    // Verify medication indicators are shown
    cy.get('[data-testid=medication-indicator]').should('exist')
  })

  // EDITING AND UPDATING STUDENTS
  it('should allow editing a student\'s basic information', () => {
    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=edit-student-button]').click()
    })

    cy.get('[data-testid=student-form-modal]').should('be.visible')
    cy.get('[data-testid=firstName-input]').clear().type('UpdatedName')
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=student-table]').should('contain', 'UpdatedName')
  })

  it('should validate student number uniqueness when editing', () => {
    // Try to edit student with duplicate student number
    cy.get('[data-testid=student-row]').eq(1).within(() => {
      cy.get('[data-testid=edit-student-button]').click()
    })

    cy.get('[data-testid=studentNumber-input]').clear().type('STU100')
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=error-message]').should('contain', 'Student number already exists')
  })

  it('should allow updating student grade level', () => {
    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=edit-student-button]').click()
    })

    cy.get('[data-testid=grade-select]').select('10')
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=student-row]').first().should('contain', '10')
  })

  it('should allow updating student emergency contact information', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=edit-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-firstName]').clear().type('NewContact')
    cy.get('[data-testid=emergency-contact-phone]').clear().type('555-9999')
    cy.get('[data-testid=save-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-name]').should('contain', 'NewContact')
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

  // DELETING AND ARCHIVING STUDENTS
  it('should allow soft deleting (archiving) a student', () => {
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

  it('should show archived students when viewing archive', () => {
    cy.get('[data-testid=view-archived-button]').click()
    cy.get('[data-testid=archived-students-list]').should('be.visible')
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

  it('should confirm before deleting a student', () => {
    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=delete-student-button]').click()
    })

    cy.get('[data-testid=confirm-delete-modal]').should('be.visible')
    cy.get('[data-testid=confirm-delete-message]').should('contain', 'Are you sure')
  })

  it('should cancel deletion when user declines confirmation', () => {
    const initialRowCount = Cypress.$('[data-testid=student-row]').length

    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=delete-student-button]').click()
    })

    cy.get('[data-testid=cancel-delete-button]').click()
    cy.get('[data-testid=student-row]').should('have.length', initialRowCount)
  })

  // FILTERING AND SORTING
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

  it('should sort students by last name alphabetically', () => {
    cy.get('[data-testid=sort-by-select]').select('lastName-asc')

    const names: string[] = []
    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).find('[data-testid=student-lastName]').invoke('text').then((currentName) => {
        names.push(currentName.toLowerCase().trim())
      })
    }).then(() => {
      // Verify array is sorted
      for (let i = 1; i < names.length; i++) {
        expect(names[i] >= names[i - 1]).to.be.true
      }
    })
  })

  it('should sort students by grade level', () => {
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

  it('should clear all filters when reset button is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=reset-filters-button]').click()
    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  // SEARCH FUNCTIONALITY
  it('should search students by last name', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.lastName)
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.lastName)
    })
  })

  it('should search students by student number', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.studentNumber)
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.studentNumber)
    })
  })

  it('should show "no results" message when search yields no matches', () => {
    cy.get('[data-testid=search-input]').type('NonexistentStudent12345')
    cy.get('[data-testid=no-results-message]').should('be.visible')
    cy.get('[data-testid=no-results-message]').should('contain', 'No students found')
  })

  it('should debounce search input to prevent excessive API calls', () => {
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

  // PAGINATION
  it('should paginate student list when there are many students', () => {
    cy.get('[data-testid=pagination-controls]').should('be.visible')
    cy.get('[data-testid=next-page-button]').click()
    cy.get('[data-testid=page-indicator]').should('contain', '2')
  })

  it('should show correct number of students per page', () => {
    cy.get('[data-testid=per-page-select]').select('10')
    cy.get('[data-testid=student-row]').should('have.length.at.most', 10)
  })

  it('should disable previous button on first page', () => {
    cy.get('[data-testid=previous-page-button]').should('be.disabled')
  })

  it('should navigate to specific page number', () => {
    cy.get('[data-testid=page-number-3]').click()
    cy.get('[data-testid=page-indicator]').should('contain', '3')
  })

  // BULK OPERATIONS
  it('should allow selecting multiple students', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=student-checkbox]').eq(1).check()
    cy.get('[data-testid=selected-count]').should('contain', '2')
  })

  it('should allow bulk export of selected students', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=student-checkbox]').eq(1).check()
    cy.get('[data-testid=bulk-export-button]').click()

    cy.get('[data-testid=export-format-modal]').should('be.visible')
    cy.get('[data-testid=export-csv-button]').click()

    cy.readFile('cypress/downloads/students.csv').should('exist')
  })

  it('should select all students with select all checkbox', () => {
    cy.get('[data-testid=select-all-checkbox]').check()
    cy.get('[data-testid=student-checkbox]:checked').should('have.length.greaterThan', 0)
  })

  it('should deselect all students when unchecking select all', () => {
    cy.get('[data-testid=select-all-checkbox]').check()
    cy.get('[data-testid=select-all-checkbox]').uncheck()
    cy.get('[data-testid=student-checkbox]:checked').should('have.length', 0)
  })

  // DATA VALIDATION
  it('should validate date of birth is not in the future', () => {
    cy.get('[data-testid=add-student-button]').click()

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const futureDateString = futureDate.toISOString().split('T')[0]

    cy.get('[data-testid=dateOfBirth-input]').type(futureDateString)
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=dateOfBirth-error]').should('contain', 'Date of birth cannot be in the future')
  })

  it('should validate phone number format for emergency contacts', () => {
    cy.get('[data-testid=add-student-button]').click()
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=studentNumber-input]').type('STU999')
      cy.get('[data-testid=firstName-input]').type('Test')
      cy.get('[data-testid=lastName-input]').type('Student')
      cy.get('[data-testid=dateOfBirth-input]').type('2010-01-01')
      cy.get('[data-testid=emergency-contact-phone]').type('invalid-phone')
      cy.get('[data-testid=save-student-button]').click()

      cy.get('[data-testid=emergency-contact-phone-error]').should('contain', 'Invalid phone number format')
    })
  })

  it('should validate student age is within acceptable school range', () => {
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

  // HIPAA COMPLIANCE AND SECURITY
  it('should require authentication to access student management', () => {
    cy.clearCookies()
    cy.visit('/students')
    cy.url().should('include', '/login')
  })

  it('should log audit trail when viewing student details', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=student-row]').first().click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'VIEW_STUDENT',
      resourceType: 'STUDENT'
    })
  })
})
