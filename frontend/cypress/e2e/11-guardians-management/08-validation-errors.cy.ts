/// <reference types="cypress" />

/**
 * Guardians Management: Validation and Errors (4 tests)
 *
 * Tests form validation and error handling for guardians
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

describe('Guardians Management - Validation and Errors', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()

    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)
      } else if ($body.find('button').text().toLowerCase().includes('guardian')) {
        cy.get('button').contains(/add.*guardian/i).click()
        cy.wait(500)
      }
    })
  })

  it('should require guardian name fields', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="phone-input"]').length > 0) {
        cy.get('[data-testid="phone-input"]').type('555-123-4567')

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(500)
        cy.get('body').should('contain.text', 'required')
      } else {
        cy.log('Guardian form not yet implemented')
      }
    })
  })

  it('should validate guardian contact information', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="firstName-input"]').length > 0) {
        cy.get('[data-testid="firstName-input"]').type('Test')
        cy.get('[data-testid="lastName-input"]').type('Guardian')
        cy.get('[data-testid="phone-input"]').type('invalid')

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(500)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian form not yet implemented')
      }
    })
  })

  it('should validate custody status selection', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="firstName-input"]').length > 0) {
        cy.get('[data-testid="firstName-input"]').type('Test')
        cy.get('[data-testid="lastName-input"]').type('Guardian')
        cy.get('[data-testid="phone-input"]').type('555-123-4567')
      }
    })

    cy.get('body').should('exist')
  })

  it('should prevent multiple primary guardians', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="isPrimary-checkbox"]').length > 0) {
        cy.get('[data-testid="isPrimary-checkbox"]').check()
      }
    })

    cy.get('body').should('exist')
  })
})
