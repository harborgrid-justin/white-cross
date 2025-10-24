import { test, expect } from '@playwright/test'

/**
 * Debug Login Test
 * Simple test to debug login issues
 */

test.describe('Debug - Login Test', () => {
  test('should attempt login and show what happens', async ({ page }) => {
    await page.goto('/login')

    // Fill in credentials
    await page.getByTestId('email-input').fill('admin@school.edu')
    await page.getByTestId('password-input').fill('AdminPassword123!')

    // Intercept the login request
    let loginRequest: any = null
    let loginResponse: any = null

    await page.route('**/api/auth/login', async (route) => {
      loginRequest = {
        body: route.request().postDataJSON(),
        url: route.request().url()
      }

      const response = await route.fetch()
      const responseBody = await response.text()

      loginResponse = {
        status: response.status(),
        body: responseBody
      }

      await route.fulfill({ response })
    })

    // Click login button
    await page.getByTestId('login-button').click()

    // Wait a moment for request to complete
    await page.waitForTimeout(1000)

    // Log request details
    if (loginRequest) {
      console.log('Login Request:', JSON.stringify(loginRequest.body))
    }

    if (loginResponse) {
      console.log('Login Response:', loginResponse.body)
      console.log('Status Code:', loginResponse.status.toString())
    }

    // Check if there's an error message on page
    const errorMessage = page.getByTestId('error-message')
    const errorCount = await errorMessage.count()

    if (errorCount > 0) {
      const errorText = await errorMessage.textContent()
      console.log('Error Message:', errorText)
    }

    // Check current URL
    const currentUrl = page.url()
    console.log('Current URL:', currentUrl)

    // Check localStorage
    const storageData = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      }
    })

    console.log('Token in localStorage:', storageData.token ? 'EXISTS' : 'NULL')
    console.log('User in localStorage:', storageData.user ? 'EXISTS' : 'NULL')
  })
})
