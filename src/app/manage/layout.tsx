import type { Metadata } from "next";
import NavBar from "@/components/navigation/NavBar";

import { Toaster } from 'sonner'

export const metadata: Metadata = {
    title: "TN Lexical Editor",
    description: "A custom editor modified on top of Lexical Editor of Meta.",
};

export default function ManageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <NavBar />
            {children}
            <Toaster />
        </section>
    );
}
