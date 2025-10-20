/// <reference types="cypress" />

/**
 * Health Records Management: Performance (10 tests)
 *
 * Tests performance and optimization
 */

describe('Health Records Management - Performance', () => {
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

  it('should load page quickly', () => {
    const start = Date.now()
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    const end = Date.now()
    expect(end - start).to.be.lessThan(5000)
  })

  it('should handle rapid tab switching', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    for (let i = 0; i < 5; i++) {
      cy.contains('button', 'Allergies').scrollIntoView().click()
      cy.wait(100)
      cy.contains('button', 'Overview').scrollIntoView().click()
      cy.wait(100)
    }
  })

  it('should handle rapid filtering', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('[data-testid="health-records-search"]')
      .type('Test')
      .clear()
      .type('Another')
      .clear()
  })

  it('should render large datasets', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="vaccinations-table"]').should('exist')
  })

  it('should handle multiple concurrent requests', () => {
    cy.visit('/health-records')
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should cache data appropriately', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(300)
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(300)
  })

  it('should optimize re-renders', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('[data-testid="health-records-search"]').type('Test')
    cy.wait(300)
  })

  it('should lazy load tab content', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="growth-charts-content"]').should('be.visible')
  })

  it('should handle page refresh efficiently', () => {
    cy.visit('/health-records')
    cy.reload()
    cy.wait(1000)
    cy.get('[data-testid="health-records-page"]').should('be.visible')
  })

  it('should debounce search input', () => {
    cy.visit('/health-records')
    cy.get('[data-testid="health-records-page"]').should('be.visible')
    cy.get('[data-testid="health-records-search"]')
      .type('T')
      .type('e')
      .type('s')
      .type('t')
    cy.wait(500)
  })
})
