/**
 * Cypress E2E Tests for Appointments
 *
 * Tests appointment scheduling workflow:
 * - Create appointment
 * - View appointment calendar
 * - Edit appointment
 * - Cancel appointment
 *
 * @module cypress/e2e/appointments.cy
 */

describe('Appointments', () => {
  beforeEach(() => {
    // Login before each test
    cy.loginByApi('nurse@example.com', 'password123');
    cy.visit('/appointments');
  });

  describe('Appointment List', () => {
    it('should display appointments list', () => {
      cy.findByRole('heading', { name: /appointments/i }).should('be.visible');

      // Should show appointments table or list
      cy.findByRole('table').or(cy.findByRole('list')).should('be.visible');
    });

    it('should filter appointments by status', () => {
      // Mock API response
      cy.mockApi('GET', '/api/v1/appointments*', {
        statusCode: 200,
        body: {
          data: [
            { id: '1', status: 'scheduled', patientName: 'John Doe' },
            { id: '2', status: 'completed', patientName: 'Jane Smith' },
          ],
        },
      });

      // Select filter
      cy.findByLabelText(/status|filter/i).select('Scheduled');

      // Should show only scheduled appointments
      cy.findByText('John Doe').should('be.visible');
      cy.findByText('Jane Smith').should('not.exist');
    });

    it('should search appointments', () => {
      cy.mockApi('GET', '/api/v1/appointments*', {
        statusCode: 200,
        body: {
          data: [
            { id: '1', patientName: 'John Doe' },
          ],
        },
      });

      // Type in search
      cy.findByPlaceholderText(/search/i).type('John');

      // Wait for API call
      cy.waitForApi('GET', '/api/v1/appointments');

      // Should show search results
      cy.findByText('John Doe').should('be.visible');
    });
  });

  describe('Create Appointment', () => {
    beforeEach(() => {
      cy.findByRole('button', { name: /new appointment|schedule|create/i }).click();
    });

    it('should create a new appointment', () => {
      // Mock API response
      cy.mockApi('POST', '/api/v1/appointments', {
        statusCode: 201,
        body: {
          data: { id: '123', status: 'scheduled' },
        },
      });

      // Fill form
      cy.fillForm({
        'Patient Name': 'John Doe',
        'Date': '2025-12-01',
        'Time': '10:00',
        'Reason': 'Annual checkup',
      });

      // Select appointment type
      cy.findByLabelText(/type/i).select('Checkup');

      // Submit
      cy.findByRole('button', { name: /schedule|create|save/i }).click();

      // Wait for API call
      cy.waitForApi('POST', '/api/v1/appointments');

      // Should show success message
      cy.findByText(/appointment (created|scheduled)/i).should('be.visible');

      // Should redirect to appointments list
      cy.url().should('include', '/appointments');
    });

    it('should validate required fields', () => {
      // Try to submit without filling form
      cy.findByRole('button', { name: /schedule|create|save/i }).click();

      // Should show validation errors
      cy.findByText(/patient (name )?is required/i).should('be.visible');
      cy.findByText(/date is required/i).should('be.visible');
    });

    it('should prevent double-booking', () => {
      // Mock API error response
      cy.mockApi('POST', '/api/v1/appointments', {
        statusCode: 409,
        body: {
          error: 'Time slot already booked',
        },
      });

      cy.fillForm({
        'Patient Name': 'John Doe',
        'Date': '2025-12-01',
        'Time': '10:00',
      });

      cy.findByRole('button', { name: /schedule|create/i }).click();

      // Should show error message
      cy.findByText(/already booked|conflict/i).should('be.visible');
    });
  });

  describe('Appointment Calendar', () => {
    beforeEach(() => {
      cy.navigateTo('Calendar');
    });

    it('should display calendar view', () => {
      cy.findByRole('heading', { name: /calendar/i }).should('be.visible');

      // Should show calendar grid
      cy.get('[data-testid="calendar"]').or(cy.get('.calendar')).should('be.visible');
    });

    it('should navigate between months', () => {
      // Click next month
      cy.findByRole('button', { name: /next (month)?/i }).click();

      // Should update calendar
      // (Check that month name changes)
      cy.get('[data-month]').should('exist');
    });

    it('should show appointments on calendar', () => {
      cy.mockApi('GET', '/api/v1/appointments*', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '1',
              date: '2025-12-15',
              time: '10:00',
              patientName: 'John Doe',
            },
          ],
        },
      });

      // Should show appointment on calendar
      cy.findByText('John Doe').should('be.visible');
    });

    it('should open appointment details on click', () => {
      cy.mockApi('GET', '/api/v1/appointments*', {
        statusCode: 200,
        body: {
          data: [
            {
              id: '1',
              date: '2025-12-15',
              time: '10:00',
              patientName: 'John Doe',
            },
          ],
        },
      });

      // Click on appointment
      cy.findByText('John Doe').click();

      // Should show appointment details modal or page
      cy.findByText(/appointment details/i).should('be.visible');
    });
  });

  describe('Edit Appointment', () => {
    beforeEach(() => {
      cy.visit('/appointments/123/edit');
    });

    it('should load appointment data', () => {
      cy.mockApi('GET', '/api/v1/appointments/123', {
        statusCode: 200,
        body: {
          data: {
            id: '123',
            patientName: 'John Doe',
            date: '2025-12-01',
            time: '10:00',
          },
        },
      });

      // Form should be pre-filled
      cy.findByLabelText(/patient name/i).should('have.value', 'John Doe');
      cy.findByLabelText(/date/i).should('have.value', '2025-12-01');
    });

    it('should update appointment', () => {
      cy.mockApi('PUT', '/api/v1/appointments/123', {
        statusCode: 200,
        body: {
          data: { id: '123', status: 'updated' },
        },
      });

      // Change time
      cy.findByLabelText(/time/i).clear().type('14:00');

      // Submit
      cy.findByRole('button', { name: /update|save/i }).click();

      // Should show success message
      cy.findByText(/appointment updated/i).should('be.visible');
    });
  });

  describe('Cancel Appointment', () => {
    it('should cancel appointment with confirmation', () => {
      cy.visit('/appointments/123');

      // Mock API response
      cy.mockApi('DELETE', '/api/v1/appointments/123', {
        statusCode: 200,
        body: { success: true },
      });

      // Click cancel button
      cy.findByRole('button', { name: /cancel appointment/i }).click();

      // Should show confirmation dialog
      cy.findByText(/are you sure/i).should('be.visible');

      // Confirm cancellation
      cy.findByRole('button', { name: /confirm|yes|delete/i }).click();

      // Should redirect to appointments list
      cy.url().should('include', '/appointments');

      // Should show success message
      cy.findByText(/appointment (cancelled|deleted)/i).should('be.visible');
    });

    it('should not cancel appointment if user declines confirmation', () => {
      cy.visit('/appointments/123');

      // Click cancel button
      cy.findByRole('button', { name: /cancel appointment/i }).click();

      // Click "No" or "Cancel" in confirmation dialog
      cy.findByRole('button', { name: /no|cancel/i }).click();

      // Should stay on appointment page
      cy.url().should('include', '/appointments/123');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', () => {
      cy.checkA11y();
    });

    it('should be keyboard navigable', () => {
      // Tab through elements
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });
  });
});
