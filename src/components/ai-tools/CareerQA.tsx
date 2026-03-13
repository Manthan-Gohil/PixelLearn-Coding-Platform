"use client";

import { useState } from "react";
import {
    Brain,
    Send,
    Loader2,
    ChevronRight,
} from "lucide-react";
import { CAREER_QA_SUGGESTED_QUESTIONS } from "@/constants/ai-tools";
import { useAIApi } from "@/hooks/useAIApi";

export default function CareerQA() {
    const { isLoading, callAI } = useAIApi();
    const [question, setQuestion] = useState("");
    const [careerAnswer, setCareerAnswer] = useState("");

    async function handleCareerQA() {
        if (!question.trim()) return;
        const result = await callAI("career-qa", { question });
        setCareerAnswer(result);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary-light" />
                    Ask a Career Question
                </h2>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., What skills do I need to become a full-stack developer? How long will it take to transition from QA to development?"
                    className="w-full h-40 p-4 rounded-lg bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
                />
                <button
                    onClick={handleCareerQA}
                    disabled={isLoading || !question.trim()}
                    className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {isLoading ? "Thinking..." : "Ask AI"}
                </button>

                {/* Suggested Questions */}
                <div className="mt-6">
                    <p className="text-xs text-text-muted mb-2">Try asking:</p>
                    <div className="space-y-2">
                        {CAREER_QA_SUGGESTED_QUESTIONS.map((q) => (
                            <button
                                key={q}
                                onClick={() => setQuestion(q)}
                                className="block w-full text-left p-2.5 rounded-lg bg-surface-hover/50 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                            >
                                <ChevronRight className="w-3 h-3 inline mr-1" />
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Answer */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                    AI Response
                </h2>
                {careerAnswer ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                        {careerAnswer.split("\n").map((line, i) => {
                            if (line.startsWith("## "))
                                return (
                                    <h2
                                        key={i}
                                        className="text-lg font-bold text-text-primary mt-4 mb-2"
                                    >
                                        {line.replace("## ", "")}
                                    </h2>
                                );
                            if (line.startsWith("### "))
                                return (
                                    <h3
                                        key={i}
                                        className="text-base font-semibold text-text-primary mt-3 mb-1"
                                    >
                                        {line.replace("### ", "")}
                                    </h3>
                                );
                            if (line.startsWith("- "))
                                return (
                                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary ml-2">
                                        <span className="text-primary-light mt-1">•</span>
                                        <span>{line.replace("- ", "")}</span>
                                    </div>
                                );
                            if (line.match(/^\d+\.\s/))
                                return (
                                    <p
                                        key={i}
                                        className="text-sm text-text-secondary ml-2"
                                    >
                                        {line}
                                    </p>
                                );
                            if (line.startsWith("**") && line.endsWith("**"))
                                return (
                                    <p
                                        key={i}
                                        className="text-sm font-semibold text-text-primary mt-2"
                                    >
                                        {line.replace(/\*\*/g, "")}
                                    </p>
                                );
                            if (line.trim())
                                return (
                                    <p key={i} className="text-sm text-text-secondary">
                                        {line}
                                    </p>
                                );
                            return <br key={i} />;
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                        <Brain className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">Ask a question to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
