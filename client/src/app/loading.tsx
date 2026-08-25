export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans">
      {/* Monochrome Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Signature FITORA Monochrome Dual Spinner Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-white animate-spin" />
          <div className="absolute w-10 h-10 rounded-full border-2 border-white/20 border-b-white/80 animate-spin flex items-center justify-center" />
          <img
            src="/logo.svg"
            alt="Fitora logo"
            className="w-5 h-5 object-contain filter brightness-0 invert animate-pulse"
          />
        </div>

        {/* Loading Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black uppercase tracking-widest text-gray-200 backdrop-blur-md animate-pulse shadow-xl">
          <span>LOADING FITORA...</span>
        </div>
      </div>
    </div>
  );
}
