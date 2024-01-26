import { RecordAudio } from "./components/RecordAudio";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-500">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">NYT Read</h1>
        <p className="text-white text-center">
          A tool to help you read the New York Times.
        </p>
        <RecordAudio />
      </div>
    </main>
  );
}
