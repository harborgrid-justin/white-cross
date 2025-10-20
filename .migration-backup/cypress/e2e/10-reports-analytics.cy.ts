/// <reference types="cypress" />

describe('Reports and Analytics', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/reports')
  })

  it('should display the reports page with proper elements', () => {
    cy.contains('Reports').should('be.visible')
    cy.url().should('include', '/reports')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/reports')
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
