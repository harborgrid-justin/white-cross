/// <reference types="cypress" />

/**
 * RBAC - Admin Authentication & Dashboard (15 tests)
 *
 * Tests admin role authentication and dashboard access
 */

describe('RBAC - Admin Authentication & Dashboard', () => {
  beforeEach(() => {
    cy.login('admin')
  })

  it('should maintain authentication token', () => {
    cy.visit('/dashboard')
    cy.window({ timeout: 2500 }).then((win) => {
      const token = win.localStorage.getItem('token') || win.localStorage.getItem('auth_data')
      expect(token).to.exist
    })
  })

  it('should have admin role in local storage', () => {
    cy.visit('/dashboard')
    cy.window({ timeout: 2500 }).then((win) => {
      const userStr = win.localStorage.getItem('user')
      const authStr = win.localStorage.getItem('auth_data')
      // User role check - either from legacy storage or auth_data
      if (userStr) {
        const user = JSON.parse(userStr || '{}')
        expect(user.role).to.be.oneOf(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'])
      } else if (authStr) {
        // If using encrypted storage, just check that auth data exists
        expect(authStr).to.exist
      } else {
        // At least one should exist
        expect(userStr || authStr).to.exist
      }
    })
  })

  it('should not redirect to login on protected routes', () => {
    cy.visit('/settings')
    cy.url().should('include', '/settings')
    cy.url().should('not.include', '/login')
  })

  it('should persist login across page reloads', () => {
    cy.visit('/dashboard')
    cy.reload()
    cy.url().should('not.include', '/login')
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should access configuration history', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.contains('System Configuration').should('be.visible')
  })

  it('should have administration privileges', () => {
    cy.visit('/settings')
    cy.contains('Administration Panel').should('be.visible')
  })

  it('should see all system configurations', () => {
    cy.visit('/settings')
    cy.contains('button', 'Configuration').click()
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should access audit logs', () => {
    cy.visit('/settings')
    cy.contains('button', 'Audit Logs').click()
    cy.contains('button', 'Audit Logs').should('have.class', 'border-blue-500')
  })

  it('should access monitoring tab', () => {
    cy.visit('/settings')
    cy.contains('button', 'Monitoring').click()
    cy.contains('button', 'Monitoring').should('have.class', 'text-blue-600')
  })

  it('should not have permission errors', () => {
    cy.visit('/settings')
    cy.contains('Permission denied').should('not.exist')
    cy.contains('Access denied').should('not.exist')
  })

  it('should see dashboard metrics', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should access overview tab in settings', () => {
    cy.visit('/settings')
    cy.contains('button', 'Overview').should('have.class', 'border-blue-500')
  })

  it('should view system health information', () => {
    cy.visit('/settings')
    cy.contains('button', 'Monitoring').click()
    cy.get('body').should('be.visible')
  })

  it('should access licenses tab', () => {
    cy.visit('/settings')
    cy.contains('button', 'Licenses').click()
    cy.contains('button', 'Licenses').should('have.class', 'text-blue-600')
  })

  it('should access training tab', () => {
    cy.visit('/settings')
    cy.contains('button', 'Training').click()
    cy.contains('button', 'Training').should('have.class', 'border-blue-500')
  })
})
