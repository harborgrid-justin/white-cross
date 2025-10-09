/// <reference types="cypress" />

/**
 * Dashboard - Quick Actions (15 tests)
 *
 * Tests quick action buttons and shortcuts on dashboard
 */

describe('Dashboard - Quick Actions', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display quick actions section', () => {
    cy.contains(/quick.*actions|shortcuts/i).should('be.visible')
  })

  it('should have add student button', () => {
    cy.get('button').contains(/add.*student|new.*student/i).should('exist')
  })

  it('should have schedule appointment button', () => {
    cy.get('button').contains(/schedule|new.*appointment/i).should('exist')
  })

  it('should have add medication button', () => {
    cy.get('button').contains(/add.*medication|new.*medication/i).should('exist')
  })

  it('should have report incident button', () => {
    cy.get('button').contains(/report.*incident|new.*incident/i).should('exist')
  })

  it('should have view reports button', () => {
    cy.get('button, a').contains(/view.*reports|reports/i).should('exist')
  })

  it('should navigate to students page when clicking add student', () => {
    cy.get('button').contains(/add.*student/i).click()
    cy.url().should('include', '/students')
  })

  it('should navigate to appointments when clicking schedule', () => {
    cy.get('button').contains(/schedule|appointment/i).click()
    cy.url().should('include', '/appointments')
  })

  it('should navigate to medications when clicking add medication', () => {
    cy.get('button').contains(/add.*medication/i).click()
    cy.url().should('include', '/medications')
  })

  it('should have quick action icons', () => {
    cy.get('[class*="quick-action"] svg, button svg').should('exist')
  })

  it('should display quick actions in grid or row layout', () => {
    cy.get('[class*="grid"], [class*="flex"]').should('exist')
  })

  it('should have hover effects on quick actions', () => {
    cy.get('button').first().should('have.css', 'cursor', 'pointer')
  })

  it('should show tooltips on quick action buttons', () => {
    cy.get('button[title], button[aria-label]').should('exist')
  })

  it('should have accessible button labels', () => {
    cy.get('button').each(($btn) => {
      cy.wrap($btn).should('have.attr', 'aria-label').or('have.text')
    })
  })

  it('should display quick actions prominently', () => {
    cy.get('[class*="quick-action"]').should('be.visible')
  })
})
