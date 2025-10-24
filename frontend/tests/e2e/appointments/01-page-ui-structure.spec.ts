import { test, expect } from '@playwright/test';
import { login } from '../../support/auth-helpers';
import { mockApiResponse } from '../../support/test-helpers';

/**
 * Appointment Scheduling: Page Load & UI Structure (10 tests)
 *
 * Tests page load behavior and UI element visibility
 * Validates core navigation, calendar view, and filter controls
 */

test.describe('Appointment Scheduling - Page Load & UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept appointments API to ensure controlled test state
    await mockApiResponse(
      page,
      /\/api\/appointments/,
      {
        success: true,
        data: { appointments: [], pagination: { page: 1, total: 0 } }
      }
    );

    await login(page, 'nurse');
    await page.goto('/appointments');

    // Wait for initial data load
    await page.waitForResponse(/\/api\/appointments/);
  });

  test('should display the appointments page with correct title', async ({ page }) => {
    await expect(page.locator('text=Appointments')).toBeVisible();
    expect(page.url()).toContain('/appointments');

    // Verify page is fully loaded
    const appointmentsPage = page.locator('[data-cy=appointments-page], [data-testid=appointments-page]').first();
    await expect(appointmentsPage).toBeAttached({ timeout: 10000 });
  });

  test('should display calendar view by default', async ({ page }) => {
    const calendarView = page.locator('[data-cy=calendar-view], [data-testid=calendar-view]').first();
    await expect(calendarView).toBeVisible();
    await expect(calendarView).not.toHaveClass(/hidden/);
  });

  test('should display add appointment button with correct text', async ({ page }) => {
    const addButton = page.locator('[data-cy=add-appointment-button], [data-testid=add-appointment-button]').first();
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    await expect(addButton).toContainText('New Appointment');
    await expect(addButton).toHaveAttribute('aria-label');
  });

  test('should display view toggle buttons (Calendar/List)', async ({ page }) => {
    const calendarButton = page.locator('[data-cy=view-calendar-button], [data-testid=view-calendar-button]').first();
    await expect(calendarButton).toBeVisible();
    await expect(calendarButton).toBeEnabled();

    const listButton = page.locator('[data-cy=view-list-button], [data-testid=view-list-button]').first();
    await expect(listButton).toBeVisible();
    await expect(listButton).toBeEnabled();
  });

  test('should display date navigation controls with accessibility', async ({ page }) => {
    const prevButton = page.locator('[data-cy=prev-period-button], [data-testid=prev-period-button]').first();
    await expect(prevButton).toBeVisible();
    await expect(prevButton).toBeEnabled();
    await expect(prevButton).toHaveAttribute('aria-label');

    const nextButton = page.locator('[data-cy=next-period-button], [data-testid=next-period-button]').first();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
    await expect(nextButton).toHaveAttribute('aria-label');

    const todayButton = page.locator('[data-cy=today-button], [data-testid=today-button]').first();
    await expect(todayButton).toBeVisible();
    await expect(todayButton).toBeEnabled();
  });

  test('should display current date/period indicator', async ({ page }) => {
    const periodDisplay = page.locator('[data-cy=current-period-display], [data-testid=current-period-display]').first();
    await expect(periodDisplay).toBeVisible();

    const text = await periodDisplay.textContent();
    expect(text).toBeTruthy();
    expect(text?.trim()).not.toBe('');
  });

  test('should display appointment count indicator', async ({ page }) => {
    const countDisplay = page.locator('[data-cy=appointment-count], [data-testid=appointment-count]').first();
    await expect(countDisplay).toBeVisible();

    const text = await countDisplay.textContent();
    expect(text).toMatch(/\d+/); // Should contain a number
  });

  test('should display filter options', async ({ page }) => {
    const filterButton = page.locator('[data-cy=filter-button], [data-testid=filter-button]').first();
    await expect(filterButton).toBeVisible();
    await expect(filterButton).toBeEnabled();
  });

  test('should load without errors and display key UI elements', async ({ page }) => {
    // Verify no error messages are displayed
    const errorMessage = page.locator('[data-cy=error-message], [data-testid=error-message]');
    await expect(errorMessage).not.toBeAttached();

    // Verify page structure is intact
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('/appointments');

    // Verify critical elements are present
    const calendarView = page.locator('[data-cy=calendar-view], [data-testid=calendar-view]').first();
    await expect(calendarView).toBeAttached();
  });

  test('should display loading state initially when data loads slowly', async ({ page }) => {
    // Intercept with delay to test loading state
    await page.route(/\/api\/appointments/, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { appointments: [], pagination: { page: 1, total: 0 } }
        })
      });
    });

    await page.goto('/appointments');

    // Verify loading indicator appears
    const loadingSpinner = page.locator('[data-cy=loading-spinner], [data-testid=loading-spinner]').first();
    await expect(loadingSpinner).toBeVisible();

    // Wait for data to load
    await page.waitForResponse(/\/api\/appointments/);

    // Verify loading indicator disappears
    await expect(loadingSpinner).not.toBeAttached({ timeout: 5000 });

    // Verify calendar is displayed
    const calendarView = page.locator('[data-cy=calendar-view], [data-testid=calendar-view]').first();
    await expect(calendarView).toBeVisible();
  });
});
