import { test, expect } from "@playwright/test";

test.describe("TourPackageDetails Component", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/api/packages/*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    id: "1",
                    title: "Everest Base Camp Trek",
                    image: "everest1.jpg",
                    image1: "everest2.jpg",
                    highlights: [
                        { highlight: "Scenic Views", description: "Stunning Himalayan landscapes" },
                        { highlight: "Cultural Experience", description: "Meet local Sherpas" }
                    ],
                    itinerary: [
                        { day: "Day 1", description: "Arrive in Kathmandu" },
                        { day: "Day 2", description: "Flight to Lukla & trek begins" }
                    ],
                    price: 1200,
                    duration: 14,
                    description: "A once-in-a-lifetime trekking experience."
                }),
            });
        });

        await page.goto("http://localhost:5173/tour-packages/1");
    });

    test("should show loading state initially", async ({ page }) => {
    });

    test("should display package details after loading", async ({ page }) => {

        // Check if images are displayed correctly
        const firstImage = page.locator('img[alt="Everest Base Camp Trek"]').nth(0);

        const secondImage = page.locator('img[alt="Everest Base Camp Trek"]').nth(1);
    });
});
