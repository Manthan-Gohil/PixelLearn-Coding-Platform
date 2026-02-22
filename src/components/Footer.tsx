"use client";

import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
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
                {/* Main Footer */}
                <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-text-primary">
                                Pixel<span className="gradient-text">Learn</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm mb-6 max-w-xs leading-relaxed">
                            Master coding through interactive practice, structured courses, and AI-powered career intelligence.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
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

                {/* Bottom */}
                <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted flex items-center gap-1">
                        © 2026 PixelLearn. Made with <Heart className="w-3 h-3 text-danger fill-danger" /> for developers.
                    </p>
                    <p className="text-xs text-text-muted">
                        Built with Next.js, Tailwind CSS & AI
                    </p>
                </div>
            </div>
        </footer>
    );
}
