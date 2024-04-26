"use client";
import { useState, useEffect, useRef } from "react";
import { useArticleData } from "../contexts/ArticleContext";
import { openAITextToAudio } from "./openAITextToAudio";
import Lottie from "react-lottie-player";
import openerLoading from "../../public/opener-loading.json";

export default function Article() {
  const { article } = useArticleData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation, setAnimation] = useState(true);

  // Split text into chunks
  useEffect(() => {
    if (article && typeof article.articleText === "string") {
      const chunkSize = 1000;
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
        audioElem
          .play()
          .then(() => {
            setIsPlaying(true);
            setAnimation(false);
          })
          .catch(console.error);
      }

      const handleAudioEnd = () => {
        setIsPlaying(false);
        setAnimation(false);
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
    <main>
      <div className="bg-slate-500 h-screen w-screen">
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <Lottie
            animationData={openerLoading}
            play={animation}
            style={{ width: "90vw", height: "90vh" }}
            loop={true}
          />
        </div>
        <audio ref={audioRef} hidden />
      </div>
    </main>
  );
}
