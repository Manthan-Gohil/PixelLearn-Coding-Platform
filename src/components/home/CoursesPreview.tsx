"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, Users, Zap, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from "@/constants/ui";

gsap.registerPlugin(ScrollTrigger);

export default function CoursesPreview() {
    const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setFeaturedCourses(data.slice(0, 3));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0, duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            const cards = gridRef.current?.querySelectorAll(".course-card");
            if (cards && cards.length) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 0.7,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [featuredCourses]);

    return (
        <section ref={sectionRef} className="py-28 relative fb-section-glow">
            <div className="absolute inset-0 fb-dot-grid opacity-30" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headingRef} className="text-center mb-20 opacity-0">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        Featured{" "}
                        <span className="text-[#E6C212]">Courses</span>
                    </h2>
                    <p className="fb-mono text-[15px] text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
                        Start your journey with our most popular courses, designed by
                        industry experts.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                    {featuredCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="course-card group fb-card overflow-hidden"
                        >
                            {/* Thumbnail */}
                            <div className="h-48 bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                                <span className="text-6xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                                    {CATEGORY_ICONS[course.category] || "📚"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {course.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6C212] text-black">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#222] text-[#A1A1AA] border border-[#333]">
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E6C212] transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2">
                                    {course.shortDescription}
                                </p>
                                <div className="flex items-center justify-between text-xs text-[#71717A]">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-[#E6C212] fill-[#E6C212]" />
                                            {course.rating.toFixed(1)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {course.enrolledCount.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1 fb-mono">
                                        <Zap className="w-3 h-3 text-[#E6C212]" />
                                        {course.totalXP} XP
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/courses"
                        className="fb-btn-outline inline-flex items-center gap-2 text-sm"
                    >
                        View All Courses
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
