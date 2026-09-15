import FitoraSpinner from "@/components/ui/FitoraSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans">
      {/* Monochrome Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Official FITORA Dual-Ring Brand Spinner */}
        <FitoraSpinner size="lg" label="LOADING FITORA..." />
      </div>
    </div>
  );
}
