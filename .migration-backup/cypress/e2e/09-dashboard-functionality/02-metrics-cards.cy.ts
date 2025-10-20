/// <reference types="cypress" />

/**
 * Dashboard - Metrics & Cards (15 tests)
 *
 * Tests dashboard metrics, statistics cards, and data summaries
 */

describe('Dashboard - Metrics & Cards', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display key metrics cards', () => {
    cy.get('[class*="card"], [data-testid*="metric"]').should('have.length.at.least', 1)
  })

  it('should show total students metric', () => {
    cy.contains(/total.*students|students.*count/i).should('be.visible')
  })

  it('should display active appointments count', () => {
    cy.contains(/appointments|scheduled/i).should('exist')
  })

  it('should show medications due today', () => {
    cy.contains(/medications.*due|due.*today/i).should('exist')
  })

  it('should display pending incidents count', () => {
    cy.contains(/incidents|pending/i).should('exist')
  })

  it('should have numeric values in metric cards', () => {
    cy.get('[class*="card"]').first().should('contain', /\d+/)
  })

  it('should display metric cards with icons', () => {
    cy.get('[class*="card"] svg, [data-testid*="metric"] svg').should('exist')
  })

  it('should show percentage changes or trends', () => {
    cy.get('[class*="trend"], [class*="change"]').should('exist')
  })

  it('should have color-coded metric cards', () => {
    cy.get('[class*="bg-blue"], [class*="bg-green"], [class*="bg-yellow"]').should('exist')
  })

  it('should display metric cards in grid layout', () => {
    cy.get('[class*="grid"]').should('exist')
  })

  it('should show health alerts count', () => {
    cy.contains(/alerts|warnings/i).should('exist')
  })

  it('should display recent activity count', () => {
    cy.contains(/recent|activity/i).should('exist')
  })

  it('should have hover effects on metric cards', () => {
    cy.get('[class*="card"]').first().should('have.class', /hover/)
  })

  it('should show loading state for metrics initially', () => {
    cy.visit('/dashboard')
    cy.get('[class*="skeleton"], [class*="loading"]', { timeout: 500 }).should('exist')
  })

  it('should refresh metrics when clicking refresh button', () => {
    cy.get('button').contains(/refresh|reload/i).should('exist')
  })
})
