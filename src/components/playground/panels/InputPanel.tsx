"use client";

import { useState } from "react";
import { Terminal, Eraser, ClipboardPen, ChevronDown, ChevronUp } from "lucide-react";

interface InputPanelProps {
    value: string;
    onChange: (value: string) => void;
    example?: string | null;
}

/**
 * Standard input (stdin) editor shown below the console.
 * Whatever is typed here is piped into the program when it runs, so code
 * using scanf / cin / input / readline receives the values in order.
 */
export default function InputPanel({ value, onChange, example }: InputPanelProps) {
    const [collapsed, setCollapsed] = useState(false);

    const lineCount = value.length === 0 ? 0 : value.split("\n").length;

    return (
        <div className="h-44 shrink-0 flex flex-col border-t border-border bg-surface-alt">
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                <div className="flex items-center gap-2 text-xs text-text-muted min-w-0">
                    <Terminal className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">Program Input (stdin)</span>
                    {lineCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E6C212]/15 text-[#E6C212] border border-[#E6C212]/25 whitespace-nowrap">
                            {lineCount} line{lineCount > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {example ? (
                        <button
                            type="button"
                            onClick={() => onChange(example)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#E6C212] hover:bg-[#E6C212]/10 transition-colors"
                            title="Fill with the exercise's example input"
                        >
                            <ClipboardPen className="w-3 h-3" />
                            Use example
                        </button>
                    ) : null}
                    {value.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                            title="Clear input"
                        >
                            <Eraser className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                        title={collapsed ? "Expand input" : "Collapse input"}
                    >
                        {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {!collapsed && (
                <>
                    <textarea
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={"Type the values your program should read, one per line.\nExample:\n5"}
                        spellCheck={false}
                        className="flex-1 w-full bg-transparent p-3 font-mono text-sm resize-none focus:outline-none text-text-secondary select-text"
                    />
                    <div className="px-3 py-1.5 text-[10px] text-text-muted border-t border-border/60 shrink-0">
                        Sent to your program&apos;s standard input when you run it. Use one value per line for scanf.
                    </div>
                </>
            )}
        </div>
    );
}
