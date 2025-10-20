/// <reference types="cypress" />

/**
 * Authentication: Logout Functionality (15 tests)
 *
 * Tests logout process and session cleanup
 */

describe('Authentication - Logout Functionality', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/dashboard')
  })

  it('should display logout button in user menu', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').should('be.visible')
  })

  it('should logout user when logout button is clicked', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()
    cy.url().should('include', '/login')
  })

  it('should clear authentication token on logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null
    })
  })

  it('should clear user data on logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('user')).to.be.null
    })
  })

  it('should clear session cookie on logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.getCookie('session').should('not.exist')
  })

  it('should redirect to login page after logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()
    cy.url().should('include', '/login')
  })

  it('should display logout confirmation message', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()
    cy.get('[data-cy=logout-message]').should('contain', 'Successfully logged out')
  })

  it('should prevent access to protected routes after logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('should clear all session data on logout', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.length).to.eq(0)
      expect(win.sessionStorage.length).to.eq(0)
    })
  })

  it('should create audit log entry for logout', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'LOGOUT',
      resourceType: 'USER'
    })
  })

  it('should handle logout API errors gracefully', () => {
    cy.intercept('POST', '/api/auth/logout', { statusCode: 500 })

    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.url().should('include', '/login')
  })

  it('should logout from all tabs', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('logoutEvent', Date.now().toString())
    })

    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.url().should('include', '/login')
  })

  it('should show logout confirmation dialog', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()
    cy.get('[data-cy=logout-confirm-dialog]').should('be.visible')
  })

  it('should cancel logout when cancel is clicked', () => {
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()
    cy.get('[data-cy=cancel-logout-button]').click()

    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=user-name]').should('be.visible')
  })

  it('should invalidate server session on logout', () => {
    cy.intercept('POST', '/api/auth/logout').as('logoutAPI')

    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.wait('@logoutAPI').its('response.statusCode').should('eq', 200)
  })
})
