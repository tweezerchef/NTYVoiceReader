"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import BigButton from "../public/BigButton.svg";
import Lottie from "react-lottie-player";
import openerLoading from "../public/opener-loading.json";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = () => {
    setIsPlaying(!isPlaying); // Toggle play state
  };

  return (
    <div className="bg-slate-500 h-screen w-screen">
      <Link href="/home">
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <button className="focus:outline-none" onClick={handleClick}>
            <Lottie
              animationData={openerLoading} // Use the correctly imported animation data
              play={isPlaying}
              style={{ width: "90vw", height: "90vh" }}
              loop={false}
              onClick={() => setIsPlaying(true)}
            />
          </button>
        </div>
      </Link>
    </div>
  );
}
