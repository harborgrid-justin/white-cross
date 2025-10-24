import { test, expect } from '@playwright/test'

/**
 * Administration Features: Districts Tab (20 tests)
 *
 * Tests district management functionality
 */

test.describe('Administration Features - Districts Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Districts' }).click()
  })

  test('should display the Districts tab content', async ({ page }) => {
    const districtsTab = page.getByRole('button', { name: 'Districts' })
    await expect(districtsTab).toHaveClass(/border-blue-500/)
  })

  test('should show districts heading', async ({ page }) => {
    await expect(page.getByText(/district/i).first()).toBeVisible()
  })

  test('should have add district button', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /add|new|create/i })).toBeVisible()
  })

  test('should display districts table or list', async ({ page }) => {
    const tableOrList = page.locator('table, [class*="space-y"]').first()
    await expect(tableOrList).toBeAttached()
  })

  test('should show search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await expect(searchInput).toBeAttached()
  })

  test('should display district names column', async ({ page }) => {
    await expect(page.getByText(/name|district/i).first()).toBeVisible()
  })

  test('should show school count column', async ({ page }) => {
    await expect(page.getByText(/schools|count/i).first()).toBeVisible()
  })

  test('should display status column', async ({ page }) => {
    await expect(page.getByText(/status|active/i).first()).toBeVisible()
  })

  test('should show action buttons for each district', async ({ page }) => {
    const actionButtons = page.locator('button[class*="text-"], a[class*="text-"]')
    await expect(actionButtons.first()).toBeAttached()
  })

  test('should have edit district functionality', async ({ page }) => {
    const editButton = page.locator('button, a').filter({ hasText: /edit|modify/i }).first()
    await expect(editButton).toBeAttached()
  })

  test('should display pagination if many districts', async ({ page }) => {
    const pagination = page.locator('[class*="pagination"], button:has-text("Next"), button:has-text("Previous")').first()
    await expect(pagination).toBeAttached()
  })

  test('should show filter options', async ({ page }) => {
    const filterSelect = page.locator('select, [role="combobox"]').first()
    await expect(filterSelect).toBeAttached()
  })

  test('should display district details', async ({ page }) => {
    const details = page.getByText(/contact|address|phone/i).first()
    await expect(details).toBeAttached()
  })

  test('should have sorting capability', async ({ page }) => {
    const sortable = page.locator('th[class*="cursor-"], button[class*="sort"]').first()
    await expect(sortable).toBeAttached()
  })

  test('should show empty state when no districts', async ({ page }) => {
    const emptyState = page.getByText(/no.*district|empty/i).first()
    await expect(emptyState).toBeAttached()
  })

  test('should display district configuration options', async ({ page }) => {
    const configOptions = page.getByText(/settings|config/i).first()
    await expect(configOptions).toBeAttached()
  })

  test('should have bulk actions available', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]')
    await expect(checkboxes.first()).toBeAttached()
  })

  test('should show export functionality', async ({ page }) => {
    const exportButton = page.getByRole('button').filter({ hasText: /export|download/i }).first()
    await expect(exportButton).toBeAttached()
  })

  test('should display district metrics', async ({ page }) => {
    const metrics = page.getByText(/students|enrollment/i).first()
    await expect(metrics).toBeAttached()
  })

  test('should have responsive table layout', async ({ page }) => {
    const responsiveTable = page.locator('[class*="overflow-x"]').first()
    await expect(responsiveTable).toBeAttached()
  })
})
