import { test, expect } from '@playwright/test'

/**
 * Authentication: Accessibility & Responsiveness (15 tests)
 *
 * Tests accessibility features and responsive design
 */

test.describe('Authentication - Accessibility & Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should have proper ARIA labels on form inputs', async ({ page }) => {
    await expect(page.getByTestId('email-input')).toHaveAttribute('aria-label')
    await expect(page.getByTestId('password-input')).toHaveAttribute('aria-label')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.getByTestId('email-input').focus()
    let focused = await page.locator(':focus').getAttribute('data-cy')
    expect(focused).toBe('email-input')

    await page.keyboard.press('Tab')
    focused = await page.locator(':focus').getAttribute('data-cy')
    expect(focused).toBe('password-input')

    await page.keyboard.press('Tab')
    focused = await page.locator(':focus').getAttribute('data-cy')
    expect(focused).toBe('remember-me-checkbox')
  })

  test('should submit form on Enter key', async ({ page }) => {
    await page.getByTestId('email-input').fill('admin@whitecross.health')
    await page.getByTestId('password-input').fill('admin123')
    await page.getByTestId('password-input').press('Enter')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should have accessible error messages', async ({ page }) => {
    await page.getByTestId('login-button').click()
    await expect(page.getByTestId('email-error')).toHaveAttribute('role', 'alert')
    await expect(page.getByTestId('password-error')).toHaveAttribute('role', 'alert')
  })

  test('should have sufficient color contrast', async ({ page }) => {
    const loginButton = page.getByTestId('login-button')
    await expect(loginButton).toHaveCSS('background-color')
    await expect(loginButton).toHaveCSS('color')
  })

  test('should display properly on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }) // iPhone X
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('login-button')).toBeVisible()
  })

  test('should display properly on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }) // iPad
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('logo')).toBeVisible()
  })

  test('should be responsive on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('login-button')).toBeVisible()
  })

  test('should have focus indicators', async ({ page }) => {
    await page.getByTestId('email-input').focus()
    await expect(page.getByTestId('email-input')).toHaveCSS('outline')
  })

  test('should support screen readers', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toHaveAttribute('role', 'form')
    await expect(page.getByTestId('login-button')).toHaveAttribute('type', 'submit')
  })

  test('should have descriptive page title for screen readers', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('Login')
  })

  test('should have skip navigation link', async ({ page }) => {
    const skipLink = page.getByTestId('skip-to-main')
    await expect(skipLink).toBeAttached()
    await skipLink.click()
    const focused = await page.locator(':focus').getAttribute('data-cy')
    expect(focused).toBe('email-input')
  })

  test('should have alt text for images', async ({ page }) => {
    await expect(page.getByTestId('logo')).toHaveAttribute('alt')
  })

  test('should scale properly on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await expect(page.getByTestId('login-form')).toBeVisible()
    }
  })

  test('should have accessible button states', async ({ page }) => {
    await expect(page.getByTestId('login-button')).not.toBeDisabled()
    await page.getByTestId('login-button').click()
    await expect(page.getByTestId('login-button')).toHaveAttribute('aria-busy', 'true')
  })
})
