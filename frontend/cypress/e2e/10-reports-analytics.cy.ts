/// <reference types="cypress" />

describe('Reports & Analytics - Dashboard', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/reports/dashboard', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          statistics: {
            totalStudents: 1247,
            activeMedications: 324,
            todayAppointments: 18,
            pendingIncidents: 3
          }
        }
      }
    }).as('getDashboard')
    
    cy.login()
    cy.visit('/reports')
    cy.wait('@verifyAuth')
  })

  describe('Dashboard Display', () => {
    it('should display reports page', () => {
      cy.contains('Reporting & Analytics').should('be.visible')
    })

    it('should show key statistics', () => {
      cy.wait('@getDashboard')
      cy.contains('1,247').should('be.visible')
      cy.contains('324').should('be.visible')
    })

    it('should display charts and graphs', () => {
      cy.wait('@getDashboard')
      cy.get('[data-testid="statistics-chart"]').should('be.visible')
    })
  })

  describe('Health Trend Analysis', () => {
    it('should display health trends', () => {
      cy.intercept('GET', '**/api/reports/health-trends*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            trends: [
              { month: 'Jan', incidents: 15, illnesses: 8 },
              { month: 'Feb', incidents: 12, illnesses: 10 }
            ]
          }
        }
      }).as('getTrends')
      
      cy.get('[data-testid="health-trends-tab"]').click()
      cy.wait('@getTrends')
      
      cy.get('[data-testid="trends-chart"]').should('be.visible')
    })

    it('should filter trends by date range', () => {
      cy.get('[data-testid="health-trends-tab"]').click()
      
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-03-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.get('[data-testid="trends-chart"]').should('be.visible')
    })

    it('should compare with previous period', () => {
      cy.intercept('GET', '**/api/reports/health-trends/compare*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            current: { total: 45 },
            previous: { total: 52 },
            change: -13.5
          }
        }
      }).as('getComparison')
      
      cy.get('[data-testid="health-trends-tab"]').click()
      cy.get('[data-testid="compare-periods"]').check()
      
      cy.wait('@getComparison')
      cy.contains('-13.5%').should('be.visible')
    })
  })

  describe('Medication Usage Reports', () => {
    it('should display medication statistics', () => {
      cy.intercept('GET', '**/api/reports/medication-usage', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            topMedications: [
              { name: 'Albuterol', count: 45 },
              { name: 'EpiPen', count: 12 }
            ]
          }
        }
      }).as('getMedicationReport')
      
      cy.get('[data-testid="medication-reports-tab"]').click()
      cy.wait('@getMedicationReport')
      
      cy.contains('Albuterol').should('be.visible')
      cy.contains('45').should('be.visible')
    })

    it('should show administration compliance', () => {
      cy.intercept('GET', '**/api/reports/medication-compliance', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            complianceRate: 98.5,
            missedDoses: 3,
            lateAdministrations: 5
          }
        }
      }).as('getCompliance')
      
      cy.get('[data-testid="medication-reports-tab"]').click()
      cy.wait('@getCompliance')
      
      cy.contains('98.5%').should('be.visible')
    })
  })

  describe('Incident Statistics', () => {
    it('should display incident analytics', () => {
      cy.intercept('GET', '**/api/reports/incident-statistics', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            byType: [
              { type: 'INJURY', count: 25 },
              { type: 'ILLNESS', count: 18 }
            ],
            bySeverity: [
              { severity: 'MINOR', count: 32 },
              { severity: 'MODERATE', count: 8 }
            ]
          }
        }
      }).as('getIncidentStats')
      
      cy.get('[data-testid="incident-reports-tab"]').click()
      cy.wait('@getIncidentStats')
      
      cy.get('[data-testid="incident-chart"]').should('be.visible')
    })

    it('should show incident trends by location', () => {
      cy.intercept('GET', '**/api/reports/incidents/by-location', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            locations: [
              { location: 'Playground', count: 15 },
              { location: 'Cafeteria', count: 8 }
            ]
          }
        }
      }).as('getLocationStats')
      
      cy.get('[data-testid="incident-reports-tab"]').click()
      cy.get('[data-testid="by-location"]').click()
      
      cy.wait('@getLocationStats')
      cy.contains('Playground').should('be.visible')
    })
  })

  describe('Attendance Correlation', () => {
    it('should display attendance analysis', () => {
      cy.intercept('GET', '**/api/reports/attendance-health', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            correlations: [
              { reason: 'Illness', absences: 45 },
              { reason: 'Medical Appointment', absences: 23 }
            ]
          }
        }
      }).as('getAttendance')
      
      cy.get('[data-testid="attendance-tab"]').click()
      cy.wait('@getAttendance')
      
      cy.contains('Illness').should('be.visible')
      cy.contains('45').should('be.visible')
    })

    it('should identify high-absence students', () => {
      cy.intercept('GET', '**/api/reports/attendance/high-absence', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              { name: 'Emma Wilson', absences: 12 },
              { name: 'Jake Davis', absences: 10 }
            ]
          }
        }
      }).as('getHighAbsence')
      
      cy.get('[data-testid="attendance-tab"]').click()
      cy.get('[data-testid="high-absence"]').click()
      
      cy.wait('@getHighAbsence')
      cy.contains('Emma Wilson').should('be.visible')
    })
  })

  describe('Custom Report Builder', () => {
    it('should open report builder', () => {
      cy.get('[data-testid="custom-report-builder"]').click()
      cy.get('[data-testid="report-builder-modal"]').should('be.visible')
    })

    it('should select report fields', () => {
      cy.get('[data-testid="custom-report-builder"]').click()
      
      cy.get('[data-testid="field-student-name"]').check()
      cy.get('[data-testid="field-grade"]').check()
      cy.get('[data-testid="field-medications"]').check()
      
      cy.get('[data-testid="selected-fields"]').children().should('have.length', 3)
    })

    it('should add filters to custom report', () => {
      cy.get('[data-testid="custom-report-builder"]').click()
      
      cy.get('[data-testid="add-filter"]').click()
      cy.get('[data-testid="filter-field"]').select('grade')
      cy.get('[data-testid="filter-operator"]').select('equals')
      cy.get('[data-testid="filter-value"]').type('8')
      cy.get('[data-testid="save-filter"]').click()
      
      cy.get('[data-testid="active-filters"]').should('contain', 'grade equals 8')
    })

    it('should generate custom report', () => {
      cy.intercept('POST', '**/api/reports/custom', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            rows: [
              { studentName: 'Emma Wilson', grade: '8', medications: 2 }
            ]
          }
        }
      }).as('generateReport')
      
      cy.get('[data-testid="custom-report-builder"]').click()
      cy.get('[data-testid="field-student-name"]').check()
      cy.get('[data-testid="generate-report"]').click()
      
      cy.wait('@generateReport')
      cy.get('[data-testid="report-results"]').should('be.visible')
    })

    it('should save custom report template', () => {
      cy.intercept('POST', '**/api/reports/templates', {
        statusCode: 201,
        body: { success: true }
      }).as('saveTemplate')
      
      cy.get('[data-testid="custom-report-builder"]').click()
      cy.get('[data-testid="field-student-name"]').check()
      cy.get('[data-testid="save-as-template"]').click()
      cy.get('[data-testid="template-name"]').type('My Custom Report')
      cy.get('[data-testid="confirm-save"]').click()
      
      cy.wait('@saveTemplate')
      cy.contains('Template saved').should('be.visible')
    })
  })

  describe('Data Export', () => {
    it('should export report as CSV', () => {
      cy.wait('@getDashboard')
      
      cy.intercept('GET', '**/api/reports/export?format=csv', {
        statusCode: 200,
        headers: { 'Content-Type': 'text/csv' },
        body: 'Student,Grade,Medications\nEmma Wilson,8,2'
      }).as('exportCSV')
      
      cy.get('[data-testid="export-report"]').click()
      cy.get('[data-testid="format-csv"]').click()
      
      cy.wait('@exportCSV')
    })

    it('should export as Excel', () => {
      cy.wait('@getDashboard')
      
      cy.intercept('GET', '**/api/reports/export?format=xlsx', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      }).as('exportExcel')
      
      cy.get('[data-testid="export-report"]').click()
      cy.get('[data-testid="format-excel"]').click()
      
      cy.wait('@exportExcel')
    })

    it('should export as PDF', () => {
      cy.wait('@getDashboard')
      
      cy.intercept('GET', '**/api/reports/export?format=pdf', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/pdf' }
      }).as('exportPDF')
      
      cy.get('[data-testid="export-report"]').click()
      cy.get('[data-testid="format-pdf"]').click()
      
      cy.wait('@exportPDF')
    })
  })

  describe('Compliance Reporting', () => {
    it('should generate HIPAA compliance report', () => {
      cy.intercept('GET', '**/api/reports/compliance/hipaa', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalAccesses: 1247,
            authorizedAccesses: 1247,
            violations: 0
          }
        }
      }).as('getHIPAAReport')
      
      cy.get('[data-testid="compliance-reports-tab"]').click()
      cy.get('[data-testid="hipaa-report"]').click()
      
      cy.wait('@getHIPAAReport')
      cy.contains('1,247').should('be.visible')
      cy.contains('0 violations').should('be.visible')
    })

    it('should generate immunization compliance report', () => {
      cy.intercept('GET', '**/api/reports/compliance/immunization', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalStudents: 1247,
            compliant: 1189,
            nonCompliant: 58
          }
        }
      }).as('getImmunizationReport')
      
      cy.get('[data-testid="compliance-reports-tab"]').click()
      cy.get('[data-testid="immunization-report"]').click()
      
      cy.wait('@getImmunizationReport')
      cy.contains('95.3%').should('be.visible')
    })
  })

  describe('Scheduled Reports', () => {
    it('should schedule recurring report', () => {
      cy.intercept('POST', '**/api/reports/schedule', {
        statusCode: 201,
        body: { success: true }
      }).as('scheduleReport')
      
      cy.get('[data-testid="schedule-report"]').click()
      
      cy.get('[data-testid="report-type"]').select('medication-usage')
      cy.get('[data-testid="frequency"]').select('weekly')
      cy.get('[data-testid="recipients"]').type('nurse@school.edu')
      cy.get('[data-testid="save-schedule"]').click()
      
      cy.wait('@scheduleReport')
      cy.contains('Report scheduled').should('be.visible')
    })

    it('should list scheduled reports', () => {
      cy.intercept('GET', '**/api/reports/scheduled', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            schedules: [
              {
                id: '1',
                reportType: 'medication-usage',
                frequency: 'weekly',
                nextRun: '2024-02-01T09:00:00Z'
              }
            ]
          }
        }
      }).as('getScheduled')
      
      cy.get('[data-testid="scheduled-reports"]').click()
      cy.wait('@getScheduled')
      
      cy.contains('medication-usage').should('be.visible')
      cy.contains('weekly').should('be.visible')
    })
  })

  describe('Dashboard Customization', () => {
    it('should customize dashboard widgets', () => {
      cy.wait('@getDashboard')
      
      cy.get('[data-testid="customize-dashboard"]').click()
      cy.get('[data-testid="widget-medications"]').drag('[data-testid="drop-zone-1"]')
      cy.get('[data-testid="save-layout"]').click()
      
      cy.contains('Dashboard updated').should('be.visible')
    })

    it('should add new dashboard widget', () => {
      cy.wait('@getDashboard')
      
      cy.get('[data-testid="add-widget"]').click()
      cy.get('[data-testid="widget-type"]').select('incidents-by-location')
      cy.get('[data-testid="add-to-dashboard"]').click()
      
      cy.get('[data-testid="widget-incidents-by-location"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/reports/dashboard', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load reports').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log report access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('REPORT')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Reporting').should('be.visible')
    })
  })
})
