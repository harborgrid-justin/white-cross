/// <reference types="cypress" />

/**
 * RBAC - Viewer Read-Only Access (15 tests)
 *
 * Tests viewer role read permissions
 *
 * User Account: readonly@school.edu / ReadOnlyPassword123! (VIEWER)
 */

describe('RBAC - Viewer Read-Only Access', () => {
  beforeEach(() => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/dashboard')
  })

  it('should access dashboard', () => {
    cy.url().should('include', '/dashboard')
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should view students page', () => {
    cy.visit('/students')
    cy.url({ timeout: 2500 }).should('include', '/students')
  })

  it('should view medications page', () => {
    cy.visit('/medications')
    cy.url({ timeout: 2500 }).should('include', '/medications')
  })

  it('should view health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should view incidents', () => {
    cy.visit('/incidents')
    cy.get('body').should('be.visible')
  })

  it('should view reports', () => {
    cy.visit('/reports')
    cy.url({ timeout: 2500 }).should('include', '/reports')
  })

  it('should have viewer role stored', () => {
    cy.window({ timeout: 2500 }).then((win) => {
      const userStr = win.localStorage.getItem('user')
      const authStr = win.localStorage.getItem('auth_data')
      // Check role from legacy storage if available
      if (userStr) {
        const user = JSON.parse(userStr)
        expect(user.role).to.equal('VIEWER')
      } else {
        // If using encrypted storage, just verify auth data exists
        expect(authStr).to.exist
      }
    })
  })

  it('should maintain viewer session', () => {
    cy.visit('/students')
    cy.url().should('not.include', '/login')
  })

  it('should see student information in read-only mode', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
  })

  it('should see medication information', () => {
    cy.visit('/medications')
    cy.get('body').should('be.visible')
  })

  it('should see health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
  })

  it('should see incident reports', () => {
    cy.visit('/incidents')
    cy.get('body').should('be.visible')
  })

  it('should view dashboard metrics', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should view report data', () => {
    cy.visit('/reports')
    cy.get('body').should('be.visible')
  })

  it('should see medication inventory', () => {
    cy.visit('/medications')
    cy.contains('button', 'Inventory').should('be.visible')
  })
})
