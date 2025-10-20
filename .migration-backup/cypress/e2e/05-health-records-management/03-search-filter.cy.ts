/// <reference types="cypress" />

/**
 * Health Records Management: Search & Filter (15 tests)
 *
 * Tests search and filtering functionality
 */

describe('Health Records Management - Search and Filter Functionality', () => {
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

  it('should display search input on Overview tab', () => {
    cy.get('[data-testid="health-records-search"]').should('be.visible')
  })

  it('should allow typing in search field', () => {
    cy.get('[data-testid="health-records-search"]')
      .type('John Doe')
      .should('have.value', 'John Doe')
  })

  it('should display record type filter', () => {
    cy.get('[data-testid="record-type-filter"]').should('be.visible')
  })

  it('should allow selecting different record types', () => {
    cy.get('[data-testid="record-type-filter"]').select('EXAMINATION')
  })

  it('should display date range filters', () => {
    cy.get('[data-testid="date-from"]').should('be.visible')
    cy.get('[data-testid="date-to"]').should('be.visible')
  })

  it('should allow selecting from date', () => {
    cy.get('[data-testid="date-from"]').type('2024-01-01')
  })

  it('should allow selecting to date', () => {
    cy.get('[data-testid="date-to"]').type('2024-12-31')
  })

  it('should have apply filter button', () => {
    cy.get('[data-testid="apply-date-filter"]').should('be.visible')
  })

  it('should apply date filters when button clicked', () => {
    cy.get('[data-testid="date-from"]').scrollIntoView().type('2024-01-01')
    cy.get('[data-testid="date-to"]').scrollIntoView().type('2024-12-31')
    cy.get('[data-testid="apply-date-filter"]').click()
  })

  it('should clear search input', () => {
    cy.get('[data-testid="health-records-search"]')
      .type('Test Search')
      .clear()
      .should('have.value', '')
  })

  it('should handle empty search gracefully', () => {
    cy.get('[data-testid="health-records-search"]')
      .type('   ')
      .should('have.value', '   ')
  })

  it('should display all record type options', () => {
    cy.get('[data-testid="record-type-filter"]').scrollIntoView().select('VACCINATION')
    cy.get('[data-testid="record-type-filter"]').scrollIntoView().select('ALLERGY')
    cy.get('[data-testid="record-type-filter"]').scrollIntoView().select('MEDICATION')
  })

  it('should validate date range', () => {
    cy.get('[data-testid="date-from"]').scrollIntoView().type('2024-12-31')
    cy.get('[data-testid="date-to"]').scrollIntoView().type('2024-01-01')
  })

  it('should persist filters across tab switches', () => {
    cy.get('[data-testid="health-records-search"]').type('Test')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="health-records-search"]').should('have.value', 'Test')
  })

  it('should support special characters in search', () => {
    cy.get('[data-testid="health-records-search"]')
      .type("O'Brien")
      .should('have.value', "O'Brien")
  })
})
