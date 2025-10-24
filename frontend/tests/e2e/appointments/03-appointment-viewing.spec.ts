import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Appointment Viewing & Details (12 tests)
 *
 * Tests appointment viewing and details display
 */

test.describe('Appointment Scheduling - Appointment Viewing & Details', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
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

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display appointments in calendar view', async ({ page }) => {
    await expect(page.getByTestId('calendar-view').first()).toBeVisible();
    await expect(page.getByTestId('appointment-event').first()).toBeAttached();
  });

  test('should switch to list view when list button is clicked', async ({ page }) => {
    await page.getByTestId('view-list-button').first().click();
    await expect(page.getByTestId('appointments-list').first()).toBeVisible();
  });

  test('should display appointment details when clicked', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-details-modal').first()).toBeVisible();
  });

  test('should show student name in appointment details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-student-name').first()).toBeVisible();
  });

  test('should show appointment date and time in details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-datetime').first()).toBeVisible();
  });

  test('should show appointment type in details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-type-display').first()).toBeVisible();
  });

  test('should show appointment notes in details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-notes-display').first()).toBeVisible();
  });

  test('should show appointment duration in details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-duration-display').first()).toBeVisible();
  });

  test('should show appointment status in details', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await expect(page.getByTestId('appointment-status').first()).toBeVisible();
  });

  test('should close details modal when close button is clicked', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();

    const modal = page.getByTestId('appointment-details-modal').first();
    await expect(modal).toBeVisible();

    await page.getByTestId('close-details-button').first().click();
    await expect(modal).not.toBeAttached({ timeout: 5000 });
  });

  test('should display appointments in list format', async ({ page }) => {
    await page.getByTestId('view-list-button').first().click();

    const listItems = page.getByTestId('appointment-list-item');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should create audit log when viewing appointment details', async ({ page }) => {
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

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('VIEW_APPOINTMENT');
    expect(auditLogRequest.resourceType).toBe('APPOINTMENT');
  });
});
