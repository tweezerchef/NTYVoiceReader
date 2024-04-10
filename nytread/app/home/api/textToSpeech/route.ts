
import OpenAI from "openai";
import fs from "fs"
import path from "path"

const openai = new OpenAI();

interface ThisReq {
    body: {
      text: string;
    };
  }
export async function GET(req: ThisReq) {
    const text = req.body.text || "Default text if none provided";

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
export async function POST(req: ThisReq) {
console.log(req.body, "req.body")
    try {
        if (req.body instanceof ReadableStream) {
            const reader = req.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder();
            const text = decoder.decode(result.value);

            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: text,
            });

            // Convert to buffer
            const buffer = Buffer.from(await mp3.arrayBuffer());
            const speechFile = path.resolve("./speech.mp3");
            await fs.promises.writeFile(speechFile, buffer);

            return new Response(buffer, {
                headers: {
                    'Content-Type': 'audio/mpeg'
                }
            });
        } else {
            throw new Error("Request body is not a ReadableStream.");
        }
    }catch (error) {
        const message = (error as Error).message; // Type assertion
        console.error(message);
        return new Response(JSON.stringify({ error: `Error: ${message}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
