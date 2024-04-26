"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSectionData } from "../../contexts/SectionContext";

interface RecordAudioProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder").then((mod) => mod.ReactMediaRecorder),
  { ssr: false }
);

export const RecordAudio = ({
  isRecording,
  setIsRecording,
  setIsPlaying,
}: RecordAudioProps) => {
  const { setArticles } = useSectionData();
  const router = useRouter();
  const recordingControl = useRef({
    startRecording: () => {},
    stopRecording: () => {},
  });

  useEffect(() => {
    if (isRecording) {
      recordingControl.current.startRecording();
    } else {
      recordingControl.current.stopRecording();
    }
  }, [isRecording]);

  const handleStopRecording = async (blobUrl: string, blob: Blob) => {
    setIsPlaying(true);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;

      try {
        const response = await fetch("/openAI/api/category/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioBase64: base64data }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
        router.push("/section");
      } catch (error) {
        console.error("Error sending audio to server:", error);
      }
    };
  };

  return (
    <ReactMediaRecorder
      audio
      onStop={handleStopRecording}
      render={({ startRecording, stopRecording }) => {
        recordingControl.current.startRecording = startRecording;
        recordingControl.current.stopRecording = stopRecording;
        return null;
      }}
    />
  );
};
