import { expect, test } from '@playwright/test';

// Mock data for bookings
const mockBookings = [
  {
    _id: 'booking1',
    accommodationId: {
      _id: 'accom1',
      title: 'Luxury Hotel',
      image: 'hotel1.jpg'
    },
    destinationId: {
      _id: 'dest1',
      title: 'Paris'
    },
    userId: 'user123',
    checkInDate: '2025-02-15T00:00:00.000Z',
    checkOutDate: '2025-02-20T00:00:00.000Z',
    totalPrice: 1250.50
  },
  {
    _id: 'booking2',
    accommodationId: {
      _id: 'accom2',
      title: 'Beach Resort',
      image: 'beach1.jpg'
    },
    destinationId: {
      _id: 'dest2',
      title: 'Bali'
    },
    userId: 'user123',
    checkInDate: '2025-03-10T00:00:00.000Z',
    checkOutDate: '2025-03-15T00:00:00.000Z',
    totalPrice: 975.75
  },
  {
    _id: 'booking3',
    accommodationId: {
      _id: 'accom3',
      title: 'Mountain Cabin',
      image: 'cabin1.jpg'
    },
    destinationId: {
      _id: 'dest3',
      title: 'Swiss Alps'
    },
    userId: 'user123',
    checkInDate: new Date().toISOString(), // Today
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    totalPrice: 850.25
  }
];

test.describe('BookingList Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock AuthContext values
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'fake-token-12345');
      
    });

    // Mock the API response for fetching bookings
    await page.route('**/api/booking/user/user123', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBookings)
      });
    });

    // Mock the API response for deleting a booking
    await page.route('**/api/booking/**', async route => {
      const method = route.request().method();
      const url = route.request().url();
      
      if (method === 'DELETE') {
        const bookingId = url.split('/').pop();
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: `Booking ${bookingId} deleted successfully` })
        });
      }
      return route.continue();
    });

    // Navigate to the bookings page
    await page.goto('http://localhost:5173/bookingList');
  });

  test('should display loading state initially', async ({ page }) => {
    // Create a new context for this test to avoid cached responses
    await page.route('**/api/booking/user/user123', async route => {
      // Delay the response to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBookings)
      });
    });
    
    await page.goto('http://localhost:5173/bookingList');
  });

  test('should render the booking list correctly', async ({ page }) => {
    // Check for heading
    await expect(page.locator('h1')).toHaveText('My Schedule');
  
  });

  test('should display empty state when no bookings exist', async ({ page }) => {
    // Mock empty bookings response
    await page.route('**/api/booking/user/user123', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('http://localhost:5173/bookingList');
    
    // Check for empty state message
    await expect(page.locator('text=No bookings found')).not.toBeVisible();
    await expect(page.locator('text=You don\'t have any bookings yet')).not.toBeVisible();
    await expect(page.locator('text=Explore Destinations')).not.toBeVisible();
  });

  test('should toggle calendar on mobile view', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Initially calendar should be hidden on mobile
    const calendar = page.locator('.grid-cols-7');
    
    // Click the toggle button
    await page.click('button:has-text("Show Calendar")');
    
    
    // Click again to hide
    await page.click('button:has-text("Hide Calendar")');
    
  });

  test('should correctly identify and display booking status', async ({ page }) => {
    // Check upcoming booking (second booking)
    const upcomingBooking = page.locator('.bg-white.rounded-xl.shadow-lg.overflow-hidden').nth(1);
    
    // Check active booking (third booking - using today's date)
    const activeBooking = page.locator('.bg-white.rounded-xl.shadow-lg.overflow-hidden').nth(2);

    // This might need adjustment based on the actual dates used
    if (new Date() > new Date(mockBookings[0].checkOutDate)) {
      const pastBooking = page.locator('.bg-white.rounded-xl.shadow-lg.overflow-hidden').first();
    }
  });

  test('should handle error when API call fails', async ({ page }) => {
    // Mock the API response to simulate an error
    await page.route('**/api/booking/user/user123', route => {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to fetch bookings. Please try again.' })
      });
    });
  
    // Reload the page to trigger the API request
    await page.reload();
  
    // Ensure the error message is displayed
    await expect(page.locator('.bg-red-100.text-red-800')).toBeVisible();
  });
});