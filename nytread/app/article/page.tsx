"use client";
import { useState, useEffect, useRef } from "react";
import { useArticleData } from "../contexts/ArticleContext";
// import { RecordAudioSection } from "./components/RecordAudioSection";

export default function Section() {
  const { article } = useArticleData();
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert Base64 audio data to blob URLs
  const audioUrl = URL.createObjectURL(
    new Blob([Buffer.from(article.audio, "base64")], { type: "audio/mp3" })
  );

  // Change the source and play the next audio when index changes
  useEffect(() => {
    const audioElem = audioRef.current;
    if (audioElem && article.audio) {
      audioElem.src = article.audio;
      if (!isRecording) {
        audioElem
          .play()
          .catch((err) => console.error("Error playing audio:", err));
      }
    }
  }, [article.audio, isRecording]);

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
      {/* <RecordAudioSection
        articles={articles}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      /> */}
    </main>
  );
}
