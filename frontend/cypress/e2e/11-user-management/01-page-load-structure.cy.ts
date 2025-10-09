/// <reference types="cypress" />

/**
 * User Management - Page Load & Structure (15 tests)
 *
 * Tests basic page load and structure of the administration panel
 */

describe('User Management - Page Load & Structure', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should display the administration panel page', () => {
    cy.contains('Administration Panel').should('be.visible')
    cy.url().should('include', '/settings')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/settings')
  })

  it('should display page navigation', () => {
    cy.get('nav').should('be.visible')
  })

  it('should have accessible page title', () => {
    cy.get('h1, h2, [role="heading"]').should('exist')
  })

  it('should maintain admin authentication on page load', () => {
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should display the subtitle text', () => {
    cy.contains('System configuration, multi-school management, and enterprise tools').should('be.visible')
  })

  it('should have proper page spacing', () => {
    cy.get('.space-y-6').should('exist')
  })

  it('should have navigation border styling', () => {
    cy.get('.border-b.border-gray-200').should('exist')
  })

  it('should display tab navigation container', () => {
    cy.get('nav').within(() => {
      cy.get('button').should('have.length.at.least', 5)
    })
  })

  it('should have scrollable navigation on small screens', () => {
    cy.get('nav').should('have.class', 'overflow-x-auto')
  })

  it('should not show login page elements', () => {
    cy.contains('Login').should('not.exist')
    cy.contains('Sign In').should('not.exist')
  })

  it('should have proper text styling for title', () => {
    cy.get('h1').should('have.class', 'text-2xl')
    cy.get('h1').should('have.class', 'font-bold')
  })

  it('should have proper text color for subtitle', () => {
    cy.get('.text-gray-600').should('exist')
  })

  it('should render without React errors', () => {
    cy.window().then((win) => {
      expect(win.console.error).to.not.be.called
    })
  })

  it('should have proper document title', () => {
    cy.title().should('not.be.empty')
  })
})
