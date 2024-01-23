"use client";
import React, { useState } from "react";

const IndexPage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [text, setText] = useState(""); // State to store the input text

  const handleButtonClick = async () => {
    setIsFetching(true);
    console.log(text);

    try {
      const requestBody = JSON.stringify({ text });
      console.log(requestBody + "requestBody");

      const response = await fetch("/home/api/textToSpeech", {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });
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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-red-500 rounded shadow-md text-white">
        <div className="mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            placeholder="Please type what words you would like converted to speech"
          />
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={handleButtonClick}
            disabled={isFetching}
          >
            {isFetching ? "Fetching" : "Get Audio"}
          </button>
        </div>
        {/* Add error handling display here if needed */}
      </div>
    </div>
  );
};

export default IndexPage;
