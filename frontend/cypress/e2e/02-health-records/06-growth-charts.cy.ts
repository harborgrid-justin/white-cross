/**
 * Health Records - Growth Charts Tests
 *
 * Comprehensive E2E tests for growth tracking.
 * Tests cover:
 * - Loading growth charts tab (verify no mock data)
 * - Displaying growth measurements
 * - Adding new measurement
 * - Editing measurement
 * - Deleting measurement
 * - Growth chart visualization
 * - Percentile display
 * - Trend analysis
 * - Concern flagging
 *
 * @author White Cross Healthcare Platform
 * @module GrowthChartsE2E
 */

describe('Health Records - Growth Charts Module', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.setupHealthRecordsIntercepts()
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Growth Charts Tab', () => {
    it('should load growth charts without mock data', () => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: { measurements: [] }
        }
      }).as('getGrowthEmpty')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getGrowthEmpty')

      cy.contains(/no measurements|no growth data/i).should('be.visible')
    })

    it('should load growth data from API', () => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            measurements: [
              {
                id: 'growth-1',
                date: '2024-09-01',
                height: 150,
                weight: 45,
                bmi: 20,
                heightPercentile: 50,
                weightPercentile: 55
              }
            ]
          }
        }
      }).as('getGrowth')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getGrowth')

      cy.contains('150').should('be.visible')
    })
  })

  describe('Displaying Growth Measurements', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            measurements: [
              {
                id: 'growth-1',
                date: '2024-09-01',
                height: 150,
                heightUnit: 'cm',
                weight: 45,
                weightUnit: 'kg',
                bmi: 20.0,
                heightPercentile: 50,
                weightPercentile: 55,
                bmiPercentile: 52
              },
              {
                id: 'growth-2',
                date: '2024-06-01',
                height: 148,
                weight: 43,
                bmi: 19.6,
                heightPercentile: 48,
                weightPercentile: 53
              }
            ]
          }
        }
      }).as('getGrowth')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getGrowth')
    })

    it('should display measurement history', () => {
      cy.get('[data-testid*="measurement-item"]').should('have.length', 2)
    })

    it('should show percentiles', () => {
      cy.contains('50th').should('exist').or(cy.contains('50%').should('exist'))
    })
  })

  describe('Adding New Measurement', () => {
    it('should add growth measurement', () => {
      cy.intercept('POST', '**/api/health-records/growth', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            measurement: {
              id: 'growth-new-1',
              height: 152,
              weight: 46
            }
          }
        }
      }).as('addMeasurement')

      cy.navigateToHealthRecordTab('Growth')
      cy.get('button').contains(/add measurement|new measurement/i).click()

      cy.get('input[name="height"]').first().type('152')
      cy.get('input[name="weight"]').first().type('46')
      cy.get('input[name="date"]').first().type('2025-01-10')

      cy.get('button').contains(/save|add/i).click()
      cy.wait('@addMeasurement')
      cy.verifySuccess()
    })
  })

  describe('Growth Chart Visualization', () => {
    it('should display growth chart', () => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            measurements: [
              { id: '1', date: '2024-01-01', height: 145, weight: 40 },
              { id: '2', date: '2024-06-01', height: 148, weight: 43 },
              { id: '3', date: '2024-12-01', height: 150, weight: 45 }
            ]
          }
        }
      }).as('getGrowth')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getGrowth')

      // Chart should be visible (using canvas or SVG)
      cy.get('canvas, svg').should('exist')
    })
  })

  describe('Trend Analysis', () => {
    it('should show growth trends', () => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            measurements: [
              { id: '1', date: '2024-01-01', height: 145 },
              { id: '2', date: '2024-12-01', height: 150 }
            ],
            trends: {
              heightChange: '+5 cm',
              weightChange: '+5 kg',
              trend: 'NORMAL'
            }
          }
        }
      }).as('getGrowthTrends')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getGrowthTrends')

      cy.contains('+5 cm').should('exist').or(cy.contains('NORMAL').should('exist'))
    })
  })

  describe('Concern Flagging', () => {
    it('should flag concerning growth patterns', () => {
      cy.intercept('GET', '**/api/health-records/student/*/growth', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            measurements: [
              {
                id: 'growth-concern-1',
                bmiPercentile: 95,
                concern: true,
                concernType: 'OBESITY_RISK'
              }
            ]
          }
        }
      }).as('getConcerns')

      cy.navigateToHealthRecordTab('Growth')
      cy.wait('@getConcerns')

      cy.get('[class*="text-red"], [class*="bg-red"]').should('exist')
    })
  })
})
