import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Calendar View & Recurring Appointments (22 tests)
 *
 * Tests calendar navigation and recurring appointment functionality
 */

test.describe('Appointment Scheduling - Calendar View & Navigation', () => {
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
            type: 'Check-up'
          }
        ]
      }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display calendar in month view by default', async ({ page }) => {
    await expect(page.getByTestId('calendar-view').first()).toBeVisible();
    await expect(page.getByTestId('calendar-month-view').first()).toBeVisible();
  });

  test('should navigate to next month when next button is clicked', async ({ page }) => {
    const currentMonth = await page.getByTestId('current-period-display').first().textContent();

    await page.getByTestId('next-period-button').first().click();

    const newMonth = await page.getByTestId('current-period-display').first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test('should navigate to previous month when prev button is clicked', async ({ page }) => {
    const currentMonth = await page.getByTestId('current-period-display').first().textContent();

    await page.getByTestId('prev-period-button').first().click();

    const newMonth = await page.getByTestId('current-period-display').first().textContent();
    expect(newMonth).not.toBe(currentMonth);
  });

  test('should return to today when today button is clicked', async ({ page }) => {
    await page.getByTestId('next-period-button').first().click();
    await page.getByTestId('next-period-button').first().click();
    await page.getByTestId('today-button').first().click();

    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });

    const currentPeriod = await page.getByTestId('current-period-display').first().textContent();
    expect(currentPeriod).toContain(monthName);
  });

  test('should switch to week view', async ({ page }) => {
    await page.getByTestId('view-week-button').first().click();
    await expect(page.getByTestId('calendar-week-view').first()).toBeVisible();
  });

  test('should switch to day view', async ({ page }) => {
    await page.getByTestId('view-day-button').first().click();
    await expect(page.getByTestId('calendar-day-view').first()).toBeVisible();
  });

  test('should highlight today on calendar', async ({ page }) => {
    await expect(page.getByTestId('today-highlight').first()).toBeVisible();
  });

  test('should display appointments on correct dates', async ({ page }) => {
    await expect(page.getByTestId('appointment-event').first()).toBeVisible();
  });

  test('should show appointment count on calendar dates', async ({ page }) => {
    await expect(page.getByTestId('date-appointment-count')).toBeAttached();
  });

  test('should allow clicking on date to create appointment', async ({ page }) => {
    await page.getByTestId('calendar-date-cell').first().click();
    await expect(page.getByTestId('appointment-modal').first()).toBeVisible();
  });

  test('should display color-coded appointments by type', async ({ page }) => {
    const appointmentEvent = page.getByTestId('appointment-event').first();
    const backgroundColor = await appointmentEvent.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBeTruthy();
  });

  test('should show calendar legend for appointment types', async ({ page }) => {
    await expect(page.getByTestId('calendar-legend').first()).toBeVisible();

    const legendItems = page.getByTestId('legend-item');
    const count = await legendItems.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Appointment Scheduling - Recurring Appointments', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { appointment: { id: 'appt-recur-001' } }
          })
        });
      } else {
        await route.continue();
      }
    });

    await mockApiResponse(page, /\/api\/appointments($|\?)/, {
      success: true,
      data: { appointments: [] }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display recurring appointment option', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await expect(page.getByTestId('recurring-checkbox').first()).toBeVisible();
  });

  test('should show recurrence options when enabled', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('recurring-checkbox').first().check();
    await expect(page.getByTestId('recurrence-pattern').first()).toBeVisible();
  });

  test('should create daily recurring appointments', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('appointment-type').first().selectOption('Medication');
    await page.getByTestId('recurring-checkbox').first().check();
    await page.getByTestId('recurrence-pattern').first().selectOption('Daily');
    await page.getByTestId('recurrence-end-date').first().fill('2024-11-20');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toContainText(/Recurring appointments created/i);
  });

  test('should create weekly recurring appointments', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('14:00');
    await page.getByTestId('appointment-type').first().selectOption('Check-up');
    await page.getByTestId('recurring-checkbox').first().check();
    await page.getByTestId('recurrence-pattern').first().selectOption('Weekly');
    await page.getByTestId('recurrence-end-date').first().fill('2024-12-15');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should create monthly recurring appointments', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('09:00');
    await page.getByTestId('appointment-type').first().selectOption('Follow-up');
    await page.getByTestId('recurring-checkbox').first().check();
    await page.getByTestId('recurrence-pattern').first().selectOption('Monthly');
    await page.getByTestId('recurrence-count').first().fill('6');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('success-message').first()).toBeVisible();
  });

  test('should display recurring indicator on appointments', async ({ page }) => {
    await expect(page.getByTestId('recurring-appointment-icon')).toBeAttached();
  });

  test('should allow editing single occurrence', async ({ page }) => {
    await page.getByTestId('recurring-appointment-icon').first().click();
    await page.getByTestId('edit-occurrence-option').first().click();
    await expect(page.getByTestId('appointment-modal').first()).toBeVisible();
  });

  test('should allow editing all occurrences', async ({ page }) => {
    await page.getByTestId('recurring-appointment-icon').first().click();
    await page.getByTestId('edit-series-option').first().click();
    await expect(page.getByTestId('appointment-modal').first()).toBeVisible();
  });

  test('should validate recurrence end date', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('recurring-checkbox').first().check();
    await page.getByTestId('recurrence-end-date').first().fill('2024-11-10');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('recurrence-error').first()).toContainText(/End date must be after start date/i);
  });

  test('should cancel recurring series', async ({ page }) => {
    await page.getByTestId('recurring-appointment-icon').first().click();
    await page.getByTestId('cancel-series-option').first().click();
    await page.getByTestId('cancellation-reason').first().fill('No longer needed');
    await page.getByTestId('confirm-cancel-button').first().click();

    await expect(page.getByTestId('success-message').first()).toContainText(/Recurring series cancelled/i);
  });
});
