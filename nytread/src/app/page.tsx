"use client";
import { useState, useEffect, use } from "react";

export default function Home() {
  const [isFetching, setIsFetching] = useState(false);
  const [text, setText] = useState(""); // State to store the input text

  const opening = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/api/openAI/opening", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("There was an error fetching the audio:", error);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    opening();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-500">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">NYT Read</h1>
        <p className="text-white text-center">
          A tool to help you read the New York Times.
        </p>
      </div>
    </main>
  );
}
