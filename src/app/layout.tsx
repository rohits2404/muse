import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Muse",
    description:
        "An AI Design Agent That Turns A Single Prompt Into A Complete, Multi-Screen App Design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" suppressHydrationWarning className={roboto.variable}>
            <body className="h-screen w-full antialiased">{children}</body>
        </html>
    );
}
