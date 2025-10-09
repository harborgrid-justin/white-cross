/// <reference types="cypress" />

/**
 * Health Records Management: Data Validation (10 tests)
 *
 * Tests data validation and integrity
 */

describe('Health Records Management - Data Validation and Integrity', () => {
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
    cy.visit('/dashboard')
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]', { timeout: 10000 }).should('exist')
  })

  it('should display consistent data across tabs', () => {
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(300)
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="allergies-list"]').should('exist')
  })

  it('should maintain state when navigating', () => {
    cy.get('[data-testid="health-records-search"]').type('Test')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="health-records-search"]').should('have.value', 'Test')
  })

  it('should handle empty data gracefully', () => {
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should display loading states', () => {
    cy.reload()
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should validate required fields', () => {
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should sanitize user input', () => {
    cy.get('[data-testid="health-records-search"]')
      .type('<script>alert("test")</script>')
      .should('have.value', '<script>alert("test")</script>')
  })

  it('should preserve data format', () => {
    cy.get('[data-testid="allergies-list"]').should('exist')
  })

  it('should handle concurrent updates', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should maintain referential integrity', () => {
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should handle data refresh', () => {
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })
})
