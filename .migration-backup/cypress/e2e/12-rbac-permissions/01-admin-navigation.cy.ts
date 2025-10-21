/// <reference types="cypress" />

/**
 * RBAC - Admin Navigation Access (10 tests)
 *
 * Tests admin role navigation permissions
 *
 * User Accounts: admin@school.edu / AdminPassword123! (ADMIN)
 */

describe('RBAC - Admin Navigation Access', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/dashboard')
  })

  it('should access dashboard', () => {
    cy.url().should('include', '/dashboard')
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should access students page', () => {
    cy.visit('/students')
    cy.url({ timeout: 2500 }).should('include', '/students')
  })

  it('should access medications page', () => {
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('include', '/medications')
  })

  it('should access health records page', () => {
    cy.visit('/health-records')
    cy.url().should('include', '/health-records')
  })

  it('should access incidents page', () => {
    cy.visit('/incidents')
    cy.url().should('include', '/incidents')
  })

  it('should access reports page', () => {
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('should access settings page', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel', { timeout: 2500 }).should('be.visible')
  })

  it('should access users tab in settings', () => {
    cy.visit('/settings')
    cy.contains('button', 'Users').click()
    cy.contains('button', 'Users').should('have.class', 'border-blue-500')
  })

  it('should access configuration tab in settings', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.contains('System Configuration').should('be.visible')
  })

  it('should access all settings tabs', () => {
    cy.visit('/settings')
    const tabs = ['Overview', 'Districts', 'Schools', 'Users', 'Configuration']
    tabs.forEach(tab => {
      cy.contains('button', tab).should('be.visible')
    })
  })
})
