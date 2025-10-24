/// <reference types="cypress" />

/**
 * Reports & Analytics: Page UI Structure (5 tests)
 *
 * Tests the reports page structure, loading, and navigation
 *
 * @module ReportsAnalyticsTests
 * @category Reports
 * @priority High
 */

describe('Reports & Analytics - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/reports')
    cy.waitForHealthcareData()
  })

  it('should load reports page successfully', () => {
    cy.url().should('include', '/reports')
    cy.get('body').should('be.visible')
  })

  it('should display report type selection dropdown', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="report-type-select"]').length > 0) {
        cy.get('[data-testid="report-type-select"]').should('be.visible')
      } else {
        cy.get('select, [role="combobox"]').should('have.length.at.least', 1)
      }
    })
  })

  it('should display date range filters', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="start-date-input"]').length > 0) {
        cy.get('[data-testid="start-date-input"]').should('be.visible')
        cy.get('[data-testid="end-date-input"]').should('be.visible')
      } else {
        cy.get('input[type="date"]').should('have.length.at.least', 1)
      }
    })
  })

  it('should display generate report button', () => {
    cy.get('button').contains(/generate|create.*report/i).should('be.visible')
  })

  it('should display export options section', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="export-options"]').length > 0) {
        cy.get('[data-testid="export-options"]').should('be.visible')
      } else {
        cy.get('body').should('contain.text', 'Export')
      }
    })
  })
})
