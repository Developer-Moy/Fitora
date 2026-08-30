import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-16 sm:pt-20">{children}</main>
    </div>
  );
};

export default MainLayout;
