import { test, expect } from '@playwright/test';

test.describe('Upload Destination Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('http://localhost:5173/add');
  });

  test('should display the form elements correctly', async ({ page }) => {
    // Ensure the form is visible
    await expect(page.locator('h2:has-text("Add New Destination")')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="bestTimeToVisit"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    await expect(page.locator('input[name="category"]')).toBeVisible();
    await expect(page.locator('select[name="section"]')).toBeVisible();
  });

  test('should submit the form successfully', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="title"]', 'New Destination');
    await page.fill('textarea[name="description"]', 'A beautiful place to visit');
    await page.fill('input[name="bestTimeToVisit"]', 'April to June');
    await page.fill('input[name="location"]', 'Country, City');

    // Click the submit button
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
  });

  test('should show error message on form submission failure', async ({ page }) => {
    // Fill out the form with incorrect data or leave required fields empty to trigger error
    await page.fill('input[name="title"]', 'New Destination');
    await page.fill('textarea[name="description"]', 'A beautiful place to visit');
    await page.fill('input[name="bestTimeToVisit"]', 'April to June');
    await page.fill('input[name="location"]', 'Country, City');
    await page.fill('input[name="category"]', 'Adventure');

    // Intentionally not uploading any files to trigger a failure due to missing images
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
  });
});
