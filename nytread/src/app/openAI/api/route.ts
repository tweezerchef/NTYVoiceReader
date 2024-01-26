import fs from 'fs';
import path from 'path';
import { openAIAudioToText } from '../../../../utility/openAIAudioToText';


export const POST = async (req: Request) => {
    const { audioBase64 } = req.body;

    // Convert base64 to a buffer
    const buffer = Buffer.from(audioBase64.split(';base64,').pop(), 'base64');

    // Create a temporary file path
    const tempFilePath = path.join('/tmp', `audio-${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, buffer);

    try {
      // Get the transcription
      const transcription = await openAIAudioToText(tempFilePath);

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      // Send the transcription back to the client
      return new Response(JSON.stringify({ transcription }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }catch (error) {
        const message = (error as Error).message;
        console.error(message);
        return new Response(JSON.stringify({ error: `Error: ${message}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    };
