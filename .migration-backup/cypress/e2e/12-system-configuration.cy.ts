/// <reference types="cypress" />

describe('System Configuration', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
  })

  it('should display the settings page with proper elements', () => {
    cy.contains('Settings').should('be.visible')
    cy.url().should('include', '/settings')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/settings')
  })

  it('should display page header and navigation', () => {
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
  })

  it('should have accessible page title', () => {
    cy.get('h1, h2, [role="heading"]').should('exist')
  })

  it('should maintain admin authentication on page load', () => {
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })
})
