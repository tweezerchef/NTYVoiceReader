"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import openerLoading from "../public/opener-loading.json";
import { useReactMediaRecorder } from "react-media-recorder";

export default function LoginPage() {
  const [audioUrl, setAudioUrl] = useState<string>("/login.mp3");
  const [animate, setAnimate] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    // Toggle recording state
    if (!isRecording) {
      audioRef.current?.pause();
      setAudioUrl("/startRecording.mp3");
      audioRef.current?.play();
      startRecording();
      setIsRecording(true);
    } else {
      stopRecording();
      setAudioUrl("/recordingEnded.mp3");
      audioRef.current?.play();
    }
  };

  const handleAudioBlob = async (blob: Blob) => {
    setIsRecording(false); // Reset recording state
    setAnimate(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64data = reader.result as string;

      try {
        const response = await fetch("/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ audioBase64: base64data }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data, "data");
        if (data.isValid) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error processing audio:", error);
      }
    };
    reader.readAsDataURL(blob);
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      onStop: (blobUrl, blob) => {
        handleAudioBlob(blob);
      },
    });

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
      <div className="bg-slate-500 h-screen w-screen" onClick={handleClick}>
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <Lottie
            animationData={openerLoading}
            play={animate}
            style={{ width: "90vw", height: "90vh" }}
            loop={true}
          />
          <audio ref={audioRef} src={audioUrl} autoPlay hidden />
        </div>
      </div>
    </main>
  );
}
