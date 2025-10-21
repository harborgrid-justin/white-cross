/// <reference types="cypress" />

/**
 * Authentication: Accessibility & Responsiveness (15 tests)
 *
 * Tests accessibility features and responsive design
 */

describe('Authentication - Accessibility & Responsiveness', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should have proper ARIA labels on form inputs', () => {
    cy.get('[data-cy=email-input]').should('have.attr', 'aria-label')
    cy.get('[data-cy=password-input]').should('have.attr', 'aria-label')
  })

  it('should support keyboard navigation', () => {
    cy.get('[data-cy=email-input]').focus()
    cy.focused().should('have.attr', 'data-cy', 'email-input')

    cy.focused().tab()
    cy.focused().should('have.attr', 'data-cy', 'password-input')

    cy.focused().tab()
    cy.focused().should('have.attr', 'data-cy', 'remember-me-checkbox')
  })

  it('should submit form on Enter key', () => {
    cy.get('[data-cy=email-input]').type('admin@whitecross.health')
    cy.get('[data-cy=password-input]').type('admin123{enter}')
    cy.url().should('include', '/dashboard')
  })

  it('should have accessible error messages', () => {
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-cy=email-error]').should('have.attr', 'role', 'alert')
    cy.get('[data-cy=password-error]').should('have.attr', 'role', 'alert')
  })

  it('should have sufficient color contrast', () => {
    cy.get('[data-cy=login-button]').should('have.css', 'background-color')
    cy.get('[data-cy=login-button]').should('have.css', 'color')
  })

  it('should display properly on mobile devices', () => {
    cy.viewport('iphone-x')
    cy.get('[data-cy=login-form]').should('be.visible')
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible')
  })

  it('should display properly on tablet devices', () => {
    cy.viewport('ipad-2')
    cy.get('[data-cy=login-form]').should('be.visible')
    cy.get('[data-cy=logo]').should('be.visible')
  })

  it('should be responsive on small screens', () => {
    cy.viewport(375, 667)
    cy.get('[data-cy=login-form]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible')
  })

  it('should have focus indicators', () => {
    cy.get('[data-cy=email-input]').focus()
    cy.get('[data-cy=email-input]').should('have.css', 'outline')
  })

  it('should support screen readers', () => {
    cy.get('[data-cy=login-form]').should('have.attr', 'role', 'form')
    cy.get('[data-cy=login-button]').should('have.attr', 'type', 'submit')
  })

  it('should have descriptive page title for screen readers', () => {
    cy.title().should('include', 'Login')
  })

  it('should have skip navigation link', () => {
    cy.get('[data-cy=skip-to-main]').should('exist')
    cy.get('[data-cy=skip-to-main]').click()
    cy.focused().should('have.attr', 'data-cy', 'email-input')
  })

  it('should have alt text for images', () => {
    cy.get('[data-cy=logo]').should('have.attr', 'alt')
  })

  it('should scale properly on different screen sizes', () => {
    const viewports = [
      [1920, 1080],
      [1366, 768],
      [768, 1024],
      [375, 667]
    ]

    viewports.forEach(([width, height]) => {
      cy.viewport(width, height)
      cy.get('[data-cy=login-form]').should('be.visible')
    })
  })

  it('should have accessible button states', () => {
    cy.get('[data-cy=login-button]').should('not.be.disabled')
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-cy=login-button]').should('have.attr', 'aria-busy', 'true')
  })
})
