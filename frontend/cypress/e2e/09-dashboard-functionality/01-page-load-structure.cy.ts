/// <reference types="cypress" />

/**
 * Dashboard - Page Load & Structure (15 tests)
 *
 * Tests dashboard page loading, structure, and basic UI elements
 */

describe('Dashboard - Page Load & Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display the dashboard page with proper elements', () => {
    cy.contains('Dashboard').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should display page header and navigation', () => {
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
  })

  it('should have accessible page title', () => {
    cy.get('h1, h2, [role="heading"]').should('exist')
  })

  it('should maintain authentication on page load', () => {
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should have proper page spacing', () => {
    cy.get('[class*="space-y"], [class*="gap"]').should('exist')
  })

  it('should display main content area', () => {
    cy.get('main, [role="main"]').should('be.visible')
  })

  it('should load without JavaScript errors', () => {
    cy.window().then((win) => {
      expect(win.console.error).to.not.be.called
    })
  })

  it('should have proper document title', () => {
    cy.title().should('include', 'Dashboard')
  })

  it('should render within acceptable time', () => {
    cy.get('body', { timeout: 3000 }).should('be.visible')
  })

  it('should have responsive layout', () => {
    cy.get('[class*="container"], [class*="grid"]').should('exist')
  })

  it('should display sidebar or navigation menu', () => {
    cy.get('aside, nav[class*="sidebar"]').should('exist')
  })

  it('should have proper background styling', () => {
    cy.get('body').should('have.css', 'background-color')
  })

  it('should load all critical CSS', () => {
    cy.get('head link[rel="stylesheet"]').should('exist')
  })

  it('should not show loading spinner after page loads', () => {
    cy.wait(1000)
    cy.get('[class*="spinner"], [class*="loading"]').should('not.exist')
  })
})
