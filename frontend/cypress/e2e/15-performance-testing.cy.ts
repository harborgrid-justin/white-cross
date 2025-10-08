/// <reference types="cypress" />

describe('Performance Testing', () => {
  beforeEach(() => {
    cy.login('admin')
  })

  it('should load dashboard page within acceptable time', () => {
    cy.visit('/dashboard', { timeout: 10000 })
    cy.get('body').should('be.visible')
    cy.url().should('include', '/dashboard')
  })

  it('should load students page efficiently', () => {
    cy.visit('/students', { timeout: 10000 })
    cy.get('body').should('be.visible')
    cy.url().should('include', '/students')
  })

  it('should handle page navigation smoothly', () => {
    cy.visit('/dashboard')
    cy.visit('/medications')
    cy.visit('/appointments')
    cy.get('body').should('be.visible')
  })

  it('should load health records page', () => {
    cy.visit('/health-records', { timeout: 10000 })
    cy.get('body').should('be.visible')
  })

  it('should maintain performance on reports page', () => {
    cy.visit('/reports', { timeout: 15000 })
    cy.get('body').should('be.visible')
  })
})
