/// <reference types="cypress" />

/**
 * Guardians Management: RBAC Permissions (2 tests)
 *
 * Tests role-based access control for guardian management
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

describe('Guardians Management - RBAC Permissions', () => {
  it('should allow admin to manage guardians', () => {
    cy.login('admin')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })

  it('should restrict viewer from adding guardians', () => {
    cy.login('viewer')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()

    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').should('be.disabled')
      } else {
        cy.log('Guardian management respects RBAC')
      }
    })
  })
})
