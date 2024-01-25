
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openAI = new OpenAI();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse){
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Assuming the file is available under the 'file' key
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      // Save the file temporarily
      const filePath = path.join('/tmp', file.newFilename);  // Use 'newFilename' for formidable v2
      const fileStream = fs.createWriteStream(filePath);
      fs.createReadStream(file.filepath).pipe(fileStream);

      await new Promise<void>((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });

      try {
        // Send the file to OpenAI for transcription
        const transcription = await openAI.audio.transcriptions.create({
          file: fs.createReadStream(filePath),
          model: "whisper-1",
        });

        // Clean up: delete the temporary file
        fs.unlinkSync(filePath);

        // Respond with the transcription result
        res.status(200).json(transcription);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: `OpenAI Error: ${(error as Error).message}` });
      }
    });
  };