/// <reference types="cypress" />

/**
 * Appointment Scheduling: Appointment Viewing & Details (12 tests)
 *
 * Tests appointment viewing and details display
 */

describe('Appointment Scheduling - Appointment Viewing & Details', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display appointments in calendar view', () => {
    cy.get('[data-testid=calendar-view]').should('be.visible')
    cy.get('[data-testid=appointment-event]').should('exist')
  })

  it('should switch to list view when list button is clicked', () => {
    cy.get('[data-testid=view-list-button]').click()
    cy.get('[data-testid=appointments-list]').should('be.visible')
  })

  it('should display appointment details when clicked', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-details-modal]').should('be.visible')
  })

  it('should show student name in appointment details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-student-name]').should('be.visible')
  })

  it('should show appointment date and time in details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-datetime]').should('be.visible')
  })

  it('should show appointment type in details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-type-display]').should('be.visible')
  })

  it('should show appointment notes in details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-notes-display]').should('be.visible')
  })

  it('should show appointment duration in details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-duration-display]').should('be.visible')
  })

  it('should show appointment status in details', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-status]').should('be.visible')
  })

  it('should close details modal when close button is clicked', () => {
    cy.get('[data-testid=appointment-event]').first().click()
    cy.get('[data-testid=appointment-details-modal]').should('be.visible')
    cy.get('[data-testid=close-details-button]').click()
    cy.get('[data-testid=appointment-details-modal]').should('not.exist')
  })

  it('should display appointments in list format', () => {
    cy.get('[data-testid=view-list-button]').click()
    cy.get('[data-testid=appointment-list-item]').should('have.length.greaterThan', 0)
  })

  it('should create audit log when viewing appointment details', () => {
    cy.intercept('POST', '/api/audit-log').as('auditLog')

    cy.get('[data-testid=appointment-event]').first().click()

    cy.wait('@auditLog').its('request.body').should('deep.include', {
      action: 'VIEW_APPOINTMENT',
      resourceType: 'APPOINTMENT'
    })
  })
})
