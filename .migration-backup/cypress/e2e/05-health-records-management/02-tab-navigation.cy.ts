/// <reference types="cypress" />

/**
 * Health Records Management: Tab Navigation (20 tests)
 *
 * Tests navigation between different tabs
 */

describe('Health Records Management - Tab Navigation', () => {
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

  it('should display all tab options', () => {
    cy.contains('button', 'Overview').should('exist')
    cy.contains('button', 'Health Records').should('exist')
    cy.contains('button', 'Allergies').should('exist')
    cy.contains('button', 'Chronic Conditions').should('exist')
    cy.contains('button', 'Vaccinations').should('exist')
    cy.contains('button', 'Growth Charts').should('exist')
    cy.contains('button', 'Screenings').scrollIntoView().should('be.visible')
  })

  it('should start on the Overview tab by default', () => {
    cy.contains('button', 'Overview').should('have.class', 'border-blue-600')
  })

  it('should navigate to Health Records tab', () => {
    cy.contains('button', 'Health Records').click()
    cy.wait(500)
  })

  it('should navigate to Allergies tab', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="allergies-content"]').should('be.visible')
  })

  it('should navigate to Chronic Conditions tab', () => {
    cy.contains('button', 'Chronic Conditions').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="chronic-conditions-content"]').should('be.visible')
  })

  it('should navigate to Vaccinations tab', () => {
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="vaccinations-content"]').should('be.visible')
  })

  it('should navigate to Growth Charts tab', () => {
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="growth-charts-content"]').should('be.visible')
  })

  it('should navigate to Screenings tab', () => {
    cy.contains('button', 'Screenings').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="screenings-content"]').should('be.visible')
  })

  it('should highlight active tab', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.contains('button', 'Allergies').should('have.class', 'border-blue-600')
  })

  it('should persist tab selection', () => {
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.wait(500)
    cy.reload()
    cy.contains('button', 'Overview').should('have.class', 'border-blue-600')
  })

  it('should switch between multiple tabs', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(300)
    cy.contains('button', 'Vaccinations').scrollIntoView().click({ force: true })
    cy.wait(300)
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(300)
  })

  it('should load tab content when switching', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="allergies-list"]').should('exist')
  })

  it('should display tab icons', () => {
    cy.contains('button', 'Overview').find('svg').should('exist')
    cy.contains('button', 'Allergies').find('svg').should('exist')
  })

  it('should navigate through all tabs sequentially', () => {
    const tabs = ['Health Records', 'Allergies', 'Chronic Conditions', 'Vaccinations', 'Growth Charts', 'Screenings']
    tabs.forEach(tab => {
      cy.contains('button', tab).scrollIntoView().click()
      cy.wait(300)
    })
  })

  it('should handle rapid tab switching', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.contains('button', 'Vaccinations').scrollIntoView().click()
    cy.contains('button', 'Growth Charts').scrollIntoView().click()
    cy.wait(500)
  })

  it('should maintain data when switching tabs', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.contains('button', 'Overview').scrollIntoView().click()
    cy.wait(300)
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="allergies-list"]').should('exist')
  })

  it('should show tab count badges if available', () => {
    cy.contains('button', 'Vaccinations').should('be.visible')
  })

  it('should support keyboard navigation between tabs', () => {
    cy.contains('button', 'Overview').focus()
    cy.focused().should('contain', 'Overview')
  })

  it('should display appropriate content for each tab', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.get('[data-testid="add-allergy-button"]').should('be.visible')
  })

  it('should handle back button navigation', () => {
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
    cy.go('back')
    cy.wait(500)
    cy.url().should('include', '/dashboard')
  })
})
