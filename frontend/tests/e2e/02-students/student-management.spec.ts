import { test, expect } from '@playwright/test';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '1',
            email: 'nurse@school.edu',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'nurse',
          },
        }),
      });
    });

    // Mock students list
    await page.route('**/api/v1/students**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '2010-05-15',
                grade: '8',
                status: 'active',
                schoolId: 'school-1',
              },
              {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '2011-08-22',
                grade: '7',
                status: 'active',
                schoolId: 'school-1',
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 2,
              totalPages: 1,
            },
          },
        }),
      });
    });

    await page.goto('/students');
  });

  test('should display students list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /students/i })).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('should search students', async ({ page }) => {
    await page.route('**/api/v1/students?search=John**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '2010-05-15',
                grade: '8',
                status: 'active',
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
            },
          },
        }),
      });
    });

    const searchInput = page.getByPlaceholder(/search students/i);
    await searchInput.fill('John');

    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('should filter students by grade', async ({ page }) => {
    await page.route('**/api/v1/students?grade=8**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '2010-05-15',
                grade: '8',
                status: 'active',
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
            },
          },
        }),
      });
    });

    await page.getByLabel(/grade/i).selectOption('8');

    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('should create new student', async ({ page }) => {
    await page.getByRole('button', { name: /add student/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /new student/i })).toBeVisible();

    // Mock create student API
    await page.route('**/api/v1/students', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 'new-student-id',
              firstName: 'Alice',
              lastName: 'Johnson',
              dateOfBirth: '2012-03-10',
              grade: '6',
              status: 'active',
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Fill form
    await page.getByLabel(/first name/i).fill('Alice');
    await page.getByLabel(/last name/i).fill('Johnson');
    await page.getByLabel(/date of birth/i).fill('2012-03-10');
    await page.getByLabel(/grade/i).selectOption('6');

    await page.getByRole('button', { name: /save/i }).click();

    // Should close modal and show success message
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(/student created successfully/i)).toBeVisible();
  });

  test('should edit existing student', async ({ page }) => {
    await page.getByRole('button', { name: /edit john doe/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /edit student/i })).toBeVisible();

    // Mock update student API
    await page.route('**/api/v1/students/1', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '2010-05-15',
              grade: '9',
              status: 'active',
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Update grade
    await page.getByLabel(/grade/i).selectOption('9');
    await page.getByRole('button', { name: /save/i }).click();

    // Should close modal and show success message
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(/student updated successfully/i)).toBeVisible();
  });

  test('should delete student', async ({ page }) => {
    await page.getByRole('button', { name: /delete john doe/i }).click();

    // Confirm deletion
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();

    // Mock delete student API
    await page.route('**/api/v1/students/1', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: /confirm/i }).click();

    // Should close modal and show success message
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(/student deleted successfully/i)).toBeVisible();
  });

  test('should view student details', async ({ page }) => {
    // Mock student details API
    await page.route('**/api/v1/students/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '2010-05-15',
            grade: '8',
            status: 'active',
            emergencyContacts: [],
            healthRecords: [],
            medications: [],
          },
        }),
      });
    });

    await page.getByRole('link', { name: /view john doe/i }).click();

    await expect(page).toHaveURL('/students/1');
    await expect(page.getByRole('heading', { name: /john doe/i })).toBeVisible();
    await expect(page.getByText(/grade 8/i)).toBeVisible();
  });

  test('should paginate student list', async ({ page }) => {
    await page.route('**/api/v1/students?page=2**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            students: [
              {
                id: '3',
                firstName: 'Bob',
                lastName: 'Wilson',
                dateOfBirth: '2010-11-30',
                grade: '8',
                status: 'active',
              },
            ],
            pagination: {
              page: 2,
              limit: 10,
              total: 21,
              totalPages: 3,
            },
          },
        }),
      });
    });

    await page.getByRole('button', { name: /next page/i }).click();

    await expect(page.getByText('Bob Wilson')).toBeVisible();
  });

  test('should export student data', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');

    await page.getByRole('button', { name: /export/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/students.*\.csv/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/v1/students', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    await page.reload();

    await expect(page.getByRole('alert')).toContainText(/error loading students/i);
  });
});
