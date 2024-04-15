"use client";
import { useState, useEffect, useRef } from "react";
import { useSectionData } from "../contexts/SectionContext";
import { RecordAudioSection } from "./components/RecordAudioSection";

export default function Section() {
  const { articles } = useSectionData();
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert Base64 audio data to blob URLs
  const audioUrls = articles.map((article) =>
    URL.createObjectURL(
      new Blob([Buffer.from(article.audio, "base64")], { type: "audio/mp3" })
    )
  );

  useEffect(() => {
    const audioElem = audioRef.current;
    if (!audioElem) return;

    const handleAudioEnd = () => {
      const nextIndex = currentAudioIndex + 1;
      if (nextIndex < audioUrls.length) {
        setCurrentAudioIndex(nextIndex); // Automatically increment to next audio
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

  // // Change the source and play the next audio when index changes
  // useEffect(() => {
  //   if (!audioRef.current) return;
  //   if (audioUrls && audioUrls[currentAudioIndex]) {
  //     audioRef.current.src = audioUrls[currentAudioIndex];
  //     audioRef.current
  //       .play()
  //       .catch((err) => console.error("Error playing audio:", err));
  //   }
  // }, [currentAudioIndex, audioUrls]);
  useEffect(() => {
    if (isRecording && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isRecording]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-500">
      <h1 className="text-4xl font-bold text-white mb-4">
        NYT Reader: Articles Audio
      </h1>
      <audio ref={audioRef} controls autoPlay />
      <RecordAudioSection
        articles={articles}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
    </main>
  );
}
