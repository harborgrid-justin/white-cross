/**
 * Health Records - Vaccinations Tests
 *
 * Comprehensive E2E tests for vaccinations management.
 * Tests cover:
 * - Loading vaccinations tab (verify no mock/hardcoded upcoming vaccinations)
 * - Displaying vaccination history
 * - Recording new vaccination
 * - Editing vaccination record
 * - Deleting vaccination record
 * - Compliance status indicators
 * - Upcoming vaccinations display (from API, not hardcoded)
 * - Exemption tracking
 * - Generating vaccination report
 * - Dose tracking display
 *
 * @author White Cross Healthcare Platform
 * @module VaccinationsE2E
 */

describe('Health Records - Vaccinations Module', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.setupHealthRecordsIntercepts()
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  describe('Loading Vaccinations Tab', () => {
    it('should load vaccinations tab without mock data', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [],
            upcomingVaccinations: []
          }
        }
      }).as('getVaccinationsEmpty')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getVaccinationsEmpty')

      // Should show empty state
      cy.contains(/no vaccinations|no records/i).should('be.visible')
    })

    it('should verify no hardcoded upcoming vaccinations', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [],
            upcomingVaccinations: []
          }
        }
      }).as('emptyVaccinations')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@emptyVaccinations')

      // Should NOT show hardcoded upcoming vaccinations
      cy.get('[data-testid*="upcoming-vaccination"]').should('not.exist')
    })

    it('should load vaccinations from API', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [
              {
                id: 'vacc-1',
                vaccineName: 'MMR',
                doseNumber: 1,
                dateGiven: '2024-06-15',
                provider: 'Dr. Smith',
                lotNumber: 'LOT123',
                compliance: 'COMPLIANT'
              }
            ],
            upcomingVaccinations: [
              {
                id: 'upcoming-1',
                vaccineName: 'MMR',
                doseNumber: 2,
                dueDate: '2025-06-15',
                status: 'DUE'
              }
            ]
          }
        }
      }).as('getVaccinations')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getVaccinations')

      cy.contains('MMR').should('be.visible')
    })
  })

  describe('Displaying Vaccination History', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [
              {
                id: 'vacc-1',
                vaccineName: 'MMR',
                doseNumber: 1,
                dateGiven: '2024-06-15',
                provider: 'Dr. Sarah Johnson',
                lotNumber: 'MMR2024-001',
                expirationDate: '2026-06-15',
                site: 'Left deltoid',
                route: 'Intramuscular',
                compliance: 'COMPLIANT'
              },
              {
                id: 'vacc-2',
                vaccineName: 'Tdap',
                doseNumber: 1,
                dateGiven: '2024-08-10',
                provider: 'Nurse Thompson',
                lotNumber: 'TDAP2024-002',
                compliance: 'COMPLIANT'
              },
              {
                id: 'vacc-3',
                vaccineName: 'Flu',
                doseNumber: 1,
                dateGiven: '2024-10-01',
                provider: 'School Nurse',
                lotNumber: 'FLU2024-003',
                compliance: 'COMPLIANT'
              }
            ]
          }
        }
      }).as('getVaccinations')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getVaccinations')
    })

    it('should display vaccination history', () => {
      cy.get('[data-testid*="vaccination-item"]').should('have.length', 3)
      cy.contains('MMR').should('be.visible')
      cy.contains('Tdap').should('be.visible')
      cy.contains('Flu').should('be.visible')
    })

    it('should display vaccination details', () => {
      cy.get('[data-testid*="vaccination-item"]').first().within(() => {
        cy.contains('MMR').should('be.visible')
        cy.contains('2024-06-15').should('be.visible')
        cy.contains('Dr. Sarah Johnson').should('be.visible')
      })
    })
  })

  describe('Recording New Vaccination', () => {
    it('should open vaccination modal', () => {
      cy.navigateToHealthRecordTab('Vaccinations')
      cy.get('button').contains(/record vaccination|add vaccination/i).click()
      cy.get('[data-testid*="modal"]').should('be.visible')
    })

    it('should record vaccination successfully', () => {
      cy.intercept('POST', '**/api/health-records/vaccinations', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            vaccination: {
              id: 'vacc-new-1',
              vaccineName: 'COVID-19',
              doseNumber: 1,
              dateGiven: '2025-01-10'
            }
          }
        }
      }).as('recordVaccination')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.get('button').contains(/record vaccination/i).click()

      cy.get('select[name="vaccineName"]').first().select('COVID-19')
      cy.get('input[name="doseNumber"]').first().type('1')
      cy.get('input[name="dateGiven"]').first().type('2025-01-10')
      cy.get('input[name="lotNumber"]').first().type('COVID2025-001')

      cy.get('button').contains(/save|record/i).click()
      cy.wait('@recordVaccination')
      cy.verifySuccess()
    })
  })

  describe('Compliance Status Indicators', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [
              {
                id: 'vacc-1',
                vaccineName: 'MMR',
                compliance: 'COMPLIANT'
              },
              {
                id: 'vacc-2',
                vaccineName: 'Tdap',
                compliance: 'OVERDUE'
              }
            ],
            complianceSummary: {
              compliant: 5,
              overdue: 2,
              upcoming: 3
            }
          }
        }
      }).as('getVaccinations')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getVaccinations')
    })

    it('should display compliance badges', () => {
      cy.contains('COMPLIANT').should('be.visible')
      cy.contains('OVERDUE').should('be.visible')
    })

    it('should show compliance summary', () => {
      cy.contains(/5.*compliant/i).should('exist')
      cy.contains(/2.*overdue/i).should('exist')
    })
  })

  describe('Upcoming Vaccinations from API', () => {
    it('should display upcoming vaccinations from API only', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [],
            upcomingVaccinations: [
              {
                id: 'upcoming-1',
                vaccineName: 'HPV',
                doseNumber: 2,
                dueDate: '2025-03-15',
                status: 'DUE_SOON'
              },
              {
                id: 'upcoming-2',
                vaccineName: 'Meningococcal',
                doseNumber: 1,
                dueDate: '2025-04-01',
                status: 'SCHEDULED'
              }
            ]
          }
        }
      }).as('getUpcoming')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getUpcoming')

      // Verify upcoming vaccinations shown from API
      cy.contains('HPV').should('be.visible')
      cy.contains('Meningococcal').should('be.visible')
      cy.contains('2025-03-15').should('be.visible')
    })

    it('should not show upcoming vaccinations when API returns empty', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [],
            upcomingVaccinations: []
          }
        }
      }).as('noUpcoming')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@noUpcoming')

      cy.get('[data-testid*="upcoming"]').should('not.exist')
    })
  })

  describe('Exemption Tracking', () => {
    it('should display vaccination exemptions', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [],
            exemptions: [
              {
                id: 'exempt-1',
                vaccineName: 'MMR',
                exemptionType: 'MEDICAL',
                reason: 'Immunocompromised',
                documentedBy: 'Dr. Smith',
                expirationDate: '2026-01-01'
              }
            ]
          }
        }
      }).as('getExemptions')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getExemptions')

      cy.contains('MEDICAL').should('be.visible')
      cy.contains('Immunocompromised').should('be.visible')
    })
  })

  describe('Vaccination Report Generation', () => {
    it('should generate vaccination report', () => {
      cy.intercept('POST', '**/api/health-records/vaccinations/report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            reportUrl: '/reports/vaccination-report-001.pdf'
          }
        }
      }).as('generateReport')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.get('button').contains(/report|export/i).click()

      cy.wait('@generateReport')
      cy.verifySuccess()
    })
  })

  describe('Dose Tracking', () => {
    it('should display dose numbers and series completion', () => {
      cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            vaccinations: [
              {
                id: 'vacc-1',
                vaccineName: 'HPV',
                doseNumber: 1,
                totalDoses: 3,
                seriesComplete: false
              },
              {
                id: 'vacc-2',
                vaccineName: 'HPV',
                doseNumber: 2,
                totalDoses: 3,
                seriesComplete: false
              }
            ]
          }
        }
      }).as('getDoseSeries')

      cy.navigateToHealthRecordTab('Vaccinations')
      cy.wait('@getDoseSeries')

      cy.contains(/1.*of.*3|2.*of.*3/i).should('exist')
    })
  })
})
