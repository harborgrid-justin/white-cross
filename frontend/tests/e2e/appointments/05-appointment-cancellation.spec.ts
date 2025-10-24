import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Appointment Cancellation (10 tests)
 *
 * Tests appointment cancellation functionality
 */

test.describe('Appointment Scheduling - Appointment Cancellation', () => {
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
            status: 'Scheduled'
          }
        ]
      }
    });

    await page.route('**/api/appointments/**', async (route) => {
      if (route.request().method() === 'DELETE' || route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/notifications/, { success: true });
    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display cancel button in appointment details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('cancel-appointment-button').first()).toBeVisible();
  });

  test('should show confirmation modal when cancel is clicked', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await expect(page.getByTestId('confirm-cancel-modal').first()).toBeVisible();
  });

  test('should require cancellation reason', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('confirm-cancel-button').first().click();

    await expect(page.getByTestId('reason-error').first()).toContainText(/Cancellation reason is required/i);
  });

  test('should successfully cancel appointment with reason', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('cancellation-reason').first().fill('Student illness');
    await page.getByTestId('confirm-cancel-button').first().click();

    await expect(page.getByTestId('success-message').first()).toContainText(/Appointment cancelled/i);
  });

  test('should not cancel when cancel is aborted', async ({ page }) => {
    const initialCount = await page.getByTestId('appointment-event').count();

    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('abort-cancel-button').first().click();

    const currentCount = await page.getByTestId('appointment-event').count();
    expect(currentCount).toBe(initialCount);
  });

  test('should mark appointment as cancelled instead of deleting', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('cancellation-reason').first().fill('Rescheduled');
    await page.getByTestId('confirm-cancel-button').first().click();

    await page.getByTestId('view-cancelled-button').first().click();
    await expect(page.getByTestId('cancelled-appointment').first()).toBeAttached();
  });

  test('should display cancelled status on appointment', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('cancellation-reason').first().fill('No longer needed');
    await page.getByTestId('confirm-cancel-button').first().click();

    await page.getByTestId('view-cancelled-button').first().click();

    const cancelledAppointment = page.getByTestId('cancelled-appointment').first();
    const statusBadge = cancelledAppointment.locator('[data-testid=status-badge]');
    await expect(statusBadge).toContainText('Cancelled');
  });

  test('should send cancellation notification to student', async ({ page }) => {
    let notificationSent = false;

    await page.route('**/api/notifications', async (route) => {
      if (route.request().method() === 'POST') {
        notificationSent = true;
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
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('cancellation-reason').first().fill('Schedule conflict');
    await page.getByTestId('confirm-cancel-button').first().click();

    await page.waitForResponse(/\/api\/notifications/, { timeout: 5000 });
    expect(notificationSent).toBe(true);
  });

  test('should allow viewing cancellation history', async ({ page }) => {
    await page.getByTestId('view-cancelled-button').first().click();
    await expect(page.getByTestId('cancelled-appointments-list').first()).toBeVisible();
  });

  test('should create audit log when appointment is cancelled', async ({ page }) => {
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
    await page.getByTestId('cancel-appointment-button').first().click();
    await page.getByTestId('cancellation-reason').first().fill('Patient request');
    await page.getByTestId('confirm-cancel-button').first().click();

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('CANCEL_APPOINTMENT');
    expect(auditLogRequest.resourceType).toBe('APPOINTMENT');
  });
});
