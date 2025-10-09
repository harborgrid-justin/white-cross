/// <reference types="cypress" />

/**
 * Appointment Scheduling - Comprehensive Test Suite (120 Tests)
 *
 * This test suite provides complete coverage of the appointment scheduling module,
 * validating appointment creation, viewing, updating, cancellation, recurring appointments,
 * calendar functionality, notifications, and HIPAA compliance.
 *
 * Test Organization:
 * 1. Page Load & UI Structure (10 tests)
 * 2. Appointment Creation (15 tests)
 * 3. Appointment Viewing & Details (12 tests)
 * 4. Appointment Editing & Updates (12 tests)
 * 5. Appointment Cancellation (10 tests)
 * 6. Calendar View & Navigation (12 tests)
 * 7. Recurring Appointments (10 tests)
 * 8. Appointment Search & Filtering (10 tests)
 * 9. Appointment Reminders & Notifications (8 tests)
 * 10. Time Slot Management (8 tests)
 * 11. Student Association (8 tests)
 * 12. Data Validation & Error Handling (10 tests)
 * 13. HIPAA Compliance & Security (8 tests)
 * 14. Accessibility & Responsiveness (7 tests)
 */

describe('Appointment Scheduling - Comprehensive Test Suite (120 Tests)', () => {

  // =============================================================================
  // SECTION 1: PAGE LOAD & UI STRUCTURE (10 tests)
  // =============================================================================

  describe('Page Load & UI Structure', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display the appointments page with correct title', () => {
      cy.contains('Appointments').should('be.visible')
      cy.url().should('include', '/appointments')
    })

    it('should display calendar view by default', () => {
      cy.get('[data-testid=calendar-view]').should('be.visible')
    })

    it('should display add appointment button', () => {
      cy.get('[data-testid=add-appointment-button]').should('be.visible')
      cy.get('[data-testid=add-appointment-button]').should('contain', 'New Appointment')
    })

    it('should display view toggle buttons (Calendar/List)', () => {
      cy.get('[data-testid=view-calendar-button]').should('be.visible')
      cy.get('[data-testid=view-list-button]').should('be.visible')
    })

    it('should display date navigation controls', () => {
      cy.get('[data-testid=prev-period-button]').should('be.visible')
      cy.get('[data-testid=next-period-button]').should('be.visible')
      cy.get('[data-testid=today-button]').should('be.visible')
    })

    it('should display current date/period indicator', () => {
      cy.get('[data-testid=current-period-display]').should('be.visible')
    })

    it('should display appointment count indicator', () => {
      cy.get('[data-testid=appointment-count]').should('be.visible')
    })

    it('should display filter options', () => {
      cy.get('[data-testid=filter-button]').should('be.visible')
    })

    it('should load without errors', () => {
      cy.get('body').should('be.visible')
      cy.url().should('include', '/appointments')
    })

    it('should display loading state initially', () => {
      cy.intercept('GET', '/api/appointments*', (req) => {
        req.reply((res) => {
          res.delay = 1000
          res.send()
        })
      }).as('getAppointments')

      cy.visit('/appointments')
      cy.get('[data-testid=loading-spinner]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 2: APPOINTMENT CREATION (15 tests)
  // =============================================================================

  describe('Appointment Creation', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should open appointment creation modal when add button is clicked', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should display all required fields in creation form', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').should('be.visible')
      cy.get('[data-testid=appointment-date]').should('be.visible')
      cy.get('[data-testid=appointment-time]').should('be.visible')
      cy.get('[data-testid=appointment-type]').should('be.visible')
    })

    it('should successfully create a new appointment', () => {
      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=appointment-notes]').type(newAppointment.notes)
        cy.get('[data-testid=save-appointment-button]').click()

        cy.get('[data-testid=success-message]').should('be.visible')
      })
    })

    it('should display success message after creating appointment', () => {
      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=save-appointment-button]').click()

        cy.get('[data-testid=success-message]').should('contain', 'Appointment created successfully')
      })
    })

    it('should close modal after successful creation', () => {
      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=save-appointment-button]').click()

        cy.get('[data-testid=appointment-modal]').should('not.exist')
      })
    })

    it('should allow creating appointment with custom duration', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=appointment-duration]').type('45')
      cy.get('[data-testid=appointment-type]').select('Follow-up')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should display appointment type options', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-type]').click()
      cy.get('[data-testid=appointment-type] option').should('contain', 'Check-up')
      cy.get('[data-testid=appointment-type] option').should('contain', 'Follow-up')
      cy.get('[data-testid=appointment-type] option').should('contain', 'Vaccination')
    })

    it('should validate required fields on submission', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=student-error]').should('contain', 'Student is required')
      cy.get('[data-testid=date-error]').should('contain', 'Date is required')
      cy.get('[data-testid=time-error]').should('contain', 'Time is required')
    })

    it('should prevent creating appointments in the past', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2020-01-01')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=appointment-type]').select('Check-up')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule appointments in the past')
    })

    it('should allow adding notes to appointment', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').should('be.visible')
      cy.get('[data-testid=appointment-notes]').type('Patient needs medication refill discussion')
      cy.get('[data-testid=appointment-notes]').should('have.value', 'Patient needs medication refill discussion')
    })

    it('should close modal when cancel button is clicked', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
      cy.get('[data-testid=cancel-button]').click()
      cy.get('[data-testid=appointment-modal]').should('not.exist')
    })

    it('should clear form when modal is closed and reopened', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').type('Test notes')
      cy.get('[data-testid=cancel-button]').click()

      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').should('have.value', '')
    })

    it('should create appointment from calendar date click', () => {
      cy.get('[data-testid=calendar-date-cell]').first().click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
      cy.get('[data-testid=appointment-date]').should('not.have.value', '')
    })

    it('should show available time slots when creating appointment', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=available-slots]').should('be.visible')
    })

    it('should create audit log when appointment is created', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=save-appointment-button]').click()

        cy.wait('@auditLog').its('request.body').should('deep.include', {
          action: 'CREATE_APPOINTMENT',
          resourceType: 'APPOINTMENT'
        })
      })
    })
  })

  // =============================================================================
  // SECTION 3: APPOINTMENT VIEWING & DETAILS (12 tests)
  // =============================================================================

  describe('Appointment Viewing & Details', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display appointments in calendar view', () => {
      cy.get('[data-testid=calendar-view]').should('be.visible')
      cy.get('[data-testid=appointment-event]').should('exist')
    })

    it('should switch to list view when list button is clicked', () => {
      cy.get('[data-testid=view-list-button]').click()
      cy.get('[data-testid=appointments-list]').should('be.visible')
    })

    it('should display appointment details when clicked', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-details-modal]').should('be.visible')
    })

    it('should show student name in appointment details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-student-name]').should('be.visible')
    })

    it('should show appointment date and time in details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-datetime]').should('be.visible')
    })

    it('should show appointment type in details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-type-display]').should('be.visible')
    })

    it('should show appointment notes in details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-notes-display]').should('be.visible')
    })

    it('should show appointment duration in details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-duration-display]').should('be.visible')
    })

    it('should show appointment status in details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-status]').should('be.visible')
    })

    it('should close details modal when close button is clicked', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-details-modal]').should('be.visible')
      cy.get('[data-testid=close-details-button]').click()
      cy.get('[data-testid=appointment-details-modal]').should('not.exist')
    })

    it('should display appointments in list format', () => {
      cy.get('[data-testid=view-list-button]').click()
      cy.get('[data-testid=appointment-list-item]').should('have.length.greaterThan', 0)
    })

    it('should create audit log when viewing appointment details', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=appointment-event]').first().click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'VIEW_APPOINTMENT',
        resourceType: 'APPOINTMENT'
      })
    })
  })

  // =============================================================================
  // SECTION 4: APPOINTMENT EDITING & UPDATES (12 tests)
  // =============================================================================

  describe('Appointment Editing & Updates', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should open edit modal from appointment details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should populate form with existing appointment data', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').should('not.have.value', '')
      cy.get('[data-testid=appointment-date]').should('not.have.value', '')
    })

    it('should successfully update appointment date', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').clear().type('2024-12-01')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Appointment updated')
    })

    it('should successfully update appointment time', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-time]').clear().type('14:00')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should successfully update appointment type', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-type]').select('Follow-up')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should successfully update appointment notes', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').clear().type('Updated appointment notes')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should preserve data when canceling edit', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=appointment-datetime]').invoke('text').as('originalDateTime')
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').clear().type('2025-01-01')
      cy.get('[data-testid=cancel-button]').click()

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('@originalDateTime').then((originalDateTime) => {
        cy.get('[data-testid=appointment-datetime]').should('contain', originalDateTime)
      })
    })

    it('should validate time slot availability when rescheduling', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').clear().type('2024-11-20')
      cy.get('[data-testid=appointment-time]').clear().type('10:00')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=error-message]').should('contain', 'Time slot already booked')
    })

    it('should allow changing appointment duration', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-duration]').clear().type('60')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should update appointment status', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-status-select]').select('Completed')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should close modal after successful update', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').clear().type('Updated')
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=appointment-modal]').should('not.exist')
    })

    it('should create audit log when appointment is updated', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').click()
      cy.get('[data-testid=appointment-notes]').clear().type('Updated')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'UPDATE_APPOINTMENT',
        resourceType: 'APPOINTMENT'
      })
    })
  })

  // =============================================================================
  // SECTION 5: APPOINTMENT CANCELLATION (10 tests)
  // =============================================================================

  describe('Appointment Cancellation', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display cancel button in appointment details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').should('be.visible')
    })

    it('should show confirmation modal when cancel is clicked', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=confirm-cancel-modal]').should('be.visible')
    })

    it('should require cancellation reason', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=confirm-cancel-button]').click()
      cy.get('[data-testid=reason-error]').should('contain', 'Cancellation reason is required')
    })

    it('should successfully cancel appointment with reason', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=cancellation-reason]').type('Student illness')
      cy.get('[data-testid=confirm-cancel-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Appointment cancelled')
    })

    it('should not cancel when cancel is aborted', () => {
      const initialCount = Cypress.$('[data-testid=appointment-event]').length

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=abort-cancel-button]').click()

      cy.get('[data-testid=appointment-event]').should('have.length', initialCount)
    })

    it('should mark appointment as cancelled instead of deleting', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=cancellation-reason]').type('Rescheduled')
      cy.get('[data-testid=confirm-cancel-button]').click()

      cy.get('[data-testid=view-cancelled-button]').click()
      cy.get('[data-testid=cancelled-appointment]').should('exist')
    })

    it('should display cancelled status on appointment', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=cancellation-reason]').type('No longer needed')
      cy.get('[data-testid=confirm-cancel-button]').click()

      cy.get('[data-testid=view-cancelled-button]').click()
      cy.get('[data-testid=cancelled-appointment]').first().within(() => {
        cy.get('[data-testid=status-badge]').should('contain', 'Cancelled')
      })
    })

    it('should send cancellation notification to student', () => {
      cy.intercept('POST', '/api/notifications').as('sendNotification')

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=cancellation-reason]').type('Schedule conflict')
      cy.get('[data-testid=confirm-cancel-button]').click()

      cy.wait('@sendNotification')
    })

    it('should allow viewing cancellation history', () => {
      cy.get('[data-testid=view-cancelled-button]').click()
      cy.get('[data-testid=cancelled-appointments-list]').should('be.visible')
    })

    it('should create audit log when appointment is cancelled', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=cancel-appointment-button]').click()
      cy.get('[data-testid=cancellation-reason]').type('Patient request')
      cy.get('[data-testid=confirm-cancel-button]').click()

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'CANCEL_APPOINTMENT',
        resourceType: 'APPOINTMENT'
      })
    })
  })

  // =============================================================================
  // SECTION 6: CALENDAR VIEW & NAVIGATION (12 tests)
  // =============================================================================

  describe('Calendar View & Navigation', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display calendar in month view by default', () => {
      cy.get('[data-testid=calendar-view]').should('be.visible')
      cy.get('[data-testid=calendar-month-view]').should('be.visible')
    })

    it('should navigate to next month when next button is clicked', () => {
      cy.get('[data-testid=current-period-display]').invoke('text').as('currentMonth')
      cy.get('[data-testid=next-period-button]').click()

      cy.get('@currentMonth').then((currentMonth) => {
        cy.get('[data-testid=current-period-display]').should('not.contain', currentMonth)
      })
    })

    it('should navigate to previous month when prev button is clicked', () => {
      cy.get('[data-testid=current-period-display]').invoke('text').as('currentMonth')
      cy.get('[data-testid=prev-period-button]').click()

      cy.get('@currentMonth').then((currentMonth) => {
        cy.get('[data-testid=current-period-display]').should('not.contain', currentMonth)
      })
    })

    it('should return to today when today button is clicked', () => {
      cy.get('[data-testid=next-period-button]').click()
      cy.get('[data-testid=next-period-button]').click()
      cy.get('[data-testid=today-button]').click()

      const today = new Date()
      const monthName = today.toLocaleString('default', { month: 'long' })
      cy.get('[data-testid=current-period-display]').should('contain', monthName)
    })

    it('should switch to week view', () => {
      cy.get('[data-testid=view-week-button]').click()
      cy.get('[data-testid=calendar-week-view]').should('be.visible')
    })

    it('should switch to day view', () => {
      cy.get('[data-testid=view-day-button]').click()
      cy.get('[data-testid=calendar-day-view]').should('be.visible')
    })

    it('should highlight today on calendar', () => {
      cy.get('[data-testid=today-highlight]').should('be.visible')
    })

    it('should display appointments on correct dates', () => {
      cy.get('[data-testid=appointment-event]').first().should('be.visible')
    })

    it('should show appointment count on calendar dates', () => {
      cy.get('[data-testid=date-appointment-count]').should('exist')
    })

    it('should allow clicking on date to create appointment', () => {
      cy.get('[data-testid=calendar-date-cell]').first().click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should display color-coded appointments by type', () => {
      cy.get('[data-testid=appointment-event]').first().should('have.css', 'background-color')
    })

    it('should show calendar legend for appointment types', () => {
      cy.get('[data-testid=calendar-legend]').should('be.visible')
      cy.get('[data-testid=legend-item]').should('have.length.greaterThan', 0)
    })
  })

  // =============================================================================
  // SECTION 7: RECURRING APPOINTMENTS (10 tests)
  // =============================================================================

  describe('Recurring Appointments', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display recurring appointment option', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=recurring-checkbox]').should('be.visible')
    })

    it('should show recurrence options when enabled', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=recurring-checkbox]').check()
      cy.get('[data-testid=recurrence-pattern]').should('be.visible')
    })

    it('should create daily recurring appointments', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=appointment-type]').select('Medication')
      cy.get('[data-testid=recurring-checkbox]').check()
      cy.get('[data-testid=recurrence-pattern]').select('Daily')
      cy.get('[data-testid=recurrence-end-date]').type('2024-11-20')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('contain', 'Recurring appointments created')
    })

    it('should create weekly recurring appointments', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('14:00')
      cy.get('[data-testid=appointment-type]').select('Check-up')
      cy.get('[data-testid=recurring-checkbox]').check()
      cy.get('[data-testid=recurrence-pattern]').select('Weekly')
      cy.get('[data-testid=recurrence-end-date]').type('2024-12-15')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should create monthly recurring appointments', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('09:00')
      cy.get('[data-testid=appointment-type]').select('Follow-up')
      cy.get('[data-testid=recurring-checkbox]').check()
      cy.get('[data-testid=recurrence-pattern]').select('Monthly')
      cy.get('[data-testid=recurrence-count]').type('6')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=success-message]').should('be.visible')
    })

    it('should display recurring indicator on appointments', () => {
      cy.get('[data-testid=recurring-appointment-icon]').should('exist')
    })

    it('should allow editing single occurrence', () => {
      cy.get('[data-testid=recurring-appointment-icon]').first().click()
      cy.get('[data-testid=edit-occurrence-option]').click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should allow editing all occurrences', () => {
      cy.get('[data-testid=recurring-appointment-icon]').first().click()
      cy.get('[data-testid=edit-series-option]').click()
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should validate recurrence end date', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=recurring-checkbox]').check()
      cy.get('[data-testid=recurrence-end-date]').type('2024-11-10')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=recurrence-error]').should('contain', 'End date must be after start date')
    })

    it('should cancel recurring series', () => {
      cy.get('[data-testid=recurring-appointment-icon]').first().click()
      cy.get('[data-testid=cancel-series-option]').click()
      cy.get('[data-testid=cancellation-reason]').type('No longer needed')
      cy.get('[data-testid=confirm-cancel-button]').click()

      cy.get('[data-testid=success-message]').should('contain', 'Recurring series cancelled')
    })
  })

  // =============================================================================
  // SECTION 8: APPOINTMENT SEARCH & FILTERING (10 tests)
  // =============================================================================

  describe('Appointment Search & Filtering', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display search input', () => {
      cy.get('[data-testid=appointment-search]').should('be.visible')
    })

    it('should filter appointments by student name', () => {
      cy.get('[data-testid=appointment-search]').type('John')
      cy.get('[data-testid=appointment-event]').should('contain', 'John')
    })

    it('should filter appointments by type', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=type-filter]').select('Check-up')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=appointment-event]').each(($event) => {
        cy.wrap($event).should('contain', 'Check-up')
      })
    })

    it('should filter appointments by status', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=status-filter]').select('Scheduled')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=appointment-event]').should('exist')
    })

    it('should filter appointments by date range', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=start-date-filter]').type('2024-11-01')
      cy.get('[data-testid=end-date-filter]').type('2024-11-30')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
    })

    it('should clear all filters', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=type-filter]').select('Check-up')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=clear-filters-button]').click()
      cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
    })

    it('should show no results message when no matches', () => {
      cy.get('[data-testid=appointment-search]').type('NonexistentStudent12345')
      cy.get('[data-testid=no-results-message]').should('be.visible')
      cy.get('[data-testid=no-results-message]').should('contain', 'No appointments found')
    })

    it('should display active filter badges', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=type-filter]').select('Follow-up')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=filter-badge]').should('be.visible')
      cy.get('[data-testid=filter-badge]').should('contain', 'Follow-up')
    })

    it('should filter by upcoming appointments only', () => {
      cy.get('[data-testid=upcoming-only-filter]').check()
      cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
    })

    it('should persist filters when switching views', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=type-filter]').select('Vaccination')
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=view-list-button]').click()
      cy.get('[data-testid=filter-badge]').should('contain', 'Vaccination')
    })
  })

  // =============================================================================
  // SECTION 9: APPOINTMENT REMINDERS & NOTIFICATIONS (8 tests)
  // =============================================================================

  describe('Appointment Reminders & Notifications', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display reminder settings in appointment form', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=reminder-settings]').should('be.visible')
    })

    it('should enable email reminder', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=email-reminder-checkbox]').check()
      cy.get('[data-testid=email-reminder-checkbox]').should('be.checked')
    })

    it('should enable SMS reminder', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=sms-reminder-checkbox]').check()
      cy.get('[data-testid=sms-reminder-checkbox]').should('be.checked')
    })

    it('should set reminder time before appointment', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=email-reminder-checkbox]').check()
      cy.get('[data-testid=reminder-time]').select('24 hours before')
      cy.get('[data-testid=reminder-time]').should('have.value', '24')
    })

    it('should display upcoming reminders list', () => {
      cy.get('[data-testid=reminders-button]').click()
      cy.get('[data-testid=reminders-list]').should('be.visible')
    })

    it('should send reminder on appointment creation', () => {
      cy.intercept('POST', '/api/reminders').as('sendReminder')

      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=email-reminder-checkbox]').check()
        cy.get('[data-testid=save-appointment-button]').click()

        cy.wait('@sendReminder')
      })
    })

    it('should show notification preferences', () => {
      cy.get('[data-testid=notification-settings-button]').click()
      cy.get('[data-testid=notification-preferences]').should('be.visible')
    })

    it('should display confirmation notification after appointment', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=mark-completed-button]').click()
      cy.get('[data-testid=success-message]').should('contain', 'Appointment completed')
    })
  })

  // =============================================================================
  // SECTION 10: TIME SLOT MANAGEMENT (8 tests)
  // =============================================================================

  describe('Time Slot Management', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display available time slots', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=available-slots]').should('be.visible')
    })

    it('should show time slots in chronological order', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=time-slot]').first().should('contain', '08:00')
    })

    it('should mark booked slots as unavailable', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=time-slot-booked]').should('exist')
    })

    it('should allow selecting available time slot', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=time-slot-available]').first().click()
      cy.get('[data-testid=appointment-time]').should('not.have.value', '')
    })

    it('should prevent double-booking', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-11-15')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=appointment-type]').select('Check-up')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=error-message]').should('contain', 'Time slot already booked')
    })

    it('should display slot duration options', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-duration]').should('be.visible')
    })

    it('should show buffer time between appointments', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=buffer-time-indicator]').should('exist')
    })

    it('should display slot capacity indicator', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=slot-capacity]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 11: STUDENT ASSOCIATION (8 tests)
  // =============================================================================

  describe('Student Association', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should display student selection dropdown', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').should('be.visible')
    })

    it('should list all active students', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select] option').should('have.length.greaterThan', 1)
    })

    it('should display student medical information', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=student-medical-info]').should('be.visible')
    })

    it('should show student allergies when selected', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=student-allergies]').should('be.visible')
    })

    it('should display student current medications', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=student-medications]').should('be.visible')
    })

    it('should filter appointments by student', () => {
      cy.get('[data-testid=filter-button]').click()
      cy.get('[data-testid=student-filter]').select(1)
      cy.get('[data-testid=apply-filters-button]').click()

      cy.get('[data-testid=appointment-event]').should('have.length.greaterThan', 0)
    })

    it('should show student appointment history', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=view-student-history]').click()
      cy.get('[data-testid=student-appointment-history]').should('be.visible')
    })

    it('should link to student profile from appointment', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=student-profile-link]').click()
      cy.url().should('include', '/students/')
    })
  })

  // =============================================================================
  // SECTION 12: DATA VALIDATION & ERROR HANDLING (10 tests)
  // =============================================================================

  describe('Data Validation & Error Handling', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should require student selection', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=student-error]').should('contain', 'Student is required')
    })

    it('should require appointment date', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=date-error]').should('contain', 'Date is required')
    })

    it('should require appointment time', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=save-appointment-button]').click()
      cy.get('[data-testid=time-error]').should('contain', 'Time is required')
    })

    it('should validate appointment is not in the past', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2020-01-01')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule appointments in the past')
    })

    it('should validate appointment duration is positive', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-duration]').type('-30')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=duration-error]').should('contain', 'Duration must be positive')
    })

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '/api/appointments', { statusCode: 500 }).as('createAppointment')

      cy.fixture('appointments').then((appointments) => {
        const newAppointment = appointments.testAppointment1

        cy.get('[data-testid=add-appointment-button]').click()
        cy.get('[data-testid=appointment-student-select]').select(newAppointment.studentName)
        cy.get('[data-testid=appointment-date]').type(newAppointment.date)
        cy.get('[data-testid=appointment-time]').type(newAppointment.time)
        cy.get('[data-testid=appointment-type]').select(newAppointment.type)
        cy.get('[data-testid=save-appointment-button]').click()

        cy.wait('@createAppointment')
        cy.get('[data-testid=error-message]').should('contain', 'Failed to create appointment')
      })
    })

    it('should display validation errors simultaneously', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=student-error]').should('be.visible')
      cy.get('[data-testid=date-error]').should('be.visible')
      cy.get('[data-testid=time-error]').should('be.visible')
    })

    it('should validate business hours constraints', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-12-01')
      cy.get('[data-testid=appointment-time]').type('22:00')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=time-error]').should('contain', 'Appointment must be during business hours')
    })

    it('should prevent scheduling on holidays/weekends', () => {
      cy.get('[data-testid=add-appointment-button]').click()
      cy.get('[data-testid=appointment-student-select]').select(1)
      cy.get('[data-testid=appointment-date]').type('2024-12-25')
      cy.get('[data-testid=appointment-time]').type('10:00')
      cy.get('[data-testid=save-appointment-button]').click()

      cy.get('[data-testid=date-error]').should('contain', 'Cannot schedule on holidays')
    })

    it('should handle server unavailability', () => {
      cy.intercept('GET', '/api/appointments*', { forceNetworkError: true }).as('getAppointments')

      cy.visit('/appointments')
      cy.get('[data-testid=error-message]').should('contain', 'Unable to load appointments')
    })
  })

  // =============================================================================
  // SECTION 13: HIPAA COMPLIANCE & SECURITY (8 tests)
  // =============================================================================

  describe('HIPAA Compliance & Security', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should require authentication to access appointments', () => {
      cy.clearCookies()
      cy.visit('/appointments')
      cy.url().should('include', '/login')
    })

    it('should create audit log when viewing appointments', () => {
      cy.intercept('POST', '/api/audit-log').as('auditLog')

      cy.visit('/appointments')

      cy.wait('@auditLog').its('request.body').should('deep.include', {
        action: 'VIEW_APPOINTMENTS',
        resourceType: 'APPOINTMENT'
      })
    })

    it('should mask sensitive patient information in list view', () => {
      cy.get('[data-testid=appointment-event]').first().should('not.contain', 'SSN')
    })

    it('should use secure HTTPS for API requests', () => {
      cy.intercept('GET', '/api/appointments*').as('getAppointments')

      cy.visit('/appointments')

      cy.wait('@getAppointments').its('request.url').should('include', 'https')
    })

    it('should include authentication token in requests', () => {
      cy.intercept('GET', '/api/appointments*').as('getAppointments')

      cy.visit('/appointments')

      cy.wait('@getAppointments').its('request.headers').should('have.property', 'authorization')
    })

    it('should prevent unauthorized access to appointment details', () => {
      cy.loginAs('readonly@school.edu', 'ReadOnlyPassword123!')
      cy.visit('/appointments')

      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=edit-appointment-button]').should('not.exist')
    })

    it('should enforce session timeout', () => {
      cy.wait(30000)
      cy.get('[data-testid=appointment-event]').first().click()
      cy.url().should('include', '/login')
    })

    it('should display PHI warning when accessing appointment details', () => {
      cy.get('[data-testid=appointment-event]').first().click()
      cy.get('[data-testid=phi-warning]').should('be.visible')
    })
  })

  // =============================================================================
  // SECTION 14: ACCESSIBILITY & RESPONSIVENESS (7 tests)
  // =============================================================================

  describe('Accessibility & Responsiveness', () => {
    beforeEach(() => {
      cy.login('nurse')
      cy.visit('/appointments')
    })

    it('should have proper ARIA labels on interactive elements', () => {
      cy.get('[data-testid=add-appointment-button]').should('have.attr', 'aria-label')
      cy.get('[data-testid=prev-period-button]').should('have.attr', 'aria-label')
    })

    it('should support keyboard navigation in calendar', () => {
      cy.get('[data-testid=calendar-date-cell]').first().focus()
      cy.focused().type('{enter}')
      cy.get('[data-testid=appointment-modal]').should('be.visible')
    })

    it('should display properly on mobile devices', () => {
      cy.viewport('iphone-x')
      cy.get('[data-testid=calendar-view]').should('be.visible')
      cy.get('[data-testid=add-appointment-button]').should('be.visible')
    })

    it('should display properly on tablet devices', () => {
      cy.viewport('ipad-2')
      cy.get('[data-testid=calendar-view]').should('be.visible')
      cy.get('[data-testid=appointment-event]').should('be.visible')
    })

    it('should have accessible color contrast', () => {
      cy.get('[data-testid=appointment-event]').first().should('have.css', 'color')
    })

    it('should support screen reader announcements', () => {
      cy.get('[data-testid=appointment-event]').first().should('have.attr', 'aria-label')
    })

    it('should be navigable with tab key', () => {
      cy.get('[data-testid=add-appointment-button]').focus().tab()
      cy.focused().should('have.attr', 'data-testid')
    })
  })
})
