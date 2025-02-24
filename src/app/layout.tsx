import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/reduxProvider";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emerge-X Client Admin",
  description: "Emerge-X Client Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-custom-gradient">
        <ReduxProvider>
        <Toaster />
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
