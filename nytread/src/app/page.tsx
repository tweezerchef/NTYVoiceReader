// Home.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { RecordAudio } from "./components/RecordAudio";
export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string>("/NYTOpening.mp3");
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "r") {
        event.preventDefault();
        toggleRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleRecording]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-500">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">NYT Read</h1>
        <audio src={audioUrl} controls />
        <RecordAudio
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>
    </main>
  );
}
