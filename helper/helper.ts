import { Page } from "@playwright/test";

/**
 * Validates all links on a page to check for broken links and returns detailed information.
 * @param {Page} page - The Playwright Page object.
 * @returns {Promise<{ text: string; href: string; status?: number; error?: string }[]>}
 *          An array of objects containing link details and status for broken links.
 */
export async function findBrokenLinks(
  page: Page
): Promise<{ text: string; href: string; status?: number; error?: string }[]> {
  // Extract all anchor elements and their text and href attributes
  const links = await page.$$eval("a", (anchorElements) =>
    anchorElements
      .map((anchor) => ({
        text: anchor.innerText.trim(),
        href: anchor.href,
      }))
      .filter((link) => link.href)
  );

  console.log(`Found ${links.length} links on the page.`);

  // Array to hold broken links
  const brokenLinks: {
    text: string;
    href: string;
    status?: number;
    error?: string;
  }[] = [];

  // Validate each link
  for (const link of links) {
    try {
      const response = await page.request.get(link.href);
      if (!response.ok()) {
        brokenLinks.push({ ...link, status: response.status() }); // Add to broken links if the response is not OK
      }
    } catch (error) {
      brokenLinks.push({ ...link, error: (error as Error).message }); // Add to broken links if there's an error
    }
  }

  return brokenLinks;
}

/**
 * Validates that all images on a page are correctly loaded.
 * @param {Page} page - The Playwright Page object.
 * @returns {Promise<string[]>} - A promise that resolves with an array of broken image URLs.
 */
export async function findBrokenImages(page: Page): Promise<string[]> {
  // Extract all image elements and their sources
  const images = await page.$$eval("img", (imgElements) =>
    imgElements.map((img) => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }))
  );

  // Find broken images based on rendering in the browser
  const brokenImages = images
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.src);

  return brokenImages;
}
