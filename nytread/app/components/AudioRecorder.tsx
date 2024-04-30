// components/AudioRecorder.tsx

import { useReactMediaRecorder } from "react-media-recorder";

interface AudioRecorderProps {
  onBlobReady: (blob: Blob) => void;
}

const AudioRecorder = ({ onBlobReady }: AudioRecorderProps) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      onStop: (blobUrl, blob) => {
        onBlobReady(blob);
      },
    });

  // Expose controls to start/stop recording externally if needed
  return { status, startRecording, stopRecording, mediaBlobUrl };
};

export default AudioRecorder;
