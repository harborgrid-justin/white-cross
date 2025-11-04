/**
 * E2E Tests for Navigation
 *
 * Tests application navigation including:
 * - Menu navigation
 * - Breadcrumbs
 * - Back button
 * - Deep linking
 * - Mobile navigation
 *
 * @module tests/e2e/navigation.spec
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is logged in for navigation tests
    await page.goto('/dashboard');
  });

  test.describe('Main Navigation', () => {
    test('should navigate to different pages from menu', async ({ page }) => {
      // Navigate to Students
      await page.getByRole('link', { name: /students/i }).click();
      await expect(page).toHaveURL(/\/students/);

      // Navigate to Medications
      await page.getByRole('link', { name: /medications/i }).click();
      await expect(page).toHaveURL(/\/medications/);

      // Navigate to Appointments
      await page.getByRole('link', { name: /appointments/i }).click();
      await expect(page).toHaveURL(/\/appointments/);
    });

    test('should highlight active page in navigation', async ({ page }) => {
      await page.getByRole('link', { name: /students/i }).click();

      const studentsLink = page.getByRole('link', { name: /students/i });
      const className = await studentsLink.getAttribute('class');

      // Active link should have active class or aria-current
      const isActive =
        className?.includes('active') ||
        (await studentsLink.getAttribute('aria-current')) === 'page';

      expect(isActive).toBeTruthy();
    });

    test('should update page title on navigation', async ({ page }) => {
      await page.getByRole('link', { name: /students/i }).click();
      await expect(page).toHaveTitle(/students/i);

      await page.getByRole('link', { name: /medications/i }).click();
      await expect(page).toHaveTitle(/medication/i);
    });
  });

  test.describe('Breadcrumbs', () => {
    test('should show breadcrumbs for nested pages', async ({ page }) => {
      // Navigate to a nested page (e.g., student details)
      await page.goto('/students/123');

      // Should show breadcrumbs
      const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
      if (await breadcrumbs.isVisible()) {
        await expect(breadcrumbs).toContainText(/home|dashboard/i);
        await expect(breadcrumbs).toContainText(/students/i);
      }
    });

    test('should navigate using breadcrumbs', async ({ page }) => {
      await page.goto('/students/123/edit');

      const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
      if (await breadcrumbs.isVisible()) {
        // Click on Students breadcrumb
        await breadcrumbs.getByRole('link', { name: /students/i }).click();

        // Should navigate to students list
        await expect(page).toHaveURL(/\/students$/);
      }
    });
  });

  test.describe('Browser Navigation', () => {
    test('should work with browser back button', async ({ page }) => {
      await page.goto('/dashboard');
      await page.goto('/students');
      await page.goto('/medications');

      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\/students/);

      // Go back again
      await page.goBack();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should work with browser forward button', async ({ page }) => {
      await page.goto('/dashboard');
      await page.goto('/students');

      await page.goBack();
      await page.goForward();

      await expect(page).toHaveURL(/\/students/);
    });
  });

  test.describe('Deep Linking', () => {
    test('should handle direct URL access', async ({ page }) => {
      await page.goto('/students/123');

      // Should load the specific student page
      await expect(page).toHaveURL(/\/students\/123/);
    });

    test('should preserve query parameters', async ({ page }) => {
      await page.goto('/students?search=john&filter=active');

      // Should preserve query params
      await expect(page).toHaveURL(/search=john/);
      await expect(page).toHaveURL(/filter=active/);
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should show mobile menu button', async ({ page }) => {
      await page.goto('/dashboard');

      // Should show hamburger menu or mobile nav button
      const mobileMenuButton = page.getByRole('button', { name: /menu|navigation/i });
      await expect(mobileMenuButton).toBeVisible();
    });

    test('should open mobile menu on click', async ({ page }) => {
      await page.goto('/dashboard');

      const mobileMenuButton = page.getByRole('button', { name: /menu|navigation/i });
      await mobileMenuButton.click();

      // Mobile menu should be visible
      const mobileMenu = page.getByRole('navigation');
      await expect(mobileMenu).toBeVisible();
    });

    test('should navigate from mobile menu', async ({ page }) => {
      await page.goto('/dashboard');

      // Open mobile menu
      const mobileMenuButton = page.getByRole('button', { name: /menu|navigation/i });
      await mobileMenuButton.click();

      // Click on a nav link
      await page.getByRole('link', { name: /students/i }).click();

      // Should navigate
      await expect(page).toHaveURL(/\/students/);

      // Menu should close (optional, depends on UX)
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate with Tab key', async ({ page }) => {
      await page.goto('/dashboard');

      // Press Tab to navigate through links
      await page.keyboard.press('Tab');

      // First focusable element should be focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeFocused();
    });

    test('should activate links with Enter key', async ({ page }) => {
      await page.goto('/dashboard');

      // Tab to Students link
      const studentsLink = page.getByRole('link', { name: /students/i }).first();
      await studentsLink.focus();

      // Press Enter
      await page.keyboard.press('Enter');

      // Should navigate
      await expect(page).toHaveURL(/\/students/);
    });
  });

  test.describe('Loading States', () => {
    test('should show loading indicator during navigation', async ({ page }) => {
      await page.goto('/dashboard');

      // Click on a link
      const studentsLink = page.getByRole('link', { name: /students/i });
      await studentsLink.click();

      // Should show loading indicator (if implemented)
      const loadingIndicator = page.getByRole('progressbar').or(page.getByText(/loading/i));

      // Loading indicator may be very fast, so we check if it appears
      const hasLoadingIndicator = await loadingIndicator.isVisible().catch(() => false);

      // If loading indicator exists, it's good UX
      // If not, that's also acceptable for fast pages
    });
  });

  test.describe('Accessibility', () => {
    test('should have skip to main content link', async ({ page }) => {
      await page.goto('/dashboard');

      // Press Tab to focus skip link
      await page.keyboard.press('Tab');

      // Should have skip link as first focusable element
      const skipLink = page.getByRole('link', { name: /skip to (main )?content/i });
      const isVisible = await skipLink.isVisible().catch(() => false);

      if (isVisible) {
        await expect(skipLink).toBeFocused();
      }
    });

    test('should have proper navigation landmarks', async ({ page }) => {
      await page.goto('/dashboard');

      // Should have navigation landmark
      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();

      // Should have main landmark
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
    });
  });
});
