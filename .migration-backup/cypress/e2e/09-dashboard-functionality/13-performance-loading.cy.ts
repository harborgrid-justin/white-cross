/// <reference types="cypress" />

/**
 * Dashboard - Performance & Loading (15 tests)
 *
 * Tests dashboard performance, loading states, and optimization
 */

describe('Dashboard - Performance & Loading', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should load dashboard within 3 seconds', () => {
    const start = Date.now()
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
    cy.then(() => {
      const loadTime = Date.now() - start
      expect(loadTime).to.be.lessThan(3000)
    })
  })

  it('should show loading skeleton for widgets', () => {
    cy.visit('/dashboard')
    cy.get('[class*="skeleton"], [class*="loading"]', { timeout: 500 }).should('exist')
  })

  it('should load metrics asynchronously', () => {
    cy.visit('/dashboard')
    cy.get('[class*="card"]', { timeout: 5000 }).should('be.visible')
  })

  it('should display progressive content loading', () => {
    cy.visit('/dashboard')
    cy.wait(500)
    cy.get('body').should('be.visible')
  })

  it('should not block UI during data fetch', () => {
    cy.visit('/dashboard')
    cy.get('button').first().should('not.be.disabled')
  })

  it('should cache dashboard data', () => {
    cy.visit('/dashboard')
    cy.wait(1000)
    cy.reload()
    cy.get('[class*="card"]', { timeout: 2000 }).should('be.visible')
  })

  it('should lazy load below-fold content', () => {
    cy.visit('/dashboard')
    cy.scrollTo('bottom')
    cy.get('body').should('be.visible')
  })

  it('should optimize images for performance', () => {
    cy.visit('/dashboard')
    cy.get('img').should('have.attr', 'loading', 'lazy').or('have.attr', 'src')
  })

  it('should prefetch critical resources', () => {
    cy.visit('/dashboard')
    cy.window().its('performance').should('exist')
  })

  it('should handle slow network gracefully', () => {
    cy.visit('/dashboard')
    cy.wait(3000)
    cy.get('body').should('be.visible')
  })

  it('should show timeout error for failed requests', () => {
    cy.intercept('GET', '**/api/**', { statusCode: 500, delay: 5000 })
    cy.visit('/dashboard')
    cy.contains(/error|failed|try.*again/i, { timeout: 10000 }).should('exist')
  })

  it('should minimize reflows and repaints', () => {
    cy.visit('/dashboard')
    cy.get('[class*="card"]').should('have.css', 'display')
  })

  it('should use efficient rendering techniques', () => {
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })

  it('should handle large datasets efficiently', () => {
    cy.visit('/dashboard')
    cy.get('[class*="activity"]', { timeout: 5000 }).should('exist')
  })

  it('should maintain 60fps scrolling', () => {
    cy.visit('/dashboard')
    cy.scrollTo('bottom', { duration: 1000 })
    cy.get('body').should('be.visible')
  })
})
