"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const RecordAudio = dynamic(
  () => import("./components/RecordAudio").then((mod) => mod.RecordAudio),
  {
    ssr: false,
  }
);
export default function HomePage() {
  const [audioUrl, setAudioUrl] = useState<string>("/NYTOpening.mp3");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleRecording = useCallback(() => {
    setIsClicked(true);
    if (!isRecording) {
      audioRef.current?.pause();
    }
    setIsRecording(!isRecording);
    setTimeout(() => setIsClicked(false), 200);
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
      if (!isRecording && initialLoad && audioRef.current) {
        try {
          await audioRef.current.play();
          setInitialLoad(false); // Prevent future playback
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    };
    playAudio();
  }, [isRecording, initialLoad]);

  return (
    <main>
      <div className="bg-slate-500 h-screen w-screen">
        <button
          className="w-48 h-48 focus:outline-none"
          onClick={toggleRecording}
        >
          <div className="aspect-w-1 aspect-h-1 w-full h-full">
            <Image
              src="/bigButton.png"
              alt="Record"
              fill={true}
              objectFit="contain"
              className={`w-full h-full ${isClicked ? "animate-click" : ""}`}
            />
          </div>
          <audio ref={audioRef} src={audioUrl} autoPlay hidden />
          <RecordAudio
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </button>
      </div>
    </main>
  );
}
