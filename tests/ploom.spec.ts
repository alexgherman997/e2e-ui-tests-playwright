import { test, expect } from "@playwright/test";
import { findBrokenImages, findBrokenLinks } from "../helper/helper";

test("test cases 1 and 2", async ({ page }) => {
  const env = process.env.BASE_URL;
  await page.goto(env!);

  await page.locator("button#onetrust-reject-all-handler").click();
  await page.locator(".ageconfirmation__confirmBtn").click();
  await page.locator("div.navigation__list-container li").nth(0).click();
  await page.hover("svg.icon--account");
  await page.locator("[data-sku='ploom-x-advanced']").click();

  const productTitle = await page
    .locator("div.product-heading h1")
    .textContent();
  const productPrice = await page
    .locator(
      "[data-testid='finalPrice'] span.FormattedPrice-module-price-1QJjU"
    )
    .textContent();

  await page.locator("[data-testid='pdpAddToProduct']").click();

  // Wait for the loading selector to be detached
  await page.waitForSelector("ul.Loading-module-active-hwbGz", {
    state: "detached",
    timeout: 10000,
  });

  // check product in cart information
  // check product title
  expect(
    await page.locator("div.ProductMiniature-module-name-h-hJP").textContent()
  ).toEqual(productTitle);

  // check product price
  expect(
    await page
      .locator(
        ".CompactItem-module-price-dcEe4 .FormattedPrice-module-price-eDdEl"
      )
      .textContent()
  ).toEqual(productPrice);

  // check number of items
  expect(
    await page.locator("div.mini-cart__header-count").textContent()
  ).toEqual("1 Item");
  expect(
    await page.locator("[data-testid='cartQuantity']").inputValue()
  ).toEqual("1");

  // check cart price
  await page.waitForSelector("[data-testid='miniCartSubtotal']");
  expect(
    await page.locator("[data-testid='miniCartSubtotal']").textContent()
  ).toEqual(productPrice);

  // remove product from cart
  await page.locator('[data-testid="cartRemoveButton"]').click();

  // check cart when 0 Products
  expect(
    await page.locator('[data-testid="emptyCartContainer"]').textContent()
  ).toEqual("There are no products in your cart at the moment.");
  expect(
    await page.locator("div.mini-cart__header-count").textContent()
  ).toEqual("0 Items");
});

test("test cases 3", async ({ page }) => {
  const env = process.env.BASE_URL;
  await page.goto(env!);

  await page.locator("button#onetrust-reject-all-handler").click();
  await page.locator(".ageconfirmation__confirmBtn").click();
  await page.locator("div.navigation__list-container li").nth(0).click();
  await page.hover("svg.icon--account");
  await page.locator("[data-sku='ploom-x-advanced']").click();

  expect(await page.locator("div.product-heading h1").textContent()).toEqual(
    "Ploom X Advanced Black"
  );

  // Call the method to find broken links
  const brokenLinks = await findBrokenLinks(page);

  // Log the broken links for debugging
  if (brokenLinks.length > 0) {
    console.log("Broken links:", brokenLinks);
  }

  // Call the method to find broken images
  const brokenImages = await findBrokenImages(page);

  // Log broken images for debugging purposes
  if (brokenImages.length > 0) {
    console.log("Broken images:", brokenImages);
  }
});
