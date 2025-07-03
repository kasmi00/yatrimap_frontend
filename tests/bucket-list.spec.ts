import { test, expect } from '@playwright/test';

test.describe('Bucket List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Set up response mocking before navigation
    await page.route('**/api/bucket-list/**', async (route) => {
      const url = route.request().url();
      
      // For GET requests
      if (route.request().method() === 'GET' && url.endsWith('/api/bucket-list/')) {
        console.log('Mocking GET bucket list response');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              _id: '1',
              title: 'Paris',
              description: 'The city of lights and romance',
              image: 'paris.jpg',
              category: 'Europe'
            },
            {
              _id: '2',
              title: 'Tokyo',
              description: 'Modern metropolis with traditional charm',
              image: 'tokyo.jpg',
              category: 'Asia'
            },
            {
              _id: '3',
              title: 'New York',
              description: 'The city that never sleeps',
              image: null,
              category: 'North America'
            }
          ])
        });
      }
      
      // For DELETE requests
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });
    
    // Navigate to the bucket list page after setting up mocks
    await page.goto('http://localhost:5173/bucket-list');
  });

  test('should load and display bucket list items', async ({ page }) => {
    // Wait for the grid to load with items
    await page.waitForSelector('.grid', { state: 'visible' });

    // Verify the number of items
    const bucketListItems = page.locator('.grid > div');
    await expect(bucketListItems).toHaveCount(3);

    // Verify the displayed titles
    const itemTitles = page.locator('.grid h2');
    await expect(itemTitles.nth(0)).toContainText('Paris');
    await expect(itemTitles.nth(1)).toContainText('Tokyo');
    await expect(itemTitles.nth(2)).toContainText('New York');

    // Verify images
    await expect(page.locator('img[alt="Paris"]')).toHaveAttribute(
      'src', 
      'http://localhost:3000/destinations_image/paris.jpg'
    );
    
    // Verify placeholder for missing image
    await expect(page.locator('img[alt="New York"]')).toHaveAttribute(
      'src', 
      'https://via.placeholder.com/400x300'
    );
    
    // Verify categories are displayed
    const categories = page.locator('.bg-blue-100.text-blue-800');
    await expect(categories.nth(0)).toContainText('Europe');
    await expect(categories.nth(1)).toContainText('Asia');
    await expect(categories.nth(2)).toContainText('North America');
  });

  test('should remove an item when heart icon is clicked', async ({ page }) => {
    // Wait for items to load
    await page.waitForSelector('.grid > div', { state: 'visible' });

    // Count before deletion
    const initialCount = await page.locator('.grid > div').count();
    expect(initialCount).toBe(3);

    // Click the first heart button (matches the FaHeart in the component)
    await page.locator('.grid > div').first().locator('button .w-5.h-5').click();

    // Verify one item is removed
    await expect(page.locator('.grid > div')).toHaveCount(initialCount - 1);
  });

  test('should display a loading state', async ({ page }) => {
    // Clear all routes
    await page.unroute('**/api/bucket-list/**');
    
    // Mock API response with delay
    await page.route('**/api/bucket-list/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ 
          _id: '1', 
          title: 'Paris', 
          image: 'paris.jpg',
          category: 'Europe'
        }])
      });
    });

    // Reload the page
    await page.reload();

    // Verify loading state appears with the proper text from the component
    await expect(page.locator('text="Loading your dream destinations..."')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();

    // Wait for content to appear
    await page.waitForSelector('.grid > div', { state: 'visible' });

    // Ensure loading disappears
    await expect(page.locator('text="Loading your dream destinations..."')).not.toBeVisible();
  });

  test('should display empty state when no items exist', async ({ page }) => {
    // Override the route to return empty array
    await page.route('**/api/bucket-list/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Reload the page
    await page.reload();

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Verify empty state message appears
    await expect(page.locator('text="Your bucket list is empty"')).toBeVisible();
    await expect(page.locator('text="Start adding destinations you dream of visiting!"')).toBeVisible();
  });

  test('should handle an error when deleting an item', async ({ page }) => {
    // Set up console error listener
    

    // Wait for items to load
    await page.waitForSelector('.grid > div', { state: 'visible' });

    // Mock an error for DELETE request to the first item
    await page.route('**/api/bucket-list/1', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      } else {
        // Pass through other requests
        await route.continue();
      }
    });

    // Click the first heart button
    await page.locator('.grid > div').first().locator('button').click();

    // Wait for potential error to be logged
    await page.waitForTimeout(500);

    // Count should still be 3 as deletion failed
    await expect(page.locator('.grid > div')).toHaveCount(3);
  });
});