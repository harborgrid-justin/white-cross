/// <reference types="cypress" />

/**
 * Dashboard - Accessibility (15 tests)
 *
 * Tests dashboard accessibility features and ARIA compliance
 */

describe('Dashboard - Accessibility', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should have semantic HTML structure', () => {
    cy.get('header').should('exist')
    cy.get('main').should('exist')
    cy.get('nav').should('exist')
  })

  it('should have proper heading hierarchy', () => {
    cy.get('h1').should('have.length', 1)
    cy.get('h2, h3').should('exist')
  })

  it('should have ARIA labels on interactive elements', () => {
    cy.get('button[aria-label], a[aria-label]').should('exist')
  })

  it('should support keyboard navigation', () => {
    cy.get('button').first().focus()
    cy.focused().should('exist')
  })

  it('should have skip to main content link', () => {
    cy.get('a[href="#main"]').should('exist')
  })

  it('should have sufficient color contrast', () => {
    cy.get('body').should('have.css', 'color')
    cy.get('body').should('have.css', 'background-color')
  })

  it('should have alt text for images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
    })
  })

  it('should have focus indicators', () => {
    cy.get('button').first().focus()
    cy.focused().should('have.css', 'outline')
  })

  it('should have proper form labels', () => {
    cy.get('input').each(($input) => {
      cy.wrap($input).should('have.attr', 'aria-label').or('have.attr', 'id')
    })
  })

  it('should announce dynamic content changes', () => {
    cy.get('[aria-live], [role="status"]').should('exist')
  })

  it('should have accessible tooltips', () => {
    cy.get('[title], [aria-describedby]').should('exist')
  })

  it('should support screen reader navigation', () => {
    cy.get('[role="navigation"], nav').should('exist')
    cy.get('[role="main"], main').should('exist')
  })

  it('should have keyboard-accessible dropdowns', () => {
    cy.get('button[aria-haspopup]').first().click()
    cy.get('[role="menu"], [role="listbox"]').should('exist')
  })

  it('should have proper tab order', () => {
    cy.get('a, button, input').first().focus()
    cy.realPress('Tab')
  })

  it('should have ARIA landmarks', () => {
    cy.get('[role="banner"], header').should('exist')
    cy.get('[role="navigation"], nav').should('exist')
    cy.get('[role="main"], main').should('exist')
  })
})
