import type { Metadata } from "next";
import "./globals.css";
import "../style/editor.css"

import "../style/editor-theme.css"

import { EditorStateProvider } from "../context/EditorStateContext";
import { NextUIProvider } from "@nextui-org/react";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "TN Notes | Capturing ideas and thoughts.",
  description: "Welcome to TN Notes! A tiny space of mine for capturing ideas and thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="/meta.png" />
      </head>
      <body className="text-black">
        <NextUIProvider>
          <EditorStateProvider>
            {children}
            <Footer />
          </EditorStateProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
