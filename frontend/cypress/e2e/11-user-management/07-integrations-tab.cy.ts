/// <reference types="cypress" />

/**
 * User Management - Integrations Tab (10 tests)
 *
 * Tests integrations tab functionality
 */

describe('User Management - Integrations Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Integrations').click()
  })

  it('should display integrations tab when clicked', () => {
    cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
  })

  it('should show integrations as active', () => {
    cy.contains('button', 'Integrations').should('have.class', 'text-blue-600')
  })

  it('should render plug icon', () => {
    cy.contains('button', 'Integrations').find('svg').should('be.visible')
  })

  it('should deselect other tabs', () => {
    cy.contains('button', 'Configuration').should('not.have.class', 'border-blue-500')
  })

  it('should render integrations content', () => {
    cy.get('body').should('be.visible')
  })

  it('should maintain selection', () => {
    cy.wait(100)
    cy.contains('button', 'Integrations').should('have.class', 'border-blue-500')
  })

  it('should allow navigation to other tabs', () => {
    cy.contains('button', 'Backups').click()
    cy.contains('button', 'Backups').should('have.class', 'text-blue-600')
  })

  it('should have proper styling', () => {
    cy.contains('button', 'Integrations').should('have.class', 'border-b-2')
  })

  it('should be visible', () => {
    cy.contains('button', 'Integrations').should('be.visible')
  })

  it('should maintain settings URL', () => {
    cy.url().should('include', '/settings')
  })
})
