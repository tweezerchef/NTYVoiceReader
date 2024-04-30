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
            headless: false,
            args: ['--enable-javascript'],
        });
        const page: Page = await browser.newPage();
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36';
        await page.setUserAgent(userAgent);

        // Read cookies from the file
        const cookiesString = await fs.readFile('nytimesCookie.json', { encoding: 'utf8' });
        const cookies = JSON.parse(cookiesString);

        // Set cookies in the page
        await page.setCookie(...cookies);

        // Go to the NYTimes page to check if we are logged in using the cookies
        await page.goto('https://www.nytimes.com', { waitUntil: 'networkidle0' });

        // Check if login was successful using cookies or not
        if (await page.$('input[name="email"]')) {  // Adjust selector as needed
            // Login process if cookies are not valid or not found
            await page.type('input[name="email"]', username);
            await page.click('button[type="submit"]');
            await page.waitForSelector('input[name="password"]', { visible: true });
            await page.type('input[name="password"]', password);
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            // Save the cookies for next time
            const cookies = await page.cookies();
            await fs.writeFile('nytimes_cookie.json', JSON.stringify(cookies, null, 2));
        }

        // Now go to the article URL
        console.log('Going to the article URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Scroll to the bottom of the page to ensure all content is loaded
        await page.evaluate(async () => {
            await new Promise<void>((resolve, reject) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Extract article text
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
