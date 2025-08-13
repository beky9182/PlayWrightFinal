// @ts-check
import { test, expect } from '@playwright/test';

/*
User Authentication: Signup, login, and account deletion
Product Catalogue: View, search, and filter products
Shopping Cart & Checkout: Add items to cart, place orders
Contact Form: Submit queries using a form
Test Scenarios: Includes ads, sliders, and page navigations for UI interaction
*/


// Test Case 1: User Signup
test('User Signup Flow', async ({ page }) => {
  console.log('Navigating to homepage');
  await page.goto('https://www.automationexercise.com/');
  await page.click('div.header-middle a[href="/login"]');
  console.log('Navigated to signup/login page');

  await page.fill('input[data-qa="signup-name"]', 'TestUser000');
  await page.fill('input[data-qa="signup-email"]', 'testuser000@example.com');
  await page.click('button[data-qa="signup-button"]');

  console.log('Signup form submitted');
  
  let passed = false;
  
  try {
	  await expect(
		page.locator('div.login-form form input[data-qa=\"email\"]')
	  ).toHaveValue('testuser000@example.com');
	  passed = true;
	  
	  if(passed){
  
	// Fill title (radio button)
	await page.check('input#id_gender2'); // for Mrs.

	// Fill name
	await page.fill('input[data-qa="name"]', 'testuser000');

	// Fill password
	await page.fill('input[data-qa="password"]', 'test123123');

	// Select Date of Birth
	await page.selectOption('select[data-qa="days"]', '5');
	await page.selectOption('select[data-qa="months"]', '3');
	await page.selectOption('select[data-qa="years"]', '1995');

	// Fill Address Info
	await page.fill('input[data-qa="first_name"]', 'HyoJeong');
	await page.fill('input[data-qa="last_name"]', 'Kang');
	await page.fill('input[data-qa="address"]', 'PROG8173 Conestoga St.');

	// Country select
	await page.selectOption('select[data-qa="country"]', 'Canada');

	// State, city, zip, phone
	await page.fill('input[data-qa="state"]', 'Ontario');
	await page.fill('input[data-qa="city"]', 'Waterloo');
	await page.fill('input[data-qa="zipcode"]', 'N2L 3N8');
	await page.fill('input[data-qa="mobile_number"]', '+11231231234');

	// Submit form
	await page.click('button[data-qa="create-account"]');
	console.log('Account Information form submitted');
	
	await expect(page.locator('div.row h2 b')).toContainText('Account Created!');
	
	  }
	  
	  
	  
	} catch (e) {
	  console.log('The value could not be found.');
	}

	if (!passed) { //Register User with existing email
	  try {
		await expect(
		  page.locator('div.signup-form form p[style=\"color: red;\"]')
		).toHaveText('Email Address already exist!');
		passed = true;
		console.log('There is a log that says there is an email that exists.');
	  } catch (e) {
		console.log('Can\'t sign up even though email address doesn\'t already exist.');
	  }
	}

	expect(passed).toBe(true);
});


// Test Case 2: User Login
test('User Login Flow', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/login');
  console.log('On login page');
  await page.fill('input[data-qa="login-email"]', 'testuser000@example.com');
  await page.fill('input[data-qa="login-password"]', 'test123123');
  await page.click('button[data-qa="login-button"]');
  console.log('Login button clicked');
  await expect(page.locator('div.header-middle a[href="/logout"]')).toBeVisible();
});

// Test Case 3: Delete Account
test('Delete Account', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/login');
  await page.fill('input[data-qa="login-email"]', 'testuser000@example.com');
  await page.fill('input[data-qa="login-password"]', 'test123123');
  await page.click('button[data-qa="login-button"]');
  console.log('Logged in');
  await page.click('div.header-middle a[href="/delete_account"]');
  await expect(page.locator('div.row h2 b')).toContainText('Account Deleted!');
});

// Test Case 4: View Products
test('View All Products', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  console.log('On products page');
  
  const productNames = await page.locator('.features_items .productinfo.text-center p').allTextContents();

  console.log('productNames:');
  console.log(productNames);
  
  await expect(page.locator('.features_items')).toBeVisible();
});

// Test Case 5: Search Product
test('Search Product by Name', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  await page.fill('#search_product', 'dress');
  await page.click('#submit_search');
  console.log('Search submitted');
  const count = await page.locator('div.productinfo.text-center p').count();
	
	console.log('p tag count: ', count);
	
	const productNames = await page.locator('div.productinfo.text-center p').allTextContents();

  console.log('Search results:');
  console.log(productNames);

  expect(count).toBeGreaterThan(0);
});

// Test Case 6: Add Product to Cart
test('Add Product to Cart', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/products');
  await page.hover('.single-products');
  await page.click('.product-overlay a[data-product-id="1"]');
  console.log('Product added to cart');
  await expect(page.locator('#cartModal .modal-body p').first()).toContainText('Your product has been added to cart.');
  
});


// Test Case 7: Checkout Flow
test('Checkout Flow', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/login');
  console.log('On login page');
  await page.fill('input[data-qa="login-email"]', 'testuser000@example.com');
  await page.fill('input[data-qa="login-password"]', 'test123123');
  await page.click('button[data-qa="login-button"]');
  console.log('Login button clicked');
  await page.click('div.header-middle a[href="/products"]')
  await page.hover('div.single-products');
  await page.click('div.product-overlay .overlay-content a[data-product-id="1"]');
  console.log('Product added to cart');
  await page.click('#cartModal a[href="/view_cart"]'); // View Cart
  console.log('Navigating to cart');
  await page.click('.btn.btn-default.check_out');
  
  const delivery_addr = await page.locator('div.checkout-information #address_delivery li.address_address1.address_address2').allTextContents();
  
  console.log('Delivery address:', delivery_addr);
  
  // ensure it's not empty or undefined
expect(Array.isArray(delivery_addr)).toBe(true);

// check that at least one item includes the string
const hasAddress = delivery_addr.some(addr =>
  addr.includes('PROG8173 Conestoga St.')
);

expect(hasAddress).toBe(true);
  
});

// Test Case 8: Fill Contact Us Form
test('Contact Us Form Submission', async ({ page }) => {
  await page.goto('https://www.automationexercise.com/contact_us');
  
  // popup handler -> OK button
  page.on('dialog', async dialog => {
    console.log('popup content:', dialog.message());
    await dialog.accept();
  });
  
  await page.fill('[data-qa="name"]', 'TestUser000');
  await page.fill('[data-qa="email"]', 'testuser000@example.com');
  await page.fill('[data-qa="subject"]', 'Test Subject');
  await page.fill('[data-qa="message"]', 'This is a test message.');
  await page.click('input[data-qa="submit-button"]');
    
  console.log('Form submitted');
  await expect(page.locator('.contact-form .status')).toContainText('Success! Your details have been submitted successfully.');
});

// Test Case 9: Navigate Slider
test('Homepage Slider Navigation', async ({ page }) => {
  await page.goto('https://www.automationexercise.com');
  await page.click('#slider-carousel .fa-angle-right');
  console.log('Slider clicked');
  await expect(page.locator('.carousel-indicators')).toBeVisible();
});

// Test Case 10: Verify Ads Displayed
test('Verify Ads on Home Page', async ({ page }) => {
  await page.goto('https://www.automationexercise.com');
  
  const adCount = await page.locator('ins.adsbygoogle.adsbygoogle-noablate').count();
  console.log('Ads found:', adCount);

	const visibleAds = page.locator('ins.adsbygoogle.adsbygoogle-noablate').filter({
	  has: page.locator(':visible')
	});

	const visibleCount = await visibleAds.count();
	console.log('visibleCount:', visibleCount);
	expect(visibleCount).toBeGreaterThan(0); 
});

