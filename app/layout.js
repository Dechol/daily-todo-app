import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GuestInit from "@/components/GuestInit";
import { UserProvider, useUser } from "@/context/UserContext";
import Nav from "@/components/Nav";
import { TodoProvider } from "@/context/TodoContext";
import Sidebar from "@/components/Sidebar";
import { UIProvider } from "@/context/UiContext";

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
            <UIProvider >

              <Nav />
              <div className="flex h-[calc(100vh-60px)]" >

                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">

                  {children}
                </main>
                
              </div>

            </UIProvider>
          </TodoProvider>
        </UserProvider>
      </body>
    </html>
  );
}
