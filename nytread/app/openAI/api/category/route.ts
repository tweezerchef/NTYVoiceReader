import fs from 'fs';
import path from 'path';
import { openAIAudioToText } from '../../../../../utility/openAIAudioToText'
import 'dotenv/config';
import leven from 'leven';

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

export const POST = async (req: Request) => {
  console.log(NYTAPIKEY)
    // Parse the JSON body from the request
    const body = await req.json();
    const audioBase64 = body.audioBase64;

    // Convert base64 to a buffer
    const buffer = Buffer.from(audioBase64.split(';base64,').pop() || '', 'base64');

    // Create a temporary file path
    const tempFilePath = path.join('/tmp', `audio-${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, buffer);

    try {
      // Get the transcription
      const transcription = await openAIAudioToText(tempFilePath);

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      const closestSection = getClosestSection(transcription);
      console.log(closestSection);
      let returnText: string;
      fetch(`https://api.nytimes.com/svc/topstories/v2/${closestSection}.json?api-key=${NYTAPIKEY}`).then(response => response.json()) .then(data => {
        console.log(data, 'data');
        const returnText = data.results;  // Assuming 'results' is the correct field you want from 'data'
        // Now 'returnText' is in the correct scope to be used for the response
        // Send the transcription back to the client
        return new Response(JSON.stringify({ returnText }), {
            headers: { 'Content-Type': 'application/json' }
        });
    })
    .catch(error => {
        console.error('Error fetching NYTimes data:', error);
        return new Response(JSON.stringify({ error: `Error: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    });
      // Send the transcription back to the client
 //     return new Response(JSON.stringify({ returnText }), {
 //       headers: { 'Content-Type': 'application/json' }
 //     });
    } catch (error) {
        const message = (error as Error).message;
        console.error(message);
        return new Response(JSON.stringify({ error: `Error: ${message}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
    }
};
