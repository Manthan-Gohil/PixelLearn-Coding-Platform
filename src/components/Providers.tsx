"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
    );
}
