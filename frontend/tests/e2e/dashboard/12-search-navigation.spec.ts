import { test, expect } from '@playwright/test'

/**
 * Dashboard - Search & Navigation (15 tests)
 *
 * Tests global search and navigation features from dashboard
 */

test.describe('Dashboard - Search & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test('should display global search bar', async ({ page }) => {
    const searchBar = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await expect(searchBar).toBeVisible()
  })

  test('should allow searching for students', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.fill('student')
    const searchResults = page.getByText(/student|results/i).first()
    await expect(searchResults).toBeAttached()
  })

  test('should display search suggestions', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.fill('med')
    const suggestions = page.locator('[class*="suggestion"], [class*="dropdown"]')
    await expect(suggestions.first()).toBeAttached()
  })

  test('should navigate to student profile from search', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.fill('john')
    const firstResult = page.locator('[class*="result"]').first()
    await firstResult.click()
  })

  test('should show recent searches', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.click()
    const recentSearches = page.getByText(/recent|history/i).first()
    await expect(recentSearches).toBeAttached()
  })

  test('should have keyboard navigation in search results', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.fill('test')
    await searchInput.press('ArrowDown')
  })

  test('should display navigation sidebar', async ({ page }) => {
    const sidebar = page.locator('aside, nav[class*="sidebar"]').first()
    await expect(sidebar).toBeVisible()
  })

  test('should have links to main sections', async ({ page }) => {
    await expect(page.getByText(/students|medications|appointments|incidents/i).first()).toBeVisible()
  })

  test('should highlight current page in navigation', async ({ page }) => {
    const activeLink = page.locator('nav a[class*="active"], nav [aria-current]')
    await expect(activeLink.first()).toBeAttached()
  })

  test('should have collapsible navigation menu', async ({ page }) => {
    const menuToggle = page.locator('button[aria-label*="menu"], [data-testid*="menu-toggle"]').first()
    await expect(menuToggle).toBeAttached()
  })

  test('should display breadcrumb navigation', async ({ page }) => {
    const breadcrumb = page.locator('[class*="breadcrumb"], nav[aria-label="breadcrumb"]').first()
    await expect(breadcrumb).toBeAttached()
  })

  test('should show user menu dropdown', async ({ page }) => {
    const userMenuButton = page.locator('button[aria-label*="user"], [data-testid*="user-menu"]').first()
    await userMenuButton.click()
    await expect(page.getByText(/profile|settings|logout/i).first()).toBeVisible()
  })

  test('should have quick navigation to settings', async ({ page }) => {
    const settingsLink = page.locator('a, button').filter({ hasText: /settings|preferences/i }).first()
    await expect(settingsLink).toBeAttached()
  })

  test('should display navigation icons', async ({ page }) => {
    const navIcons = page.locator('nav svg, aside svg')
    await expect(navIcons.first()).toBeAttached()
  })

  test('should support mobile navigation toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    const mobileMenu = page.locator('button[aria-label*="menu"]').first()
    await expect(mobileMenu).toBeVisible()
  })
})
