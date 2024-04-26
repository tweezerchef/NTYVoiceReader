import got from "got";
import { CookieJar } from 'tough-cookie';
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import 'dotenv/config';

const username = process.env.NYT_USERNAME;
const password = process.env.NYT_PASSWORD;

if (typeof username !== 'string' || typeof password !== 'string') {
  throw new Error("NYT_USERNAME and NYT_PASSWORD must be set in the environment.");
}

// Function to log in and get cookies
const loginToNYTimes = async (username: string, password: string) => {
  const cookieJar = new CookieJar(); // Create a new cookie jar
  try {
    await got.post('https://myaccount.nytimes.com/auth/login', {
      form: {
        username: 'ltomblock@gmail.com',
        password,
      },
      cookieJar: cookieJar,
      followRedirect: true,
    });
    return cookieJar; // Return the cookie jar with the login cookies
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Main function to fetch article text
export const nyTimesArticleParser = async (url: string): Promise<string> => {
  try {
    const cookieJar = await loginToNYTimes(username, password); // Perform login

    const response = await got(url, { cookieJar: cookieJar });
    const dom = new JSDOM(response.body);
    const document = dom.window.document;

    // Fetch all paragraph elements
    const paragraphs = Array.from(document.querySelectorAll("p"));
    let articleText = "";

    const excludeStrings = [
      "Advertisement", "Supported by",
      "Send any friend a story",
      "As a subscriber, you have 10 gift articles to give each month. Anyone can read what you share.",
    ];

    paragraphs.forEach((p) => {
      const text = p.textContent?.trim();
      if (text && !excludeStrings.some(exclude => text.startsWith(exclude)) && !text.startsWith("By")) {
        articleText += text + " ";
      }
    });

    return articleText || "Text not found";
  } catch (err) {
    console.error('Error fetching article:', err);
    throw err;
  }
};
