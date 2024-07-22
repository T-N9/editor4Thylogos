import type { Metadata } from "next";
import "./globals.css";
import "../style/editor.css"

import "../style/editor-theme.css"

import { EditorStateProvider } from "../context/EditorStateContext";

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
        <EditorStateProvider>
          {children}
        </EditorStateProvider>
      </body>
    </html>
  );
}
