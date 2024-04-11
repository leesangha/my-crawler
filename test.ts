// Crawlee works with other libraries like Puppeteer
// or Cheerio as well. Now we want to work with Playwright.
import { PlaywrightCrawler } from "crawlee";

// PlaywrightCrawler manages browsers and browser tabs.
// You don't have to manually open and close them.
// It also handles navigation (goto), errors and retries.
const crawler = new PlaywrightCrawler({
  // Request handler gives you access to the currently
  // open page. Similar to the pure Playwright examples
  // above, we can use it to control the browser's page.
  requestHandler: async ({ page }) => {
    // Get the title of the page just to test things.
    const title = await page.title();
    console.log("title", title);
  },
});

// Here we start the crawler on the selected URLs.
await crawler.run(["https://vercel.com"]);
