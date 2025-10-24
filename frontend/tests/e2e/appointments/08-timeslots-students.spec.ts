import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Time Slots & Student Association (16 tests)
 *
 * Tests time slot management and student association features
 */

test.describe('Appointment Scheduling - Time Slot Management', () => {
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
            data: { appointment: { id: 'appt-001' } }
          })
        });
      } else {
        await route.continue();
      }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display available time slots', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await expect(page.getByTestId('available-slots').first()).toBeVisible();
  });

  test('should show time slots in chronological order', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');

    const firstSlot = await page.getByTestId('time-slot').first().textContent();
    expect(firstSlot).toContain('08:00');
  });

  test('should mark booked slots as unavailable', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await expect(page.getByTestId('time-slot-booked')).toBeAttached();
  });

  test('should allow selecting available time slot', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await page.getByTestId('time-slot-available').first().click();

    const timeValue = await page.getByTestId('appointment-time').first().inputValue();
    expect(timeValue).not.toBe('');
  });

  test('should prevent double-booking', async ({ page }) => {
    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
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

    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-11-15');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('appointment-type').first().selectOption('Check-up');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('error-message').first()).toContainText(/Time slot already booked/i);
  });

  test('should display slot duration options', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await expect(page.getByTestId('appointment-duration').first()).toBeVisible();
  });

  test('should show buffer time between appointments', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await expect(page.getByTestId('buffer-time-indicator')).toBeAttached();
  });

  test('should display slot capacity indicator', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await expect(page.getByTestId('slot-capacity').first()).toBeVisible();
  });
});

test.describe('Appointment Scheduling - Student Association', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: {
        appointments: [
          {
            id: 'appt-001',
            studentName: 'John Doe',
            studentId: 1,
            date: '2024-11-15',
            time: '10:00'
          }
        ]
      }
    });

    await mockApiResponse(page, /\/api\/students($|\?)/, {
      success: true,
      data: {
        students: [
          {
            id: 1,
            name: 'John Doe',
            allergies: ['Penicillin'],
            medications: ['Albuterol']
          }
        ]
      }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should display student selection dropdown', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await expect(page.getByTestId('appointment-student-select').first()).toBeVisible();
  });

  test('should list all active students', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();

    const options = page.getByTestId('appointment-student-select').first().locator('option');
    const count = await options.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should display student medical information', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await expect(page.getByTestId('student-medical-info').first()).toBeVisible();
  });

  test('should show student allergies when selected', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await expect(page.getByTestId('student-allergies').first()).toBeVisible();
  });

  test('should display student current medications', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await expect(page.getByTestId('student-medications').first()).toBeVisible();
  });

  test('should filter appointments by student', async ({ page }) => {
    await page.getByTestId('filter-button').first().click();
    await page.getByTestId('student-filter').first().selectOption({ index: 1 });
    await page.getByTestId('apply-filters-button').first().click();

    const count = await page.getByTestId('appointment-event').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show student appointment history', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('view-student-history').first().click();
    await expect(page.getByTestId('student-appointment-history').first()).toBeVisible();
  });

  test('should link to student profile from appointment', async ({ page }) => {
    await page.getByTestId('appointment-event').first().click();
    await page.getByTestId('student-profile-link').first().click();

    expect(page.url()).toContain('/students/');
  });
});
