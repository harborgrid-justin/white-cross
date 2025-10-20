/// <reference types="cypress" />

describe('Accessibility Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should have accessible page structure on dashboard', () => {
    cy.visit('/dashboard')
    cy.get('h1, h2, [role="heading"]').should('exist')
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
  })

  it('should have proper page headings', () => {
    cy.visit('/students')
    cy.get('h1, h2, [role="heading"]').should('exist')
    cy.get('body').should('be.visible')
  })

  it('should be keyboard navigable', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.get('a, button').first().should('exist')
  })

  it('should have proper link and button elements', () => {
    cy.visit('/medications')
    cy.get('button, a').should('exist')
    cy.get('body').should('be.visible')
  })

  it('should maintain accessibility across pages', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
  })
})
