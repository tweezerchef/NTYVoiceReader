"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import openerLoading from "../public/opener-loading.json";
import { useReactMediaRecorder } from "react-media-recorder";

export default function LoginPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    // Toggle recording state
    if (!isRecording) {
      startRecording();
      setIsRecording(true);
    } else {
      stopRecording();
    }
  };

  const handleAudioBlob = async (blob: Blob) => {
    setIsRecording(false); // Reset recording state
    const reader = new FileReader();
    reader.onload = async () => {
      const base64data = reader.result as string;

      try {
        const response = await fetch("/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Necessary for cookies to be set if the API is on a different origin
          body: JSON.stringify({ audioBase64: base64data }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data, "data");
        if (data.isValid) {
          // Change this line
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
      video: false, // Set to false if only audio is needed
      onStop: (blobUrl, blob) => {
        // You can handle API call here after recording stops
        handleAudioBlob(blob);
      },
    });

  return (
    <main>
      <div className="bg-slate-500 h-screen w-screen" onClick={handleClick}>
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <Lottie
            animationData={openerLoading}
            play={isPlaying}
            style={{ width: "90vw", height: "90vh" }}
            loop={true}
          />
        </div>
        <p>{status}</p>
      </div>
    </main>
  );
}
