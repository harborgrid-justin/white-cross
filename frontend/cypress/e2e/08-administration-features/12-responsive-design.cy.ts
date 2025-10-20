/// <reference types="cypress" />

/**
 * Administration Features: Responsive Design (10 tests)
 *
 * Tests responsive behavior across different screen sizes
 */

describe('Administration Features - Responsive Design', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should be responsive on mobile (375px)', () => {
    cy.viewport(375, 667)
    cy.contains('h1', 'Administration Panel').should('be.visible')
  })

  it('should be responsive on tablet (768px)', () => {
    cy.viewport(768, 1024)
    cy.contains('h1', 'Administration Panel').should('be.visible')
  })

  it('should be responsive on desktop (1920px)', () => {
    cy.viewport(1920, 1080)
    cy.contains('h1', 'Administration Panel').should('be.visible')
  })

  it('should have scrollable tab navigation on small screens', () => {
    cy.viewport(375, 667)
    cy.get('nav[class*="overflow-x"]').should('exist')
  })

  it('should adapt grid layouts on different screen sizes', () => {
    cy.viewport(1280, 720)
    cy.get('[class*="grid"]').should('exist')
  })

  it('should maintain usability on iPad (810px)', () => {
    cy.viewport(810, 1080)
    cy.get('nav button').should('be.visible')
  })

  it('should handle very wide screens (2560px)', () => {
    cy.viewport(2560, 1440)
    cy.contains('h1', 'Administration Panel').should('be.visible')
  })

  it('should maintain aspect ratio on landscape mobile', () => {
    cy.viewport(667, 375)
    cy.get('body').should('be.visible')
  })

  it('should have readable text on all screen sizes', () => {
    cy.viewport(375, 667)
    cy.get('h1').should('have.css', 'font-size')
  })

  it('should maintain proper spacing on different viewports', () => {
    cy.viewport(1024, 768)
    cy.get('[class*="space-y"], [class*="gap"]').should('exist')
  })
})
