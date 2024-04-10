import { useState } from "react";
import { useRouter } from "next/router";

const AigenComp1 = () => {
  const [text, setText] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    const res = await fetch("home/api/textToSpeech", {
      method: "POST",
      body: text,
    });

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();

    setIsFetching(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-red-500 flex flex-col items-center justify-center">
      <p className="text-white text-lg">
        Please type what words you would like converted to speech
      </p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border-2 border-white p-2 rounded-md mt-4"
      />
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-white text-red-500 rounded-md px-4 py-2 mt-4"
      >
        {isFetching ? "Fetching" : "Get Audio"}
      </button>
    </div>
  );
};

export default AigenComp1;
