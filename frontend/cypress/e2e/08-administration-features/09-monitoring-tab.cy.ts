/// <reference types="cypress" />

/**
 * Administration Features: Monitoring Tab (20 tests)
 *
 * Tests system monitoring and health metrics
 */

describe('Administration Features - Monitoring Tab', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.contains('button', 'Monitoring').click()
  })

  it('should display the Monitoring tab content', () => {
    cy.contains('button', 'Monitoring').should('have.class', 'border-blue-500')
  })

  it('should show monitoring heading', () => {
    cy.contains(/monitoring|system.*health/i).should('be.visible')
  })

  it('should display system health metrics', () => {
    cy.get('[class*="grid"]').should('exist')
  })

  it('should show CPU usage metric', () => {
    cy.contains(/cpu/i).should('be.visible')
  })

  it('should display memory usage metric', () => {
    cy.contains(/memory|ram/i).should('be.visible')
  })

  it('should show disk usage metric', () => {
    cy.contains(/disk|storage/i).should('be.visible')
  })

  it('should display database status', () => {
    cy.contains(/database|postgres/i).should('be.visible')
  })

  it('should show API response time', () => {
    cy.contains(/response.*time|latency/i).should('be.visible')
  })

  it('should display uptime metric', () => {
    cy.contains(/uptime/i).should('be.visible')
  })

  it('should show active connections', () => {
    cy.contains(/connection|active.*user/i).should('be.visible')
  })

  it('should display error rate metric', () => {
    cy.contains(/error|failure/i).should('exist')
  })

  it('should show refresh button', () => {
    cy.get('button').contains(/refresh|reload/i).should('be.visible')
  })

  it('should display charts or graphs', () => {
    cy.get('svg, canvas, [class*="chart"]').should('exist')
  })

  it('should show real-time updates', () => {
    cy.contains(/real.*time|live/i).should('exist')
  })

  it('should display alert thresholds', () => {
    cy.contains(/threshold|alert/i).should('exist')
  })

  it('should show service status indicators', () => {
    cy.get('[class*="bg-green"], [class*="bg-red"], [class*="status"]').should('exist')
  })

  it('should display queue metrics', () => {
    cy.contains(/queue|jobs/i).should('exist')
  })

  it('should show cache hit rate', () => {
    cy.contains(/cache|redis/i).should('exist')
  })

  it('should have export metrics option', () => {
    cy.get('button').contains(/export|download/i).should('exist')
  })

  it('should display time range selector', () => {
    cy.get('select, button').contains(/hour|day|week/i).should('exist')
  })
})
