import fs from 'fs';
import path from 'path';
import { openAIAudioToText } from '../../../../utility/openAIAudioToText'
import 'dotenv/config';
import leven from 'leven';

interface Article {
  index: number;
  title: string;
  abstract: string;
  byline: string;
  url: string;
}

const sections = ['arts', 'automobiles', 'books', 'review', 'business', 'fashion', 'food', 'health', 'home', 'insider', 'magazine', 'movies', 'nyregion', 'obituaries', 'opinion', 'politics', 'realestate', 'science', 'sports', 'sundayreview', 'technology', 'theater', 't-magazine', 'travel', 'upshot', 'us', 'world'];

function getClosestSection(transcription: string): string {
  let closestMatch = '';
  let smallestDistance = Infinity;

  for(let section of sections) {
    const distance = leven(transcription.toLocaleLowerCase(), section);
    if (distance < smallestDistance){
      smallestDistance = distance;
      closestMatch = section;
    }
  }
return closestMatch;
}

const NYTAPIKEY = process.env.NYT_API_KEY

export const POST = async (req: Request): Promise<Response> => {
  console.log(NYTAPIKEY);

  try {
    const body = await req.json();
    const audioBase64 = body.audioBase64;
    const buffer = Buffer.from(audioBase64.split(';base64,').pop() || '', 'base64');

    const tempFilePath = path.join('/tmp', `audio-${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, buffer);

    const transcription = await openAIAudioToText(tempFilePath);
    fs.unlinkSync(tempFilePath);

    const closestSection = getClosestSection(transcription);
    console.log(closestSection);

    const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${closestSection}.json?api-key=${NYTAPIKEY}`);
    const data = await response.json();

    const articles = data.results.map((article: any, index: number) => ({
      index: index + 1,
      title: article.title,
      abstract: article.abstract,
      byline: article.byline,
      url: article.url
    }));

    const textsForVoice = articles.map((article: Article) => `${article.index}. ${article.title} by ${article.byline}. ${article.abstract}`);
    console.log(textsForVoice);
    return new Response(JSON.stringify({ textsForVoice, articles }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
