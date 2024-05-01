import puppeteer, { Browser, Page } from 'puppeteer';
import { JSDOM } from 'jsdom';
import 'dotenv/config';
import fs from 'fs/promises';

const username = process.env.NYT_USERNAME;
const password = process.env.NYT_PASSWORD;

if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error("Environment variables NYT_USERNAME and NYT_PASSWORD must be set.");
}

export const nyTimesArticleParser = async (url: string): Promise<string> => {
    let browser: Browser | null = null;
    try {
        browser = await puppeteer.launch({
            headless: false, // Set headless to true to improve performance
            args: ['--enable-javascript'],
        });
        const page: Page = await browser.newPage();
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36';
        await page.setUserAgent(userAgent);

        // Set cookies directly
        const cookiesString = await fs.readFile('nytimesCookie.json', { encoding: 'utf8' });
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);

        // Directly go to the article URL
        console.log('Going to the article URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Try to extract the article without scrolling
        const bodyHTML: string = await page.evaluate(() => document.documentElement.outerHTML);
        const dom = new JSDOM(bodyHTML);
        const document: Document = dom.window.document;
        let articleText = "";
        document.querySelectorAll("p").forEach((p: HTMLElement ) => {
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
