"use client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default function Page() {
  function handleClick() {
    redirect("/home");
  }
  return (
    <div className="container mx-auto p-4">
      <Link href="/home">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go Home
        </button>
      </Link>
    </div>
  );
}
