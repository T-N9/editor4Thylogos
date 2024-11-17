import type { Metadata } from "next";
import "./globals.css";
import "../style/editor.css"

import "../style/editor-theme.css"

import { ViewTransitions } from 'next-view-transitions'
import Footer from "@/components/footer/Footer";
import { Providers } from "./providers";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Script from 'next/script';

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
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Adsense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-2340030299315656" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5KMRHWRQ7"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Y5KMRHWRQ7');
              `,
          }}
        />

         {/* Google Adsense Script */}
         <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2340030299315656"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <Script
            id="adsense-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({});
              `,
            }}
          />
      </head>
        <body className="text-black bg-white dark:bg-slate-900">
          <Providers>
            <ThemeSwitcher />
            <div className="mb-14"></div>
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
