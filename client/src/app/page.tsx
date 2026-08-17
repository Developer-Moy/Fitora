import AiTrainerChat from "@/components/AiTrainerChat";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center space-y-1 mb-2">
        <h1 className="text-3xl font-extrabold tracking-wider">
          FITORA <span className="text-red-500">AI TRAINER</span>
        </h1>
        <p className="text-sm text-white/50">
          Interactive AI Fitness Assistant & Realtime Chat Demo
        </p>
      </div>

      {/* Render AI Trainer Chat Component */}
      <AiTrainerChat />
    </main>
  );
}
