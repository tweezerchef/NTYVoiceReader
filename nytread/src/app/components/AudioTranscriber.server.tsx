"use server";

import { openAIAudioToText } from "../../../utility/openAIAudioToText";
import { RecordAudio } from "./RecordAudio"; // Assuming RecordAudio is your client component
import fs from "fs";

// ... (rest of your imports and setup)

export const AudioTranscriber = () => {
  const getTranscription = async (audioBase64: string) => {
    try {
      // Decode base64 to a buffer/file
      const audioBuffer = Buffer.from(audioBase64.split(",")[1], "base64");
      const audioPath = "/path/to/temp/audio/file"; // Make sure this path is writable
      fs.writeFileSync(audioPath, audioBuffer);

      const transcription = await openAIAudioToText(audioPath);
      fs.unlinkSync(audioPath); // Clean up the file after use
      return transcription;
    } catch (error) {
      console.error("Error getting transcription:", error);
      return "";
    }
  };

  return <RecordAudio getTranscription={getTranscription} />;
};
