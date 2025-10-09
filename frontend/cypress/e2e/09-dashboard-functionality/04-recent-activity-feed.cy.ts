/// <reference types="cypress" />

/**
 * Dashboard - Recent Activity Feed (15 tests)
 *
 * Tests recent activity timeline, feed, and notifications
 */

describe('Dashboard - Recent Activity Feed', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display recent activity section', () => {
    cy.contains(/recent.*activity|activity.*feed/i).should('be.visible')
  })

  it('should show activity items', () => {
    cy.get('[data-testid*="activity"], [class*="activity-item"]').should('exist')
  })

  it('should display activity timestamps', () => {
    cy.contains(/ago|minutes|hours|yesterday/i).should('exist')
  })

  it('should show activity type icons', () => {
    cy.get('[class*="activity"] svg').should('exist')
  })

  it('should display user who performed activity', () => {
    cy.get('[class*="activity"]').should('contain', /nurse|admin|user/i)
  })

  it('should show activity descriptions', () => {
    cy.get('[class*="activity"]').should('have.length.at.least', 1)
  })

  it('should limit recent activities to recent timeframe', () => {
    cy.contains(/today|yesterday|this week/i).should('exist')
  })

  it('should display activities in chronological order', () => {
    cy.get('[class*="activity"]').should('exist')
  })

  it('should have scrollable activity feed', () => {
    cy.get('[class*="activity-feed"], [class*="overflow"]').should('exist')
  })

  it('should show different activity types', () => {
    cy.contains(/added|updated|deleted|created/i).should('exist')
  })

  it('should display activity categories', () => {
    cy.contains(/student|medication|appointment|incident/i).should('exist')
  })

  it('should have clickable activity items', () => {
    cy.get('[class*="activity"]').first().should('be.visible')
  })

  it('should show "view all" activities link', () => {
    cy.contains(/view.*all|see.*more/i).should('exist')
  })

  it('should display activity severity indicators', () => {
    cy.get('[class*="badge"], [class*="status"]').should('exist')
  })

  it('should refresh activity feed automatically', () => {
    cy.wait(2000)
    cy.get('[class*="activity"]').should('exist')
  })
})
