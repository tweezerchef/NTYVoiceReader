import { openAIAudioToText } from "../../../utility/openAIAudioToText";
import { isVoiceLoginValid } from "../../../utility/isTextSimilar";
import { promises as fs } from "fs";
import path from "path";



const login = process.env.LOGIN as string;

export const POST = async (req: Request) => {

  try {
    const body = await req.json();
    const audioBase64 = body.audioBase64;
    const buffer = Buffer.from(
      audioBase64.split(";base64,").pop() || "",
      "base64"
    );

    const tempFilePath = path.join("/tmp", `audio-${Date.now()}.mp3`);
    await fs.writeFile(tempFilePath, buffer);

    const transcription = await openAIAudioToText(tempFilePath);
    await fs.unlink(tempFilePath);
    console.log(transcription, "transcribedLogin");

    const isValid: boolean = await isVoiceLoginValid(transcription, login, 3);
    console.log(isValid, "isValid");

    return new Response(JSON.stringify({ isValid }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error handling the request:', error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
