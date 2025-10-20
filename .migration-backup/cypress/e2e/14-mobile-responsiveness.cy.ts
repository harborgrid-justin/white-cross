/// <reference types="cypress" />

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should display dashboard on mobile viewport', () => {
    cy.viewport('iphone-8')
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should display dashboard on tablet viewport', () => {
    cy.viewport('ipad-2')
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should display students page on mobile', () => {
    cy.viewport('iphone-8')
    cy.visit('/students')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/students')
  })

  it('should maintain authentication across viewports', () => {
    cy.viewport('iphone-8')
    cy.visit('/medications')
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should handle landscape orientation', () => {
    cy.viewport('iphone-8', 'landscape')
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })
})
