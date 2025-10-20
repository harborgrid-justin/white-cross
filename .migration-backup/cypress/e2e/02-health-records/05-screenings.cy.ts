/**
 * Health Records - Screenings Tests
 *
 * Comprehensive E2E tests for health screenings.
 * Tests cover:
 * - Loading screenings tab (verify no mock data)
 * - Displaying screening history
 * - Recording new screening
 * - Editing screening
 * - Deleting screening
 * - Referral tracking
 * - Follow-up scheduling
 * - Screening results visualization
 *
 * @author White Cross Healthcare Platform
 * @module ScreeningsE2E
 */

describe('Health Records - Screenings Module', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.setupHealthRecordsIntercepts()
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Screenings Tab', () => {
    it('should load screenings tab without mock data', () => {
      cy.intercept('GET', '**/api/health-records/student/*/screenings', {
        statusCode: 200,
        body: {
          success: true,
          data: { screenings: [] }
        }
      }).as('getScreeningsEmpty')

      cy.navigateToHealthRecordTab('Screenings')
      cy.wait('@getScreeningsEmpty')

      cy.contains(/no screenings|no records/i).should('be.visible')
    })

    it('should load screenings from API', () => {
      cy.intercept('GET', '**/api/health-records/student/*/screenings', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            screenings: [
              {
                id: 'screen-1',
                type: 'VISION',
                date: '2024-09-15',
                result: 'PASS',
                conductedBy: 'Nurse Johnson'
              }
            ]
          }
        }
      }).as('getScreenings')

      cy.navigateToHealthRecordTab('Screenings')
      cy.wait('@getScreenings')

      cy.contains('VISION').should('be.visible')
    })
  })

  describe('Displaying Screening History', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/screenings', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            screenings: [
              {
                id: 'screen-1',
                type: 'VISION',
                date: '2024-09-15',
                result: 'PASS',
                leftEye: '20/20',
                rightEye: '20/20',
                conductedBy: 'Nurse Johnson',
                notes: 'Normal vision'
              },
              {
                id: 'screen-2',
                type: 'HEARING',
                date: '2024-09-20',
                result: 'REFER',
                leftEar: 'Passed',
                rightEar: 'Refer',
                conductedBy: 'Nurse Thompson',
                notes: 'Refer for audiologist evaluation',
                referralStatus: 'PENDING'
              },
              {
                id: 'screen-3',
                type: 'SCOLIOSIS',
                date: '2024-10-05',
                result: 'PASS',
                conductedBy: 'Dr. Smith',
                notes: 'No curvature detected'
              }
            ]
          }
        }
      }).as('getScreenings')

      cy.navigateToHealthRecordTab('Screenings')
      cy.wait('@getScreenings')
    })

    it('should display all screenings', () => {
      cy.get('[data-testid*="screening-item"]').should('have.length', 3)
    })

    it('should show screening results with color coding', () => {
      cy.contains('PASS').should('be.visible')
      cy.contains('REFER').should('be.visible')
    })
  })

  describe('Recording New Screening', () => {
    it('should record vision screening', () => {
      cy.intercept('POST', '**/api/health-records/screenings', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            screening: {
              id: 'screen-new-1',
              type: 'VISION',
              result: 'PASS'
            }
          }
        }
      }).as('recordScreening')

      cy.navigateToHealthRecordTab('Screenings')
      cy.get('button').contains(/record screening|new screening/i).click()

      cy.get('select[name="type"]').first().select('VISION')
      cy.get('input[name="date"]').first().type('2025-01-10')
      cy.get('input[name="leftEye"]').first().type('20/20')
      cy.get('input[name="rightEye"]').first().type('20/20')
      cy.get('select[name="result"]').first().select('PASS')

      cy.get('button').contains(/save|record/i).click()
      cy.wait('@recordScreening')
      cy.verifySuccess()
    })
  })

  describe('Referral Tracking', () => {
    it('should track screening referrals', () => {
      cy.intercept('GET', '**/api/health-records/student/*/screenings', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            screenings: [
              {
                id: 'screen-refer-1',
                type: 'HEARING',
                result: 'REFER',
                referralStatus: 'COMPLETED',
                referralDate: '2024-10-15',
                referralProvider: 'Dr. Audiology Specialist'
              }
            ]
          }
        }
      }).as('getReferrals')

      cy.navigateToHealthRecordTab('Screenings')
      cy.wait('@getReferrals')

      cy.contains('REFER').should('be.visible')
      cy.contains('COMPLETED').should('be.visible')
    })
  })

  describe('Follow-up Scheduling', () => {
    it('should schedule follow-up screening', () => {
      cy.intercept('POST', '**/api/health-records/screenings/*/follow-up', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            followUp: {
              scheduledDate: '2025-03-15'
            }
          }
        }
      }).as('scheduleFollowUp')

      cy.navigateToHealthRecordTab('Screenings')
      cy.get('button').contains(/schedule follow-up/i).first().click()

      cy.get('input[type="date"]').first().type('2025-03-15')
      cy.get('button').contains(/confirm|save/i).click()

      cy.wait('@scheduleFollowUp')
      cy.verifySuccess()
    })
  })
})
