"use client";
import { useState, useEffect, useRef } from "react";
import { useArticleData } from "../contexts/ArticleContext";
import { openAITextToAudio } from "./openAITextToAudio";

export default function Article() {
  const { article } = useArticleData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Split text into chunks
  useEffect(() => {
    if (article && typeof article.articleText === "string") {
      const chunkSize = 1000; // Define chunk size for splitting the text
      // Regex to split by spaces ensuring each chunk is as close to 1000 characters as possible without exceeding it
      const regex = new RegExp(`\\b.{1,${chunkSize}}\\b(\\s|$)`, "g");
      const textChunks = [];
      let match;
      while ((match = regex.exec(article.articleText)) !== null) {
        textChunks.push(match[0]);
      }
      setChunks(textChunks);
    }
  }, [article]);

  // Process each chunk to audio and store URLs incrementally
  useEffect(() => {
    const processChunksIncrementally = async () => {
      for (const chunk of chunks) {
        const base64Audio = await openAITextToAudio(chunk);
        const audioBlob = await fetch(
          `data:audio/mp3;base64,${base64Audio}`
        ).then((res) => res.blob());
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrls((prevUrls) => [...prevUrls, audioUrl]);
      }
    };

    if (chunks.length > 0) {
      processChunksIncrementally();
    }
  }, [chunks]);

  // Manage audio playback
  useEffect(() => {
    const audioElem = audioRef.current;
    if (audioUrls.length > currentChunkIndex && audioElem) {
      if (!audioElem.src || audioElem.src !== audioUrls[currentChunkIndex]) {
        audioElem.src = audioUrls[currentChunkIndex];
        audioElem.play().catch(console.error);
      }

      const handleAudioEnd = () => {
        setIsPlaying(false);
        setCurrentChunkIndex((prevIndex) => prevIndex + 1);
      };

      audioElem.onended = handleAudioEnd;

      return () => {
        audioElem.onended = null; // Cleanup on unmount or dependency change
      };
    }
  }, [audioUrls, currentChunkIndex]);

  // Ensure playback continues when possible
  useEffect(() => {
    const audioElem = audioRef.current;
    if (audioUrls.length > currentChunkIndex && audioElem && !isPlaying) {
      audioElem.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [audioUrls, currentChunkIndex, isPlaying]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-500">
      <h1 className="text-4xl font-bold text-white mb-4">
        NYT Reader: Articles Audio
      </h1>
      <audio ref={audioRef} controls />
    </main>
  );
}
