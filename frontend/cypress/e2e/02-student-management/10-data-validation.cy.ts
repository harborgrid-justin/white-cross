/// <reference types="cypress" />

/**
 * Student Management: Data Validation & Error Handling (15 tests)
 *
 * Tests input validation and error handling
 */

describe('Student Management - Data Validation & Error Handling', () => {
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
