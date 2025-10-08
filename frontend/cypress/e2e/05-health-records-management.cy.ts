/// <reference types="cypress" />

describe('Health Records Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/health-records')
  })

  it('should display the health records page with proper elements', () => {
    cy.contains('Health Records').should('be.visible')
    cy.url().should('include', '/health-records')
  })

  it('should load page without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/health-records')
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
})
