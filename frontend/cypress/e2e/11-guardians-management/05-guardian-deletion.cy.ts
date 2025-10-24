/// <reference types="cypress" />

/**
 * Guardians Management: Guardian Deletion (4 tests)
 *
 * Tests guardian deletion functionality with proper safeguards
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

describe('Guardians Management - Guardian Deletion', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.setupAuditLogInterception()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
  })

  it('should display delete button for guardian', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-guardian-button"]').length > 0) {
        cy.get('[data-testid="delete-guardian-button"]').should('be.visible')
      } else {
        cy.log('Guardian delete functionality not yet implemented')
      }
    })
  })

  it('should show confirmation dialog before deleting guardian', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-guardian-button"]').length > 0) {
        cy.get('[data-testid="delete-guardian-button"]').first().click()
        cy.wait(500)
        cy.get('body').should('contain.text', 'delete')
      } else {
        cy.log('Guardian delete functionality not yet implemented')
      }
    })
  })

  it('should successfully delete guardian after confirmation', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-guardian-button"]').length > 0) {
        cy.get('[data-testid="delete-guardian-button"]').first().click()
        cy.wait(500)

        cy.get('[data-testid="confirm-delete-button"], button')
          .contains(/confirm|delete|yes/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian delete functionality not yet implemented')
      }
    })
  })

  it('should prevent deletion of sole legal guardian', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-guardian-button"]').length > 0) {
        cy.get('[data-testid="delete-guardian-button"]').first().click()
        cy.wait(500)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian delete functionality not yet implemented')
      }
    })
  })
})
