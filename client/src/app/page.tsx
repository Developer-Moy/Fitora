import BmiCalculator from "@/components/BmiCalculator";

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold tracking-wider">FITORA</h1>
      
      <div className="flex w-full justify-end">
        <div className="w-[40%]">
          <BmiCalculator />
        </div>
      </div>
    </main>
  );
}
