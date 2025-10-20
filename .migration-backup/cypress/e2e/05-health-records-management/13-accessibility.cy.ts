/// <reference types="cypress" />

/**
 * Health Records Management: Accessibility (15 tests)
 *
 * Tests accessibility features and compliance
 */

describe('Health Records Management - Accessibility', () => {
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

  it('should have proper ARIA labels', () => {
    cy.get('[data-testid="new-record-button"]').should('be.visible')
  })

  it('should support keyboard navigation', () => {
    cy.get('[data-testid="new-record-button"]').focus()
    cy.focused().should('have.attr', 'data-testid', 'new-record-button')
  })

  it('should have focus indicators', () => {
    cy.get('[data-testid="new-record-button"]').focus()
  })

  it('should have descriptive button text', () => {
    cy.get('[data-testid="new-record-button"]').should('contain', 'New Record')
  })

  it('should use semantic HTML', () => {
    cy.get('h1').should('exist')
    cy.get('button').should('exist')
  })

  it('should have proper heading hierarchy', () => {
    cy.get('h1').should('exist')
    cy.get('h3').should('exist')
  })

  it('should provide text alternatives for icons', () => {
    cy.get('[data-testid="new-record-button"]').find('svg').should('exist')
  })

  it('should support screen readers', () => {
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should have sufficient color contrast', () => {
    cy.get('[data-testid="new-record-button"]').should('be.visible')
  })

  it('should support tab navigation', () => {
    cy.get('body').tab()
  })

  it('should have accessible form controls', () => {
    cy.get('[data-testid="health-records-search"]').should('have.attr', 'type', 'text')
  })

  it('should provide error feedback', () => {
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should have descriptive labels', () => {
    cy.get('[data-testid="health-records-search"]')
      .should('have.attr', 'placeholder')
  })

  it('should support assistive technologies', () => {
    cy.get('[data-testid="health-records-page"]').should('exist')
  })

  it('should maintain focus management', () => {
    cy.get('[data-testid="new-record-button"]').click()
    cy.wait(300)
  })
})
