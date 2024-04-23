"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useArticleData } from "../contexts/ArticleContext";
import { openAITextToAudio } from "./openAITextToAudio";
// import { RecordAudioSection } from "./components/RecordAudioSection";

export default function Article() {
  const { article } = useArticleData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);

  const processChunk = async (text: string) => {
    const base64Audio = await openAITextToAudio(text);
    const audioBlob = await fetch(`data:audio/mp3;base64,${base64Audio}`).then(
      (res) => res.blob()
    );
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(console.error);
    }
  };

  useEffect(() => {
    // Check if article text is available and is a string
    console.log(article);
    if (article && typeof article.articleText === "string") {
      console.log(article.articleText, "articleText");
      const chunkSize = 1000; // Define chunk size for splitting the text
      const regex = new RegExp(`.{1,${chunkSize}}`, "g");
      const textChunks = article.articleText.match(regex) || [];
      console.log(textChunks);
      setChunks(textChunks);
    }
  }, [article]);
  useEffect(() => {
    if (currentChunkIndex < chunks.length) {
      processChunk(chunks[currentChunkIndex]);
    }
  }, [currentChunkIndex, chunks]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-500">
      <h1 className="text-4xl font-bold text-white mb-4">
        NYT Reader: Articles Audio
      </h1>
      <audio
        ref={audioRef}
        controls
        autoPlay
        onEnded={() => setCurrentChunkIndex(currentChunkIndex + 1)}
      />
      {/* <RecordAudioSection
        articles={articles}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      /> */}
    </main>
  );
}
