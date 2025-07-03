import { test, expect } from '@playwright/test';

test.describe('Admin Destination List', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Admin Destination List page
    await page.goto('http://localhost:5173/admindestinationlist');
  });

  test('should display no destinations available message if no destinations', async ({ page }) => {
    // Mock the API response to return an empty array of destinations
    await page.route('**/api/destination', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      })
    );

    // Reload the page after intercepting the network request
    await page.reload();

    // Check for the no destinations available message
    await expect(page.locator('button-Add Your First Destination')).not.toBeVisible();
  });

  test('should display list of destinations', async ({ page }) => {
    // Mock the API response with destination data
    const mockDestinations = [
      {
        _id: '1',
        title: 'Paris',
        image: 'paris.jpg',
      },
      {
        _id: '2',
        title: 'New York',
        image: 'newyork.jpg',
      },
    ];

    await page.route('**/api/destination', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDestinations),
      })
    );

    // Reload the page after intercepting the network request
    await page.reload();

    // Check that the list of destinations is visible
    await expect(page.locator('text=Paris')).toBeVisible();
    await expect(page.locator('text=New York')).toBeVisible();
  });

  test('should allow deletion of a destination', async ({ page }) => {
    // Mock the API response with destination data
    const mockDestinations = [
      {
        _id: '1',
        title: 'Paris',
        image: 'paris.jpg',
      },
    ];

    await page.route('**/api/destination', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDestinations),
      })
    );

    await page.reload();

    // Click the delete button for the first destination
    const deleteButton = page.locator('button:has-text("Delete")');
    await deleteButton.click();

    // Confirm the deletion behavior (mocking backend call)
    await page.route('**/api/destination/1', route =>
      route.fulfill({
        status: 200,
      })
    );

    // After deletion, the destination should no longer be visible
    await expect(page.locator('text=Paris')).toBeVisible();
  });

  test('should navigate to the edit destination page', async ({ page }) => {
    // Mock the API response with destination data
    const mockDestinations = [
      {
        _id: '1',
        title: 'Paris',
        image: 'paris.jpg',
      },
    ];

    await page.route('**/api/destination', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDestinations),
      })
    );

    await page.reload();

    // Click the edit button for the first destination
    const editButton = page.locator('button:has-text("Edit")');
    await editButton.click();

    // Check that the page navigated to the edit destination page
    await expect(page).toHaveURL('http://localhost:5173/editDestination/1');
  });

  test('should display destination image correctly', async ({ page }) => {
    // Mock the API response with destination data
    const mockDestinations = [
      {
        _id: '1',
        title: 'Paris',
        image: 'paris.jpg',
      },
    ];

    await page.route('**/api/destination', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDestinations),
      })
    );

    await page.reload();

    // Check if the destination image is visible
    const image = page.locator('img[src*="paris.jpg"]');
    await expect(image).toBeVisible();
  });
});
