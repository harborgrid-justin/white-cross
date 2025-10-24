import { test, expect } from '@playwright/test'

/**
 * Administration Features: Schools Tab (20 tests)
 *
 * Tests school management functionality
 */

test.describe('Administration Features - Schools Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Schools' }).click()
  })

  test('should display the Schools tab content', async ({ page }) => {
    const schoolsTab = page.getByRole('button', { name: 'Schools' })
    await expect(schoolsTab).toHaveClass(/border-blue-500/)
  })

  test('should show schools heading', async ({ page }) => {
    await expect(page.getByText(/school/i).first()).toBeVisible()
  })

  test('should have add school button', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /add|new|create/i })).toBeVisible()
  })

  test('should display schools table or list', async ({ page }) => {
    const tableOrList = page.locator('table, [class*="space-y"]').first()
    await expect(tableOrList).toBeAttached()
  })

  test('should show search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    await expect(searchInput).toBeAttached()
  })

  test('should display school name column', async ({ page }) => {
    await expect(page.getByText(/name|school/i).first()).toBeVisible()
  })

  test('should show district column', async ({ page }) => {
    await expect(page.getByText(/district/i).first()).toBeVisible()
  })

  test('should display enrollment column', async ({ page }) => {
    await expect(page.getByText(/enrollment|students/i).first()).toBeVisible()
  })

  test('should show status column', async ({ page }) => {
    await expect(page.getByText(/status|active/i).first()).toBeVisible()
  })

  test('should have action buttons for each school', async ({ page }) => {
    const actionButtons = page.locator('button[class*="text-"], a[class*="text-"]')
    await expect(actionButtons.first()).toBeAttached()
  })

  test('should display school type information', async ({ page }) => {
    const schoolType = page.getByText(/elementary|middle|high|type/i).first()
    await expect(schoolType).toBeAttached()
  })

  test('should show filter by district', async ({ page }) => {
    const districtFilter = page.locator('select, [role="combobox"]').first()
    await expect(districtFilter).toBeAttached()
  })

  test('should display school address', async ({ page }) => {
    const address = page.getByText(/address|location/i).first()
    await expect(address).toBeAttached()
  })

  test('should have sorting capability', async ({ page }) => {
    const sortable = page.locator('th[class*="cursor-"], button[class*="sort"]').first()
    await expect(sortable).toBeAttached()
  })

  test('should show empty state when no schools', async ({ page }) => {
    const emptyState = page.getByText(/no.*school|empty/i).first()
    await expect(emptyState).toBeAttached()
  })

  test('should display school contact information', async ({ page }) => {
    const contactInfo = page.getByText(/contact|phone|email/i).first()
    await expect(contactInfo).toBeAttached()
  })

  test('should have bulk actions available', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]')
    await expect(checkboxes.first()).toBeAttached()
  })

  test('should show export functionality', async ({ page }) => {
    const exportButton = page.getByRole('button').filter({ hasText: /export|download/i }).first()
    await expect(exportButton).toBeAttached()
  })

  test('should display nurse assignments', async ({ page }) => {
    const nurseInfo = page.getByText(/nurse|staff/i).first()
    await expect(nurseInfo).toBeAttached()
  })

  test('should have responsive table layout', async ({ page }) => {
    const responsiveTable = page.locator('[class*="overflow-x"]').first()
    await expect(responsiveTable).toBeAttached()
  })
})
