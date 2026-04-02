"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";

export default function Footer({ flowblockMode = false }: { flowblockMode?: boolean }) {
    // ── FLOWBLOCK-STYLE FOOTER ──
    if (flowblockMode) {
        const linkGroups = {
            Product: [
                { label: "Dashboard", href: "/dashboard" },
                { label: "Courses", href: "/courses" },
                { label: "Pricing", href: "/pricing" },
                { label: "AI Tools", href: "/ai-tools" },
            ],
            Resources: [
                { label: "Documentation", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Community", href: "#" },
            ],
        };

        return (
            <footer className="border-t border-[#222] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
                        {/* Logo */}
                        <div>
                            <Link href="/" className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#E6C212] flex items-center justify-center">
                                    <Code2 className="w-5 h-5 text-black" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">
                                    Pixel<span className="text-[#E6C212]">Learn</span>
                                </span>
                            </Link>
                            <p className="text-sm text-[#71717A] max-w-xs leading-relaxed">
                                Master coding through interactive practice, structured courses, and AI-powered career intelligence.
                            </p>
                        </div>

                        {/* Links */}
                        <div className="flex gap-16">
                            {Object.entries(linkGroups).map(([category, links]) => (
                                <div key={category}>
                                    <h4 className="text-sm font-semibold text-[#A1A1AA] mb-4 tracking-wider uppercase fb-mono">
                                        {category}
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-[#71717A] hover:text-white transition-colors duration-200"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="pt-6 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-[#71717A]">
                            © 2026 PixelLearn. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="#" className="text-xs text-[#71717A] hover:text-white transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="#" className="text-xs text-[#71717A] hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // ── DEFAULT FOOTER (for inner pages) ──
    const footerLinks = {
        Product: [
            { label: "Courses", href: "/courses" },
            { label: "Pricing", href: "/pricing" },
            { label: "AI Tools", href: "/ai-tools" },
            { label: "Playground", href: "/courses" },
        ],
        Resources: [
            { label: "Documentation", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Community", href: "#" },
            { label: "Changelog", href: "#" },
        ],
        Company: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact", href: "#" },
            { label: "Press Kit", href: "#" },
        ],
        Legal: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
            { label: "GDPR", href: "#" },
        ],
    };

    return (
        <footer className="border-t border-border bg-surface-alt/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-text-primary">
                                Pixel<span className="text-[#E6C212]">Learn</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm mb-6 max-w-xs leading-relaxed">
                            Master coding through interactive practice, structured courses, and AI-powered career intelligence.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-text-primary mb-4">
                                {category}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">
                        © 2026 PixelLearn. All rights reserved.
                    </p>
                    <p className="text-xs text-text-muted">
                        Built with Next.js, Tailwind CSS & AI
                    </p>
                </div>
            </div>
        </footer>
    );
}
