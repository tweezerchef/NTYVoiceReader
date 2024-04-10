"use client";
import { useState, useEffect, useRef, use } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string>("/NYTOpening.mp3");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    const playAudioOpen = () => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    };

    if (!isRecording) {
      playAudioOpen();
    }
  }, [audioUrl, isRecording]);

  useEffect(() => {
    const startRecording = async () => {
      setIsRecording(true);
      setRecordedChunks([]);
      if (!navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia not supported");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
      setIsRecording(false);
      mediaRecorderRef.current?.stop();

      // Combine the audio chunks into a single Blob
      const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play the recorded audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Error playing recorded audio:", error);
        });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "r") {
        event.preventDefault();
        if (isRecording) {
          stopRecording();
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          startRecording();
        }
      } else if (event.key === "p") {
        event.preventDefault(); // Prevent the default backspace action
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };

    window.addEventListener("keypress", handleKeyDown);
    return () => {
      window.removeEventListener("keypress", handleKeyDown);
    };
  }, [isRecording, recordedChunks]);

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
