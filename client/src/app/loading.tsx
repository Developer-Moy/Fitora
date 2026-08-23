export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
        <div className="absolute w-10 h-10 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin flex items-center justify-center" />
        <img
          src="/logo.svg"
          alt="Fitora logo"
          className="w-5 h-5 object-contain animate-pulse"
        />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400 animate-pulse">
        Loading Fitora...
      </p>
    </div>
  );
}
