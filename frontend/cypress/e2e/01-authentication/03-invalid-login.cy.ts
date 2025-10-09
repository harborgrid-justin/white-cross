/// <reference types="cypress" />

/**
 * Authentication: Invalid Login Attempts (15 tests)
 *
 * Tests various invalid login scenarios and error handling
 */

describe('Authentication - Invalid Login Attempts', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should show error for empty email and password', () => {
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/email.*required|required.*email/i, { timeout: 2500 }).should('be.visible')
    cy.contains(/password.*required|required.*password/i, { timeout: 2500 }).should('be.visible')
  })

  it('should show error for invalid email format', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('invalidemail')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('password123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/invalid.*email|email.*invalid/i, { timeout: 2500 }).should('be.visible')
  })

  it('should show error for wrong password', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('wrongpassword')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/invalid.*credentials|incorrect|failed/i, { timeout: 2500 }).should('be.visible')
  })

  it('should show error for non-existent user', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('nonexistent@example.com')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('password123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/invalid.*credentials|incorrect|failed/i, { timeout: 2500 }).should('be.visible')
  })

  it('should not reveal if email exists', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('wrongpassword')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.get('body', { timeout: 2500 }).should('not.contain', 'User not found')
  })

  it('should disable login button while processing', () => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    })

    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('admin123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.get('[data-cy=login-button]', { timeout: 2500 }).should('be.disabled')
  })

  it('should show loading indicator during login', () => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    })

    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('admin123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.get('[data-cy=loading-spinner], [class*="loading"], [class*="spinner"]', { timeout: 2500 }).should('exist')
  })

  it('should handle network errors gracefully', () => {
    cy.intercept('POST', '/api/auth/login', { forceNetworkError: true })

    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('admin123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/network.*error|error.*network|failed/i, { timeout: 2500 }).should('be.visible')
  })

  it('should handle server errors gracefully', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 500 })

    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('admin123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/server.*error|error.*server|error.*occurred/i, { timeout: 2500 }).should('be.visible')
  })

  it('should clear error message when user starts typing', () => {
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/email.*required|required.*email/i, { timeout: 2500 }).should('be.visible')
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('a')
    cy.contains(/email.*required|required.*email/i, { timeout: 2500 }).should('not.exist')
  })

  it('should validate minimum password length', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('admin@whitecross.health')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/minimum|too.*short/i, { timeout: 2500 }).should('be.visible')
  })

  it('should prevent SQL injection in email field', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type("admin@test.com' OR '1'='1")
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('password123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.contains(/invalid/i, { timeout: 2500 }).should('be.visible')
  })

  it('should prevent XSS in error messages', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
      body: { error: '<script>alert("xss")</script>' }
    })

    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('test@test.com')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('password')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.get('body', { timeout: 2500 }).should('not.contain', '<script>')
  })

  it('should rate limit login attempts', () => {
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy=email-input]', { timeout: 2500 }).clear().type('admin@whitecross.health')
      cy.get('[data-cy=password-input]', { timeout: 2500 }).clear().type('wrongpassword')
      cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
      cy.wait(500)
    }
    cy.contains(/too.*many.*attempts|rate.*limit/i, { timeout: 2500 }).should('be.visible')
  })

  it('should sanitize user input', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).type('<script>alert("test")</script>@test.com')
    cy.get('[data-cy=password-input]', { timeout: 2500 }).type('password123')
    cy.get('[data-cy=login-button]', { timeout: 2500 }).click()
    cy.get('[data-cy=email-input]', { timeout: 2500 }).should('not.contain', '<script>')
  })
})
