/// <reference types="cypress" />

/**
 * User Management - Configuration Tab (15 tests)
 *
 * Tests system configuration tab functionality
 */

describe('User Management - Configuration Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
  })

  it('should display configuration tab when clicked', () => {
    cy.contains('button', 'Configuration').should('have.class', 'border-blue-500')
  })

  it('should show configuration as active tab', () => {
    cy.contains('button', 'Configuration').should('have.class', 'text-blue-600')
  })

  it('should render shield icon for configuration', () => {
    cy.contains('button', 'Configuration').find('svg').should('be.visible')
  })

  it('should show system configuration content', () => {
    cy.contains('System Configuration').should('be.visible')
  })

  it('should display category filter buttons', () => {
    cy.contains('button', 'ALL').should('be.visible')
    cy.contains('button', 'GENERAL').should('be.visible')
    cy.contains('button', 'SECURITY').should('be.visible')
  })

  it('should have refresh button', () => {
    cy.contains('button', 'Refresh').should('be.visible')
  })

  it('should have save button', () => {
    cy.contains('Save All').should('exist')
  })

  it('should display configuration groups', () => {
    cy.get('.card').should('exist')
  })

  it('should allow filtering by category', () => {
    cy.contains('button', 'SECURITY').click()
    cy.contains('button', 'SECURITY').should('have.class', 'bg-blue-600')
  })

  it('should show database-driven message', () => {
    cy.contains('Database-driven configuration management').should('be.visible')
  })

  it('should display configuration inputs', () => {
    cy.get('input, select, textarea').should('exist')
  })

  it('should have proper spacing on config page', () => {
    cy.get('.space-y-6').should('exist')
  })

  it('should render without errors', () => {
    cy.get('body').should('be.visible')
  })

  it('should maintain URL', () => {
    cy.url().should('include', '/settings')
  })

  it('should be accessible to admin', () => {
    cy.contains('System Configuration').should('be.visible')
  })
})
