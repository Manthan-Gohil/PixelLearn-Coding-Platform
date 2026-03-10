"use client";

import { Terminal, X } from "lucide-react";

interface OutputPanelProps {
    output: string;
    setOutput: (output: string) => void;
}

export default function OutputPanel({ output, setOutput }: OutputPanelProps) {
    return (
        <div className="h-48 border-t border-border bg-surface-alt flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Terminal className="w-4 h-4" />
                    Output Console
                </div>
                {output && (
                    <button
                        onClick={() => setOutput("")}
                        className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-center sm:text-left">
                {output ? (
                    <pre
                        className={`whitespace-pre-wrap ${output.includes("Error") ? "text-danger" : "text-success"
                            }`}
                    >
                        {output}
                    </pre>
                ) : (
                    <span className="text-text-muted text-xs">
                        Click &quot;Run Code&quot; to see output here...
                    </span>
                )}
            </div>
        </div>
    );
}
