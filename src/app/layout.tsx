import type { Metadata } from "next";
import "../style/editor.css"
import "./globals.css";
import "../style/editor-theme.css"

import { EditorStateProvider } from "../context/EditorStateContext";
import NavBar from "@/components/navigation/NavBar";

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
      <body className="">
        <NavBar/>
        <EditorStateProvider>
          {children}
        </EditorStateProvider>
      </body>
    </html>
  );
}
