import  OpenAI  from 'openai';
import fs from 'fs';
import path from 'path';
const openAI = new OpenAI();

export const transcribeAudio = async ( formData: FormData ) => {
    "use server";
  try {
    // Get the file from the formData
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      throw new Error('No file provided.');
    }

    // Save the file temporarily (you might want to handle this differently)
    const filePath = path.join('/tmp', file.name);
    const fileStream = fs.createWriteStream(filePath);
    file.stream().pipe(fileStream);
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    // Send the file to OpenAI for transcription
    const transcription = await openAI.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    // Clean up: delete the temporary file
    fs.unlinkSync(filePath);

    // Return the transcription
    return transcription;
  } catch (error) {
    const message = (error as Error).message; // Type assertion
    console.error(message);
    return JSON({ error: `Error: ${message}` }, 500);
  }
};