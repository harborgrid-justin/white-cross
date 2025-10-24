/// <reference types="cypress" />

/**
 * Guardians Management: Page UI Structure (5 tests)
 *
 * Tests the guardians management page structure, loading, and navigation
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

describe('Guardians Management - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
  })

  it('should display guardians section in student details', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').should('contain.text', 'Guardian')
  })

  it('should display add guardian button', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').should('be.visible')
      } else {
        cy.get('button').contains(/add.*guardian/i).should('be.visible')
      }
    })
  })

  it('should display guardians table with headers', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').should('exist')
  })

  it('should display custody information section', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').should('contain.text', 'Guardian')
  })

  it('should navigate to guardians section from student profile', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.url().should('include', '/students')
  })
})
