import { openAIAudioToText } from "../../../utility/openAIAudioToText";
import { isVoiceLoginValid } from "../../../utility/isTextSimilar";
import { promises as fs } from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const login = process.env.LOGIN as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

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

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = jwt.sign({ user: login }, JWT_SECRET, { expiresIn: "1h" });

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Set-Cookie",
      `token=${token}; SameSite=Strict; Path=/;`
    );

    return new Response(JSON.stringify({ isValid }), { headers });
  } catch (error) {
    console.error("Error handling the request:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
