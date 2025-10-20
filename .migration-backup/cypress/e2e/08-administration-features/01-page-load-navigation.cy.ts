/// <reference types="cypress" />

/**
 * Administration Features: Page Load & Navigation (15 tests)
 *
 * Tests basic page load and navigation structure
 */

describe('Administration Features - Page Load & Navigation', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should load the settings page successfully', () => {
    cy.url().should('include', '/settings')
    cy.get('body').should('be.visible')
  })

  it('should display the Administration Panel heading', () => {
    cy.contains('h1', 'Administration Panel').should('be.visible')
  })

  it('should display the page description', () => {
    cy.contains('System configuration, multi-school management, and enterprise tools').should('be.visible')
  })

  it('should have the Layout header visible', () => {
    cy.get('[class*="sticky top-0"]').should('be.visible')
  })

  it('should display navigation sidebar', () => {
    cy.get('nav').should('be.visible')
  })

  it('should maintain admin authentication', () => {
    cy.url().should('not.include', '/login')
    cy.get('[data-cy="user-menu"]').should('be.visible')
  })

  it('should have accessible page structure', () => {
    cy.get('h1').should('exist')
    cy.get('nav').should('exist')
  })

  it('should load without console errors', () => {
    cy.visit('/settings')
    cy.window().then((win) => {
      expect(win.console.error).to.not.have.been.called
    })
  })

  it('should display the page header in Layout', () => {
    cy.get('.sticky.top-0').should('be.visible')
  })

  it('should show user information in header', () => {
    cy.get('[data-cy="user-menu"]').should('be.visible')
  })

  it('should have logout button visible', () => {
    cy.get('[data-cy="logout-button"]').should('be.visible')
  })

  it('should display breadcrumb or page title in top bar', () => {
    cy.get('.sticky.top-0').within(() => {
      cy.contains(/settings|administration/i).should('be.visible')
    })
  })

  it('should have proper page title in document', () => {
    cy.title().should('exist')
  })

  it('should render main content area', () => {
    cy.get('main').should('be.visible')
  })

  it('should have responsive layout classes', () => {
    cy.get('.lg\\:pl-64').should('exist')
  })
})
