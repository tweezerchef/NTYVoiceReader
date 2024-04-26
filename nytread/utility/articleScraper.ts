import puppeteer, { Browser, Page } from 'puppeteer';
import { JSDOM } from 'jsdom';
import 'dotenv/config';
import { setTimeout } from 'node:timers/promises';

const username = process.env.NYT_USERNAME;
const password = process.env.NYT_PASSWORD;

if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error("Environment variables NYT_USERNAME and NYT_PASSWORD must be set.");
}

export const nyTimesArticleParser = async (url: string): Promise<string> => {
    let browser: Browser | null = null;
    try {
      browser = await puppeteer.launch({ headless: false }); // For debugging
      const page: Page = await browser.newPage();

      // Go to the login page
      await page.goto('https://myaccount.nytimes.com/auth/login', { waitUntil: 'networkidle2' });

      // Enter the email and go to the next step
      await page.waitForSelector('input[name="email"]', { visible: true });
      await page.type('input[name="email"]', username);
      await page.click('button[type="submit"]');

      // Now wait for the password field to appear
      await page.waitForSelector('input[name="password"]', { visible: true });
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Go to the article URL
      console.log('Going to the article URL:', url);
      await page.goto(url, { waitUntil: 'networkidle0' });

        const bodyHTML = await page.evaluate(() => document.documentElement.outerHTML);
        const dom = new JSDOM(bodyHTML);
        const document = dom.window.document;

        let articleText = "";
        document.querySelectorAll("p").forEach(p => {
            const text = p.textContent?.trim();
            if (text && !text.startsWith("Advertisement") && !text.startsWith("Supported by")) {
                articleText += text + " ";
            }
        });

        return articleText || "Text not found";
    } catch (err) {
        console.error('Error while fetching the article:', err);
        throw err;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
