import fs from "fs";
import path from "path";
import { openAIAudioToText } from "../../../../utility/openAIAudioToText";
import leven from "leven";
import { nyTimesArticleParser } from "../../../../utility/articleScraper";
import { NextApiResponse } from "next";

interface Article {
  index: number;
  title: string;
  abstract: string;
  byline: string;
  url: string;
}
interface OnErrorParams {
  error: Error;
}
interface OnSuccessParams {
  model: string;
  buffer: Buffer;
}
enum Text2SpeechVoiceEnum {
  alloy = "alloy",
  // add other enum values as needed
}
interface Text2SpeechParams {
  res: NextApiResponse;
  onSuccess: (params: OnSuccessParams) => void;
  onError: (params: OnErrorParams) => void;
  model?: string;
  voice?: Text2SpeechVoiceEnum;
  input: string;
  speed?: number;
}

const selections = [
  "home",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

async function getClosestArticleIndex(transcription: string): Promise<number> {
  let closestMatchIndex = -1;
  let smallestDistance = Infinity;

  for (let i = 0; i < selections.length; i++) {
    const distance = leven(transcription.toLocaleLowerCase(), selections[i]);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestMatchIndex = i;
    }
  }
  return closestMatchIndex;
}

export const POST = async (
  req: Request,
  res: NextApiResponse
): Promise<any> => {
  try {
    const body = await req.json();
    const audioBase64 = body.audioBase64;
    const buffer = Buffer.from(
      audioBase64.split(";base64,").pop() || "",
      "base64"
    );

    const tempFilePath = path.join("/tmp", `audio-${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, buffer);

    const transcription = await openAIAudioToText(tempFilePath);
    fs.unlinkSync(tempFilePath);

    const articleIndex = await getClosestArticleIndex(transcription);
    if (articleIndex === -1) {
      return new Response(
        JSON.stringify({ error: "No matching article found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const articles: Article[] = body.articles;
    const selectedArticleURL = articles[articleIndex].url;
    console.log(selectedArticleURL);

    const articleText = await nyTimesArticleParser(selectedArticleURL);
    return new Response(JSON.stringify({ articleText }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
