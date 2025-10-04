/// <reference types="cypress" />

describe('Health Records - Vaccination Tracking', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Mock authentication
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '1',
          email: 'nurse@school.edu',
          role: 'NURSE'
        }
      }
    }).as('verifyAuth')
    
    // Mock vaccinations API
    cy.intercept('GET', '**/api/vaccinations*', {
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
    
    cy.login()
    cy.visit('/health-records')
    cy.contains('button', 'Vaccinations').click()
  })

  describe('Vaccination List Display', () => {
    it('should display vaccination records', () => {
      cy.wait('@getVaccinations')
      cy.contains('MMR').should('be.visible')
      cy.contains('Tdap').should('be.visible')
    })

    it('should show student names', () => {
      cy.wait('@getVaccinations')
      cy.contains('Emma Wilson').should('be.visible')
      cy.contains('Jake Davis').should('be.visible')
    })

    it('should display vaccination dates', () => {
      cy.wait('@getVaccinations')
      cy.contains('2023-09-15').should('be.visible')
      cy.contains('2023-10-20').should('be.visible')
    })

    it('should show provider information', () => {
      cy.wait('@getVaccinations')
      cy.contains('Dr. Smith').should('be.visible')
      cy.contains('Dr. Johnson').should('be.visible')
    })

    it('should display lot numbers', () => {
      cy.wait('@getVaccinations')
      cy.contains('LOT123').should('be.visible')
      cy.contains('LOT456').should('be.visible')
    })
  })

  describe('Add Vaccination Record', () => {
    it('should open add vaccination modal', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="add-vaccination-button"]').click()
      cy.get('[data-testid="vaccination-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="add-vaccination-button"]').click()
      cy.get('[data-testid="save-vaccination"]').click()
      
      cy.contains('Student is required').should('be.visible')
      cy.contains('Vaccine name is required').should('be.visible')
      cy.contains('Date is required').should('be.visible')
    })

    it('should successfully add vaccination record', () => {
      cy.wait('@getVaccinations')
      
      cy.intercept('POST', '**/api/vaccinations', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '3',
            vaccineName: 'COVID-19',
            date: '2024-01-15'
          }
        }
      }).as('addVaccination')
      
      cy.get('[data-testid="add-vaccination-button"]').click()
      
      cy.get('[data-testid="student-select"]').select('STU001')
      cy.get('[data-testid="vaccine-name"]').type('COVID-19')
      cy.get('[data-testid="vaccination-date"]').type('2024-01-15')
      cy.get('[data-testid="provider"]').type('Dr. Brown')
      cy.get('[data-testid="lot-number"]').type('LOT789')
      
      cy.get('[data-testid="save-vaccination"]').click()
      
      cy.wait('@addVaccination')
      cy.contains('Vaccination record added').should('be.visible')
    })

    it('should validate date is not in future', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="add-vaccination-button"]').click()
      
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      
      cy.get('[data-testid="vaccination-date"]').type(futureDate.toISOString().split('T')[0])
      cy.get('[data-testid="save-vaccination"]').click()
      
      cy.contains('Date cannot be in the future').should('be.visible')
    })
  })

  describe('Vaccination Compliance', () => {
    it('should show compliance status by student', () => {
      cy.intercept('GET', '**/api/vaccinations/compliance*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                studentId: 'STU001',
                studentName: 'Emma Wilson',
                compliant: true,
                requiredVaccines: 5,
                completedVaccines: 5
              },
              {
                studentId: 'STU002',
                studentName: 'Jake Davis',
                compliant: false,
                requiredVaccines: 5,
                completedVaccines: 3,
                missingVaccines: ['Hepatitis B', 'Varicella']
              }
            ]
          }
        }
      }).as('getCompliance')
      
      cy.get('[data-testid="view-compliance"]').click()
      cy.wait('@getCompliance')
      
      cy.contains('Emma Wilson').parent().should('contain', 'Compliant')
      cy.contains('Jake Davis').parent().should('contain', 'Non-Compliant')
    })

    it('should display missing vaccinations', () => {
      cy.intercept('GET', '**/api/vaccinations/compliance/STU002', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            missing: ['Hepatitis B', 'Varicella'],
            overdue: ['MMR Booster']
          }
        }
      }).as('getMissing')
      
      cy.get('[data-testid="view-student-compliance-STU002"]').click()
      cy.wait('@getMissing')
      
      cy.contains('Hepatitis B').should('be.visible')
      cy.contains('Varicella').should('be.visible')
      cy.contains('MMR Booster').should('be.visible')
    })

    it('should generate compliance report', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="generate-compliance-report"]').click()
      
      cy.intercept('GET', '**/api/vaccinations/compliance/report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalStudents: 1247,
            compliant: 1189,
            nonCompliant: 58,
            complianceRate: 95.3
          }
        }
      }).as('complianceReport')
      
      cy.wait('@complianceReport')
      cy.contains('95.3%').should('be.visible')
    })
  })

  describe('Vaccination Schedule', () => {
    it('should display upcoming vaccinations', () => {
      cy.intercept('GET', '**/api/vaccinations/upcoming', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            upcoming: [
              {
                studentId: 'STU001',
                studentName: 'Emma Wilson',
                vaccineName: 'Tdap Booster',
                dueDate: '2024-09-15'
              }
            ]
          }
        }
      }).as('getUpcoming')
      
      cy.get('[data-testid="view-upcoming"]').click()
      cy.wait('@getUpcoming')
      
      cy.contains('Tdap Booster').should('be.visible')
      cy.contains('2024-09-15').should('be.visible')
    })

    it('should show overdue vaccinations', () => {
      cy.intercept('GET', '**/api/vaccinations/overdue', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            overdue: [
              {
                studentId: 'STU002',
                studentName: 'Jake Davis',
                vaccineName: 'MMR Booster',
                dueDate: '2023-12-01',
                daysOverdue: 45
              }
            ]
          }
        }
      }).as('getOverdue')
      
      cy.get('[data-testid="view-overdue"]').click()
      cy.wait('@getOverdue')
      
      cy.contains('MMR Booster').should('be.visible')
      cy.contains('45 days overdue').should('be.visible')
    })

    it('should send reminder notifications', () => {
      cy.wait('@getVaccinations')
      
      cy.intercept('POST', '**/api/vaccinations/reminders', {
        statusCode: 200,
        body: { success: true }
      }).as('sendReminders')
      
      cy.get('[data-testid="send-reminders"]').click()
      cy.get('[data-testid="confirm-send"]').click()
      
      cy.wait('@sendReminders')
      cy.contains('Reminders sent successfully').should('be.visible')
    })
  })

  describe('Update Vaccination Record', () => {
    it('should open edit modal', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="edit-vaccination-1"]').click()
      cy.get('[data-testid="vaccination-modal"]').should('be.visible')
      cy.get('[data-testid="vaccine-name"]').should('have.value', 'MMR')
    })

    it('should update vaccination details', () => {
      cy.wait('@getVaccinations')
      
      cy.intercept('PUT', '**/api/vaccinations/1', {
        statusCode: 200,
        body: {
          success: true,
          data: { id: '1', vaccineName: 'MMR', lotNumber: 'LOT999' }
        }
      }).as('updateVaccination')
      
      cy.get('[data-testid="edit-vaccination-1"]').click()
      
      cy.get('[data-testid="lot-number"]').clear().type('LOT999')
      cy.get('[data-testid="save-vaccination"]').click()
      
      cy.wait('@updateVaccination')
      cy.contains('Vaccination updated').should('be.visible')
    })
  })

  describe('Delete Vaccination Record', () => {
    it('should show confirmation dialog', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="delete-vaccination-1"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
    })

    it('should successfully delete record', () => {
      cy.wait('@getVaccinations')
      
      cy.intercept('DELETE', '**/api/vaccinations/1', {
        statusCode: 200,
        body: { success: true }
      }).as('deleteVaccination')
      
      cy.get('[data-testid="delete-vaccination-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteVaccination')
      cy.contains('Vaccination record deleted').should('be.visible')
    })
  })

  describe('Search and Filter', () => {
    it('should search by vaccine name', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="vaccination-search"]').type('MMR')
      cy.contains('MMR').should('be.visible')
      cy.contains('Tdap').should('not.exist')
    })

    it('should filter by student', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="student-filter"]').select('STU001')
      cy.contains('Emma Wilson').should('be.visible')
      cy.contains('Jake Davis').should('not.exist')
    })

    it('should filter by date range', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="date-from"]').type('2023-09-01')
      cy.get('[data-testid="date-to"]').type('2023-09-30')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should filter by status', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="status-filter"]').select('COMPLETED')
      cy.contains('MMR').should('be.visible')
    })
  })

  describe('Export and Reports', () => {
    it('should export vaccination records', () => {
      cy.wait('@getVaccinations')
      
      cy.intercept('GET', '**/api/vaccinations/export*', {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/csv'
        },
        body: 'Student,Vaccine,Date\nEmma Wilson,MMR,2023-09-15'
      }).as('export')
      
      cy.get('[data-testid="export-vaccinations"]').click()
      cy.wait('@export')
    })

    it('should generate vaccination report', () => {
      cy.wait('@getVaccinations')
      
      cy.get('[data-testid="generate-report"]').click()
      
      cy.intercept('GET', '**/api/vaccinations/report', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            totalVaccinations: 324,
            thisMonth: 42,
            compliant: 95.3
          }
        }
      }).as('getReport')
      
      cy.wait('@getReport')
      cy.contains('324').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/vaccinations*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.contains('button', 'Vaccinations').click()
      cy.wait('@error')
      
      cy.contains('Failed to load vaccinations').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log vaccination record access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('VACCINATION')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should require authorization for modifications', () => {
      cy.intercept('POST', '**/api/vaccinations', {
        statusCode: 403,
        body: { error: 'Insufficient permissions' }
      }).as('unauthorized')
      
      cy.wait('@getVaccinations')
      cy.get('[data-testid="add-vaccination-button"]').click()
      cy.get('[data-testid="save-vaccination"]').click()
      
      cy.wait('@unauthorized')
      cy.contains('Insufficient permissions').should('be.visible')
    })
  })
})
