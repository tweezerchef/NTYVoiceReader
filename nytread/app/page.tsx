"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import openerLoading from "../public/opener-loading.json";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setIsPlaying(true);
    setTimeout(() => {
      router.push("/home");
    }, 3000);
  };

  return (
    <div className="bg-slate-500 h-screen w-screen" onClick={handleClick}>
      <div className="aspect-w-1 aspect-h-1 w-full h-full">
        <Lottie
          animationData={openerLoading}
          play={isPlaying}
          style={{ width: "90vw", height: "90vh" }}
          loop={true}
        />
      </div>
    </div>
  );
}
