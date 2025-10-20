/**
 * Health Records - Vital Signs Tests
 *
 * Comprehensive E2E tests for vital signs tracking.
 * Tests cover:
 * - Loading vitals tab
 * - Displaying vital signs history
 * - Recording new vitals
 * - Latest vitals display
 * - Trend charts
 * - Normal range indicators
 * - Abnormal value alerts
 *
 * @author White Cross Healthcare Platform
 * @module VitalSignsE2E
 */

describe('Health Records - Vital Signs Module', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.setupHealthRecordsIntercepts()
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Vitals Tab', () => {
    it('should load vitals tab', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vitals', {
        statusCode: 200,
        body: {
          success: true,
          data: { vitals: [] }
        }
      }).as('getVitalsEmpty')

      cy.navigateToHealthRecordTab('Vitals')
      cy.wait('@getVitalsEmpty')

      cy.contains(/no vital signs|no vitals/i).should('be.visible')
    })
  })

  describe('Displaying Vital Signs History', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/vitals', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vitals: [
              {
                id: 'vital-1',
                date: '2025-01-10',
                temperature: 98.6,
                heartRate: 72,
                bloodPressureSystolic: 120,
                bloodPressureDiastolic: 80,
                respiratoryRate: 16,
                oxygenSaturation: 98
              }
            ]
          }
        }
      }).as('getVitals')

      cy.navigateToHealthRecordTab('Vitals')
      cy.wait('@getVitals')
    })

    it('should display vital signs', () => {
      cy.contains('98.6').should('be.visible')
      cy.contains('72').should('be.visible')
      cy.contains('120/80').should('exist')
    })
  })

  describe('Recording New Vitals', () => {
    it('should record vital signs', () => {
      cy.intercept('POST', '**/api/health-records/vitals', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            vital: {
              id: 'vital-new-1',
              temperature: 98.6
            }
          }
        }
      }).as('recordVital')

      cy.navigateToHealthRecordTab('Vitals')
      cy.get('button').contains(/record vitals|add vitals/i).click()

      cy.get('input[name="temperature"]').first().type('98.6')
      cy.get('input[name="heartRate"]').first().type('72')

      cy.get('button').contains(/save|record/i).click()
      cy.wait('@recordVital')
      cy.verifySuccess()
    })
  })

  describe('Normal Range Indicators', () => {
    it('should indicate normal values', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vitals', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vitals: [
              {
                id: 'vital-1',
                temperature: 98.6,
                temperatureStatus: 'NORMAL',
                heartRate: 72,
                heartRateStatus: 'NORMAL'
              }
            ]
          }
        }
      }).as('getNormalVitals')

      cy.navigateToHealthRecordTab('Vitals')
      cy.wait('@getNormalVitals')

      cy.get('[class*="text-green"], [class*="bg-green"]').should('exist')
    })
  })

  describe('Abnormal Value Alerts', () => {
    it('should alert on abnormal values', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vitals', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vitals: [
              {
                id: 'vital-abnormal-1',
                temperature: 102.5,
                temperatureStatus: 'HIGH',
                alert: true
              }
            ]
          }
        }
      }).as('getAbnormalVitals')

      cy.navigateToHealthRecordTab('Vitals')
      cy.wait('@getAbnormalVitals')

      cy.get('[class*="text-red"], [class*="bg-red"]').should('exist')
      cy.contains('HIGH').should('exist')
    })
  })
})
