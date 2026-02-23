"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppProvider } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { COURSES, SUBSCRIPTION_PLANS } from "@/services/data";
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
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary-light" />
            <span className="text-sm font-medium text-text-secondary">
              AI-Powered Learning Platform
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            <span className="text-text-primary">Master Coding</span>
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
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30"
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { value: "50K+", label: "Active Learners" },
              { value: "200+", label: "Exercises" },
              { value: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
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
          <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
            {/* Window Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-alt/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <span className="text-xs text-text-muted ml-2 font-mono">
                playground.py
              </span>
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
                <div className="text-success">
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
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Level Up</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            A complete platform designed for developers who want to learn by
            building, not just watching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
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
    <section className="py-24 bg-surface-alt/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Featured <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Start your journey with our most popular courses, designed by
            industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="h-48 gradient-card flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[course.category] || "📚"}
                </span>
                <div className="absolute top-3 right-3 flex gap-2">
                  {course.isPremium && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold gradient-primary text-white">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-text-primary font-medium hover:bg-surface-hover hover:border-primary/30 transition-all"
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
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary-light" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="group relative glass rounded-2xl p-8 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-shadow">
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
  return (
    <section className="py-24 bg-surface-alt/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${plan.isPopular
                ? "border-primary/40 shadow-xl shadow-primary/10 scale-105"
                : "hover:border-primary/20"
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-white text-xs font-semibold">
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
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/25"
          >
            <Rocket className="w-5 h-5" />
            Start Learning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <main className="overflow-x-hidden">
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
