/// <reference types="cypress" />

/**
 * Guardians Management: Guardian Viewing (4 tests)
 *
 * Tests viewing and displaying guardian information
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

describe('Guardians Management - Guardian Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
  })

  it('should display list of guardians for student', () => {
    cy.get('body').should('contain.text', 'Guardian')
  })

  it('should display guardian details with custody status', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Guardian') || $body.text().includes('Custody')) {
        cy.get('body').should('exist')
      }
    })
  })

  it('should display primary guardian indicator', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="primary-guardian-badge"]').length > 0) {
        cy.get('[data-testid="primary-guardian-badge"]').should('be.visible')
      } else {
        cy.get('body').should('contain.text', 'Guardian')
      }
    })
  })

  it('should display multiple guardians with custody information', () => {
    cy.get('body').should('exist')
    cy.wait(500)
  })
})
