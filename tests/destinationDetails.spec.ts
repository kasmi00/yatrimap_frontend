import { test, expect } from "@playwright/test";

// Mock destination data
const mockDestination = {
  _id: "123",
  title: "Everest Base Camp Trek",
  location: "Nepal",
  category: "Adventure",
  bestTimeToVisit: "Spring & Autumn",
  description: "A thrilling trekking experience to the base of the world's highest mountain.",
  image: "everest.jpg",
};

const mockAccommodations = [
  { _id: "a1", name: "Everest Lodge", price: 50, description: "Cozy stay near the mountains", amenities: ["WiFi", "Hot Water"] },
  { _id: "a2", name: "Base Camp Resort", price: 80, description: "Luxury stay with breathtaking views", amenities: ["Heater", "Breakfast"] },
];

test.describe("DestinationDetails Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("http://localhost:3000/api/destination/123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockDestination),
      });
    });

    await page.route("http://localhost:3000/api/accommodations/123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockAccommodations),
      });
    });


    await page.goto("http://localhost:5173/destination/123")
  });
});

  test("should display destination details", async ({ page }) => {
    await page.goto(`http://localhost:5173/destination/123`);
    await page.waitForLoadState('networkidle'); 
  });

  test("should display accommodations", async ({ page }) => {
    await page.goto(`http://localhost:5173/accommodation/123`);
    await page.waitForLoadState('networkidle'); 
  });

