import { NextRequest, NextResponse } from 'next/server';
import { nyTimesArticleParser } from '../../../../utility/articleScraper';

export async function GET(req: NextRequest) {
  try {
    // Extracting the 'url' from the query parameters
    const url = req.nextUrl.searchParams.get('url');

    // Check if the URL parameter is provided and valid
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Use the utility to parse the article text from the URL
    const articleText = await nyTimesArticleParser(url);

    // Return the article text in a JSON response
    return new Response(JSON.stringify({ articleText }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
