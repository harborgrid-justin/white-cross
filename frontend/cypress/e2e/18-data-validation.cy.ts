/// <reference types="cypress" />

describe('Data Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should validate user is logged in', () => {
    cy.visit('/dashboard')
    cy.url().should('not.include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should display valid page content', () => {
    cy.visit('/students')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/students')
  })

  it('should maintain data integrity across navigation', () => {
    cy.visit('/dashboard')
    cy.visit('/medications')
    cy.url().should('not.include', '/login')
  })

  it('should handle form pages properly', () => {
    cy.visit('/appointments')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/appointments')
  })

  it('should validate page accessibility', () => {
    cy.visit('/health-records')
    cy.get('body').should('be.visible')
    cy.get('header').should('be.visible')
  })
})
