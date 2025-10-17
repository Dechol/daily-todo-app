import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GuestInit from "@/components/GuestInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dailys",
  description: "Your daily todo list",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <header className="flex justify-between items-center p-4 bg-gray-50">
          {/* Left side: anonId (dev only) */}
          <div id="anon-id" className="text-xs text-gray-500 font-mono"></div>

          {/* Right side: Sign In */}
          <Link
            href="/signin"
            className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-blue-400 transition"
          >
            Sign In
          </Link>
        </header>
        <GuestInit />

        {children}
      </body>
    </html>
  );
}
