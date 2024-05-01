"use client";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";

interface AudioRecorderProps {
  onBlobReady: (blob: Blob) => void; // Assuming 'blob' should be of type Blob
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder").then((mod) => mod.ReactMediaRecorder),
  { ssr: false }
);

export const AudioRecorder = ({
  onBlobReady,
  isRecording,
  setIsRecording,
}: AudioRecorderProps) => {
  const recordingControl = useRef({
    startRecording: () => {},
    stopRecording: () => {},
  });

  const handleStopRecording = (blobUrl: string, blob: Blob) => {
    onBlobReady(blob);
  };

  useEffect(() => {
    if (isRecording) {
      recordingControl.current.startRecording();
    } else {
      recordingControl.current.stopRecording();
      setIsRecording(false);
    }
  }, [isRecording, setIsRecording]);

  return (
    <ReactMediaRecorder
      audio
      onStop={handleStopRecording}
      render={({ startRecording, stopRecording }) => {
        recordingControl.current.startRecording = startRecording;
        recordingControl.current.stopRecording = stopRecording;
        return null; // Render nothing, controls are managed through refs
      }}
    />
  );
};
