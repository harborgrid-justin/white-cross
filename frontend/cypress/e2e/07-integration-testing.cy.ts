/// <reference types="cypress" />

describe('Integration Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should navigate between dashboard and students page', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')

    cy.visit('/students')
    cy.url().should('include', '/students')
    cy.get('body').should('be.visible')
  })

  it('should navigate between multiple pages maintaining state', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')

    cy.visit('/medications')
    cy.url().should('include', '/medications')

    cy.visit('/appointments')
    cy.url().should('include', '/appointments')

    cy.url().should('not.include', '/login')
  })

  it('should maintain authentication across page navigations', () => {
    cy.visit('/dashboard')
    cy.url().should('not.include', '/login')

    cy.visit('/students')
    cy.url().should('not.include', '/login')

    cy.visit('/health-records')
    cy.url().should('not.include', '/login')
  })

  it('should load dashboard and verify basic layout', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.get('header').should('be.visible')
  })

  it('should handle direct URL navigation', () => {
    cy.visit('/medications')
    cy.url().should('include', '/medications')
    cy.get('body').should('be.visible')
  })
})
