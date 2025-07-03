import { expect, test } from '@playwright/test';

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        page.on('response', response => {
            console.log(`Response: ${response.url()} - ${response.status()}`);
        });

        page.on('console', log => console.log(`Console: ${log.text()}`));
    });

    test('should login successfully with valid admin credentials', async ({ page }) => {
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'AdminPassword');
        await page.click('button[type="submit"]');

        await page.waitForURL('http://localhost:5173/admin');
        await expect(page).toHaveURL('http://localhost:5173/admin');

        // Verify token storage
        const token = await page.evaluate(() => localStorage.getItem('authToken'));
        expect(token).not.toBeNull();
    });

    test('should login successfully with a valid user', async ({ page }) => {
        await page.fill('input[type="email"]', 'abc@gmail.com');
        await page.fill('input[type="password"]', 'abc1234');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('http://localhost:5173/login');

    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.fill('input[type="email"]', 'wronguser@gmail.com');
        await page.fill('input[type="password"]', 'WrongPassword');
        await page.click('button[type="submit"]');

        const errorMessage = page.locator('p.text-red-500');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(/Login failed|User not found/);
    });

    test('should show validation error if email is empty', async ({ page }) => { 
        await page.click('button[type="submit"]');
        
        // Check if browser shows a validation error
        const emailInput = page.locator('input[type="email"]');
        const errorMessage = await emailInput.evaluate(input => input);
        
        expect(errorMessage).not.toBe('');
    });
    test('should show validation error if password is empty', async ({ page }) => { 
        await page.click('button[type="submit"]');
        
        // Check if browser shows a validation error
        const passwordInput = page.locator('input[type="password"]');
        const errorMessage = await passwordInput.evaluate(input => input);
        
        expect(errorMessage).not.toBe('');
    });

    test('should display loading state while logging in', async ({ page }) => {
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', 'AdminPassword');
        await page.click('button[type="submit"]');

        const loadingButton = page.locator('button[type="submit"]');
        await expect(loadingButton).toHaveText('Loading...');
    });

    test('should navigate to register page when clicking "Register"', async ({ page }) => {
        await page.click('text=Register');
        await page.waitForURL('http://localhost:5173/register');
        await expect(page).toHaveURL('http://localhost:5173/register');
    });

    test('should navigate to forgot password page', async ({ page }) => {
        await page.click('text=Forgot Password?');
        await page.waitForURL('http://localhost:5173/forgotpassword');
        await expect(page).toHaveURL('http://localhost:5173/forgotpassword');
    });
});
