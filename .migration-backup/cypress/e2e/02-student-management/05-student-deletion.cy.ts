/// <reference types="cypress" />

/**
 * Student Management: Student Deletion & Archiving (15 tests)
 *
 * Tests CRUD Delete operations and archiving functionality
 */

describe('Student Management - Student Deletion & Archiving (CRUD - Delete)', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display delete button for each student', () => {
    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=delete-student-button]').scrollIntoView().should('be.visible')
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
    // Use student without medications (fourth student, Sophia Miller)
    cy.get('[data-testid=student-row]').eq(3).within(() => {
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
    // Get initial row count properly using Cypress commands
    cy.get('[data-testid=student-row]').its('length').then((initialRowCount) => {
      cy.get('[data-testid=student-row]').first().within(() => {
        cy.get('[data-testid=delete-student-button]').click()
      })

      cy.get('[data-testid=cancel-delete-button]').click()
      cy.get('[data-testid=student-row]').should('have.length', initialRowCount)
    })
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
    // Use student without medications (fourth student, Sophia Miller)
    cy.get('[data-testid=student-row]').eq(3).within(() => {
      cy.get('[data-testid=delete-student-button]').click()
    })
    cy.get('[data-testid=confirm-delete-button]').click()
    cy.verifySuccess(/archived/i)
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

    // Use student without medications (fourth student, Sophia Miller)
    cy.get('[data-testid=student-row]').eq(3).within(() => {
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
    cy.verifyError(/cannot archive.*active medications/i)
  })
})
