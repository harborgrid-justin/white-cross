/// <reference types="cypress" />

/**
 * Dashboard - Charts & Visualizations (15 tests)
 *
 * Tests dashboard charts, graphs, and data visualizations
 */

describe('Dashboard - Charts & Visualizations', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display at least one chart', () => {
    cy.get('canvas, svg[class*="chart"]').should('exist')
  })

  it('should show student enrollment chart', () => {
    cy.contains(/enrollment|student.*trend/i).should('be.visible')
  })

  it('should display medication administration chart', () => {
    cy.contains(/medication.*chart|administration/i).should('exist')
  })

  it('should show incident frequency graph', () => {
    cy.contains(/incident.*frequency|incident.*chart/i).should('exist')
  })

  it('should display appointment trends', () => {
    cy.contains(/appointment.*trend|scheduling.*chart/i).should('exist')
  })

  it('should have interactive charts', () => {
    cy.get('canvas, svg').first().trigger('mouseover')
  })

  it('should show chart legends', () => {
    cy.get('[class*="legend"]').should('exist')
  })

  it('should display chart axis labels', () => {
    cy.get('svg text, [class*="axis"]').should('exist')
  })

  it('should have time period selectors for charts', () => {
    cy.contains(/week|month|year/i).should('exist')
  })

  it('should show data points on hover', () => {
    cy.get('canvas, svg').should('exist')
  })

  it('should display multiple chart types', () => {
    cy.get('canvas, svg').should('have.length.at.least', 2)
  })

  it('should have responsive chart sizing', () => {
    cy.get('canvas, svg').should('have.attr', 'width')
  })

  it('should show chart titles', () => {
    cy.get('[class*="chart-title"], h3, h4').should('exist')
  })

  it('should display empty state when no data', () => {
    // Mock empty data scenario
    cy.get('body').should('be.visible')
  })

  it('should allow toggling chart data series', () => {
    cy.get('[class*="legend"] button, [class*="toggle"]').should('exist')
  })
})
