"use server"
import OpenAI from "openai";


const openai = new OpenAI();
export const openAITextToAudio = async (text: string) => {

    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
}