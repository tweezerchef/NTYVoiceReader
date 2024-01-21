
import OpenAI from "openai";
import fs from "fs"
import path from "path"
const openai = new OpenAI();


export async function GET(req: Request) {
    const text = "Default text if none provided";

    try {
        // Generate speech from text
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        // Convert to buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const speechFile = path.resolve("./speech.mp3");
        await fs.promises.writeFile(speechFile, buffer);

        // Send the file in the response
        // Note: The buffer must be converted to a Uint8Array before returning
        return new Response(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg'
            }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: `Error generating speech` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};