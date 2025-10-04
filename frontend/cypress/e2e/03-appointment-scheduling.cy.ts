/// <reference types="cypress" />

describe('Appointment Scheduling', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.navigateTo('appointments')
  })

  it('should display the appointments page with proper elements', () => {
    cy.get('[data-cy=appointments-title]').should('contain', 'Appointments')
    cy.get('[data-cy=add-appointment-button]').should('be.visible')
    cy.get('[data-cy=appointments-calendar]').should('be.visible')
    cy.get('[data-cy=appointments-list]').should('be.visible')
    cy.get('[data-cy=date-filter]').should('be.visible')
  })

  it('should allow scheduling a new appointment', () => {
    cy.fixture('appointments').then((appointments) => {
      const newAppointment = appointments.checkup
      
      cy.get('[data-cy=add-appointment-button]').click()
      cy.get('[data-cy=appointment-modal]').should('be.visible')
      
      cy.get('[data-cy=appointment-student-select]').select(newAppointment.studentName)
      cy.get('[data-cy=appointment-date]').type(newAppointment.date)
      cy.get('[data-cy=appointment-time]').type(newAppointment.time)
      cy.get('[data-cy=appointment-type]').select(newAppointment.type)
      cy.get('[data-cy=appointment-notes]').type(newAppointment.notes)
      
      cy.get('[data-cy=save-appointment-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Appointment scheduled successfully')
      
      // Verify appointment appears in the list
      cy.get('[data-cy=appointments-list]').should('contain', newAppointment.studentName)
      cy.get('[data-cy=appointments-list]').should('contain', newAppointment.type)
    })
  })

  it('should show appointment details in calendar view', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments.medication
      
      // Create an appointment first
      cy.createAppointment(appointment)
      
      // Switch to calendar view
      cy.get('[data-cy=calendar-view-button]').click()
      cy.get('[data-cy=appointments-calendar]').should('be.visible')
      
      // Click on the appointment in calendar
      cy.get('[data-cy=calendar-appointment]')
        .contains(appointment.studentName)
        .click()
      
      // Verify appointment details popup
      cy.get('[data-cy=appointment-details-popup]').should('be.visible')
      cy.get('[data-cy=appointment-detail-student]').should('contain', appointment.studentName)
      cy.get('[data-cy=appointment-detail-type]').should('contain', appointment.type)
      cy.get('[data-cy=appointment-detail-time]').should('contain', appointment.time)
      cy.get('[data-cy=appointment-detail-notes]').should('contain', appointment.notes)
    })
  })

  it('should allow filtering appointments by date', () => {
    cy.fixture('appointments').then((appointments) => {
      // Create appointments for different dates
      cy.createAppointment(appointments.checkup)
      cy.createAppointment(appointments.emergency)
      
      // Filter by specific date
      cy.get('[data-cy=date-filter]').type('2024-01-15')
      cy.get('[data-cy=apply-filter-button]').click()
      
      // Verify only appointments for that date are shown
      cy.get('[data-cy=appointments-list]').should('contain', appointments.checkup.studentName)
      cy.get('[data-cy=appointments-list]').should('not.contain', appointments.emergency.studentName)
      
      // Clear filter
      cy.get('[data-cy=clear-filter-button]').click()
      cy.get('[data-cy=appointments-list]').should('contain', appointments.checkup.studentName)
      cy.get('[data-cy=appointments-list]').should('contain', appointments.emergency.studentName)
    })
  })

  it('should allow rescheduling appointments', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments.checkup
      const newDate = '2024-01-20'
      const newTime = '14:00'
      
      // Create an appointment first
      cy.createAppointment(appointment)
      
      // Find and reschedule the appointment
      cy.get('[data-cy=appointments-list]')
        .contains(appointment.studentName)
        .parent()
        .find('[data-cy=reschedule-button]')
        .click()
      
      cy.get('[data-cy=reschedule-modal]').should('be.visible')
      cy.get('[data-cy=new-appointment-date]').clear().type(newDate)
      cy.get('[data-cy=new-appointment-time]').clear().type(newTime)
      cy.get('[data-cy=confirm-reschedule-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Appointment rescheduled successfully')
      
      // Verify updated appointment details
      cy.get('[data-cy=appointments-list]').should('contain', newDate)
      cy.get('[data-cy=appointments-list]').should('contain', newTime)
    })
  })

  it('should handle appointment conflicts', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment1 = appointments.checkup
      const conflictingAppointment = {
        ...appointments.medication,
        date: appointment1.date,
        time: appointment1.time
      }
      
      // Create first appointment
      cy.createAppointment(appointment1)
      
      // Try to create conflicting appointment
      cy.get('[data-cy=add-appointment-button]').click()
      cy.get('[data-cy=appointment-student-select]').select(conflictingAppointment.studentName)
      cy.get('[data-cy=appointment-date]').type(conflictingAppointment.date)
      cy.get('[data-cy=appointment-time]').type(conflictingAppointment.time)
      cy.get('[data-cy=appointment-type]').select(conflictingAppointment.type)
      cy.get('[data-cy=save-appointment-button]').click()
      
      // Should show conflict warning
      cy.get('[data-cy=conflict-warning]').should('be.visible')
      cy.get('[data-cy=conflict-warning]').should('contain', 'Time slot already booked')
      
      // Should offer alternative times
      cy.get('[data-cy=suggested-times]').should('be.visible')
      cy.get('[data-cy=suggested-time-option]').first().click()
      cy.get('[data-cy=confirm-alternative-time]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Appointment scheduled successfully')
    })
  })

  it('should allow canceling appointments', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments.emergency
      
      // Create an appointment first
      cy.createAppointment(appointment)
      
      // Cancel the appointment
      cy.get('[data-cy=appointments-list]')
        .contains(appointment.studentName)
        .parent()
        .find('[data-cy=cancel-appointment-button]')
        .click()
      
      // Confirm cancellation
      cy.get('[data-cy=cancel-confirmation-modal]').should('be.visible')
      cy.get('[data-cy=cancel-reason-input]').type('Student recovered, no longer needed')
      cy.get('[data-cy=confirm-cancel-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Appointment cancelled successfully')
      
      // Verify appointment is removed or marked as cancelled
      cy.get('[data-cy=appointments-list]').should('not.contain', appointment.studentName)
    })
  })

  it('should send appointment reminders', () => {
    cy.fixture('appointments').then((appointments) => {
      const appointment = appointments.checkup
      
      // Create an appointment
      cy.createAppointment(appointment)
      
      // Navigate to appointment details
      cy.get('[data-cy=appointments-list]')
        .contains(appointment.studentName)
        .parent()
        .find('[data-cy=view-appointment-button]')
        .click()
      
      cy.get('[data-cy=appointment-details-modal]').should('be.visible')
      
      // Send reminder
      cy.get('[data-cy=send-reminder-button]').click()
      cy.get('[data-cy=reminder-options]').should('be.visible')
      cy.get('[data-cy=email-reminder]').check()
      cy.get('[data-cy=sms-reminder]').check()
      cy.get('[data-cy=send-reminder-confirm]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Reminders sent successfully')
    })
  })
})
