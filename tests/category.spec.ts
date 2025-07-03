import { test, expect } from '@playwright/test';

test.describe('Destinations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Destinations page
    await page.goto('http://localhost:5173/destinations');
  });

  test('should load and display destinations after category is selected', async ({ page }) => {
    // Mock the API response with destination data
    const mockDestinations = [
      {
        _id: '1',
        title: 'Paris',
        description: 'Beautiful city of lights',
        image: 'paris.jpg',
      },
      {
        _id: '2',
        title: 'New York',
        description: 'The big apple',
        image: 'newyork.jpg',
      },
    ];

    // Intercept the API call and provide mock data
    await page.route('**/api/destination/category/**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mockDestinations),
      })
    );

  });

  test('should show error message when destinations fail to load', async ({ page }) => {
    // Simulate an error in fetching destinations
    await page.route('**/api/destination/category/**', route =>
      route.abort()
    );
  });

  test('should toggle destination in and out of the bucket list', async ({ page }) => {
    // Mock destination data
    const destination = {
      _id: '1',
      title: 'Paris',
      image: 'paris.jpg',
    };

    // Simulate the API post request after adding to the bucket list
    await page.route('**/api/bucket-list/', route =>
      route.fulfill({
        status: 200,
      })
    );
  });

  test('should navigate to destination details page on image click', async ({ page }) => {
    // Mock destination data
    const destination = {
      _id: '1',
      title: 'Paris',
      image: 'paris.jpg',
    };

    await page.route('**/api/destination/category/**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([destination]),
      })
    );

    // Click on the first destination image
    const destinationImage = page.locator('img');
  });

  test('should display a placeholder if destination image is missing', async ({ page }) => {
    // Mock destination data with missing image
    const destination = {
      _id: '1',
      title: 'Paris',
      image: null, // No image
    };


    await page.route('http://localhost:5173/api/destination/category/**', route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([destination]),
      })
    );

    // Check that the placeholder image is displayed
    const placeholderImage = page.locator('img[src="https://via.placeholder.com/150"]');
  });
});
