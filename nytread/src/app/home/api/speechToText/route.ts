// pages/api/speechToText.ts
import OpenAI from 'openai';
import { Readable } from 'stream';

const openAI = new OpenAI();
async function streamToBuffer(stream) {
    const chunks = [];
    const reader = stream.getReader();
    let done, value;

    while ({ done, value } = await reader.read()) {
      if (done) break;
      chunks.push(value);
    }

    return new Uint8Array(Buffer.concat(chunks));
  }
export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb', // Set an appropriate size limit for your audio files
      },
    },
  };

export const POST = async (req: Request) => {
    console.log(req.body, "req.body")
  try {
    const { body } = req;
    const audioFile = body as ReadableStream<Uint8Array>;

    if (!audioFile || typeof audioFile === 'string') {
      return new Response(JSON.stringify({ error: 'No file uploaded.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const audioBlob = new Blob([audioFile], { type: 'audio/mpeg' });
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioData = new Uint8Array(arrayBuffer);
    const audioStream = new ReadableStream({
      start(controller) {
        controller.enqueue(audioData);
        controller.close();
      },
    });

    const transcription = await openAI.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
    });


    // Respond with the transcription result
    return new Response(JSON.stringify({ transcription }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = (error as Error).message;
    console.error(message);
    return new Response(JSON.stringify({ error: `Error: ${message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
