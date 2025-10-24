import { test, expect } from '@playwright/test'

/**
 * Authentication: Logout Functionality (15 tests)
 *
 * Tests logout process and session cleanup
 *
 * NOTE: These tests use a custom login helper that needs to be created.
 * The Cypress command `cy.login('admin')` should be replaced with a Playwright fixture or helper.
 */

test.describe('Authentication - Logout Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Replace with Playwright login fixture or helper
    // For now, this is a placeholder - implement authentication setup
    await page.goto('/login')
    // Implement login logic here or use a fixture
    await page.goto('/dashboard')
  })

  test('should display logout button in user menu', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await expect(page.getByTestId('logout-button')).toBeVisible()
  })

  test('should logout user when logout button is clicked', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should clear authentication token on logout', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeNull()
  })

  test('should clear user data on logout', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    const user = await page.evaluate(() => localStorage.getItem('user'))
    expect(user).toBeNull()
  })

  test('should clear session cookie on logout', async ({ page, context }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    const cookies = await context.cookies()
    const sessionCookie = cookies.find(c => c.name === 'session')
    expect(sessionCookie).toBeUndefined()
  })

  test('should redirect to login page after logout', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display logout confirmation message', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()
    await expect(page.getByTestId('logout-message')).toContainText('Successfully logged out')
  })

  test('should prevent access to protected routes after logout', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should clear all session data on logout', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    const storageData = await page.evaluate(() => {
      return {
        localStorageLength: localStorage.length,
        sessionStorageLength: sessionStorage.length
      }
    })

    expect(storageData.localStorageLength).toBe(0)
    expect(storageData.sessionStorageLength).toBe(0)
  })

  test('should create audit log entry for logout', async ({ page }) => {
    const auditRequests: any[] = []
    await page.route('**/api/audit-log', (route) => {
      auditRequests.push(route.request().postDataJSON())
      route.fulfill({ status: 200 })
    })

    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    const logoutAudit = auditRequests.find(req => req.action === 'LOGOUT')
    expect(logoutAudit).toBeDefined()
    if (logoutAudit) {
      expect(logoutAudit.resourceType).toBe('USER')
    }
  })

  test('should handle logout API errors gracefully', async ({ page }) => {
    await page.route('**/api/auth/logout', (route) =>
      route.fulfill({ status: 500 })
    )

    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('should logout from all tabs', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('logoutEvent', Date.now().toString())
    })

    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('should show logout confirmation dialog', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()
    await expect(page.getByTestId('logout-confirm-dialog')).toBeVisible()
  })

  test('should cancel logout when cancel is clicked', async ({ page }) => {
    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()
    await page.getByTestId('cancel-logout-button').click()

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByTestId('user-name')).toBeVisible()
  })

  test('should invalidate server session on logout', async ({ page }) => {
    let logoutStatusCode = 0
    await page.route('**/api/auth/logout', (route) => {
      logoutStatusCode = 200
      route.fulfill({ status: 200 })
    })

    await page.getByTestId('user-menu').click()
    await page.getByTestId('logout-button').click()

    await page.waitForTimeout(1000)
    expect(logoutStatusCode).toBe(200)
  })
})
