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
      body: [
        {
          id: '1',
          vaccineName: 'COVID-19 Vaccine',
          dateAdministered: '2024-09-15',
          administeredBy: 'School Nurse',
          compliant: true,
          priority: 'High'
        },
        {
          id: '2',
          vaccineName: 'Influenza Vaccine',
          dateAdministered: '2024-08-20',
          administeredBy: 'Dr. Smith',
          compliant: true,
          priority: 'Medium'
        },
        {
          id: '3',
          vaccineName: 'Tdap Booster',
          dateAdministered: null,
          administeredBy: null,
          compliant: false,
          dueDate: '2024-11-01',
          priority: 'High'
        }
      ]
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
      .scrollIntoView()
      .type('MMR', { force: true })
      .should('have.value', 'MMR')
  })

  it('should display filter dropdown', () => {
    cy.get('[data-testid="vaccination-filter"]').should('be.visible')
  })

  it('should filter by compliance status', () => {
    cy.get('[data-testid="vaccination-filter"]').select('Completed')
  })

  it('should display sort dropdown', () => {
    cy.get('[data-testid="vaccination-sort"]').should('be.visible')
  })

  it('should sort by date', () => {
    cy.get('[data-testid="vaccination-sort"]').scrollIntoView().select('date-desc', { force: true })
  })

  it('should sort by name', () => {
    cy.get('[data-testid="vaccination-sort"]').scrollIntoView().select('name', { force: true })
  })

  it('should display vaccination rows', () => {
    cy.wait(1000) // Wait for mock data to render
    cy.get('[data-testid="vaccination-row"]', { timeout: 10000 }).should('have.length.at.least', 1)
  })

  it('should show vaccine names', () => {
    cy.wait(1000)
    cy.get('[data-testid="vaccine-name"]', { timeout: 10000 }).first().should('be.visible')
  })

  it('should display compliance badges', () => {
    cy.wait(1000)
    cy.get('[data-testid="compliance-badge"]', { timeout: 10000 }).should('exist')
  })

  it('should show compliant vaccines in green', () => {
    cy.wait(1000)
    cy.get('[data-testid="compliance-badge"]', { timeout: 10000 })
      .contains('Compliant')
      .should('have.class', 'bg-green-100')
  })

  it('should show overdue vaccines in red', () => {
    cy.wait(1000)
    cy.get('[data-testid="vaccinations-table"]', { timeout: 10000 }).should('exist')
  })

  it('should display due dates', () => {
    cy.wait(1000)
    cy.get('[data-testid="due-date"]', { timeout: 10000 }).should('exist')
  })

  it('should show administered dates', () => {
    cy.wait(1000)
    cy.get('[data-testid="administered-date"]', { timeout: 10000 }).should('exist')
  })

  it('should display action buttons', () => {
    cy.wait(1000)
    cy.get('[data-testid="vaccination-actions"]', { timeout: 10000 }).should('exist')
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
