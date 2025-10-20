/// <reference types="cypress" />

describe('Workflow Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should complete basic navigation workflow', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')

    cy.visit('/students')
    cy.url().should('include', '/students')

    cy.visit('/medications')
    cy.url().should('include', '/medications')
  })

  it('should maintain authentication throughout workflow', () => {
    cy.visit('/dashboard')
    cy.url().should('not.include', '/login')

    cy.visit('/appointments')
    cy.url().should('not.include', '/login')

    cy.visit('/health-records')
    cy.url().should('not.include', '/login')
  })

  it('should handle multi-page workflow', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')

    cy.visit('/students')
    cy.get('body').should('be.visible')

    cy.visit('/reports')
    cy.get('body').should('be.visible')
  })

  it('should support healthcare management workflows', () => {
    cy.visit('/medications')
    cy.get('body').should('be.visible')

    cy.visit('/appointments')
    cy.get('body').should('be.visible')
  })

  it('should complete basic user journey', () => {
    cy.visit('/dashboard')
    cy.visit('/students')
    cy.visit('/health-records')
    cy.visit('/incident-reports')
    cy.get('body').should('be.visible')
  })
})
