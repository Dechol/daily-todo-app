import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GuestInit from "@/components/GuestInit";
import { UserProvider, useUser } from "@/context/UserContext";
import Nav from "@/components/Nav";
import { TodoProvider } from "@/context/TodoContext";
import Sidebar from "@/components/Sidebar";
import { UIProvider } from "@/context/UiContext";
import UserMenu from "@/components/UserMenu";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-gray-50`} >
        
        <UserProvider >
          <TodoProvider>
            <UIProvider >

              <Sidebar />

              <div className="flex-1 flex flex-col border-l">
                
                {/* Top Bar */}
                <header className="h-14 flex items-center justify-end px-4 border-b">
                  <UserMenu />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
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
