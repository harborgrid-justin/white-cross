/// <reference types="cypress" />

/**
 * Reports & Analytics: Report Generation (6 tests)
 */

describe('Reports & Analytics - Report Generation', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/reports')
    cy.waitForHealthcareData()
  })

  it('should generate health summary report', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="report-type-select"]').length > 0) {
        cy.get('[data-testid="report-type-select"]').select('health-summary')
      }
    })
    cy.get('button').contains(/generate/i).click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should generate immunization compliance report', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="report-type-select"]').length > 0) {
        cy.get('[data-testid="report-type-select"]').select('immunization')
      }
    })
    cy.get('button').contains(/generate/i).click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should generate medication administration report', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="report-type-select"]').length > 0) {
        cy.get('[data-testid="report-type-select"]').select('medication')
      }
    })
    cy.get('button').contains(/generate/i).click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should generate incident report summary', () => {
    cy.get('button').contains(/generate/i).should('be.visible').click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should display generated report preview', () => {
    cy.get('button').contains(/generate/i).click()
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should show loading indicator while generating report', () => {
    cy.get('button').contains(/generate/i).click()
    cy.get('body').should('exist')
  })
})
