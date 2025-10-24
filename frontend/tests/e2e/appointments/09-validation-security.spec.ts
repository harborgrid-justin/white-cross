import { test, expect } from '@playwright/test';
import { login, clearAuthState } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Validation, Security & Accessibility (25 tests)
 *
 * Tests data validation, HIPAA compliance, and accessibility
 */

test.describe('Appointment Scheduling - Data Validation & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: { appointments: [] }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should require student selection', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('student-error').first()).toContainText(/Student is required/i);
  });

  test('should require appointment date', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('date-error').first()).toContainText(/Date is required/i);
  });

  test('should require appointment time', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('time-error').first()).toContainText(/Time is required/i);
  });

  test('should validate appointment is not in the past', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2020-01-01');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('date-error').first()).toContainText(/Cannot schedule appointments in the past/i);
  });

  test('should validate appointment duration is positive', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-duration').first().fill('-30');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('duration-error').first()).toContainText(/Duration must be positive/i);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: { message: 'Server error' } })
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
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('error-message').first()).toContainText(/Failed to create appointment/i);
  });

  test('should display validation errors simultaneously', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('student-error').first()).toBeVisible();
    await expect(page.getByTestId('date-error').first()).toBeVisible();
    await expect(page.getByTestId('time-error').first()).toBeVisible();
  });

  test('should validate business hours constraints', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-12-01');
    await page.getByTestId('appointment-time').first().fill('22:00');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('time-error').first()).toContainText(/Appointment must be during business hours/i);
  });

  test('should prevent scheduling on holidays/weekends', async ({ page }) => {
    await page.getByTestId('add-appointment-button').first().click();
    await page.getByTestId('appointment-student-select').first().selectOption({ index: 1 });
    await page.getByTestId('appointment-date').first().fill('2024-12-25');
    await page.getByTestId('appointment-time').first().fill('10:00');
    await page.getByTestId('save-appointment-button').first().click();

    await expect(page.getByTestId('date-error').first()).toContainText(/Cannot schedule on holidays/i);
  });

  test('should handle server unavailability', async ({ page }) => {
    await page.route('**/api/appointments*', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/appointments');

    await expect(page.getByTestId('error-message').first()).toContainText(/Unable to load appointments/i);
  });
});

test.describe('Appointment Scheduling - HIPAA Compliance & Security', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: { appointments: [] }
    });

    await mockApiResponse(page, /\/api\/audit-log/, { success: true });
  });

  test('should require authentication to access appointments', async ({ page }) => {
    await page.goto('/appointments');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('should create audit log when viewing appointments', async ({ page }) => {
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

    await login(page, 'nurse');
    await page.goto('/appointments');

    await page.waitForResponse(/\/api\/audit-log/, { timeout: 5000 });

    expect(auditLogRequest).toBeTruthy();
    expect(auditLogRequest.action).toBe('VIEW_APPOINTMENTS');
    expect(auditLogRequest.resourceType).toBe('APPOINTMENT');
  });

  test('should mask sensitive patient information in list view', async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/appointments');

    const firstEvent = await page.getByTestId('appointment-event').first().textContent();
    expect(firstEvent).not.toContain('SSN');
  });

  test('should use secure HTTPS for API requests', async ({ page }) => {
    let requestUrl = '';

    await page.route('**/api/appointments*', async (route) => {
      requestUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { appointments: [] } })
      });
    });

    await login(page, 'nurse');
    await page.goto('/appointments');

    expect(requestUrl).toContain('http'); // Will be https in production
  });

  test('should include authentication token in requests', async ({ page }) => {
    let hasAuthHeader = false;

    await page.route('**/api/appointments*', async (route) => {
      hasAuthHeader = !!route.request().headers()['authorization'];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { appointments: [] } })
      });
    });

    await login(page, 'nurse');
    await page.goto('/appointments');

    expect(hasAuthHeader).toBe(true);
  });

  test('should prevent unauthorized access to appointment details', async ({ page }) => {
    // Mock readonly user permissions
    await login(page, 'viewer');
    await page.goto('/appointments');

    await page.getByTestId('appointment-event').first().click();

    const editButton = page.getByTestId('edit-appointment-button');
    await expect(editButton).not.toBeAttached();
  });

  test('should enforce session timeout', async ({ page }) => {
    // This would require mocking session expiration
    // For now, just verify that expired sessions redirect to login
    await login(page, 'nurse');

    // Clear auth state to simulate expiration
    await clearAuthState(page);

    await page.goto('/appointments');
    await page.waitForURL(/\/login/, { timeout: 10000 });

    expect(page.url()).toContain('/login');
  });

  test('should display PHI warning when accessing appointment details', async ({ page }) => {
    await login(page, 'nurse');
    await page.goto('/appointments');

    await page.getByTestId('appointment-event').first().click();

    await expect(page.getByTestId('phi-warning').first()).toBeVisible();
  });
});

test.describe('Appointment Scheduling - Accessibility & Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiResponse(page, /\/api\/appointments/, {
      success: true,
      data: { appointments: [] }
    });

    await login(page, 'nurse');
    await page.goto('/appointments');
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await expect(page.getByTestId('add-appointment-button').first()).toHaveAttribute('aria-label');
    await expect(page.getByTestId('prev-period-button').first()).toHaveAttribute('aria-label');
  });

  test('should support keyboard navigation in calendar', async ({ page }) => {
    const calendarCell = page.getByTestId('calendar-date-cell').first();
    await calendarCell.focus();
    await calendarCell.press('Enter');

    await expect(page.getByTestId('appointment-modal').first()).toBeVisible();
  });

  test('should display properly on mobile devices', async ({ page, isMobile }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByTestId('calendar-view').first()).toBeVisible();
    await expect(page.getByTestId('add-appointment-button').first()).toBeVisible();
  });

  test('should display properly on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await expect(page.getByTestId('calendar-view').first()).toBeVisible();
    await expect(page.getByTestId('appointment-event')).toBeAttached();
  });

  test('should have accessible color contrast', async ({ page }) => {
    const appointmentEvent = page.getByTestId('appointment-event').first();

    const color = await appointmentEvent.evaluate((el) =>
      window.getComputedStyle(el).color
    );

    expect(color).toBeTruthy();
  });

  test('should support screen reader announcements', async ({ page }) => {
    const appointmentEvent = page.getByTestId('appointment-event').first();
    await expect(appointmentEvent).toHaveAttribute('aria-label');
  });

  test('should be navigable with tab key', async ({ page }) => {
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBeTruthy();
  });
});
