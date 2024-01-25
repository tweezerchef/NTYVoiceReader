"use client";

import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

export const RecordAudio = () => {
  const [recording, setRecording] = useState<string>("");
  const [transcription, setTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.mp3");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTranscription(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Recorder</h1>

      <ReactMediaRecorder
        audio
        onStop={(blobUrl, blob) => {
          setRecording(blobUrl);
          sendAudioToServer(blob);
        }}
        render={({ status, startRecording, stopRecording }) => (
          <>
            <p>Status: {status}</p>
            <button
              className={`px-4 py-2 rounded ${
                isRecording ? "bg-red-500" : "bg-blue-500"
              } text-white`}
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                  setIsRecording(false);
                } else {
                  startRecording();
                  setIsRecording(true);
                }
              }}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            {recording && <audio src={recording} controls />}

            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">Transcription:</h2>
              <pre className="p-4 bg-gray-200 rounded">{transcription}</pre>
            </div>
          </>
        )}
      />
    </div>
  );
};
