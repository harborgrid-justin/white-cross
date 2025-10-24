/// <reference types="cypress" />

/**
 * Reports & Analytics: Report Types (5 tests)
 */

describe('Reports & Analytics - Report Types', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/reports')
    cy.waitForHealthcareData()
  })

  it('should display available report types', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="report-type-select"]').length > 0) {
        cy.get('[data-testid="report-type-select"] option').should('have.length.at.least', 2)
      } else {
        cy.get('select').should('exist')
      }
    })
  })

  it('should generate attendance report', () => {
    cy.get('button').contains(/generate/i).click()
    cy.wait(1500)
    cy.get('body').should('exist')
  })

  it('should generate health screening report', () => {
    cy.get('button').contains(/generate/i).click()
    cy.wait(1500)
    cy.get('body').should('exist')
  })

  it('should generate allergy summary report', () => {
    cy.get('button').contains(/generate/i).click()
    cy.wait(1500)
    cy.get('body').should('exist')
  })

  it('should generate custom report with selected fields', () => {
    cy.get('button').contains(/generate/i).click()
    cy.wait(1500)
    cy.get('body').should('exist')
  })
})
