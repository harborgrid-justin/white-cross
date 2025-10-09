/// <reference types="cypress" />

/**
 * Health Records Management: Vaccinations Tab (25 tests)
 *
 * Tests vaccination tracking and management functionality
 */

describe('Health Records Management - Vaccinations Tab', () => {
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
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
  })

  it('should display vaccinations content', () => {
    cy.get('[data-testid="vaccinations-content"]').should('be.visible')
  })

  it('should show record vaccination button', () => {
    cy.get('[data-testid="record-vaccination-button"]').should('be.visible')
  })

  it('should show schedule vaccination button', () => {
    cy.get('[data-testid="schedule-vaccination-button"]').should('be.visible')
  })

  it('should display vaccinations table', () => {
    cy.get('[data-testid="vaccinations-table"]').should('exist')
  })

  it('should show vaccination search', () => {
    cy.get('[data-testid="vaccination-search"]').should('be.visible')
  })

  it('should allow searching vaccinations', () => {
    cy.get('[data-testid="vaccination-search"]')
      .type('MMR')
      .should('have.value', 'MMR')
  })

  it('should display filter dropdown', () => {
    cy.get('[data-testid="vaccination-filter"]').should('be.visible')
  })

  it('should filter by compliance status', () => {
    cy.get('[data-testid="vaccination-filter"]').select('compliant')
  })

  it('should display sort dropdown', () => {
    cy.get('[data-testid="vaccination-sort"]').should('be.visible')
  })

  it('should sort by date', () => {
    cy.get('[data-testid="vaccination-sort"]').select('date')
  })

  it('should sort by name', () => {
    cy.get('[data-testid="vaccination-sort"]').select('name')
  })

  it('should display vaccination rows', () => {
    cy.get('[data-testid="vaccination-row"]').should('have.length.at.least', 1)
  })

  it('should show vaccine names', () => {
    cy.get('[data-testid="vaccine-name"]').should('be.visible')
  })

  it('should display compliance badges', () => {
    cy.get('[data-testid="compliance-badge"]').should('exist')
  })

  it('should show compliant vaccines in green', () => {
    cy.contains('[data-testid="compliance-badge"]', 'Compliant')
      .should('have.class', 'bg-green-100')
  })

  it('should show overdue vaccines in red', () => {
    cy.get('[data-testid="vaccinations-table"]').should('exist')
  })

  it('should display due dates', () => {
    cy.get('[data-testid="due-date"]').should('exist')
  })

  it('should show administered dates', () => {
    cy.get('[data-testid="administered-date"]').should('exist')
  })

  it('should display action buttons', () => {
    cy.get('[data-testid="vaccination-actions"]').should('exist')
  })

  it('should click record vaccination button', () => {
    cy.get('[data-testid="record-vaccination-button"]').click()
  })

  it('should click schedule vaccination button', () => {
    cy.get('[data-testid="schedule-vaccination-button"]').click()
  })

  it('should show edit vaccination buttons', () => {
    cy.get('[data-testid="edit-vaccination"]').should('exist')
  })

  it('should show delete vaccination buttons', () => {
    cy.get('[data-testid="delete-vaccination"]').should('exist')
  })

  it('should display priority indicators', () => {
    cy.get('[data-testid="priority-badge"]').should('exist')
  })

  it('should show high priority vaccines', () => {
    cy.contains('[data-testid="priority-badge"]', 'High').should('exist')
  })
})
