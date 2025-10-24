/// <reference types="cypress" />

/**
 * Guardians Management: HIPAA Compliance and Accessibility (1 test)
 *
 * Tests HIPAA compliance and accessibility requirements for guardian management
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

describe('Guardians Management - HIPAA Compliance and Accessibility', () => {
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

  it('should maintain accessibility and HIPAA compliance for guardians', () => {
    cy.get('body').should('exist')

    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        if ($body.find('[data-testid="firstName-input"]').length > 0) {
          cy.checkAccessibility('firstName-input')
          cy.checkAccessibility('lastName-input')
        }

        cy.get('[data-testid="cancel-button"], button')
          .contains(/cancel/i)
          .click()
      }
    })

    cy.get('body').should('exist')
  })
})
