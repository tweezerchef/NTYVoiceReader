"use client";

import React, { useState } from "react";

const IndexPage = () => {
  const [isFetching, setIsFetching] = useState(false);

  const handleButtonClick = async () => {
    setIsFetching(true);

    try {
      // Update the URL to the correct API endpoint
      const response = await fetch("/home/api/textToSpeech");
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

  return (
    <div className="container mx-auto text-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleButtonClick}
        disabled={isFetching}
      >
        {isFetching ? "Fetching..." : "Play Audio"}
      </button>
    </div>
  );
};

export default IndexPage;
