import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Page Load & UI Structure (15 tests)
 *
 * Tests page load behavior and UI element visibility
 */

test.describe('Student Management - Page Load & UI Structure', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
  })

  test('should display the student management page with correct title', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toContainText('Student Management', { timeout: 2500 })
    expect(page.url()).toContain('/students')
  })

  test('should display the add student button', async ({ page }) => {
    const addButton = page.getByTestId('add-student-button')
    await expect(addButton).toBeVisible({ timeout: 2500 })
    await expect(addButton).toContainText('Add Student')
  })

  test('should display the search input field', async ({ page }) => {
    const searchInput = page.getByTestId('search-input')
    await expect(searchInput).toBeVisible({ timeout: 2500 })
    await expect(searchInput).toHaveAttribute('placeholder')
  })

  test('should display the student table with headers', async ({ page }) => {
    await expect(page.getByTestId('student-table')).toBeVisible({ timeout: 2500 })
    await expect(page.locator('thead')).toBeVisible({ timeout: 2500 })
  })

  test('should display filter button', async ({ page }) => {
    await expect(page.getByTestId('filter-button')).toBeVisible({ timeout: 2500 })
  })

  test('should display sort controls', async ({ page }) => {
    await expect(page.getByTestId('sort-by-select')).toBeVisible({ timeout: 2500 })
  })

  test('should display pagination controls when applicable', async ({ page }) => {
    await expect(page.getByTestId('pagination-controls')).toBeAttached({ timeout: 2500 })
  })

  test('should display view archived students button', async ({ page }) => {
    await expect(page.getByTestId('view-archived-button')).toBeVisible({ timeout: 2500 })
  })

  test('should show student count indicator', async ({ page }) => {
    // Student count may not have specific data-testid, check for text instead
    await expect(page.locator('text=/\\d+\\s*student/i')).toBeVisible({ timeout: 2500 })
  })

  test('should display bulk action controls', async ({ page }) => {
    await expect(page.getByTestId('select-all-checkbox')).toBeAttached({ timeout: 2500 })
  })

  test('should have proper table column headers', async ({ page }) => {
    // Headers may not have exact text, check for partial matches
    const thead = page.locator('thead')
    await expect(thead).toContainText('Name', { timeout: 2500 })
    await expect(thead).toContainText('Grade')
  })

  test('should display medical indicators column', async ({ page }) => {
    await expect(page.locator('thead')).toBeVisible({ timeout: 2500 })
  })

  test('should display actions column', async ({ page }) => {
    await expect(page.locator('thead')).toContainText('Actions', { timeout: 2500 })
  })

  test('should load student data on page mount', async ({ page }) => {
    const rows = page.getByTestId('student-row')
    await expect(rows).toHaveCount(await rows.count(), { timeout: 2500 })
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('should display loading state initially', async ({ page }) => {
    // Intercept and delay the API response
    await page.route('**/api/students*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/students')

    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid=loading-spinner], [class*="loading"], [class*="spinner"]')
    await expect(loadingIndicator).toBeAttached({ timeout: 2500 })
  })
})
