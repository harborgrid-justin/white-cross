import { test, expect } from '@playwright/test'

/**
 * Administration Features: Page Load & Navigation (15 tests)
 *
 * Tests basic page load and navigation structure
 */

test.describe('Administration Features - Page Load & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin and navigate to settings
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
  })

  test('should load the settings page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/settings/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display the Administration Panel heading', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Administration Panel' })).toBeVisible()
  })

  test('should display the page description', async ({ page }) => {
    await expect(page.getByText('System configuration, multi-school management, and enterprise tools')).toBeVisible()
  })

  test('should have the Layout header visible', async ({ page }) => {
    await expect(page.locator('[class*="sticky top-0"]').first()).toBeVisible()
  })

  test('should display navigation sidebar', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('should maintain admin authentication', async ({ page }) => {
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.locator('[data-cy="user-menu"]')).toBeVisible()
  })

  test('should have accessible page structure', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/settings')
    expect(consoleErrors).toHaveLength(0)
  })

  test('should display the page header in Layout', async ({ page }) => {
    await expect(page.locator('.sticky.top-0').first()).toBeVisible()
  })

  test('should show user information in header', async ({ page }) => {
    await expect(page.locator('[data-cy="user-menu"]')).toBeVisible()
  })

  test('should have logout button visible', async ({ page }) => {
    await expect(page.locator('[data-cy="logout-button"]')).toBeVisible()
  })

  test('should display breadcrumb or page title in top bar', async ({ page }) => {
    const topBar = page.locator('.sticky.top-0').first()
    await expect(topBar.getByText(/settings|administration/i)).toBeVisible()
  })

  test('should have proper page title in document', async ({ page }) => {
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('should render main content area', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible()
  })

  test('should have responsive layout classes', async ({ page }) => {
    const element = page.locator('.lg\\:pl-64').first()
    await expect(element).toBeAttached()
  })
})
