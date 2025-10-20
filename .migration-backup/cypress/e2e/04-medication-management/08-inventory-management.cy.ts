/// <reference types="cypress" />

/**
 * Medication Management: Inventory Management (15 tests)
 *
 * Tests inventory tracking, stock management, and expiration monitoring
 */

describe('Medication Management - Inventory Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=inventory-tab]').click()
  })

  it('should display inventory table', () => {
    cy.get('[data-testid=inventory-table]').should('be.visible')
  })

  it('should display stock levels', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=stock-level]').should('be.visible')
    })
  })

  it('should display expiration dates', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=expiration-date]').should('be.visible')
    })
  })

  it('should show low stock warnings', () => {
    cy.get('[data-testid=low-stock-warning]').should('exist')
  })

  it('should show expired medications warning', () => {
    cy.get('[data-testid=expired-warning]').should('exist')
  })

  it('should allow updating stock quantity', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=update-stock-button]').click()
    })

    cy.get('[data-testid=stock-update-modal]').should('be.visible')
    cy.get('[data-testid=new-quantity-input]').clear().type('50')
    cy.get('[data-testid=batch-number-input]').type('BATCH-001')
    cy.get('[data-testid=expiration-date-input]').type('2025-12-31')
    cy.get('[data-testid=save-stock-update]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Inventory updated successfully')
  })

  it('should validate stock quantity is positive', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=update-stock-button]').click()
    })

    cy.get('[data-testid=new-quantity-input]').clear().type('-10')
    cy.get('[data-testid=save-stock-update]').click()

    cy.get('[data-testid=quantity-error]').should('contain', 'Quantity must be positive')
  })

  it('should validate expiration date is in future', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=update-stock-button]').click()
    })

    cy.get('[data-testid=new-quantity-input]').type('50')
    cy.get('[data-testid=expiration-date-input]').type('2020-01-01')
    cy.get('[data-testid=save-stock-update]').click()

    cy.get('[data-testid=expiration-error]').should('contain', 'Expiration date must be in the future')
  })

  it('should display batch number', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=batch-number]').should('be.visible')
    })
  })

  it('should allow filtering by expiration status', () => {
    cy.get('[data-testid=filter-expiration]').select('Expiring Soon')
    cy.get('[data-testid=inventory-row]').should('have.length.greaterThan', 0)
  })

  it('should allow filtering by stock level', () => {
    cy.get('[data-testid=filter-stock]').select('Low Stock')
    cy.get('[data-testid=low-stock-warning]').should('exist')
  })

  it('should display reorder level', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=reorder-level]').should('be.visible')
    })
  })

  it('should allow setting reorder level', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=set-reorder-button]').click()
    })

    cy.get('[data-testid=reorder-modal]').should('be.visible')
    cy.get('[data-testid=reorder-level-input]').type('20')
    cy.get('[data-testid=save-reorder-button]').click()

    cy.get('[data-testid=success-message]').should('contain', 'Reorder level updated')
  })

  it('should export inventory report', () => {
    cy.get('[data-testid=export-inventory-button]').click()
    cy.readFile('cypress/downloads/inventory-report.csv').should('exist')
  })

  it('should display inventory value', () => {
    cy.get('[data-testid=inventory-row]').first().within(() => {
      cy.get('[data-testid=unit-cost]').should('be.visible')
    })
  })
})
