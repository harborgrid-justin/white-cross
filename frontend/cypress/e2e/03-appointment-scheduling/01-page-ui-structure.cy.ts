/// <reference types="cypress" />

/**
 * Appointment Scheduling: Page Load & UI Structure (10 tests)
 *
 * Tests page load behavior and UI element visibility
 */

describe('Appointment Scheduling - Page Load & UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display the appointments page with correct title', () => {
    cy.contains('Appointments').should('be.visible')
    cy.url().should('include', '/appointments')
  })

  it('should display calendar view by default', () => {
    cy.get('[data-testid=calendar-view]').should('be.visible')
  })

  it('should display add appointment button', () => {
    cy.get('[data-testid=add-appointment-button]').should('be.visible')
    cy.get('[data-testid=add-appointment-button]').should('contain', 'New Appointment')
  })

  it('should display view toggle buttons (Calendar/List)', () => {
    cy.get('[data-testid=view-calendar-button]').should('be.visible')
    cy.get('[data-testid=view-list-button]').should('be.visible')
  })

  it('should display date navigation controls', () => {
    cy.get('[data-testid=prev-period-button]').should('be.visible')
    cy.get('[data-testid=next-period-button]').should('be.visible')
    cy.get('[data-testid=today-button]').should('be.visible')
  })

  it('should display current date/period indicator', () => {
    cy.get('[data-testid=current-period-display]').should('be.visible')
  })

  it('should display appointment count indicator', () => {
    cy.get('[data-testid=appointment-count]').should('be.visible')
  })

  it('should display filter options', () => {
    cy.get('[data-testid=filter-button]').should('be.visible')
  })

  it('should load without errors', () => {
    cy.get('body').should('be.visible')
    cy.url().should('include', '/appointments')
  })

  it('should display loading state initially', () => {
    cy.intercept('GET', '/api/appointments*', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    }).as('getAppointments')

    cy.visit('/appointments')
    cy.get('[data-testid=loading-spinner]').should('be.visible')
  })
})
