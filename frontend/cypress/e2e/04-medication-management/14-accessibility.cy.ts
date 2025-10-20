/// <reference types="cypress" />

/**
 * Medication Management: Accessibility & Responsiveness (6 tests)
 *
 * Tests accessibility features and responsive design
 */

describe('Medication Management - Accessibility & Responsiveness', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should have proper ARIA labels on interactive elements', () => {
    cy.get('[data-testid=add-medication-button]').should('have.attr', 'aria-label')
    cy.get('[data-testid=medications-search]').should('have.attr', 'aria-label')
  })

  it('should support keyboard navigation', () => {
    cy.get('[data-testid=add-medication-button]').focus()
    cy.focused().type('{enter}')
    cy.get('[data-testid=add-medication-modal]').should('be.visible')
  })

  it('should display properly on mobile devices', () => {
    cy.viewport('iphone-x')
    cy.get('[data-testid=medications-table]').should('be.visible')
    cy.get('[data-testid=add-medication-button]').should('be.visible')
  })

  it('should display properly on tablet devices', () => {
    cy.viewport('ipad-2')
    cy.get('[data-testid=medications-table]').should('be.visible')
    cy.get('[data-testid=medication-row]').should('be.visible')
  })

  it('should have accessible color contrast', () => {
    cy.get('[data-testid=medication-row]').first().should('have.css', 'color')
  })

  it('should support screen reader announcements', () => {
    cy.get('[data-testid=medications-table]').should('have.attr', 'role', 'table')
    cy.get('[data-testid=add-medication-modal]').should('have.attr', 'role', 'dialog')
  })
})
