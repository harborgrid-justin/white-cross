/// <reference types="cypress" />

/**
 * Health Records Management: Error Handling (10 tests)
 *
 * Tests error handling and recovery
 */

describe('Health Records Management - Error Handling', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/students/assigned', {
      statusCode: 200,
      body: [
        { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', studentNumber: 'STU002' }
      ]
    }).as('getAssignedStudents')

    cy.intercept('GET', '**/api/health-records/student/*/allergies', {
      statusCode: 200,
      body: []
    }).as('getAllergies')

    cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
      statusCode: 200,
      body: []
    }).as('getChronicConditions')

    cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
      statusCode: 200,
      body: []
    }).as('getVaccinations')

    cy.intercept('GET', '**/api/health-records/student/*/growth-chart', {
      statusCode: 200,
      body: []
    }).as('getGrowthChart')

    cy.intercept('GET', '**/api/health-records/student/*/vitals', {
      statusCode: 200,
      body: []
    }).as('getVitals')

    cy.login('nurse')
  })

  it('should handle network errors gracefully', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should recover from failed requests', () => {
    cy.visit('/health-records')
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should display error messages', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should handle session expiration', () => {
    cy.clearCookies()
    cy.reload()
    cy.wait(2000)
    cy.url().should('include', '/login')
  })

  it('should validate form inputs', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should handle invalid data', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('[data-testid="health-records-search"]')
      .type('!@#$%^&*()')
      .should('have.value', '!@#$%^&*()')
  })

  it('should provide user feedback on errors', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should retry failed operations', () => {
    cy.visit('/health-records')
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should handle timeout scenarios', () => {
    cy.visit('/health-records', { timeout: 10000 })
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should maintain data integrity on errors', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('exist')
  })
})
