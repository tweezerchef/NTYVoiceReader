"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSectionData } from "../contexts/SectionContext";
import { RecordAudioSection } from "./components/RecordAudioSection";
import Lottie from "react-lottie-player";
import openerLoading from "../../public/opener-loading.json";

export default function Section() {
  const { articles } = useSectionData();
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldPlayAfterRecording, setShouldPlayAfterRecording] =
    useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Convert Base64 audio data to blob URLs
  const audioUrls = articles.map((article) =>
    URL.createObjectURL(
      new Blob([Buffer.from(article.audio, "base64")], { type: "audio/mp3" })
    )
  );
  const toggleRecording = useCallback(() => {
    setIsClicked(true);
    if (isRecording) {
      setShouldPlayAfterRecording(false);
    } else {
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

    // Event listener for when the audio finishes playing
    audioElem.addEventListener("ended", handleAudioEnd);

    // Check to play audio only when it's not recording and when the index changes
    if (
      !isRecording &&
      shouldPlayAfterRecording &&
      audioUrls[currentAudioIndex]
    ) {
      audioElem.src = audioUrls[currentAudioIndex];
      audioElem
        .play()
        .catch((err) => console.error("Error playing audio:", err));
    }

    return () => {
      audioElem.removeEventListener("ended", handleAudioEnd);
    };
  }, [currentAudioIndex, audioUrls, isRecording, shouldPlayAfterRecording]);

  return (
    <main>
      <div className="bg-slate-500 h-screen w-screen" onClick={toggleRecording}>
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <Lottie
            animationData={openerLoading}
            play={isPlaying}
            style={{ width: "90vw", height: "90vh" }}
            loop={true}
          />
        </div>
        <audio ref={audioRef} autoPlay hidden />
        <RecordAudioSection
          articles={articles}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </main>
  );
}
