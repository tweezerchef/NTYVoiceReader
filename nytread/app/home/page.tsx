"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Lottie from "react-lottie-player";
import openerLoading from "../../public/opener-loading.json";

const RecordAudio = dynamic(
  () => import("./components/RecordAudio").then((mod) => mod.RecordAudio),
  {
    ssr: false,
  }
);
export default function HomePage() {
  //using state for audioURL in case need to change in future
  const [audioUrl, setAudioUrl] = useState<string>("/NYTOpening.mp3");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      audioRef.current?.pause();
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  useEffect(() => {
    const playAudio = async () => {
      if (!isRecording && initialLoad && audioRef.current) {
        try {
          await audioRef.current.play();
          setInitialLoad(false);
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    };
    playAudio();
  }, [isRecording, initialLoad]);

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
        <audio ref={audioRef} src={audioUrl} autoPlay hidden />
        <RecordAudio
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </main>
  );
}
