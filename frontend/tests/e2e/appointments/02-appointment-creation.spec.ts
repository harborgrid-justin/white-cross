import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Appointment Creation (15 tests)
 *
 * Tests appointment creation functionality including:
 * - Modal interactions and form validation
 * - Required field validation
 * - Date/time validation and past date prevention
 * - Audit logging for HIPAA compliance
 * - Calendar integration
 */

// Fixture data
const appointmentFixtures = {
  testAppointment1: {
    studentName: 'John Doe',
    date: '2024-11-15',
    time: '10:00',
    type: 'Check-up',
    notes: 'Regular checkup appointment'
  }
};

test.describe('Appointment Scheduling - Appointment Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Setup API intercepts for controlled testing
    await mockApiResponse(page, /\/api\/appointments($|\?)/, {
      success: true,
      data: { appointments: [], pagination: { page: 1, total: 0 } }
    });

    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { appointment: { id: 'appt-' + Date.now() } }
          })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/students/, {
      success: true,
      data: { students: [{ id: 1, name: 'John Doe' }] }
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/appointments');

    // Ensure page is loaded
    await page.waitForResponse(/\/api\/appointments/);
  });

  test('should open appointment creation modal when add button is clicked', async ({ page }) => {
    const addButton = page.getByTestId('add-appointment-button').or(
      page.locator('[data-cy=add-appointment-button]')
    ).first();

    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // Verify modal opens with proper attributes
    const modal = page.getByTestId('appointment-modal').or(
      page.locator('[data-cy=appointment-modal]')
    ).first();

    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');

    // Verify modal title
    await expect(modal).toContainText(/New Appointment|Create Appointment/i);
  });

  test('should display all required fields in creation form', async ({ page }) => {
    await page.getByTestId('add-appointment-button').or(page.locator('[data-cy=add-appointment-button]')).first().click();

    // Wait for modal to fully render
    const modal = page.getByTestId('appointment-modal').or(page.locator('[data-cy=appointment-modal]')).first();
    await expect(modal).toBeVisible();

    // Verify all required fields are present and accessible
    const studentSelect = page.getByTestId('appointment-student-select').or(
      page.locator('[data-cy=appointment-student-select]')
    ).first();
    await expect(studentSelect).toBeVisible();
    await expect(studentSelect).toBeEnabled();

    const dateInput = page.getByTestId('appointment-date').or(
      page.locator('[data-cy=appointment-date]')
    ).first();
    await expect(dateInput).toBeVisible();
    await expect(dateInput).toBeEnabled();

    const timeInput = page.getByTestId('appointment-time').or(
      page.locator('[data-cy=appointment-time]')
    ).first();
    await expect(timeInput).toBeVisible();
    await expect(timeInput).toBeEnabled();

    const typeSelect = page.getByTestId('appointment-type').or(
      page.locator('[data-cy=appointment-type]')
    ).first();
    await expect(typeSelect).toBeVisible();
    await expect(typeSelect).toBeEnabled();
  });

  test('should successfully create a new appointment', async ({ page }) => {
    const newAppointment = appointmentFixtures.testAppointment1;

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ label: newAppointment.studentName });
    await page.getByTestId('appointment-date').first().fill(newAppointment.date);
    await page.getByTestId('appointment-time').first().fill(newAppointment.time);
    await page.getByTestId('appointment-type').first().selectOption(newAppointment.type);
    await page.getByTestId('appointment-notes').first().fill(newAppointment.notes);
    await page.getByTestId('save-appointment-button').first().click();

    const successMessage = page.getByTestId('success-message').first();
    await expect(successMessage).toBeVisible();
  });

  test('should display success message after creating appointment', async ({ page }) => {
    const newAppointment = appointmentFixtures.testAppointment1;

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ label: newAppointment.studentName });
    await page.getByTestId('appointment-date').first().fill(newAppointment.date);
    await page.getByTestId('appointment-time').first().fill(newAppointment.time);
    await page.getByTestId('appointment-type').first().selectOption(newAppointment.type);
    await page.getByTestId('save-appointment-button').first().click();

    const successMessage = page.getByTestId('success-message').first();
    await expect(successMessage).toContainText(/Appointment created successfully/i);
  });

  test('should close modal after successful creation', async ({ page }) => {
    const newAppointment = appointmentFixtures.testAppointment1;

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ label: newAppointment.studentName });
    await page.getByTestId('appointment-date').first().fill(newAppointment.date);
    await page.getByTestId('appointment-time').first().fill(newAppointment.time);
    await page.getByTestId('appointment-type').first().selectOption(newAppointment.type);
    await page.getByTestId('save-appointment-button').first().click();

    const modal = page.getByTestId('appointment-modal').first();
    await expect(modal).not.toBeAttached({ timeout: 5000 });
  });

  test('should allow creating appointment with custom duration', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('appointment-duration').first().fill('45');
    await page.getByTestId('appointment-type').first().selectOption('Follow-up');
    await page.getByTestId('save-appointment-button').first().click();

    const successMessage = page.getByTestId('success-message').first();
    await expect(successMessage).toBeVisible();
  });

  test('should display appointment type options', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-type').first().click();

    const options = page.getByTestId('appointment-type').first().locator('option');
    await expect(options.filter({ hasText: 'Check-up' })).toBeAttached();
    await expect(options.filter({ hasText: 'Follow-up' })).toBeAttached();
    await expect(options.filter({ hasText: 'Vaccination' })).toBeAttached();
  });

  test('should validate required fields on submission', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('student-error').first()).toContainText(/Student is required/i);
    await expect(page.getByTestId('date-error').first()).toContainText(/Date is required/i);
    await expect(page.getByTestId('time-error').first()).toContainText(/Time is required/i);
  });

  test('should prevent creating appointments in the past', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2020-01-01');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('appointment-type').first().selectOption('Check-up');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('date-error').first()).toContainText(/Cannot schedule appointments in the past/i);
  });

  test('should allow adding notes to appointment', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();

    const notesField = page.getByTestId('appointment-notes').first();
    await expect(notesField).toBeVisible();
    await notesField.fill('Patient needs medication refill discussion');

    const value = await notesField.inputValue();
    expect(value).toBe('Patient needs medication refill discussion');
  });

  test('should close modal when cancel button is clicked', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();

    const modal = page.getByTestId('appointment-modal').first();
    await expect(modal).toBeVisible();

    await page.getByTestId('cancel-button').first().click();
    await expect(modal).not.toBeAttached({ timeout: 5000 });
  });

  test('should clear form when modal is closed and reopened', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-notes').first().fill('Test notes');
    await page.getByTestId('cancel-button').first().click();

    await page.getByTestId('add-appointment-button').first().click();

    const notesValue = await page.getByTestId('appointment-notes').first().inputValue();
    expect(notesValue).toBe('');
  });

  test('should create appointment from calendar date click', async ({ page }) => {
    const calendarDate = page.getByTestId('calendar-date-cell').first();
    await calendarDate.click();

    const modal = page.getByTestId('appointment-modal').first();
    await expect(modal).toBeVisible();

    const dateValue = await page.getByTestId('appointment-date').first().inputValue();
    expect(dateValue).not.toBe('');
  });

  test('should show available time slots when creating appointment', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-11-15');

    const slotsContainer = page.getByTestId('available-slots').first();
    await expect(slotsContainer).toBeVisible();
  });

  test('should create audit log when appointment is created', async ({ page }) => {
    let auditLogRequest: any = null;

    await page.route('**/api/audit-log', async (route) => {
      if (route.request().method() === 'POST') {
        auditLogRequest = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    const newAppointment = appointmentFixtures.testAppointment1;

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ label: newAppointment.studentName });
    await page.getByTestId('appointment-date').first().fill(newAppointment.date);
    await page.getByTestId('appointment-time').first().fill(newAppointment.time);
    await page.getByTestId('appointment-type').first().selectOption(newAppointment.type);
    await page.getByTestId('save-appointment-button').first().click();

    // Wait for audit log request
    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('CREATE_APPOINTMENT');
    expect(auditLogRequest.resourceType).toBe('APPOINTMENT');
  });
});
