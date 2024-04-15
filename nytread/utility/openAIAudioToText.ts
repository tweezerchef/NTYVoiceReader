
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

export async function openAIAudioToText(audioPath: string): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: "whisper-1",
  });

  console.log(transcription.text);
  return transcription.text;
}