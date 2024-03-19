"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null); // Reference to the audio element

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/openAI/api/opening");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const blob = await response.blob();
        setAudioUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("There was an error fetching the audio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, []);

  // Function to play audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // KeyPress Event Listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        playAudio();
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    // Clean up
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [audioUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-500">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">NYT Read</h1>
        <p className="text-white text-center">
          A tool to help you read the New York Times.
        </p>
        {isLoading ? (
          <div className="spinner">Loading...</div>
        ) : (
          <audio ref={audioRef} src={audioUrl} controls />
        )}
      </div>
    </main>
  );
}
