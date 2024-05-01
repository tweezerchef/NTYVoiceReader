import puppeteer, { Browser, Page } from 'puppeteer';
import { JSDOM } from 'jsdom';
import 'dotenv/config';

export const nyTimesArticleParser = async (url: string): Promise<string> => {
    let browser: Browser | null = null;
    try {
        browser = await puppeteer.launch({
            headless: true,  // Set to true for better performance since we don't need a visible UI
            args: ['--enable-javascript', '--no-sandbox', '--disable-setuid-sandbox'], // Added sandbox options for better security and compatibility
        });
        const page: Page = await browser.newPage();
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        await page.setUserAgent(userAgent);

        console.log('Navigating to URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Wait to mimic human interaction and to ensure all scripts are executed
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        const bodyHTML: string = await page.evaluate(() => document.documentElement.outerHTML);
        const dom = new JSDOM(bodyHTML);
        const document: Document = dom.window.document;
        let articleText = "";
        document.querySelectorAll("p").forEach((p: HTMLElement) => {
            const text = p.textContent?.trim();
            if (text && !text.startsWith("Advertisement") && !text.startsWith("Supported by")) {
                articleText += text + " ";
            }
        });

        // Trimming the article text based on a marker
        const trimMarker = "Make sense of the day’s news and ideas.";
        const trimIndex = articleText.indexOf(trimMarker);
        if (trimIndex > -1) {
            articleText = articleText.substring(0, trimIndex);
        }
        console.log('Article text:', articleText);
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
