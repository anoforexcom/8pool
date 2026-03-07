import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "pool8.live - Premium 8 Ball Pool Game",
    description: "Play premium 8 Ball Pool with global rankings, tournaments, and achievements. Free to start!",
    keywords: ["pool", "8 ball pool", "billiards", "pool online", "free pool game", "pool table", "8ball", "mind games"],
    authors: [{ name: "pool8.live" }],
    robots: "index, follow",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        title: "Pool8Live",
        statusBarStyle: "black-translucent",
    },
    openGraph: {
        type: "website",
        url: "https://pool8.live/",
        title: "pool8.live - Premium 8 Ball Pool Game",
        description: "Play premium 8 Ball Pool with global rankings, tournaments, and achievements. Free to start!",
        images: [{ url: "https://pool8.live/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "pool8.live - Premium 8 Ball Pool Game",
        description: "Play premium 8 Ball Pool with global rankings, tournaments, and achievements. Free to start!",
        images: ["https://pool8.live/og-image.png"],
    },
};

export const viewport: Viewport = {
    themeColor: "#4f46e5",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
