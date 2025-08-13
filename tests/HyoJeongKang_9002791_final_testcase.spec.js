import { test, expect } from "@playwright/test";

test("TC01 - Empty username and Password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.click('input[name="login-button"]');
  await expect(page.locator("h3[data-test='error']")).toContainText(
    "Epic sadface: Username is required"
  );
  await page.screenshot({ path: "screenshots/tc01_empty.png" });
});

test("TC02 - Not match username and Password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "testuser");
  await page.fill('input[name="password"]', "testuser");
  await page.click('input[name="login-button"]');
  const errorMessages = await page.locator("h3[data-test='error']").allTextContents();
  await expect(errorMessages).toContain("Epic sadface: Username and password do not match any user in this service");
  await page.screenshot({ path: "screenshots/tc02_not_match.png" });
});

test("TC03 - standard user login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page).toHaveTitle("Swag Labs");
  await expect(page.locator(".title")).toContainText("Products");
  //await page.screenshot({ path: "screenshots/tc03_standard_user.png" });
});
