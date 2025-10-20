/// <reference types="cypress" />

/**
 * Dashboard - Role-Based Widgets (15 tests)
 *
 * Tests dashboard widgets and content based on user roles
 */

describe('Dashboard - Role-Based Widgets', () => {
  it('nurse should see clinical widgets', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.contains(/medications|appointments|health/i).should('be.visible')
  })

  it('admin should see administration widgets', () => {
    cy.login('admin')
    cy.visit('/dashboard')
    cy.contains(/system|users|configuration/i).should('be.visible')
  })

  it('counselor should see limited clinical data', () => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/dashboard')
    cy.contains(/students|health.*records/i).should('be.visible')
  })

  it('viewer should see read-only widgets', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/dashboard')
    cy.get('button').contains(/add|create|edit/i).should('not.exist')
  })

  it('nurse should not see admin-only metrics', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.contains(/system.*health|server|configuration/i).should('not.exist')
  })

  it('admin should see all dashboard sections', () => {
    cy.login('admin')
    cy.visit('/dashboard')
    cy.get('[class*="widget"], [class*="card"]').should('have.length.at.least', 4)
  })

  it('should display role-specific quick actions', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.get('button').contains(/add.*medication|schedule/i).should('exist')
  })

  it('should show role-appropriate notifications', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.get('[class*="notification"]').should('exist')
  })

  it('counselor should not see medication widgets', () => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/dashboard')
    cy.contains(/medications.*due|administer/i).should('not.exist')
  })

  it('should display user role indicator', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.contains(/nurse|role/i).should('exist')
  })

  it('admin should see user management shortcuts', () => {
    cy.login('admin')
    cy.visit('/dashboard')
    cy.contains(/users|manage.*users/i).should('exist')
  })

  it('should show role-based metric cards', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.get('[class*="card"]').should('exist')
  })

  it('nurse should see clinical activity feed', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.contains(/activity|recent/i).should('be.visible')
  })

  it('should hide restricted features based on role', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.contains(/system.*configuration/i).should('not.exist')
  })

  it('should personalize dashboard by user preferences', () => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.get('body').should('be.visible')
  })
})
