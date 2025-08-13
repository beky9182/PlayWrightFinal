// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test("TC01 - Empty email and password", async ({ page }) => {
  await page.goto("https://courses.ultimateqa.com/users/sign_in");
  await page.click('input[name="commit"]');
  await expect(page.locator(".form-error__list")).toContainText(
    "Invalid Email or password."
  );
  await page.screenshot({ path: "screenshots/tc01_empty.png" });
});

test("TC02 - Invalid email format", async ({ page }) => {
  await page.goto("https://courses.ultimateqa.com/users/sign_in");
  await page.fill("#user_email", "abc");
  await page.fill("#user_password", "wrongpass");
  await page.click('input[name="commit"]');
  await expect(page.locator(".form-error__list")).toContainText(
    "Invalid Email or password."
  );
  await page.screenshot({ path: "screenshots/tc02_invalid_email.png" });
});

test("TC03 - Wrong password for valid email", async ({ page }) => {
  await page.goto("https://courses.ultimateqa.com/users/sign_in");
  await page.fill("#user_email", "abc@example.com");
  await page.fill("#user_password", "wrongpassword");
  await page.click('input[name="commit"]');
  await expect(page.locator(".form-error__list")).toContainText(
    "Invalid Email or password."
  );
  await page.screenshot({ path: "screenshots/tc03_wrong_pw.png" });
});
