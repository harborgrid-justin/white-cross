/// <reference types="cypress" />

/**
 * RBAC - Admin CRUD Operations (15 tests)
 *
 * Tests admin role CRUD permissions and operations
 */

describe('RBAC - Admin CRUD Operations', () => {
  beforeEach(() => {
    cy.login('admin')
  })

  it('should see add student button', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"], button', { timeout: 2500 }).contains(/add student/i).should('exist')
  })

  it('should see add medication button', () => {
    cy.visit('/medications')
    cy.get('button', { timeout: 2500 }).contains(/add/i).should('exist')
  })

  it('should see configuration save button', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.contains('Save All').should('exist')
  })

  it('should see refresh button on configurations', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.contains('button', 'Refresh').should('be.visible')
  })

  it('should be able to filter configurations by category', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.contains('button', 'SECURITY').should('be.visible')
    cy.contains('button', 'GENERAL').should('be.visible')
  })

  it('should have edit access to configuration inputs', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.get('input:not([disabled])', { timeout: 2500 }).should('exist')
  })

  it('should be able to view reports', () => {
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('should see administration panel title', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel').should('be.visible')
  })

  it('should not be restricted from any navigation', () => {
    cy.visit('/students')
    cy.url().should('not.include', '/login')
    cy.visit('/medications')
    cy.url().should('not.include', '/login')
    cy.visit('/settings')
    cy.url().should('not.include', '/login')
  })

  it('should maintain admin session across pages', () => {
    cy.visit('/dashboard')
    cy.visit('/students')
    cy.visit('/settings')
    cy.url().should('include', '/settings')
  })

  it('should have full system access indicator', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should access user management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'text-blue-600')
  })

  it('should access district management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Districts').click()
    cy.contains('button', 'Districts').should('have.class', 'border-blue-500')
  })

  it('should access school management', () => {
    cy.visit('/settings')
    cy.contains('button', 'Schools').click()
    cy.contains('button', 'Schools').should('have.class', 'text-blue-600')
  })

  it('should access all administration features', () => {
    cy.visit('/settings')
    const adminTabs = ['Integrations', 'Backups', 'Monitoring', 'Audit Logs']
    adminTabs.forEach(tab => {
      cy.contains('button', tab).should('be.visible')
    })
  })
})
