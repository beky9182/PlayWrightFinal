import { test, expect } from "@playwright/test";

test("TC01 - standard user login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await expect(page).toHaveTitle("Swag Labs");
  await expect(page.locator(".title")).toContainText("Products");
  await page.screenshot({ path: "screenshots/tc01_standard_user.png" });
});

test("TC02 - Not match username and Password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "locked_out_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  const errorMessages = await page.locator("h3[data-test='error']").allTextContents();
  await expect(errorMessages).toContain(
    "Epic sadface: Sorry, this user has been locked out."
  );
  await page.screenshot({ path: "screenshots/tc02_not_match.png" });
});

test("TC03 - Show products with select box", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.click(".product_sort_container");
  await page.selectOption(".product_sort_container", "za"); // Sort by name (Z to A)
  const productNames = await page
    .locator(".inventory_item_label .inventory_item_name")
    .allTextContents();

  console.log("productNames:");
  console.log(productNames);
  const count = await page.locator(".inventory_item_label").count();
  expect(count).toBeGreaterThan(0);
  await expect(page.locator(".title")).toContainText("Products");
  //await page.screenshot({ path: "screenshots/tc03_standard_user.png" });
});

test("TC04 - Add product to cart", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  const productNames = await page
    .locator(".inventory_item_label .inventory_item_name")
    .allTextContents();

  console.log("productNames:");
  console.log(productNames);

  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator("#remove-sauce-labs-backpack")).toHaveText("Remove");
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.screenshot({ path: "screenshots/tc04_add_to_cart.png" });
});



test("TC05 - Go to about page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  
  await page.locator("#react-burger-menu-btn").click();
  await page.click("#about_sidebar_link");
  await expect(page).toHaveURL("https://saucelabs.com/");
  await page.screenshot({ path: "screenshots/tc06_go_to_about.png" });
});

test("TC06 - Show products order with select box", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.click(".product_sort_container");
  await page.selectOption(".product_sort_container", "za"); // Sort by name (Z to A)
  await expect(page.locator(".title")).toContainText("Products");
  //await page.screenshot({ path: "screenshots/tc03_standard_user.png" });
});

test("TC07 - login > sort ztoa > elipses > logout", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.click(".product_sort_container");
  await page.selectOption(".product_sort_container", "za"); // Sort by name (Z to A)
  await expect(page.locator(".title")).toContainText("Products");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#logout_sidebar_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  //await page.screenshot({ path: "screenshots/tc03_standard_user.png" });
});