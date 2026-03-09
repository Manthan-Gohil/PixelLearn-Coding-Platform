"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppProvider } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { COURSES, SUBSCRIPTION_PLANS } from "@/services/data";
import LandingReveal from "@/components/LandingReveal";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GlowOrbs from "@/components/ui/GlowOrbs";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TypingText from "@/components/ui/TypingText";
import { useScrollReveal, useStaggerReveal, useMagneticHover, useTiltCard } from "@/hooks/useScrollReveal";
import {
  Code2,
  Brain,
  Trophy,
  Rocket,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Check,
  Play,
  Terminal,
  BarChart3,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

function HeroSection() {
  const magneticRef = useMagneticHover<HTMLAnchorElement>(0.15);
  const codeCardRef = useTiltCard<HTMLDivElement>(8);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <GlowOrbs />
      <FloatingParticles count={25} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px] animate-morph" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-fade-in animate-shimmer">
            <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
            <span className="text-sm font-medium text-text-secondary">
              AI-Powered Learning Platform
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            <span className="text-text-primary">Master </span>
            <TypingText
              texts={["Coding", "Python", "React", "JavaScript", "AI/ML"]}
              className="gradient-text"
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={1800}
            />
            <br />
            <span className="gradient-text">by Doing It</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Build real programming skills with interactive coding environments,
            structured courses, and AI-powered career intelligence.{" "}
            <span className="text-text-primary font-medium">
              Practice-first learning
            </span>{" "}
            that actually works.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link
              ref={magneticRef}
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 animate-glow-pulse"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/courses"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-text-primary font-semibold text-lg hover:bg-surface-hover hover:border-primary/30 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-primary" />
              Explore Courses
            </Link>
          </div>

          {/* Stats - Animated Counters */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { value: 50000, suffix: "+", label: "Active Learners" },
              { value: 200, suffix: "+", label: "Exercises" },
              { value: 4.8, label: "Average Rating", isRating: true },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold gradient-text transition-transform group-hover:scale-110 duration-300">
                  {stat.isRating ? (
                    <span>4.8★</span>
                  ) : (
                    <AnimatedCounter value={stat.value as number} suffix={stat.suffix} duration={2500} />
                  )}
                </div>
                <div className="text-xs sm:text-sm text-text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Preview Card */}
        <div className="mt-20 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div ref={codeCardRef} className="glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border card-hover-glow">
            {/* Window Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-alt/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/70 hover:bg-danger transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-warning/70 hover:bg-warning transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-success/70 hover:bg-success transition-colors cursor-pointer" />
              </div>
              <span className="text-xs text-text-muted ml-2 font-mono">
                playground.py
              </span>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-success/70 font-mono">live</span>
              </div>
            </div>
            {/* Code Content */}
            <div className="p-6 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-primary-light">def</span>{" "}
                  <span className="text-accent">learn_with_pixellearn</span>
                  <span className="text-text-muted">(</span>
                  <span className="text-warning">student</span>
                  <span className="text-text-muted">):</span>
                </div>
                <div className="pl-6">
                  <span className="text-text-muted">&quot;&quot;&quot;</span>
                  <span className="text-success">Your journey to mastery starts here</span>
                  <span className="text-text-muted">&quot;&quot;&quot;</span>
                </div>
                <div className="pl-6">
                  <span className="text-primary-light">skills</span>
                  <span className="text-text-muted"> = </span>
                  <span className="text-text-muted">[</span>
                  <span className="text-success">&quot;Python&quot;</span>
                  <span className="text-text-muted">, </span>
                  <span className="text-success">&quot;JavaScript&quot;</span>
                  <span className="text-text-muted">, </span>
                  <span className="text-success">&quot;React&quot;</span>
                  <span className="text-text-muted">]</span>
                </div>
                <div className="pl-6">
                  <span className="text-primary-light">for</span>{" "}
                  <span className="text-warning">skill</span>{" "}
                  <span className="text-primary-light">in</span>{" "}
                  <span className="text-text-primary">skills</span>
                  <span className="text-text-muted">:</span>
                </div>
                <div className="pl-12">
                  <span className="text-text-primary">student</span>
                  <span className="text-text-muted">.</span>
                  <span className="text-accent">practice</span>
                  <span className="text-text-muted">(</span>
                  <span className="text-warning">skill</span>
                  <span className="text-text-muted">)</span>
                </div>
                <div className="pl-12">
                  <span className="text-text-primary">student</span>
                  <span className="text-text-muted">.</span>
                  <span className="text-accent">earn_xp</span>
                  <span className="text-text-muted">(</span>
                  <span className="text-primary-light">100</span>
                  <span className="text-text-muted">)</span>
                </div>
                <div className="pl-6 mt-2">
                  <span className="text-primary-light">return</span>{" "}
                  <span className="text-success">&quot;🚀 Career Ready!&quot;</span>
                </div>
              </div>
              {/* Output */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-text-muted mb-2">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs">Output</span>
                </div>
                <div className="text-success typewriter-line">
                  ▸ 🚀 Career Ready!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 40, duration: 0.7 });
  const gridRef = useStaggerReveal<HTMLDivElement>(".feature-card", {
    direction: "up",
    distance: 40,
    stagger: 0.1,
    duration: 0.6,
  });

  const features = [
    {
      icon: Code2,
      title: "Interactive Code Editor",
      description:
        "Write, run, and test code in our Monaco-based editor with syntax highlighting, auto-completion, and instant feedback.",
      color: "text-primary-light",
      bgColor: "bg-primary/10",
    },
    {
      icon: BookOpen,
      title: "Structured Courses",
      description:
        "Learn through carefully designed courses with chapters and exercises that build progressively from beginner to advanced.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Trophy,
      title: "Progress Gamification",
      description:
        "Earn XP, unlock badges, and maintain streaks. Track your growth with detailed analytics and professional dashboards.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Brain,
      title: "AI Career Intelligence",
      description:
        "Get personalized career guidance, resume analysis, and roadmap generation powered by advanced AI models.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Shield,
      title: "Secure Sandbox",
      description:
        "Run code safely in our isolated execution environment. Support for Python, JavaScript, Java, C++, and more.",
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
    {
      icon: BarChart3,
      title: "Learning Analytics",
      description:
        "Visualize your progress with weekly activity charts, completion rates, and personalized insights.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={sectionRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            A complete platform designed for developers who want to learn by
            building, not just watching.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group glass rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 card-hover-glow spotlight-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
              }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-float-subtle`}
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesPreview() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
  const gridRef = useStaggerReveal<HTMLDivElement>(".course-card", {
    direction: "up",
    distance: 50,
    stagger: 0.15,
    duration: 0.7,
  });

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

  const difficultyColors: Record<string, string> = {
    beginner: "text-success bg-success/10",
    intermediate: "text-warning bg-warning/10",
    advanced: "text-danger bg-danger/10",
  };

  const categoryIcons: Record<string, string> = {
    Python: "🐍",
    JavaScript: "⚡",
    "Web Development": "🌐",
    React: "⚛️",
    DSA: "🧮",
  };

  return (
    <section className="py-24 bg-surface-alt/30 relative overflow-hidden">
      <FloatingParticles count={15} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Featured <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Start your journey with our most popular courses, designed by
            industry experts.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="course-card group glass rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 card-hover-glow"
            >
              {/* Thumbnail */}
              <div className="h-48 gradient-card flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                  {categoryIcons[course.category] || "📚"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {course.isPremium && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold gradient-primary text-white animate-shimmer">
                      PRO
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty]}`}
                  >
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-light transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {course.shortDescription}
                </p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrolledCount.toLocaleString()}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-text-primary font-medium hover:bg-surface-hover hover:border-primary/30 transition-all hover-bounce"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AIToolsHighlight() {
  const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
  const gridRef = useStaggerReveal<HTMLDivElement>(".ai-card", {
    direction: "up",
    distance: 60,
    stagger: 0.12,
    duration: 0.7,
    scale: 0.95,
  });

  const tools = [
    {
      icon: Brain,
      title: "AI Career Q&A",
      description:
        "Ask any career question and get detailed, personalized guidance with skill recommendations and timelines.",
      gradient: "from-primary to-primary-dark",
    },
    {
      icon: GraduationCap,
      title: "Resume Analyzer",
      description:
        "Upload your resume for AI-powered ATS scoring, skills gap analysis, and actionable improvement suggestions.",
      gradient: "from-accent to-accent-dark",
    },
    {
      icon: Rocket,
      title: "Career Roadmap",
      description:
        "Generate a personalized step-by-step roadmap to your dream role with milestones and resource recommendations.",
      gradient: "from-success to-green-700",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <GlowOrbs />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-shimmer">
            <Sparkles className="w-4 h-4 text-primary-light animate-float-subtle" />
            <span className="text-sm font-medium text-primary-light">
              Powered by AI
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            AI Career{" "}
            <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Get personalized career guidance powered by advanced AI models.
            Make data-driven decisions about your career path.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="ai-card group relative glass rounded-2xl p-8 hover:border-primary/20 transition-all duration-300 card-hover-glow spotlight-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
              }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <tool.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {tool.title}
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {tool.description}
              </p>
              <Link
                href="/ai-tools"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-light hover:text-primary transition-colors group"
              >
                Try it now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  const headerRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 30 });
  const gridRef = useStaggerReveal<HTMLDivElement>(".pricing-card", {
    direction: "up",
    distance: 50,
    stagger: 0.12,
    scale: 0.9,
    duration: 0.7,
  });

  return (
    <section className="py-24 bg-surface-alt/30 relative overflow-hidden">
      <FloatingParticles count={10} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card relative glass rounded-2xl p-8 transition-all duration-300 card-hover-glow ${plan.isPopular
                ? "border-primary/40 shadow-xl shadow-primary/10 scale-105 animate-glow-pulse"
                : "hover:border-primary/20"
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-white text-xs font-semibold animate-shimmer">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  ${plan.price}
                </span>
                <span className="text-text-muted text-sm">/{plan.interval === "yearly" ? "year" : "mo"}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.isPopular
                  ? "gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25"
                  : "border border-border text-text-primary hover:bg-surface-hover hover:border-primary/30"
                  }`}
              >
                {plan.price === 0 ? "Get Started" : "Subscribe Now"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({ direction: "up", distance: 50, duration: 0.8 });
  const magneticRef = useMagneticHover<HTMLAnchorElement>(0.12);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      {/* Animated morphing blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-morph" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
      <FloatingParticles count={20} />

      <div ref={sectionRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-text-primary mb-6">
          Ready to Start Your
          <br />
          <span className="gradient-text">Coding Journey?</span>
        </h2>
        <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
          Join thousands of developers who are mastering programming through
          practice, not just theory. Start for free today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            ref={magneticRef}
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/25 animate-glow-pulse"
          >
            <Rocket className="w-5 h-5 group-hover:animate-bounce" />
            Start Learning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}



// This variable persists during client-side navigation but resets on full page reload
let hasShownRevealInThisSession = false;

export default function Home() {
  const [showReveal, setShowReveal] = useState(!hasShownRevealInThisSession);

  useEffect(() => {
    if (!hasShownRevealInThisSession) {
      const timer = setTimeout(() => {
        setShowReveal(false);
        hasShownRevealInThisSession = true;
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AppProvider>
      {showReveal && <LandingReveal />}
      <main className={`overflow-x-hidden transition-opacity duration-1000 ${showReveal ? 'h-screen overflow-hidden opacity-0' : 'opacity-100'}`}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <CoursesPreview />
        <AIToolsHighlight />
        <PricingPreview />
        <CTASection />
        <Footer />
      </main>
    </AppProvider>
  );
}
