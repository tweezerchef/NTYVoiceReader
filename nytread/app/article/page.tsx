"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useArticleData } from "../contexts/ArticleContext";
// import { RecordAudioSection } from "./components/RecordAudioSection";

export default function Article() {
  const { article } = useArticleData();
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert Base64 audio data to blob URLs
  const audioURL = useMemo(() => {
    if (article.audio) {
      return URL.createObjectURL(
        new Blob([Buffer.from(article.audio, "base64")], { type: "audio/mp3" })
      );
    }
  }, [article.audio]);

  useEffect(() => {
    const audioElem = audioRef.current;
    if (audioElem && audioURL) {
      audioElem.src = audioURL;
      audioElem.load();
      if (!isRecording) {
        audioElem
          .play()
          .catch((err) => console.error("Error playing audio:", err));
      }
    }
  }, [audioURL, isRecording]);

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
