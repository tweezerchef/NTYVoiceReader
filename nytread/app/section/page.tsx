"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSectionData } from "../contexts/SectionContext";
import { RecordAudioSection } from "./components/RecordAudioSection";
import Image from "next/image";

export default function Section() {
  const { articles } = useSectionData();
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert Base64 audio data to blob URLs
  const audioUrls = articles.map((article) =>
    URL.createObjectURL(
      new Blob([Buffer.from(article.audio, "base64")], { type: "audio/mp3" })
    )
  );
  const toggleRecording = useCallback(() => {
    setIsClicked(true);
    if (!isRecording) {
      audioRef.current?.pause();
    }
    setIsRecording(!isRecording);
    setTimeout(() => setIsClicked(false), 200);
  }, [isRecording]);

  useEffect(() => {
    const audioElem = audioRef.current;
    if (!audioElem) return;

    const handleAudioEnd = () => {
      const nextIndex = currentAudioIndex + 1;
      if (nextIndex < audioUrls.length) {
        setCurrentAudioIndex(nextIndex);
      }
    };

    audioElem.addEventListener("ended", handleAudioEnd);

    return () => {
      audioElem.removeEventListener("ended", handleAudioEnd);
    };
  }, [currentAudioIndex, audioUrls.length]);

  // Change the source and play the next audio when index changes
  useEffect(() => {
    const audioElem = audioRef.current;
    if (audioElem && audioUrls[currentAudioIndex]) {
      audioElem.src = audioUrls[currentAudioIndex];
      if (!isRecording) {
        audioElem
          .play()
          .catch((err) => console.error("Error playing audio:", err));
      }
    }
  }, [currentAudioIndex, audioUrls, isRecording]);

  useEffect(() => {
    if (isRecording && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isRecording]);

  return (
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
        <audio ref={audioRef} autoPlay hidden />
        <RecordAudioSection
          articles={articles}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </button>
    </div>
  );
}
