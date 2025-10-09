/// <reference types="cypress" />

/**
 * Appointment Scheduling: Page Load & UI Structure (10 tests)
 *
 * Tests page load behavior and UI element visibility
 * Validates core navigation, calendar view, and filter controls
 */

describe('Appointment Scheduling - Page Load & UI Structure', () => {
  beforeEach(() => {
    // Intercept appointments API to ensure controlled test state
    cy.intercept('GET', '/api/appointments*').as('getAppointments')

    cy.login('nurse')
    cy.visit('/appointments')

    // Wait for initial data load
    cy.wait('@getAppointments')
  })

  it('should display the appointments page with correct title', () => {
    cy.contains('Appointments').should('be.visible')
    cy.url().should('include', '/appointments')

    // Verify page is fully loaded
    cy.get('[data-cy=appointments-page], [data-testid=appointments-page]', { timeout: 10000 })
      .should('exist')
  })

  it('should display calendar view by default', () => {
    cy.get('[data-cy=calendar-view], [data-testid=calendar-view]')
      .should('be.visible')
      .and('not.have.class', 'hidden')
  })

  it('should display add appointment button with correct text', () => {
    cy.get('[data-cy=add-appointment-button], [data-testid=add-appointment-button]')
      .should('be.visible')
      .and('be.enabled')
      .and('contain', 'New Appointment')
      .should('have.attr', 'aria-label')
  })

  it('should display view toggle buttons (Calendar/List)', () => {
    cy.get('[data-cy=view-calendar-button], [data-testid=view-calendar-button]')
      .should('be.visible')
      .and('be.enabled')

    cy.get('[data-cy=view-list-button], [data-testid=view-list-button]')
      .should('be.visible')
      .and('be.enabled')
  })

  it('should display date navigation controls with accessibility', () => {
    cy.get('[data-cy=prev-period-button], [data-testid=prev-period-button]')
      .should('be.visible')
      .and('be.enabled')
      .should('have.attr', 'aria-label')

    cy.get('[data-cy=next-period-button], [data-testid=next-period-button]')
      .should('be.visible')
      .and('be.enabled')
      .should('have.attr', 'aria-label')

    cy.get('[data-cy=today-button], [data-testid=today-button]')
      .should('be.visible')
      .and('be.enabled')
  })

  it('should display current date/period indicator', () => {
    cy.get('[data-cy=current-period-display], [data-testid=current-period-display]')
      .should('be.visible')
      .and('not.be.empty')
  })

  it('should display appointment count indicator', () => {
    cy.get('[data-cy=appointment-count], [data-testid=appointment-count]')
      .should('be.visible')
      .invoke('text')
      .should('match', /\d+/) // Should contain a number
  })

  it('should display filter options', () => {
    cy.get('[data-cy=filter-button], [data-testid=filter-button]')
      .should('be.visible')
      .and('be.enabled')
  })

  it('should load without errors and display key UI elements', () => {
    // Verify no error messages are displayed
    cy.get('[data-cy=error-message], [data-testid=error-message]')
      .should('not.exist')

    // Verify page structure is intact
    cy.get('body').should('be.visible')
    cy.url().should('include', '/appointments')

    // Verify critical elements are present
    cy.get('[data-cy=calendar-view], [data-testid=calendar-view]')
      .should('exist')
  })

  it('should display loading state initially when data loads slowly', () => {
    // Intercept with delay to test loading state
    cy.intercept('GET', '/api/appointments*', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    }).as('getAppointmentsDelayed')

    cy.visit('/appointments')

    // Verify loading indicator appears
    cy.get('[data-cy=loading-spinner], [data-testid=loading-spinner]')
      .should('be.visible')

    // Wait for data to load
    cy.wait('@getAppointmentsDelayed')

    // Verify loading indicator disappears
    cy.get('[data-cy=loading-spinner], [data-testid=loading-spinner]')
      .should('not.exist')

    // Verify calendar is displayed
    cy.get('[data-cy=calendar-view], [data-testid=calendar-view]')
      .should('be.visible')
  })
})
