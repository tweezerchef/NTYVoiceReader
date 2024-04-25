"use client";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArticleData } from "../../contexts/ArticleContext";
interface Article {
  index: number;
  title: string;
  abstract: string;
  byline: string;
  url: string;
}

interface RecordAudioProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  articles: Article[];
}

const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder").then((mod) => mod.ReactMediaRecorder),
  { ssr: false }
);

export const RecordAudioSection = ({
  isRecording,
  setIsRecording,
  articles,
}: RecordAudioProps) => {
  const [recording, setRecording] = useState<string>("");
  const { setArticle } = useArticleData();
  const router = useRouter();

  const recordingControl = useRef({
    startRecording: () => {},
    stopRecording: () => {},
  });

  const handleStopRecording = async (blobUrl: string, blob: Blob) => {
    setRecording(blobUrl);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;

      try {
        const response = await fetch("/openAI/api/article/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioBase64: base64data, articles }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await setArticle(data);
        router.push("/article");
      } catch (error) {
        console.error("Error sending audio to server:", error);
      }
    };
  };
  useEffect(() => {
    if (isRecording) {
      recordingControl.current.startRecording();
    } else {
      recordingControl.current.stopRecording();
    }
  }, [isRecording]);

  return (
    <ReactMediaRecorder
      audio
      onStop={handleStopRecording}
      render={({ status, startRecording, stopRecording }) => {
        // Bind the recording control functions to the ref object
        recordingControl.current.startRecording = startRecording;
        recordingControl.current.stopRecording = stopRecording;

        return null;
      }}
    />
  );
};
