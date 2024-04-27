import got from 'got';
import { JSDOM } from 'jsdom';

export const nyTimesArticleParser = async (url: string): Promise<string> => {
    try {
        // Fetch the page HTML
        const response = await got(url);
        const dom = new JSDOM(response.body);
        const document = dom.window.document;

        // Use the specific selector to target the main content of the article
        const mainContent = document.querySelector('#story > section')?.textContent?.trim() || 'Text not found';

        return mainContent;
    } catch (err) {
        console.error('Error while fetching the article:', err);
        throw err;
    }
};