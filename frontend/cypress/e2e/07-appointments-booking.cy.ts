/// <reference types="cypress" />

describe('Appointment Scheduling - Booking', () => {
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
    
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          appointments: [
            {
              id: '1',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              appointmentType: 'Routine Checkup',
              dateTime: '2024-02-15T10:00:00Z',
              duration: 30,
              status: 'SCHEDULED',
              nurseId: '1'
            }
          ],
          total: 1
        }
      }
    }).as('getAppointments')
    
    cy.login()
    cy.visit('/appointments')
    cy.wait('@verifyAuth')
  })

  describe('Appointments Display', () => {
    it('should display appointments page', () => {
      cy.contains('Appointment Scheduling').should('be.visible')
    })

    it('should show appointment list', () => {
      cy.wait('@getAppointments')
      cy.contains('Emma Wilson').should('be.visible')
      cy.contains('Routine Checkup').should('be.visible')
    })

    it('should display appointment status', () => {
      cy.wait('@getAppointments')
      cy.contains('SCHEDULED').should('be.visible')
    })

    it('should show appointment time', () => {
      cy.wait('@getAppointments')
      cy.contains('10:00').should('be.visible')
    })
  })

  describe('Book New Appointment', () => {
    it('should open booking modal', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="appointment-modal"]').should('be.visible')
    })

    it('should validate required fields', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.contains('Student is required').should('be.visible')
      cy.contains('Date and time is required').should('be.visible')
      cy.contains('Appointment type is required').should('be.visible')
    })

    it('should successfully book appointment', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('POST', '**/api/appointments', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '2',
            studentName: 'Jake Davis',
            appointmentType: 'Medication Administration',
            dateTime: '2024-02-16T14:00:00Z'
          }
        }
      }).as('bookAppointment')
      
      cy.get('[data-testid="book-appointment-button"]').click()
      
      cy.get('[data-testid="student-select"]').select('STU002')
      cy.get('[data-testid="appointment-type"]').select('Medication Administration')
      cy.get('[data-testid="date-time"]').type('2024-02-16T14:00')
      cy.get('[data-testid="duration"]').type('15')
      cy.get('[data-testid="notes"]').type('Regular insulin administration')
      
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@bookAppointment')
      cy.contains('Appointment booked successfully').should('be.visible')
    })

    it('should check availability before booking', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('GET', '**/api/appointments/availability*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            available: false,
            conflicts: [
              { id: '1', time: '2024-02-15T10:00:00Z' }
            ]
          }
        }
      }).as('checkAvailability')
      
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="date-time"]').type('2024-02-15T10:00')
      
      cy.wait('@checkAvailability')
      cy.contains('Time slot unavailable').should('be.visible')
    })

    it('should prevent booking in past', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      
      cy.get('[data-testid="date-time"]').type('2020-01-01T10:00')
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.contains('Cannot book appointments in the past').should('be.visible')
    })

    it('should handle conflict detection', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('POST', '**/api/appointments', {
        statusCode: 409,
        body: { error: 'Time slot conflict' }
      }).as('conflict')
      
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="student-select"]').select('STU001')
      cy.get('[data-testid="appointment-type"]').select('Routine Checkup')
      cy.get('[data-testid="date-time"]').type('2024-02-15T10:00')
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@conflict')
      cy.contains('Time slot conflict').should('be.visible')
    })
  })

  describe('Appointment Types', () => {
    it('should display all appointment types', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      
      cy.get('[data-testid="appointment-type"]').click()
      
      const types = [
        'Routine Checkup',
        'Medication Administration',
        'Injury Assessment',
        'Follow-up',
        'Vaccination'
      ]
      
      types.forEach(type => {
        cy.get('[data-testid="appointment-type"]').should('contain', type)
      })
    })

    it('should set default duration by type', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      
      cy.get('[data-testid="appointment-type"]').select('Routine Checkup')
      cy.get('[data-testid="duration"]').should('have.value', '30')
      
      cy.get('[data-testid="appointment-type"]').select('Medication Administration')
      cy.get('[data-testid="duration"]').should('have.value', '15')
    })
  })

  describe('Update Appointment', () => {
    it('should open edit modal', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="edit-appointment-1"]').click()
      cy.get('[data-testid="appointment-modal"]').should('be.visible')
      cy.get('[data-testid="student-select"]').should('have.value', 'STU001')
    })

    it('should successfully update appointment', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('PUT', '**/api/appointments/1', {
        statusCode: 200,
        body: {
          success: true,
          data: { id: '1', notes: 'Updated notes' }
        }
      }).as('updateAppointment')
      
      cy.get('[data-testid="edit-appointment-1"]').click()
      cy.get('[data-testid="notes"]').clear().type('Updated notes')
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@updateAppointment')
      cy.contains('Appointment updated').should('be.visible')
    })

    it('should reschedule appointment', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('PUT', '**/api/appointments/1', {
        statusCode: 200,
        body: { success: true }
      }).as('reschedule')
      
      cy.get('[data-testid="edit-appointment-1"]').click()
      cy.get('[data-testid="date-time"]').clear().type('2024-02-16T11:00')
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@reschedule')
      cy.contains('Appointment rescheduled').should('be.visible')
    })
  })

  describe('Cancel Appointment', () => {
    it('should show confirmation dialog', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="cancel-appointment-1"]').click()
      cy.get('[data-testid="confirm-dialog"]').should('be.visible')
    })

    it('should require cancellation reason', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="cancel-appointment-1"]').click()
      cy.get('[data-testid="confirm-cancel"]').click()
      
      cy.contains('Reason is required').should('be.visible')
    })

    it('should successfully cancel appointment', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('PUT', '**/api/appointments/1/cancel', {
        statusCode: 200,
        body: { success: true }
      }).as('cancelAppointment')
      
      cy.get('[data-testid="cancel-appointment-1"]').click()
      cy.get('[data-testid="cancellation-reason"]').type('Student absent')
      cy.get('[data-testid="confirm-cancel"]').click()
      
      cy.wait('@cancelAppointment')
      cy.contains('Appointment cancelled').should('be.visible')
    })

    it('should notify parents when cancelling', () => {
      cy.wait('@getAppointments')
      
      cy.get('[data-testid="cancel-appointment-1"]').click()
      cy.get('[data-testid="notify-parents"]').check()
      cy.get('[data-testid="cancellation-reason"]').type('Nurse unavailable')
      cy.get('[data-testid="confirm-cancel"]').click()
      
      cy.contains('Parents notified').should('be.visible')
    })
  })

  describe('Appointment Status', () => {
    it('should mark appointment as completed', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('PUT', '**/api/appointments/1/complete', {
        statusCode: 200,
        body: { success: true }
      }).as('complete')
      
      cy.get('[data-testid="complete-appointment-1"]').click()
      cy.get('[data-testid="completion-notes"]').type('Checkup completed')
      cy.get('[data-testid="confirm-complete"]').click()
      
      cy.wait('@complete')
      cy.contains('COMPLETED').should('be.visible')
    })

    it('should mark no-show appointments', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('PUT', '**/api/appointments/1/no-show', {
        statusCode: 200,
        body: { success: true }
      }).as('noShow')
      
      cy.get('[data-testid="mark-no-show-1"]').click()
      cy.get('[data-testid="confirm-no-show"]').click()
      
      cy.wait('@noShow')
      cy.contains('NO_SHOW').should('be.visible')
    })

    it('should filter by status', () => {
      cy.wait('@getAppointments')
      
      cy.get('[data-testid="status-filter"]').select('SCHEDULED')
      cy.contains('SCHEDULED').should('be.visible')
      
      cy.get('[data-testid="status-filter"]').select('COMPLETED')
      cy.contains('SCHEDULED').should('not.exist')
    })
  })

  describe('Search and Filter', () => {
    it('should search by student name', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="appointment-search"]').type('Emma')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should filter by date range', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="date-from"]').type('2024-02-01')
      cy.get('[data-testid="date-to"]').type('2024-02-29')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.wait('@getAppointments')
    })

    it('should filter by appointment type', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="type-filter"]').select('Routine Checkup')
      cy.contains('Routine Checkup').should('be.visible')
    })

    it('should filter by nurse', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="nurse-filter"]').select('1')
      cy.wait('@getAppointments')
    })
  })

  describe('Recurring Appointments', () => {
    it('should create recurring appointment series', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('POST', '**/api/appointments/recurring', {
        statusCode: 201,
        body: {
          success: true,
          data: { seriesId: 'SERIES-001', count: 5 }
        }
      }).as('createSeries')
      
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="recurring"]').check()
      
      cy.get('[data-testid="student-select"]').select('STU001')
      cy.get('[data-testid="appointment-type"]').select('Medication Administration')
      cy.get('[data-testid="date-time"]').type('2024-02-15T09:00')
      cy.get('[data-testid="recurrence-pattern"]').select('DAILY')
      cy.get('[data-testid="recurrence-count"]').type('5')
      
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@createSeries')
      cy.contains('5 appointments created').should('be.visible')
    })

    it('should display recurrence patterns', () => {
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="recurring"]').check()
      
      cy.get('[data-testid="recurrence-pattern"]').click()
      cy.contains('Daily').should('be.visible')
      cy.contains('Weekly').should('be.visible')
      cy.contains('Monthly').should('be.visible')
    })
  })

  describe('Waitlist Management', () => {
    it('should add student to waitlist', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('POST', '**/api/appointments/waitlist', {
        statusCode: 201,
        body: { success: true }
      }).as('addWaitlist')
      
      cy.get('[data-testid="add-to-waitlist"]').click()
      cy.get('[data-testid="student-select"]').select('STU002')
      cy.get('[data-testid="preferred-dates"]').type('2024-02-20')
      cy.get('[data-testid="save-waitlist"]').click()
      
      cy.wait('@addWaitlist')
      cy.contains('Added to waitlist').should('be.visible')
    })

    it('should auto-book from waitlist', () => {
      cy.intercept('POST', '**/api/appointments/waitlist/auto-book', {
        statusCode: 200,
        body: {
          success: true,
          data: { booked: 1 }
        }
      }).as('autoBook')
      
      cy.get('[data-testid="auto-book-waitlist"]').click()
      
      cy.wait('@autoBook')
      cy.contains('1 appointment booked from waitlist').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load appointments').should('be.visible')
    })

    it('should handle booking errors', () => {
      cy.wait('@getAppointments')
      
      cy.intercept('POST', '**/api/appointments', {
        statusCode: 400,
        body: { error: 'Invalid data' }
      }).as('bookError')
      
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@bookError')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log appointment access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('APPOINTMENT')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })

    it('should require authorization', () => {
      cy.intercept('POST', '**/api/appointments', {
        statusCode: 403,
        body: { error: 'Insufficient permissions' }
      }).as('unauthorized')
      
      cy.wait('@getAppointments')
      cy.get('[data-testid="book-appointment-button"]').click()
      cy.get('[data-testid="save-appointment"]').click()
      
      cy.wait('@unauthorized')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Appointment').should('be.visible')
    })

    it('should be tablet responsive', () => {
      cy.viewport('ipad-2')
      cy.contains('Appointment').should('be.visible')
    })
  })
})
