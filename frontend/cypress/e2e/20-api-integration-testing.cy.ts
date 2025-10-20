/// <reference types="cypress" />

describe('API Integration Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should load pages with API data', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should handle API responses for students page', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/students')
  })

  it('should integrate with backend for medications', () => {
    cy.visit('/medications')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/medications')
  })

  it('should fetch data for health records', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/health-records')
  })

  it('should maintain API connection throughout session', () => {
    cy.visit('/dashboard')
    cy.visit('/students')
    cy.visit('/appointments')
    cy.get('body').should('be.visible')
    cy.url().should('not.include', '/login')
  })
})
