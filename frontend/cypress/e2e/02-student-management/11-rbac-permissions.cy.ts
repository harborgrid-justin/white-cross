/// <reference types="cypress" />

/**
 * Student Management: Role-Based Permissions (10 tests)
 *
 * Tests RBAC controls for different user roles
 */

describe('Student Management - Role-Based Permissions', () => {
  it('should allow admin to view student management page', () => {
    cy.login('admin')
    cy.visit('/students')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should allow nurse to view student management page', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/students')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should allow counselor to view student management page', () => {
    cy.loginAs('counselor@school.edu', 'CounselorPassword123!')
    cy.visit('/students')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should allow admin to create students', () => {
    cy.login('admin')
    cy.visit('/students')
    cy.get('[data-testid=add-student-button]').should('be.visible')
  })

  it('should allow nurse to create students', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/students')
    cy.get('[data-testid=add-student-button]').should('be.visible')
  })

  it('should NOT allow viewer to create students', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/students')
    cy.get('[data-testid=add-student-button]').should('not.exist')
  })

  it('should NOT allow nurse to delete students', () => {
    cy.loginAs('nurse@school.edu', 'testNursePassword')
    cy.visit('/students')

    // Wait for student data to load
    cy.get('[data-testid=student-table]', { timeout: 10000 }).should('be.visible')
    cy.waitForHealthcareData()
    cy.get('[data-testid=student-row]', { timeout: 10000 }).should('exist').and('have.length.at.least', 1)

    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=delete-student-button]').should('not.exist')
    })
  })

  it('should allow admin to delete students', () => {
    cy.login('admin')
    cy.visit('/students')

    // Wait for student data to load
    cy.get('[data-testid=student-table]', { timeout: 10000 }).should('be.visible')
    cy.waitForHealthcareData()
    cy.get('[data-testid=student-row]', { timeout: 10000 }).should('exist').and('have.length.at.least', 1)

    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=delete-student-button]').scrollIntoView().should('be.visible')
    })
  })

  it('should NOT allow viewer to access student management page', () => {
    cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
    cy.visit('/students', { failOnStatusCode: false })

    // Viewer should see access denied message
    cy.contains(/access denied|insufficient permissions|not have permission/i, { timeout: 10000 })
      .should('be.visible')

    // Should show HIPAA compliance notice
    cy.contains(/HIPAA Compliance/i).should('be.visible')

    // Student table should not be visible
    cy.get('[data-testid=student-table]').should('not.exist')
  })

  it('should redirect unauthenticated users to login', () => {
    cy.visit('/students')
    cy.url().should('include', '/login')
  })
})
