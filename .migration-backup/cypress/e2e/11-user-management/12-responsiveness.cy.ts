/// <reference types="cypress" />

/**
 * User Management - Responsiveness (10 tests)
 *
 * Tests responsive design and behavior across different screen sizes
 */

describe('User Management - Responsiveness', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should have scrollable navigation', () => {
    cy.get('nav').should('have.class', 'overflow-x-auto')
  })

  it('should maintain layout on smaller viewport', () => {
    cy.viewport(768, 1024)
    cy.contains('Administration Panel').should('be.visible')
  })

  it('should show all tabs on mobile', () => {
    cy.viewport(375, 667)
    cy.get('nav button').should('have.length.at.least', 5)
  })

  it('should allow horizontal scrolling on mobile', () => {
    cy.viewport(375, 667)
    cy.get('nav').should('have.class', 'overflow-x-auto')
  })

  it('should maintain proper spacing on tablet', () => {
    cy.viewport(768, 1024)
    cy.get('.space-y-6').should('exist')
  })

  it('should keep navigation visible on small screens', () => {
    cy.viewport(640, 480)
    cy.get('nav').should('be.visible')
  })

  it('should have flex layout that adapts', () => {
    cy.get('nav').should('have.class', 'flex')
  })

  it('should prevent tab text wrapping', () => {
    cy.get('nav button').should('have.class', 'whitespace-nowrap')
  })

  it('should maintain visibility on large screens', () => {
    cy.viewport(1920, 1080)
    cy.contains('Administration Panel').should('be.visible')
  })

  it('should keep all tabs accessible at any size', () => {
    cy.viewport(320, 568)
    cy.contains('button', 'Users').should('exist')
  })
})
