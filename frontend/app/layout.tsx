import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager - Collaborative Task Management",
  description: "Real-time collaborative task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`} suppressHydrationWarning>
        <AuthProvider>
          <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-[2000px]">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
          
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
              <p> 2024 Task Manager. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
