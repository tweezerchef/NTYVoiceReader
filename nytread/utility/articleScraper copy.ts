import got from "got";
import jsdom from "jsdom";

const { JSDOM } = jsdom;


export const nyTimesArticleParser = async (url: string): Promise<string> => {
  try {
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const document = dom.window.document;

    // Fetch all paragraph elements
    const paragraphs = Array.from(document.querySelectorAll("p"));
    let articleText = "";

    // Define a list of strings to exclude
    const excludeStrings = [
      "Advertisement",
      "Supported by",
      "Send any friend a story",
      "As a subscriber, you have 10 gift articles to give each month. Anyone can read what you share.",
    ];

    // Filter and accumulate the text from valid paragraphs
    paragraphs.forEach((p) => {
      if (p.textContent) {
        const text = p.textContent.trim();
        // Check if the text starts with unwanted strings or other conditions
        if (
          !excludeStrings.some((exclude) => text.startsWith(exclude)) &&
          !text.startsWith("By")
        ) {
          articleText += text + " ";
        }
      }
    });

    return articleText || "Text not found";
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to handle it in the API function.
  }
};
