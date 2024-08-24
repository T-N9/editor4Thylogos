import type { Metadata } from "next";
import "./globals.css";
import "../style/editor.css"

import "../style/editor-theme.css"

import { EditorStateProvider } from "../context/EditorStateContext";
import { NextUIProvider } from "@nextui-org/react";
import NavBar from "@/components/navigation/NavBar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "TN Lexical Editor",
  description: "A custom editor modified on top of Lexical Editor of Meta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-black">
        <NextUIProvider>
          <EditorStateProvider>
            {children}
            <Footer/>
          </EditorStateProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
