import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Appointment Editing & Updates (12 tests)
 *
 * Tests appointment editing and update functionality
 */

test.describe('Appointment Scheduling - Appointment Editing & Updates', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments($|\?)/, {
      success: true,
      data: {
        appointments: [
          {
            id: 'appt-001',
            studentName: 'John Doe',
            date: '2024-11-15',
            time: '10:00',
            type: 'Check-up',
            notes: 'Regular checkup',
            duration: 30,
            status: 'Scheduled'
          }
        ]
      }
    });

    await page.route('**/api/appointments/**', async (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { appointment: {} }
          })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should open edit modal from appointment details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await expect(page.getByTestId('appointment-modal').first()).toBeVisible();
  });

  test('should populate form with existing appointment data', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();

    const studentValue = await page.getByTestId('appointment-student-select').first().inputValue();
    expect(studentValue).not.toBe('');

    const dateValue = await page.getByTestId('appointment-date').first().inputValue();
    expect(dateValue).not.toBe('');
  });

  test('should successfully update appointment date', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toContainText(/Appointment updated/i);
  });

  test('should successfully update appointment time', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-time').first().fill('14:00');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should successfully update appointment type', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-type').first().selectOption('Follow-up');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should successfully update appointment notes', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-notes').first().fill('Updated appointment notes');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should preserve data when canceling edit', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();

    const originalDateTime = await page.getByTestId('appointment-datetime').first().textContent();

    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2025-01-01');
    await page.getByTestId('cancel-button').first().click();

    await page.getByTestId('appointment-event').first().click();

    const currentDateTime = await page.getByTestId('appointment-datetime').first().textContent();
    expect(currentDateTime).toContain(originalDateTime || '');
  });

  test('should validate time slot availability when rescheduling', async ({ page }) => {
    await page.route('**/api/appointments/**', async (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { message: 'Time slot already booked' }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-11-20');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('error-message').first()).toContainText(/Time slot already booked/i);
  });

  test('should allow changing appointment duration', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-duration').first().fill('60');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should update appointment status', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-status-select').first().selectOption('Completed');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should close modal after successful update', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-notes').first().fill('Updated');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('appointment-modal').first()).not.toBeAttached({ timeout: 5000 });
  });

  test('should create audit log when appointment is updated', async ({ page }) => {
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

    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('edit-appointment-button').first().click();
    await page.getByTestId('appointment-notes').first().fill('Updated');
    await page.getByTestId('save-appointment-button').first().click();

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('UPDATE_APPOINTMENT');
    expect(auditLogRequest.resourceType).toBe('APPOINTMENT');
  });
});
