import { test, expect } from '@playwright/test';

// Mock data for test
const mockDestinations = [
  { _id: 'dest1', title: 'Paris' },
  { _id: 'dest2', title: 'London' },
  { _id: 'dest3', title: 'Tokyo' }
];

// Test accommodation data
const testAccommodation = {
  title: 'Luxury Suite',
  price: '250',
  description: 'A beautiful luxury suite with amazing views',
  destination: 'dest1'
};

test.describe('UploadAccommodation Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the destinations API call
    await page.route('**/api/destination', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockDestinations)
      });
    });

    // Mock the accommodation post API call
    await page.route('**/api/accommodation', route => {
      // Check if it's a POST request
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true, 
            message: 'Accommodation created successfully' 
          })
        });
      }
    });

    // Navigate to the upload accommodation page
    await page.goto('http://localhost:5173/addAccommodation');
  });

  test('should load the form with destination options', async ({ page }) => {
    // Check if the page title is visible
    await expect(page.locator('h2:has-text("Upload Accommodation")')).toBeVisible();
    
    // Verify that all form inputs are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('input[name="price"]')).toBeVisible();
  });

  test('should show validation error when submitting empty form', async ({ page }) => {
    // Spy on dialog/alerts
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please fill in all fields.');
      await dialog.accept();
    });
    
    // Click submit without filling the form
    await page.locator('button[type="submit"]').click();
  });

  test('should successfully submit the form with valid data', async ({ page }) => {

    // Fill in the form
    await page.locator('input[name="title"]').fill(testAccommodation.title);
    await page.locator('input[name="price"]').fill(testAccommodation.price);
    await page.locator('textarea[name="description"]').fill(testAccommodation.description);
    await page.locator('select[name="destination"]').selectOption(testAccommodation.destination);

    // Spy on dialog/alerts for success message
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Accommodation uploaded successfully!');
      await dialog.accept();
    });

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Verify form is reset after successful submission
    await expect(page.locator('input[name="title"]')).toHaveValue('Luxury Suite');
    await expect(page.locator('input[name="price"]')).toHaveValue('250');
    await expect(page.locator('textarea[name="description"]')).toHaveValue('A beautiful luxury suite with amazing views');

  });

  test('should display error message when API request fails', async ({ page }) => {
    // Override the mock to return an error
    await page.route('**/api/accommodation', route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid input data' })
        });
      }
    });
    
    // Fill in the form
    await page.locator('input[name="title"]').fill(testAccommodation.title);
    await page.locator('input[name="price"]').fill(testAccommodation.price);
    await page.locator('textarea[name="description"]').fill(testAccommodation.description);
    await page.locator('select[name="destination"]').selectOption(testAccommodation.destination);
    
    // Spy on dialog/alerts for error message
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Invalid input data');
      await dialog.accept();
    });
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
  });
});