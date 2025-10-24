import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Search, Filtering & Reminders (18 tests)
 *
 * Tests search/filter functionality and reminder features
 */

test.describe('Appointment Scheduling - Appointment Search & Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: {
        appointments: [
          { id: 'appt-001', studentName: 'John Doe', type: 'Check-up', status: 'Scheduled' },
          { id: 'appt-002', studentName: 'Jane Smith', type: 'Follow-up', status: 'Scheduled' },
          { id: 'appt-003', studentName: 'Bob Johnson', type: 'Vaccination', status: 'Completed' }
        ]
      }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display search input', async ({ page }) => {
    await expect(page.getByTestId('appointment-search').first()).toBeVisible();
  });

  test('should filter appointments by student name', async ({ page }) => {
    await page.getByTestId('appointment-search').first().fill('John');

    const events = page.getByTestId('appointment-event');
    const firstEvent = await events.first().textContent();
    expect(firstEvent).toContain('John');
  });

  test('should filter appointments by type', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('type-filter').first().selectOption('Check-up');
    await page.getByTestId('apply-filters-button').first().click();

    const events = page.getByTestId('appointment-event');
    const count = await events.count();

    for (let i = 0; i < count; i++) {
      const text = await events.nth(i).textContent();
      expect(text).toContain('Check-up');
    }
  });

  test('should filter appointments by status', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('status-filter').first().selectOption('Scheduled');
    await page.getByTestId('apply-filters-button').first().click();

    await expect(page.getByTestId('appointment-event')).toBeAttached();
  });

  test('should filter appointments by date range', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('start-date-filter').first().fill('2024-11-01');
    await page.getByTestId('end-date-filter').first().fill('2024-11-30');
    await page.getByTestId('apply-filters-button').first().click();

    const count = await page.getByTestId('appointment-event').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should clear all filters', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('type-filter').first().selectOption('Check-up');
    await page.getByTestId('apply-filters-button').first().click();

    await page.getByTestId('clear-filters-button').first().click();

    const count = await page.getByTestId('appointment-event').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show no results message when no matches', async ({ page }) => {
    await page.getByTestId('appointment-search').first().fill('NonexistentStudent12345');

    await expect(page.getByTestId('no-results-message').first()).toBeVisible();
    await expect(page.getByTestId('no-results-message').first()).toContainText(/No appointments found/i);
  });

  test('should display active filter badges', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('type-filter').first().selectOption('Follow-up');
    await page.getByTestId('apply-filters-button').first().click();

    await expect(page.getByTestId('filter-badge').first()).toBeVisible();
    await expect(page.getByTestId('filter-badge').first()).toContainText('Follow-up');
  });

  test('should filter by upcoming appointments only', async ({ page }) => {
    await page.getByTestId('upcoming-only-filter').first().check();

    const count = await page.getByTestId('appointment-event').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should persist filters when switching views', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('type-filter').first().selectOption('Vaccination');
    await page.getByTestId('apply-filters-button').first().click();

    await page.getByTestId('view-list-button').first().click();

    await expect(page.getByTestId('filter-badge').first()).toContainText('Vaccination');
  });
});

test.describe('Appointment Scheduling - Appointment Reminders & Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: { appointments: [] }
    });

    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { appointment: { id: 'appt-new-001' } }
          })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/reminders/, { success: true });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display reminder settings in appointment form', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await expect(page.getByTestId('reminder-settings').first()).toBeVisible();
  });

  test('should enable email reminder', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('email-reminder-checkbox').first().check();
    await expect(page.getByTestId('email-reminder-checkbox').first()).toBeChecked();
  });

  test('should enable SMS reminder', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('sms-reminder-checkbox').first().check();
    await expect(page.getByTestId('sms-reminder-checkbox').first()).toBeChecked();
  });

  test('should set reminder time before appointment', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('email-reminder-checkbox').first().check();
    await page.getByTestId('reminder-time').first().selectOption('24');

    const value = await page.getByTestId('reminder-time').first().inputValue();
    expect(value).toBe('24');
  });

  test('should display upcoming reminders list', async ({ page }) => {
    await page.getByTestId('reminders-button').first().click();
    await expect(page.getByTestId('reminders-list').first()).toBeVisible();
  });

  test('should send reminder on appointment creation', async ({ page }) => {
    let reminderSent = false;

    await page.route('**/api/reminders', async (route) => {
      if (route.request().method() === 'POST') {
        reminderSent = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ label: 'John Doe' });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('appointment-type').first().selectOption('Check-up');
    await page.getByTestId('email-reminder-checkbox').first().check();
    await page.getByTestId('save-appointment-button').first().click();

    await page.waitForResponse(/\/api\/reminders/, { timeout: 5000 });
    expect(reminderSent).toBe(true);
  });

  test('should show notification preferences', async ({ page }) => {
    await page.getByTestId('notification-settings-button').first().click();
    await expect(page.getByTestId('notification-preferences').first()).toBeVisible();
  });

  test('should display confirmation notification after appointment', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('mark-completed-button').first().click();

    await expect(page.getByTestId('success-message').first()).toContainText(/Appointment completed/i);
  });
});
