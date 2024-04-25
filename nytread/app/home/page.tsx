"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const RecordAudio = dynamic(
  () => import("./components/RecordAudio").then((mod) => mod.RecordAudio),
  {
    ssr: false,
  }
);
export default function HomePage() {
  const [audioUrl, setAudioUrl] = useState<string>("/NYTOpening.mp3");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    };
    playAudio();
  }, [audioRef]);

  return (
    <main className="bg-slate-500">
      <div className="bg-slate-500 h-screen w-screen">
        <button className="w-svw h-svh focus:outline-none">
          <img src="/bigButton.png" alt="Record" />
          <audio ref={audioRef} src={audioUrl} autoPlay />
          <RecordAudio
            direction="section"
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </button>
      </div>
    </main>
  );
}
