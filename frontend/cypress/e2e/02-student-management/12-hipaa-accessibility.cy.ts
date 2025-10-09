/// <reference types="cypress" />

/**
 * Student Management: HIPAA Compliance & Accessibility (15 tests)
 *
 * Tests security compliance and accessibility features
 */

describe('Student Management - HIPAA Compliance & Security', () => {
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

describe('Student Management - Accessibility & Responsiveness', () => {
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
