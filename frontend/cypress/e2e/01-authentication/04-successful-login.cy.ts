/// <reference types="cypress" />

/**
 * Authentication: Successful Login (15 tests)
 *
 * Tests successful login scenarios for different user types
 */

describe('Authentication - Successful Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should successfully login as admin', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should successfully login as nurse', () => {
    cy.get('[data-cy=email-input]').type('nurse@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should successfully login as counselor', () => {
    cy.get('[data-cy=email-input]').type('counselor@centralhigh.edu')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should successfully login as viewer', () => {
    cy.get('[data-cy=email-input]').type('viewer@centralhigh.edu')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should store authentication token after login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token')
      expect(token).to.not.be.null
      expect(token).to.be.a('string')
    })
  })

  it('should store user information after login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.window().then((win) => {
      const user = win.localStorage.getItem('user')
      expect(user).to.not.be.null
    })
  })

  it('should display user name after login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=user-name]').should('be.visible')
  })

  it('should display user role badge after login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=user-role-badge]').should('contain', 'Admin')
  })

  it('should redirect to dashboard after successful login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy=dashboard-title]').should('be.visible')
  })

  it('should redirect to intended page after login', () => {
    cy.visit('/students')
    cy.url().should('include', '/login')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/students')
  })

  it('should remember user when remember me is checked', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=remember-me-checkbox]').check()
    cy.get('[data-cy=login-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('rememberMe')).to.eq('true')
    })
  })

  it('should set session cookie after login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.getCookie('session').should('exist')
  })

  it('should clear login form after successful login', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')

    cy.visit('/login')
    cy.get('[data-cy=email-input]').should('have.value', '')
  })

  it('should create audit log entry for login', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'LOGIN',
      resourceType: 'USER'
    })
  })

  it('should handle case-insensitive email login', () => {
    cy.get('[data-cy=email-input]').type('ADMIN@WHITECROSS.HEALTH')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
})
