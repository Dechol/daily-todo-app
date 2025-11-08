import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GuestInit from "@/components/GuestInit";
import { UserProvider, useUser } from "@/context/UserContext";
import Nav from "@/components/Nav";
import { TodoProvider } from "@/context/TodoContext";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        
        <UserProvider >
          <TodoProvider>

            <Nav />
            {children}

          </TodoProvider>
        </UserProvider>
      </body>
    </html>
  );
}
