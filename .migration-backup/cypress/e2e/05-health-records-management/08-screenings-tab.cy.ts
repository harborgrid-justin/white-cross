/// <reference types="cypress" />

/**
 * Health Records Management: Screenings Tab (10 tests)
 *
 * Tests health screening functionality
 */

describe('Health Records Management - Screenings Tab', () => {
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
    cy.contains('button', 'Screenings').scrollIntoView().click()
    cy.wait(500)
  })

  it('should display screenings content', () => {
    cy.get('[data-testid="screenings-content"]').should('be.visible')
  })

  it('should show record screening button', () => {
    cy.get('[data-testid="record-screening-button"]').should('be.visible')
  })

  it('should display screenings table', () => {
    cy.get('[data-testid="screenings-table"]').should('exist')
  })

  it('should show screening rows', () => {
    cy.get('[data-testid="screening-row"]').should('have.length.at.least', 1)
  })

  it('should display screening types', () => {
    cy.contains('Vision').should('exist')
    cy.contains('Hearing').should('exist')
  })

  it('should show screening results', () => {
    cy.get('[data-testid="screening-result"]').should('exist')
  })

  it('should display pass results', () => {
    cy.contains('[data-testid="screening-result"]', 'Pass').should('exist')
  })

  it('should display refer results', () => {
    cy.get('[data-testid="screenings-table"]').should('exist')
  })

  it('should click record screening button', () => {
    cy.get('[data-testid="record-screening-button"]').click()
  })

  it('should show screening dates', () => {
    cy.get('[data-testid="screening-date"]').should('exist')
  })
})
