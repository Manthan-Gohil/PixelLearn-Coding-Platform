"use client";

import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GlowOrbs from "../ui/GlowOrbs";
import FloatingParticles from "../ui/FloatingParticles";

// Dynamic import to avoid SSR issues with canvas
const MouseParticles = dynamic(() => import("../ui/MouseParticles"), {
    ssr: false,
    loading: () => null,
});

interface StandardLayoutProps {
    children: React.ReactNode;
    showNavbar?: boolean;
    showFooter?: boolean;
    particlesCount?: number;
    className?: string;
    containerClassName?: string;
    noContainer?: boolean;
    flowblockTheme?: boolean;
}

/**
 * StandardLayout provides a consistent shell for most pages in PixelLearn.
 * When flowblockTheme is true, it wraps in a pure black Flowblock-style theme
 * with interactive mouse particles in the background.
 */
export default function StandardLayout({
    children,
    showNavbar = true,
    showFooter = true,
    particlesCount = 20,
    className = "",
    containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    noContainer = false,
    flowblockTheme = false,
}: StandardLayoutProps) {
    if (flowblockTheme) {
        return (
            <main className={`min-h-screen flowblock-theme ${showNavbar ? "pt-18" : ""} ${className}`}>
                {/* Interactive Mouse-Following Particles */}
                <MouseParticles />

                {showNavbar && <Navbar flowblockMode />}

                {noContainer ? children : (
                    <div className={`relative ${containerClassName}`}>
                        {children}
                    </div>
                )}

                {showFooter && <Footer flowblockMode />}
            </main>
        );
    }

    return (
        <main className={`min-h-screen bg-surface ${showNavbar ? 'pt-16' : ''} relative overflow-hidden ${className}`}>
            <GlowOrbs />
            <FloatingParticles count={particlesCount} />

            {showNavbar && <Navbar />}

            {noContainer ? (
                children
            ) : (
                <div className={`relative ${containerClassName}`}>
                    {children}
                </div>
            )}

            {showFooter && <Footer />}
        </main>
    );
}
