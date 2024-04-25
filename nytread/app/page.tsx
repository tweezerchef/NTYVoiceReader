"use client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  function handleClick() {
    redirect("/home");
  }
  return (
    <div className="container mx-auto p-0">
      <Link href="/home">
        <button>
          <Image src="/bigButton.png" alt="Record" fill={true} />
        </button>
      </Link>
    </div>
  );
}
