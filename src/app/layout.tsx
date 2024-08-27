import type { Metadata } from "next";
import "./globals.css";
import "../style/editor.css"

import "../style/editor-theme.css"

import { EditorStateProvider } from "../context/EditorStateContext";
import { NextUIProvider } from "@nextui-org/react";
import Footer from "@/components/footer/Footer";
import { Providers } from "./providers";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

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
    <html lang="en" suppressHydrationWarning>
      <body className="text-black bg-white dark:bg-slate-900">
        <Providers>
          <NextUIProvider>
            <EditorStateProvider>
              <ThemeSwitcher/>
              {children}
              <Footer />
            </EditorStateProvider>
          </NextUIProvider>
        </Providers>
      </body>
    </html>
  );
}
