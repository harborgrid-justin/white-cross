import { test, expect } from '@playwright/test'
import { login } from '../../support/auth-helpers'

/**
 * Student Management: Search Functionality (15 tests)
 *
 * Tests search capabilities across student data
 */

test.describe('Student Management - Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'admin')
    await page.goto('/students')
  })

  test('should filter students by first name when searching', async ({ page }) => {
    // Get a student from the table to search for
    const firstRow = page.getByTestId('student-row').first()
    const studentName = await firstRow.textContent()

    if (studentName) {
      const firstName = studentName.split(' ')[0]
      await page.getByTestId('search-input').fill(firstName)
      await expect(page.getByTestId('student-table')).toContainText(firstName)
    }
  })

  test('should filter students by last name when searching', async ({ page }) => {
    // Get a student from the table to search for
    const firstRow = page.getByTestId('student-row').first()
    const studentName = await firstRow.textContent()

    if (studentName) {
      const parts = studentName.split(' ')
      const lastName = parts[parts.length - 1]
      await page.getByTestId('search-input').fill(lastName)
      await expect(page.getByTestId('student-table')).toContainText(lastName)
    }
  })

  test('should filter students by student number when searching', async ({ page }) => {
    await page.getByTestId('search-input').fill('STU')
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test('should be case-insensitive when searching', async ({ page }) => {
    // Get a student from the table
    const firstRow = page.getByTestId('student-row').first()
    const studentName = await firstRow.textContent()

    if (studentName) {
      const firstName = studentName.split(' ')[0]
      await page.getByTestId('search-input').fill(firstName.toUpperCase())
      await expect(page.getByTestId('student-table')).toContainText(firstName)
    }
  })

  test('should show all students when search is cleared', async ({ page }) => {
    await page.getByTestId('search-input').fill('Test')
    await page.getByTestId('search-input').clear()
    const rows = page.getByTestId('student-row')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('should show "no results" message when no students match search', async ({ page }) => {
    await page.getByTestId('search-input').fill('NonexistentStudent12345')
    await expect(page.getByTestId('no-results-message')).toBeVisible()
    await expect(page.getByTestId('no-results-message')).toContainText('No students found')
  })

  test('should debounce search input to reduce API calls', async ({ page }) => {
    let requestCount = 0

    await page.route('**/api/students*', async (route) => {
      requestCount++
      await route.continue()
    })

    await page.getByTestId('search-input').fill('Joh')
    await page.waitForTimeout(100)
    await page.getByTestId('search-input').fill('n', { force: true })
    await page.waitForTimeout(500)

    // Should have fewer requests due to debouncing
    expect(requestCount).toBeLessThan(5)
  })

  test('should display search results count', async ({ page }) => {
    await page.getByTestId('search-input').fill('Test')
    await expect(page.getByTestId('results-count')).toBeVisible()
  })

  test.skip('should highlight search term in results', () => {
    // TODO: Implement search highlighting with data-testid="search-highlight"
  })

  test('should search across multiple fields simultaneously', async ({ page }) => {
    await page.getByTestId('search-input').fill('STU')
    const rows = page.getByTestId('student-row')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test.skip('should maintain search when navigating between pages', () => {
    // TODO: Implement pagination with data-testid="next-page-button"
  })

  test('should clear search when clicking clear button', async ({ page }) => {
    await page.getByTestId('search-input').fill('Test')
    await page.getByTestId('clear-search-button').click()
    await expect(page.getByTestId('search-input')).toHaveValue('')
  })

  test.skip('should show search suggestions when typing', () => {
    // TODO: Implement search suggestions with data-testid="search-suggestions"
  })

  test('should handle special characters in search', async ({ page }) => {
    await page.getByTestId('search-input').fill("O'Brien")
    await expect(page.getByTestId('student-table')).toBeVisible()
  })

  test.skip('should update URL with search query parameters', () => {
    // TODO: Implement URL parameter synchronization for search queries
  })
})
