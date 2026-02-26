"use client";

import { useState } from "react";
import {
    Rocket,
    Loader2,
    Clock,
    Star,
} from "lucide-react";

interface RoadmapStepData {
    step: number;
    title: string;
    description: string;
    duration: string;
    skills: string[];
    resources: string[];
    milestone: string;
}

export default function RoadmapGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [desiredRole, setDesiredRole] = useState("");
    const [currentSkills, setCurrentSkills] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("beginner");
    const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStepData[]>([]);

    async function callAI(type: string, data: Record<string, unknown>) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, data }),
            });
            const result = await res.json();
            return result.result;
        } catch {
            return "Error: Unable to process request. Please try again.";
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRoadmap() {
        if (!desiredRole.trim()) return;
        const result = await callAI("roadmap", {
            desiredRole,
            currentSkills: currentSkills.split(",").map((s) => s.trim()),
            experienceLevel,
        });
        try {
            const parsed = typeof result === "string" ? JSON.parse(result) : result;
            setRoadmapSteps(Array.isArray(parsed) ? parsed : []);
        } catch {
            setRoadmapSteps([]);
        }
    }

    return (
        <div className="space-y-6">
            <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-success" />
                    Generate Your Career Roadmap
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-text-secondary mb-1.5">
                            Desired Role
                        </label>
                        <input
                            type="text"
                            value={desiredRole}
                            onChange={(e) => setDesiredRole(e.target.value)}
                            placeholder="e.g., Full Stack Developer"
                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-secondary mb-1.5">
                            Current Skills
                        </label>
                        <input
                            type="text"
                            value={currentSkills}
                            onChange={(e) => setCurrentSkills(e.target.value)}
                            placeholder="e.g., HTML, CSS, Python"
                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-secondary mb-1.5">
                            Experience Level
                        </label>
                        <select
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            className="w-full p-3 rounded-lg bg-surface-alt border border-border text-text-primary focus:outline-none focus:border-primary/50"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleRoadmap}
                    disabled={isLoading || !desiredRole.trim()}
                    className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Rocket className="w-4 h-4" />
                    )}
                    {isLoading ? "Generating..." : "Generate Roadmap"}
                </button>
            </div>

            {/* Roadmap Steps */}
            {roadmapSteps.length > 0 && (
                <div className="animate-slide-up">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">
                        Your Personalized Roadmap
                    </h3>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                        <div className="space-y-6">
                            {roadmapSteps.map((step, i) => (
                                <div key={i} className="relative flex gap-6">
                                    {/* Timeline Dot */}
                                    <div className="relative z-10 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 shrink-0">
                                        {step.step}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 glass rounded-xl p-6 hover:border-primary/20 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-text-primary">
                                                {step.title}
                                            </h4>
                                            <span className="flex items-center gap-1 text-xs text-text-muted">
                                                <Clock className="w-3 h-3" />
                                                {step.duration}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-4">
                                            {step.description}
                                        </p>

                                        {/* Skills */}
                                        <div className="mb-3">
                                            <div className="text-xs font-medium text-text-muted mb-1.5">
                                                Skills to Learn
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {step.skills.map((skill, j) => (
                                                    <span
                                                        key={j}
                                                        className="px-2 py-0.5 rounded bg-primary/10 text-primary-light text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Resources */}
                                        <div className="mb-3">
                                            <div className="text-xs font-medium text-text-muted mb-1.5">
                                                Resources
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {step.resources.map((resource, j) => (
                                                    <span
                                                        key={j}
                                                        className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs"
                                                    >
                                                        {resource}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Milestone */}
                                        <div className="p-3 rounded-lg bg-success/5 border border-success/20 flex items-start gap-2">
                                            <Star className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                            <div>
                                                <div className="text-xs font-medium text-success">
                                                    Milestone
                                                </div>
                                                <div className="text-xs text-text-secondary">
                                                    {step.milestone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
