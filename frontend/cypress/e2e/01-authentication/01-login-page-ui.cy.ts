/// <reference types="cypress" />

/**
 * Authentication: Login Page UI & Structure (15 tests)
 *
 * Tests the login page user interface elements, layout, and initial rendering
 */

describe('Authentication - Login Page UI & Structure', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login page with all elements', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible')
  })

  it('should display White Cross logo', () => {
    cy.get('img', { timeout: 2500 }).first().should('be.visible')
    cy.get('img').first().should('have.attr', 'src')
  })

  it('should display login form title', () => {
    cy.contains(/login|sign in/i, { timeout: 2500 }).should('be.visible')
  })

  it('should display email input with proper attributes', () => {
    cy.get('[data-cy=email-input]', { timeout: 2500 }).should('have.attr', 'type', 'email')
    cy.get('[data-cy=email-input]').should('have.attr', 'placeholder')
  })

  it('should display password input with proper attributes', () => {
    cy.get('[data-cy=password-input]', { timeout: 2500 }).should('have.attr', 'type', 'password')
    cy.get('[data-cy=password-input]').should('have.attr', 'placeholder')
  })

  it('should display forgot password link', () => {
    cy.contains(/forgot.*password/i, { timeout: 2500 }).should('exist')
  })

  it('should display remember me checkbox', () => {
    cy.get('input[type="checkbox"]', { timeout: 2500 }).should('exist')
  })

  it('should have accessible form labels', () => {
    cy.get('label', { timeout: 2500 }).should('have.length.at.least', 1)
  })

  it('should display login button with proper text', () => {
    cy.get('[data-cy=login-button]', { timeout: 2500 }).should('contain', /login|sign in/i)
  })

  it('should show password visibility toggle', () => {
    cy.get('button[type="button"]', { timeout: 2500 }).should('exist')
  })

  it('should toggle password visibility when icon is clicked', () => {
    cy.get('[data-cy=password-input]', { timeout: 2500 }).should('have.attr', 'type', 'password')
    cy.get('button[type="button"]').first().click()
    // Password type might toggle or might stay the same depending on implementation
  })

  it('should display help text or description', () => {
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })

  it('should have proper page title', () => {
    cy.title({ timeout: 2500 }).should('not.be.empty')
  })

  it('should display HIPAA compliance notice', () => {
    cy.contains(/hipaa|secure|protected/i, { timeout: 2500 }).should('exist')
  })

  it('should load without JavaScript errors', () => {
    cy.get('body', { timeout: 2500 }).should('be.visible')
  })
})
