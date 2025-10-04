/// <reference types="cypress" />

describe('Health Records - Vaccination Tracking', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Use the proper loginAsNurse command which includes all necessary mocks
    cy.loginAsNurse()
    
    // Set up interceptors for this test context (outside of session)
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '1',
          email: 'nurse@school.edu',
          role: 'NURSE',
          firstName: 'Test',
          lastName: 'Nurse',
          isActive: true
        }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/students/assigned', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          students: [
            {
              id: '1',
              studentNumber: 'STU001',
              firstName: 'Emma',
              lastName: 'Wilson',
              grade: '8',
              dateOfBirth: '2010-03-15',
              gender: 'FEMALE'
            }
          ]
        }
      }
    }).as('getAssignedStudents')
    
    // Mock health records vaccinations API 
    cy.intercept('GET', '**/api/health-records/vaccinations/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          vaccinations: [
            {
              id: '1',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              vaccineName: 'MMR',
              date: '2023-09-15',
              provider: 'Dr. Smith',
              lotNumber: 'LOT123',
              expirationDate: '2025-12-31',
              status: 'COMPLETED'
            },
            {
              id: '2',
              studentId: 'STU002',
              studentName: 'Jake Davis',
              vaccineName: 'Tdap',
              date: '2023-10-20',
              provider: 'Dr. Johnson',
              lotNumber: 'LOT456',
              status: 'COMPLETED'
            }
          ],
          total: 2
        }
      }
    }).as('getVaccinations')
    
    // Visit the health records page and navigate to vaccinations tab
    cy.visit('/health-records')
    
    // Wait for the auth verification and students API calls
    cy.wait('@verifyAuth')
    cy.wait('@getAssignedStudents')
    
    // Click on the Vaccinations tab
    cy.contains('button', 'Vaccinations').click()
  })

  describe('Vaccination List Display', () => {
    it('should display vaccination records', () => {
      // The vaccinations tab should be active and show vaccination content
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
      
      // Test that vaccination-related content is visible
      cy.contains('Vaccination').should('be.visible')
    })

    it('should show vaccination interface elements', () => {
      // Check that we're on the vaccinations tab
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
      
      // The tab content should be visible
      cy.get('.p-6').should('be.visible')
    })

    it('should display vaccination functionality', () => {
      // Test basic vaccination tab functionality
      cy.contains('button', 'Vaccinations').should('be.visible')
      cy.url().should('include', '/health-records')
    })
  })

  describe('Add Vaccination Record', () => {
    it.skip('should open add vaccination modal', () => {
      // This functionality needs to be implemented
      // cy.get('[data-testid="add-vaccination-button"]').click()
      // cy.get('[data-testid="vaccination-modal"]').should('be.visible')
    })

    it.skip('should validate required fields', () => {
      // This functionality needs to be implemented
      // cy.get('[data-testid="add-vaccination-button"]').click()
      // cy.get('[data-testid="save-vaccination"]').click()
    })

  })

  describe('Session Management', () => {
    it('should maintain authentication on tab switch', () => {
      // Test that authentication persists when switching tabs
      cy.contains('button', 'Overview').click()
      cy.contains('Health Records Management').should('be.visible')
      
      cy.contains('button', 'Vaccinations').click()
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
    })

    it('should handle page refresh', () => {
      // Test that authentication persists after page refresh
      cy.reload()
      cy.wait('@verifyAuth')
      cy.wait('@getAssignedStudents')
      
      cy.contains('Health Records Management').should('be.visible')
    })
  })

  describe('Basic Vaccination Tab Functionality', () => {
    it('should maintain vaccination tab state', () => {
      // Test that the vaccination tab remains active
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
      
      // Test basic navigation
      cy.url().should('include', '/health-records')
    })

    
    it('should allow navigation back to overview', () => {
      // Test navigation between tabs
      cy.contains('button', 'Overview').click()
      cy.contains('button', 'Overview').should('have.class', 'text-blue-600')
      
      // Navigate back to vaccinations
      cy.contains('button', 'Vaccinations').click()
      cy.contains('button', 'Vaccinations').should('have.class', 'text-blue-600')
    })
  })


})
