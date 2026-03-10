"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/theme";
import { AppProvider } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <AppProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </AppProvider>
        </ClerkProvider>
    );
}

