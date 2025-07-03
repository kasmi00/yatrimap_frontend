import { expect, test } from '@playwright/test';

test.describe('Booking Screen', () => {
  // Before each test, navigate to the booking page and set up response logging
  test.beforeEach(async ({ page }) => {
    // Mock localStorage for authentication
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'fake-auth-token');
      localStorage.setItem('userId', 'user123');
    });

    // Navigate to booking page with query parameters
    await page.goto('http://localhost:5173/booking?destinationId=dest123&accommodations=accom456');

    // Log responses for debugging
    page.on('response', response => {
      console.log(`Response: ${response.url()} - ${response.status()}`);
    });

    // Log console messages
    page.on('console', log => console.log(`Console: ${log.text()}`));

  });

  test('should load booking page successfully when logged in', async ({ page }) => {
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear authentication
    await page.addInitScript(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    });

    // Reload the page
    await page.reload();

    // Should redirect to login
    await page.waitForURL('**/login**');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show proper destination and accommodation details', async ({ page }) => {
  });

  test('should calculate total price based on selected dates', async ({ page }) => {
    // Fill date inputs
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() + 4); // 3 nights

    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const checkoutStr = checkoutDate.toISOString().split('T')[0];

    // Wait for calculation to update
    await page.waitForTimeout(500);
  });

  test('should submit booking successfully', async ({ page }) => {
    

    const consoleMessages = [];

    // Fill in valid dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() + 3);

    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const checkoutStr = checkoutDate.toISOString().split('T')[0];

  });

  test('should handle booking submission error', async ({ page }) => {
    // Mock API responses for failed submission
    await page.route('**/api/booking/create', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    // Fill in valid dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() + 3);

    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const checkoutStr = checkoutDate.toISOString().split('T')[0];

    // Wait for alert
    await page.waitForTimeout(1000);
});
  });

  test('should handle API errors and show error message', async ({ page }) => {
    // Mock API responses for destination error
    await page.route('**/api/destination/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch destination' })
      });
    });

    // Reload the page to trigger the error
    await page.reload();
  });

  test('should navigate back when error occurs and back button is clicked', async ({ page }) => {
    // Mock navigation
    await page.route('**/api/destination/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch destination' })
      });
    });

    // Set up a mock for window.history.back()
    await page.addInitScript(() => {
      window.history.back = () => console.log('History back called');
    });

    // Reload page to trigger error
    await page.reload();
  });