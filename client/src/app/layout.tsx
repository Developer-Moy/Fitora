import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitora",
  description: "Fitora Fitness Planner Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#12141a",
              color: "#fff",
              border: "1px solid #232836",
              borderRadius: "14px",
              fontSize: "13px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#12141a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#12141a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
