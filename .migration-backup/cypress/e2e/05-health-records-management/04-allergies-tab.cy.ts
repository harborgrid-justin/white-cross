/// <reference types="cypress" />

/**
 * Health Records Management: Allergies Tab (20 tests)
 *
 * Tests allergy management functionality
 */

describe('Health Records Management - Allergies Tab', () => {
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
    cy.contains('button', 'Allergies').scrollIntoView().click()
    cy.wait(500)
  })

  it('should display allergies tab content', () => {
    cy.get('[data-testid="allergies-content"]').should('be.visible')
  })

  it('should show add allergy button', () => {
    cy.get('[data-testid="add-allergy-button"]').should('be.visible')
  })

  it('should display allergies list', () => {
    cy.get('[data-testid="allergies-list"]').should('exist')
  })

  it('should show allergy items', () => {
    cy.get('[data-testid="allergy-item"]').should('have.length.at.least', 1)
  })

  it('should display allergen names', () => {
    cy.get('[data-testid="allergen-name"]').first().should('be.visible')
  })

  it('should show severity badges', () => {
    cy.get('[data-testid="severity-badge"]').should('exist')
  })

  it('should display verification status', () => {
    cy.get('[data-testid="verification-status"]').should('exist')
  })

  it('should show life-threatening allergies in red', () => {
    cy.get('[data-testid="allergy-item"]').first().within(() => {
      cy.get('svg').should('have.class', 'text-red-600')
    })
  })

  it('should display treatment details', () => {
    cy.get('[data-testid="treatment-details"]').should('exist')
  })

  it('should show provider name', () => {
    cy.get('[data-testid="provider-name"]').should('exist')
  })

  it('should show edit buttons for each allergy', () => {
    cy.get('[data-testid="edit-allergy-button"]').should('have.length.at.least', 1)
  })

  it('should click add allergy button', () => {
    cy.get('[data-testid="add-allergy-button"]').scrollIntoView().click()
  })

  it('should click edit allergy button', () => {
    cy.get('[data-testid="edit-allergy-button"]').first().scrollIntoView().click()
  })

  it('should display verified allergies with green badge', () => {
    cy.contains('[data-testid="verification-status"]', 'Verified')
      .should('have.class', 'bg-green-100')
  })

  it('should display unverified allergies with gray badge', () => {
    cy.contains('[data-testid="verification-status"]', 'Unverified')
      .should('have.class', 'bg-gray-100')
  })

  it('should show multiple severity levels', () => {
    cy.get('[data-testid="severity-badge"]').should('contain.text', 'LIFE_THREATENING')
      .or('contain.text', 'SEVERE')
      .or('contain.text', 'MODERATE')
  })

  it('should display allergen icons', () => {
    cy.get('[data-testid="allergy-item"]').first().find('svg').should('exist')
  })

  it('should organize allergies in a list format', () => {
    cy.get('[data-testid="allergies-list"]').children().should('have.length.at.least', 1)
  })

  it('should show allergy section heading', () => {
    cy.contains('Student Allergies').should('be.visible')
  })

  it('should maintain allergy data integrity', () => {
    cy.get('[data-testid="allergen-name"]').first().invoke('text').should('not.be.empty')
  })
})
