"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/lib/theme";
import { AppProvider } from "@/store";
import BadgeUnlockModal from "@/components/ui/BadgeUnlockModal";
import AppStatusToast from "@/components/ui/AppStatusToast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <AppProvider>
                <ThemeProvider>
                    {children}
                    <AppStatusToast />
                    <BadgeUnlockModal />
                </ThemeProvider>
            </AppProvider>
        </ClerkProvider>
    );
}

