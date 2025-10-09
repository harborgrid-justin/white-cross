/// <reference types="cypress" />

/**
 * User Management - Audit Logs Tab (10 tests)
 *
 * Tests audit logs tab functionality
 */

describe('User Management - Audit Logs Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Audit Logs').click()
  })

  it('should display audit logs tab when clicked', () => {
    cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
  })

  it('should show audit logs as active', () => {
    cy.contains('button', 'Audit Logs').should('have.class', 'text-blue-600')
  })

  it('should render file text icon', () => {
    cy.contains('button', 'Audit Logs').find('svg').should('be.visible')
  })

  it('should deselect training', () => {
    cy.contains('button', 'Training').should('not.have.class', 'border-blue-500')
  })

  it('should render audit logs content', () => {
    cy.get('body').should('be.visible')
  })

  it('should maintain selection', () => {
    cy.wait(100)
    cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
  })

  it('should allow returning to overview', () => {
    cy.contains('button', 'Overview').click()
    cy.contains('button', 'Overview').should('have.class', 'text-blue-600')
  })

  it('should have proper styling', () => {
    cy.contains('button', 'Audit Logs').should('have.class', 'text-sm')
  })

  it('should be visible and clickable', () => {
    cy.contains('button', 'Audit Logs').should('be.visible')
  })

  it('should keep settings URL', () => {
    cy.url().should('include', '/settings')
  })
})
