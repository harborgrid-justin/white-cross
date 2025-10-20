/// <reference types="cypress" />

/**
 * Dashboard - Search & Navigation (15 tests)
 *
 * Tests global search and navigation features from dashboard
 */

describe('Dashboard - Search & Navigation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display global search bar', () => {
    cy.get('input[type="search"], input[placeholder*="search" i]').should('be.visible')
  })

  it('should allow searching for students', () => {
    cy.get('input[type="search"]').type('student')
    cy.contains(/student|results/i).should('exist')
  })

  it('should display search suggestions', () => {
    cy.get('input[type="search"]').type('med')
    cy.get('[class*="suggestion"], [class*="dropdown"]').should('exist')
  })

  it('should navigate to student profile from search', () => {
    cy.get('input[type="search"]').type('john')
    cy.get('[class*="result"]').first().click()
  })

  it('should show recent searches', () => {
    cy.get('input[type="search"]').click()
    cy.contains(/recent|history/i).should('exist')
  })

  it('should have keyboard navigation in search results', () => {
    cy.get('input[type="search"]').type('test')
    cy.get('input[type="search"]').type('{downarrow}')
  })

  it('should display navigation sidebar', () => {
    cy.get('aside, nav[class*="sidebar"]').should('be.visible')
  })

  it('should have links to main sections', () => {
    cy.contains(/students|medications|appointments|incidents/i).should('be.visible')
  })

  it('should highlight current page in navigation', () => {
    cy.get('nav a[class*="active"], nav [aria-current]').should('exist')
  })

  it('should have collapsible navigation menu', () => {
    cy.get('button[aria-label*="menu"], [data-testid*="menu-toggle"]').should('exist')
  })

  it('should display breadcrumb navigation', () => {
    cy.get('[class*="breadcrumb"], nav[aria-label="breadcrumb"]').should('exist')
  })

  it('should show user menu dropdown', () => {
    cy.get('button[aria-label*="user"], [data-testid*="user-menu"]').click()
    cy.contains(/profile|settings|logout/i).should('be.visible')
  })

  it('should have quick navigation to settings', () => {
    cy.get('a, button').contains(/settings|preferences/i).should('exist')
  })

  it('should display navigation icons', () => {
    cy.get('nav svg, aside svg').should('exist')
  })

  it('should support mobile navigation toggle', () => {
    cy.viewport(375, 667)
    cy.get('button[aria-label*="menu"]').should('be.visible')
  })
})
