"use client";
import dynamic from "next/dynamic";

// Try normal dynamic import. If it fails due to window/localStorage, we'll know.
const AppClient = dynamic(() => import("./AppClient"), { ssr: false });

export default function Home() {
    return (
        <main>
            <AppClient />
        </main>
    );
}
