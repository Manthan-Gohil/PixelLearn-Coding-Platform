"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/store";
import { useTheme } from "@/lib/theme";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
    BookOpen,
    Code2,
    Brain,
    Menu,
    X,
    Zap,
    Crown,
    Sun,
    Moon,
} from "lucide-react";

// Character stagger component for Flowblock-style hover
function StaggerText({ text }: { text: string }) {
    return (
        <span className="fb-stagger-text">
            {text.split("").map((char, i) => (
                <span key={i} className="char">
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}

export default function Navbar({ flowblockMode = false }: { flowblockMode?: boolean }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useApp();
    const { theme, toggleTheme } = useTheme();
    const { isSignedIn, isLoaded } = useUser();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!flowblockMode) return;
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [flowblockMode]);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: BookOpen },
        { href: "/courses", label: "Courses", icon: Code2 },
        { href: "/ai-tools", label: "AI Tools", icon: Brain },
        { href: "/pricing", label: "Pricing", icon: Crown },
    ];

    // ── FLOWBLOCK-STYLE NAVBAR ──
    if (flowblockMode) {
        return (
            <nav className={`fixed top-0 left-0 right-0 z-50 fb-navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-18 py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-[#E6C212] flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Pixel<span className="text-[#E6C212]">Learn</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-[15px] font-medium text-[#A1A1AA] hover:text-white transition-colors duration-200"
                                >
                                    <StaggerText text={link.label} />
                                </Link>
                            ))}
                        </div>

                        {/* Right Side - CTA */}
                        <div className="hidden md:flex items-center gap-4">
                            {isLoaded && isSignedIn ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#333] bg-[#111]">
                                        <Zap className="w-4 h-4 text-[#E6C212]" />
                                        <span className="text-sm font-semibold text-white">
                                            {user.xp.toLocaleString()} XP
                                        </span>
                                    </div>
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-9 h-9 ring-2 ring-[#333] hover:ring-[#E6C212] transition-all",
                                            },
                                        }}
                                    />
                                </>
                            ) : isLoaded ? (
                                <>
                                    <SignInButton mode="redirect">
                                        <button className="px-5 py-2.5 text-sm font-medium text-white border border-[#333] rounded-lg hover:bg-[#111] hover:border-[#555] transition-all duration-200">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="redirect">
                                        <button className="fb-btn-primary !py-2.5 !px-5 !text-sm">
                                            Get Started
                                        </button>
                                    </SignUpButton>
                                </>
                            ) : null}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-lg text-[#A1A1AA] hover:text-white transition-colors"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Flowblock Style */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-[#222] bg-black/95 backdrop-blur-xl animate-slide-up">
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#111] transition-colors"
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-[#222] mt-3">
                                {isLoaded && isSignedIn ? (
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        <Zap className="w-4 h-4 text-[#E6C212]" />
                                        <span className="text-sm font-semibold text-white">{user.xp} XP</span>
                                        <div className="ml-auto">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </div>
                                ) : isLoaded ? (
                                    <div className="flex flex-col gap-2 px-4">
                                        <SignInButton mode="redirect">
                                            <button className="w-full py-2.5 text-sm font-medium text-white border border-[#333] rounded-lg hover:bg-[#111] transition-colors">
                                                Sign In
                                            </button>
                                        </SignInButton>
                                        <SignUpButton mode="redirect">
                                            <button className="w-full py-2.5 rounded-lg fb-btn-primary justify-center !text-sm">
                                                Get Started
                                            </button>
                                        </SignUpButton>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    }

    // ── DEFAULT NAVBAR (for inner pages) ──
    const allNavLinks = [
        { href: "/dashboard", label: "Dashboard", icon: BookOpen },
        { href: "/courses", label: "Courses", icon: Code2 },
        { href: "/ai-tools", label: "AI Tools", icon: Brain },
        { href: "/pricing", label: "Pricing", icon: Crown },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-shadow">
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary">
                            Pixel<span className="text-[#E6C212]">Learn</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {allNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="relative w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-surface-hover transition-all duration-300 group"
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4 text-warning transition-transform duration-300 group-hover:rotate-45" />
                            ) : (
                                <Moon className="w-4 h-4 text-primary-light transition-transform duration-300 group-hover:-rotate-12" />
                            )}
                        </button>

                        {isLoaded && isSignedIn ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-alt border border-border">
                                    <Zap className="w-4 h-4 text-warning" />
                                    <span className="text-sm font-semibold text-text-primary">
                                        {user.xp.toLocaleString()} XP
                                    </span>
                                </div>
                                {user.subscription === "pro" && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold gradient-primary text-white">
                                        PRO
                                    </span>
                                )}
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                                        },
                                    }}
                                />
                            </>
                        ) : isLoaded ? (
                            <>
                                <SignInButton mode="redirect">
                                    <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="redirect">
                                    <button className="px-5 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </>
                        ) : null}
                    </div>

                    {/* Mobile - Theme + Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-primary-light" />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-surface animate-slide-up">
                    <div className="px-4 py-4 space-y-1">
                        {allNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                            >
                                <link.icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-border mt-3">
                            {isLoaded && isSignedIn ? (
                                <div className="flex items-center gap-2 px-4 py-2">
                                    <Zap className="w-4 h-4 text-warning" />
                                    <span className="text-sm font-semibold">{user.xp} XP</span>
                                    <div className="ml-auto">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </div>
                            ) : isLoaded ? (
                                <div className="flex flex-col gap-2 px-4">
                                    <SignInButton mode="redirect">
                                        <button className="w-full py-2 text-sm font-medium text-text-primary border border-border rounded-lg hover:bg-surface-hover transition-colors">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="redirect">
                                        <button className="w-full py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                            Get Started
                                        </button>
                                    </SignUpButton>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
