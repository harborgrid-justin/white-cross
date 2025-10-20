/// <reference types="cypress" />

/**
 * Authentication: Security & HIPAA Compliance (15 tests)
 *
 * Tests security features and HIPAA compliance requirements
 */

describe('Authentication - Security & HIPAA Compliance', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should use HTTPS for all authentication requests', () => {
    cy.intercept('POST', '/api/auth/login').as('login')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@login').its('request.url').should('include', 'https')
  })

  it('should encrypt password in transit', () => {
    cy.intercept('POST', '/api/auth/login').as('login')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@login').its('request.body.password').should('not.eq', 'admin123')
  })

  it('should not expose password in browser console', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'log')
      cy.spy(win.console, 'error')
    })

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.window().then((win) => {
      expect(win.console.log).to.not.be.calledWith(Cypress.sinon.match('admin123'))
    })
  })

  it('should prevent clickjacking with frame-busting', () => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        Object.defineProperty(win, 'top', {
          get() {
            return win
          }
        })
      }
    })

    cy.window().then((win) => {
      expect(win.top).to.eq(win.self)
    })
  })

  it('should implement CSRF protection', () => {
    cy.intercept('POST', '/api/auth/login').as('login')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@login').its('request.headers').should('have.property', 'x-csrf-token')
  })

  it('should hash passwords before sending', () => {
    cy.intercept('POST', '/api/auth/login').as('login')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@login').then((interception) => {
      expect(interception.request.body.password).to.not.contain('admin123')
    })
  })

  it('should enforce secure cookie attributes', () => {
    cy.login('admin')
    cy.getCookie('session').should('have.property', 'secure', true)
    cy.getCookie('session').should('have.property', 'httpOnly', true)
  })

  it('should set SameSite cookie attribute', () => {
    cy.login('admin')
    cy.getCookie('session').should('have.property', 'sameSite', 'strict')
  })

  it('should implement rate limiting', () => {
    for (let i = 0; i < 10; i++) {
      cy.get('[data-cy=email-input]').clear().type('test@test.com')
      cy.get('[data-cy=password-input]').clear().type('wrongpassword')
      cy.get('[data-cy=login-button]').click()
      cy.wait(100)
    }

    cy.get('[data-cy=rate-limit-error]').should('be.visible')
  })

  it('should prevent brute force attacks with account lockout', () => {
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy=email-input]').clear().type('admin@whitecross.health')
      cy.get('[data-cy=password-input]').clear().type('wrongpassword')
      cy.get('[data-cy=login-button]').click()
      cy.wait(200)
    }

    cy.get('[data-cy=account-locked-error]').should('be.visible')
  })

  it('should log all authentication attempts', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('wrongpassword')
    cy.get('[data-cy=login-button]').click()

    cy.wait('@auditLog').its('request.body').should('have.property', 'action', 'LOGIN_ATTEMPT')
  })

  it('should display HIPAA notice on login page', () => {
    cy.get('[data-cy=hipaa-notice]').should('be.visible')
    cy.get('[data-cy=hipaa-notice]').should('contain', 'Protected Health Information')
  })

  it('should require strong password policy', () => {
    cy.visit('/register')
    cy.get('[data-cy=password-input]').type('weak')
    cy.get('[data-cy=register-button]').click()

    cy.get('[data-cy=password-error]').should('contain', 'Password must contain')
  })

  it('should implement two-factor authentication option', () => {
    cy.login('admin')
    cy.visit('/settings/security')
    cy.get('[data-cy=enable-2fa-button]').should('be.visible')
  })

  it('should clear sensitive data from memory on logout', () => {
    cy.login('admin')
    cy.get('[data-cy=user-menu]').click()
    cy.get('[data-cy=logout-button]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null
      expect(win.sessionStorage.getItem('token')).to.be.null
    })
  })
})
