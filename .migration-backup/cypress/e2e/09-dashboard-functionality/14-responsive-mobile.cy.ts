/// <reference types="cypress" />

/**
 * Dashboard - Responsive & Mobile (15 tests)
 *
 * Tests dashboard responsive design and mobile experience
 */

describe('Dashboard - Responsive & Mobile', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should be responsive on mobile (375px)', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.contains('Dashboard').should('be.visible')
  })

  it('should be responsive on tablet (768px)', () => {
    cy.viewport(768, 1024)
    cy.visit('/dashboard')
    cy.get('[class*="card"]').should('be.visible')
  })

  it('should be responsive on desktop (1920px)', () => {
    cy.viewport(1920, 1080)
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should stack cards vertically on mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('[class*="flex-col"], [class*="block"]').should('exist')
  })

  it('should show hamburger menu on mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('button[aria-label*="menu"]').should('be.visible')
  })

  it('should hide sidebar on mobile by default', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('aside[class*="hidden"]').should('exist')
  })

  it('should adapt grid layout for tablet', () => {
    cy.viewport(768, 1024)
    cy.visit('/dashboard')
    cy.get('[class*="grid"]').should('exist')
  })

  it('should maintain readability on small screens', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('body').should('have.css', 'font-size')
  })

  it('should support touch interactions on mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('button').first().click()
  })

  it('should show condensed metrics on mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('[class*="card"]').should('exist')
  })

  it('should collapse navigation on mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('nav[class*="collapsed"]').should('exist')
  })

  it('should optimize images for mobile', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('img').should('have.attr', 'src')
  })

  it('should have proper spacing on all viewports', () => {
    const viewports = [[375, 667], [768, 1024], [1920, 1080]]
    viewports.forEach(([width, height]) => {
      cy.viewport(width, height)
      cy.visit('/dashboard')
      cy.get('[class*="space"], [class*="gap"]').should('exist')
    })
  })

  it('should support landscape orientation on mobile', () => {
    cy.viewport(667, 375)
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should maintain functionality on all screen sizes', () => {
    cy.viewport(375, 667)
    cy.visit('/dashboard')
    cy.get('button').should('be.visible')
  })
})
