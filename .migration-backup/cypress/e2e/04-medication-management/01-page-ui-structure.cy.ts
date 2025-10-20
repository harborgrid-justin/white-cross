/// <reference types="cypress" />

/**
 * Medication Management: Page Load & UI Structure (10 tests)
 *
 * Tests page load, navigation tabs, and overall UI structure
 */

describe('Medication Management - Page Load & UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
  })

  it('should display the medications page with correct title', () => {
    cy.get('[data-testid=medications-title]').should('contain', 'Medication Management')
    cy.url().should('include', '/medications')
  })

  it('should display all navigation tabs', () => {
    cy.get('[data-testid=overview-tab]').should('be.visible')
    cy.get('[data-testid=medications-tab]').should('be.visible')
    cy.get('[data-testid=inventory-tab]').should('be.visible')
    cy.get('[data-testid=reminders-tab]').should('be.visible')
    cy.get('[data-testid=adverse-reactions-tab]').should('be.visible')
  })

  it('should display overview cards on default view', () => {
    cy.get('[data-testid=overview-cards]').should('be.visible')
    cy.get('[data-testid=prescription-card]').should('be.visible')
    cy.get('[data-testid=inventory-card]').should('be.visible')
    cy.get('[data-testid=safety-card]').should('be.visible')
    cy.get('[data-testid=reminders-card]').should('be.visible')
  })

  it('should load without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/medications')
  })

  it('should display add medication button in medications tab', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=add-medication-button]').should('be.visible')
  })

  it('should display medications table', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medications-table]').should('be.visible')
  })

  it('should display table column headers', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medication-name-column]').should('contain', 'Medication')
    cy.get('[data-testid=dosage-form-column]').should('contain', 'Dosage Form')
    cy.get('[data-testid=strength-column]').should('contain', 'Strength')
    cy.get('[data-testid=stock-column]').should('contain', 'Stock')
  })

  it('should display search functionality', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=medications-search]').should('be.visible')
  })

  it('should display filter options', () => {
    cy.get('[data-testid=medications-tab]').click()
    cy.get('[data-testid=filter-button]').should('be.visible')
  })

  it('should display loading state initially', () => {
    cy.intercept('GET', '/api/medications*', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    }).as('getMedications')

    cy.visit('/medications')
    cy.get('[data-testid=loading-spinner]').should('be.visible')
  })
})
