"use client";

import { Globe } from "lucide-react";

interface PreviewPanelProps {
    showTheoryPanel: boolean;
    previewHtml: string;
}

export default function PreviewPanel({ showTheoryPanel, previewHtml }: PreviewPanelProps) {
    return (
        <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${showTheoryPanel ? "w-[38%]" : "w-1/2"
                }`}
        >
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Globe className="w-4 h-4 text-[#E6C212]" />
                    <span className="font-medium text-text-primary">Browser Preview</span>
                </div>
                <div className="flex items-center gap-1">
                    {/* Browser dots */}
                    <div className="flex items-center gap-1 mr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                    </div>
                    <div className="px-2 py-0.5 rounded bg-surface-hover border border-border text-[10px] text-text-muted font-mono">
                        localhost:preview
                    </div>
                </div>
            </div>

            {/* Preview iframe */}
            <div className="flex-1 bg-white overflow-hidden relative">
                {previewHtml ? (
                    <iframe
                        srcDoc={previewHtml}
                        className="w-full h-full border-none"
                        title="preview"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-text-muted text-sm italic">
                        Click "Run Code" and interact with your React UI here.
                    </div>
                )}
            </div>
        </div>
    );
}
