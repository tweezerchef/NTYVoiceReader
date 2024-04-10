import { opening } from "../../utility/openAI";

export const OpeningAudio = async () => {
  try {
    const base64Audio = await opening();
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);

    return <audio src={audioUrl} controls autoPlay />;
  } catch (error) {
    console.error("Error fetching audio:", error);
    return <p>Failed to load audio</p>;
  }
};
