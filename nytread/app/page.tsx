"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="bg-slate-500 h-screen w-screen">
      <Link href="/home">
        <div className="aspect-w-1 aspect-h-1 w-full h-full">
          <button
            className="w-48 h-48 focus:outline-none"
            onClick={() => setIsClicked(!isClicked)}
          >
            <Image
              src="/bigButton.png"
              alt="Record"
              fill={true}
              objectFit="contain"
              className={`w-full h-full ${isClicked ? "animate-click" : ""}`}
            />
          </button>
        </div>
      </Link>
    </div>
  );
}
