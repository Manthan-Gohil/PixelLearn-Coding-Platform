"use client";

import { use, useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AppProvider, useApp } from "@/store";
import { generateFlowchart } from "@/utils/generateFlowchart";
import { Course, Chapter, Exercise, FlowchartNode, FlowchartEdge } from "@/types";
import {
    Play,
    RotateCcw,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Lightbulb,
    BookOpen,
    Terminal,
    Loader2,
    Zap,
    Code2,
    Eye,
    EyeOff,
    X,
    Trophy,
    Globe,
    PanelLeftClose,
    PanelRightClose,
    ShieldAlert,
    GitBranch,
    AlertTriangle,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-surface-alt">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
    ),
});

// Frontend languages that need browser preview
const FRONTEND_LANGUAGES = ["html", "css", "jsx", "tsx", "reactjs"];

function isFrontendLanguage(lang: string) {
    return FRONTEND_LANGUAGES.includes(lang.toLowerCase());
}

// ============================================================
// FlowchartDiagram - Renders a beautiful interactive flowchart
// ============================================================
function FlowchartDiagram({
    nodes,
    edges,
}: {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const obs = new ResizeObserver(([entry]) => {
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });
        obs.observe(container);
        return () => obs.disconnect();
    }, []);

    // Layout: compute positions for each node
    const layout = useCallback(() => {
        if (!nodes.length) return { positions: new Map<string, { x: number; y: number; w: number; h: number }>(), totalHeight: 0 };

        const positions = new Map<string, { x: number; y: number; w: number; h: number }>();
        const nodeW = 200;
        const nodeH = 48;
        const gapY = 70;
        const centerX = dimensions.width / 2;

        // Build adjacency for layout
        const outEdges = new Map<string, FlowchartEdge[]>();
        edges.forEach((e) => {
            if (!outEdges.has(e.from)) outEdges.set(e.from, []);
            outEdges.get(e.from)!.push(e);
        });

        // BFS to assign levels
        const levels = new Map<string, number>();
        const startNode = nodes.find((n) => n.type === "start") || nodes[0];
        const queue: string[] = [startNode.id];
        levels.set(startNode.id, 0);
        const visited = new Set<string>();

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current)) continue;
            visited.add(current);
            const outs = outEdges.get(current) || [];
            for (const edge of outs) {
                if (!levels.has(edge.to)) {
                    levels.set(edge.to, (levels.get(current) || 0) + 1);
                    queue.push(edge.to);
                }
            }
        }

        // Position nodes that weren't reached by BFS
        nodes.forEach((n) => {
            if (!levels.has(n.id)) {
                levels.set(n.id, nodes.indexOf(n));
            }
        });

        // Group by level
        const levelGroups = new Map<number, string[]>();
        levels.forEach((level, nodeId) => {
            if (!levelGroups.has(level)) levelGroups.set(level, []);
            levelGroups.get(level)!.push(nodeId);
        });

        let maxLevel = 0;
        levelGroups.forEach((_, level) => {
            if (level > maxLevel) maxLevel = level;
        });

        levelGroups.forEach((group, level) => {
            const totalW = group.length * nodeW + (group.length - 1) * 40;
            const startX = centerX - totalW / 2;
            group.forEach((nodeId, i) => {
                positions.set(nodeId, {
                    x: startX + i * (nodeW + 40),
                    y: 30 + level * gapY,
                    w: nodeW,
                    h: nodeH,
                });
            });
        });

        return { positions, totalHeight: 30 + (maxLevel + 1) * gapY + 20 };
    }, [nodes, edges, dimensions.width]);

    // Draw on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !dimensions.width || !dimensions.height) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const { positions, totalHeight } = layout();

        canvas.width = dimensions.width * dpr;
        canvas.height = Math.max(dimensions.height, totalHeight) * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${Math.max(dimensions.height, totalHeight)}px`;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, dimensions.width, Math.max(dimensions.height, totalHeight));

        // Draw edges
        edges.forEach((edge) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return;

            const fromX = from.x + from.w / 2;
            const fromY = from.y + from.h;
            const toX = to.x + to.w / 2;
            const toY = to.y;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
            ctx.lineWidth = 2;

            // Draw curved line
            const midY = (fromY + toY) / 2;
            ctx.moveTo(fromX, fromY);
            ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(toY - midY, toX - toX) || Math.PI / 2;
            const arrowSize = 8;
            ctx.beginPath();
            ctx.fillStyle = "rgba(99, 102, 241, 0.7)";
            ctx.moveTo(toX, toY);
            ctx.lineTo(
                toX - arrowSize * Math.cos(angle - Math.PI / 6),
                toY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                toX - arrowSize * Math.cos(angle + Math.PI / 6),
                toY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();

            // Edge label
            if (edge.label) {
                const labelX = (fromX + toX) / 2;
                const labelY = midY - 6;
                ctx.font = "11px Inter, system-ui, sans-serif";
                ctx.fillStyle = "#818cf8";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";

                // Background
                const textWidth = ctx.measureText(edge.label).width;
                ctx.fillStyle = "rgba(15, 23, 41, 0.9)";
                ctx.fillRect(labelX - textWidth / 2 - 4, labelY - 14, textWidth + 8, 18);
                ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
                ctx.lineWidth = 1;
                ctx.strokeRect(labelX - textWidth / 2 - 4, labelY - 14, textWidth + 8, 18);

                ctx.fillStyle = "#818cf8";
                ctx.fillText(edge.label, labelX, labelY);
            }
        });

        // Draw nodes
        nodes.forEach((node) => {
            const pos = positions.get(node.id);
            if (!pos) return;

            const { x, y, w, h } = pos;
            const radius = 10;

            // Node styling based on type
            let bgColor = "rgba(30, 41, 59, 0.9)";
            let borderColor = "rgba(99, 102, 241, 0.4)";
            let textColor = "#e2e8f0";
            let shape: "rect" | "diamond" | "rounded" | "parallelogram" = "rect";

            switch (node.type) {
                case "start":
                    bgColor = "rgba(16, 185, 129, 0.15)";
                    borderColor = "rgba(16, 185, 129, 0.6)";
                    textColor = "#10b981";
                    shape = "rounded";
                    break;
                case "end":
                    bgColor = "rgba(239, 68, 68, 0.15)";
                    borderColor = "rgba(239, 68, 68, 0.6)";
                    textColor = "#ef4444";
                    shape = "rounded";
                    break;
                case "decision":
                    bgColor = "rgba(245, 158, 11, 0.15)";
                    borderColor = "rgba(245, 158, 11, 0.6)";
                    textColor = "#f59e0b";
                    shape = "diamond";
                    break;
                case "io":
                    bgColor = "rgba(6, 182, 212, 0.15)";
                    borderColor = "rgba(6, 182, 212, 0.6)";
                    textColor = "#06b6d4";
                    shape = "parallelogram";
                    break;
                default:
                    bgColor = "rgba(99, 102, 241, 0.12)";
                    borderColor = "rgba(99, 102, 241, 0.5)";
                    textColor = "#818cf8";
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = bgColor;

            if (shape === "rounded") {
                const r = h / 2;
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
                ctx.lineTo(x + r, y + h);
                ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2);
                ctx.closePath();
            } else if (shape === "diamond") {
                const cx = x + w / 2;
                const cy = y + h / 2;
                const hw = w / 2;
                const hh = h / 2;
                ctx.beginPath();
                ctx.moveTo(cx, y);
                ctx.lineTo(x + w, cy);
                ctx.lineTo(cx, y + h);
                ctx.lineTo(x, cy);
                ctx.closePath();
            } else if (shape === "parallelogram") {
                const skew = 12;
                ctx.beginPath();
                ctx.moveTo(x + skew, y);
                ctx.lineTo(x + w, y);
                ctx.lineTo(x + w - skew, y + h);
                ctx.lineTo(x, y + h);
                ctx.closePath();
            } else {
                // Rounded rectangle
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + w - radius, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
                ctx.lineTo(x + w, y + h - radius);
                ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
                ctx.lineTo(x + radius, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
            }

            ctx.fill();
            ctx.stroke();

            // Node label
            ctx.font = "12px Inter, system-ui, sans-serif";
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const maxLabelWidth = w - 20;
            let label = node.label;
            if (ctx.measureText(label).width > maxLabelWidth) {
                while (ctx.measureText(label + "…").width > maxLabelWidth && label.length > 0) {
                    label = label.slice(0, -1);
                }
                label += "…";
            }
            ctx.fillText(label, x + w / 2, y + h / 2);
        });
    }, [nodes, edges, dimensions, layout]);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[300px] overflow-auto">
            <canvas ref={canvasRef} className="block" />
        </div>
    );
}

// ============================================================
// PasteBlockedAlert - Animated alert when paste is blocked
// ============================================================
function PasteBlockedAlert({ show, onClose }: { show: boolean; onClose: () => void }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative max-w-md w-full mx-4 animate-scale-in">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-danger via-warning to-danger rounded-2xl opacity-40 blur-lg animate-pulse-slow" />
                <div className="relative p-6 rounded-2xl bg-surface-alt border border-danger/30 shadow-2xl">
                    {/* Shield icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-danger/10 border-2 border-danger/30 flex items-center justify-center">
                            <ShieldAlert className="w-8 h-8 text-danger" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary text-center mb-2">
                        Paste Blocked! 🚫
                    </h3>

                    {/* Message */}
                    <p className="text-text-secondary text-sm text-center mb-2">
                        <span className="text-danger font-semibold">Copying code from external sources is not allowed</span> in PixelLearn exercises.
                    </p>
                    <p className="text-text-muted text-xs text-center mb-5">
                        This is a proctor-enabled environment. Please write your own code to build real programming skills. You can use the theory section and hints provided to help you solve the exercise.
                    </p>

                    {/* Warning details */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20 mb-5">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div className="text-xs text-text-secondary">
                            <strong className="text-warning">Proctor Mode Active:</strong> Pasting code from AI tools, websites, or any external source into the code editor is detected and blocked to ensure genuine learning.
                        </div>
                    </div>

                    {/* Action button */}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm gradient-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        I Understand — I&apos;ll Write My Own Code
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// FlowchartHintModal - Beautiful flowchart diagram modal
// ============================================================
function FlowchartHintModal({
    show,
    onClose,
    exercise,
    flowchart,
}: {
    show: boolean;
    onClose: () => void;
    exercise: Exercise;
    flowchart: { nodes: FlowchartNode[]; edges: FlowchartEdge[] } | null;
}) {
    if (!show || !flowchart) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative max-w-3xl w-full mx-4 max-h-[85vh] animate-scale-in flex flex-col">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-20 blur-lg" />
                <div className="relative rounded-2xl bg-surface-alt border border-primary/20 shadow-2xl flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-primary-light" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-text-primary">
                                    Solution Flowchart
                                </h3>
                                <p className="text-xs text-text-muted">
                                    Visual approach to solve: {exercise.title}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-surface/50 shrink-0 overflow-x-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50" />
                            Start/End
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50" />
                            Process
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 rotate-45 bg-warning/20 border border-warning/50" />
                            Decision
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted whitespace-nowrap">
                            <div className="w-3 h-3 skew-x-[-12deg] bg-accent/20 border border-accent/50" />
                            I/O
                        </div>
                    </div>

                    {/* Flowchart */}
                    <div className="flex-1 overflow-auto p-4 min-h-[300px]">
                        <FlowchartDiagram
                            nodes={flowchart.nodes}
                            edges={flowchart.edges}
                        />
                    </div>

                    {/* Footer tip */}
                    <div className="p-3 border-t border-border bg-surface/50 shrink-0">
                        <p className="text-xs text-text-muted text-center">
                            💡 Follow the flowchart step-by-step to build your solution. Each box represents an action in your code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


function PlaygroundContent({
    courseId,
    exerciseId,
}: {
    courseId: string;
    exerciseId: string;
}) {
    const { user, completeExercise, isExerciseCompleted, enrollCourse } = useApp();
    const [course, setCourse] = useState<Course | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [showTheory, setShowTheory] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [language, setLanguage] = useState("python");
    const [showTheoryPanel, setShowTheoryPanel] = useState(true);
    const [previewHtml, setPreviewHtml] = useState("");
    const [showPasteAlert, setShowPasteAlert] = useState(false);
    const [showFlowchart, setShowFlowchart] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        fetch("/api/courses")
            .then((res) => res.json())
            .then((data) => {
                const foundCourse = data.find((c: Course) => c.id === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);
                    const allEx = foundCourse.chapters.flatMap((ch: Chapter) => ch.exercises);
                    const foundEx = allEx.find((e: Exercise) => e.id === exerciseId);
                    if (foundEx) {
                        setExercise(foundEx);
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId, exerciseId]);

    const allExercises = course?.chapters.flatMap((ch: Chapter) => ch.exercises) || [];
    const exerciseIndex = allExercises.findIndex((e: any) => e.id === exerciseId);
    const prevExercise = exerciseIndex > 0 ? allExercises[exerciseIndex - 1] : null;
    const nextExercise =
        exerciseIndex < allExercises.length - 1
            ? allExercises[exerciseIndex + 1]
            : null;

    const completed = exercise ? isExerciseCompleted(exercise.id) : false;
    const isFrontend = exercise ? isFrontendLanguage(exercise.language) : false;

    // Generate flowchart dynamically if not pre-defined
    const exerciseFlowchart = useMemo(() => {
        if (!exercise) return null;
        // Use pre-defined flowchart if available
        if (exercise.flowchart) return exercise.flowchart;
        // Otherwise, dynamically generate from exercise data
        return generateFlowchart(exercise);
    }, [exercise]);

    // Initialize code on exercise change
    useEffect(() => {
        if (exercise) {
            setCode(exercise.starterCode);
            setLanguage(exercise.language);
            setOutput("");
            setPreviewHtml("");
            setShowHints(false);
            setCurrentHintIndex(0);
            setShowFlowchart(false);
        }
    }, [exercise?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-update preview for frontend languages
    useEffect(() => {
        if (isFrontend && code) {
            const timer = setTimeout(() => {
                updatePreview(code, language);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [code, isFrontend, language]);

    // ============================================================
    // PROCTOR MODE: Block paste from external sources
    // ============================================================
    const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
        editorRef.current = editor;

        // Intercept paste action in Monaco
        editor.onDidPaste(() => {
            // We handle this via the DOM paste event below
        });

        // Block Ctrl+V / Cmd+V at the editor level
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
            setShowPasteAlert(true);
        });

        // Also block Shift+Insert
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => {
            setShowPasteAlert(true);
        });
    }, []);

    // Global paste interception for the editor area
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            // Check if the paste target is inside the Monaco editor
            const target = e.target as HTMLElement;
            const isInEditor = target.closest('.monaco-editor') !== null;

            if (isInEditor) {
                e.preventDefault();
                e.stopPropagation();
                setShowPasteAlert(true);
            }
        };

        // Attach to the document to catch all paste events
        document.addEventListener("paste", handlePaste, true);
        return () => document.removeEventListener("paste", handlePaste, true);
    }, []);

    // Also block via context menu paste on the editor
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.monaco-editor')) {
                // Context menu items for paste will still be blocked by the paste event handler
            }
        };
        document.addEventListener("contextmenu", handleContextMenu);
        return () => document.removeEventListener("contextmenu", handleContextMenu);
    }, []);

    const updatePreview = useCallback((htmlCode: string, lang: string) => {
        let fullHtml = "";
        const normalizedLang = lang.toLowerCase();

        if (normalizedLang === "html") {
            if (htmlCode.includes("<html") || htmlCode.includes("<!DOCTYPE")) {
                fullHtml = htmlCode;
            } else {
                fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>${htmlCode}</body>
</html>`;
            }
        } else if (normalizedLang === "css") {
            fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; margin: 0; background: #fff; color: #1a1a1a; }
    ${htmlCode}
  </style>
</head>
<body>
  <div class="container">
    <header><h1>CSS Preview</h1><p>Mastering Layouts</p></header>
    <main>
      <section class="card"><h2>Card Title</h2><p>This is a preview element to test your CSS.</p><button>Action Button</button></section>
    </main>
  </div>
</body>
</html>`;
        } else if (["jsx", "tsx", "javascript", "typescript"].includes(normalizedLang)) {
            const isReact = htmlCode.includes("React") || htmlCode.includes("<") || normalizedLang === "jsx" || normalizedLang === "tsx";

            if (isReact) {
                fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    /** @jsx React.createElement */
    /** @jsxFrag React.Fragment */
    try {
      window.parent.postMessage({ type: 'console', method: 'clear' }, '*');
      const originalLog = console.log;
      console.log = (...args) => {
        window.parent.postMessage({ 
          type: 'console', 
          method: 'log', 
          content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') 
        }, '*');
        originalLog.apply(console, args);
      };

      ${htmlCode.replace(/import\s+React.*\s+from\s+['"]react['"];?/g, '')
                        .replace(/export\s+default\s+/g, 'const App = ')
                    }
      
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      } else {
          document.getElementById('root').innerHTML = '<div style="padding: 2.5rem; text-align: center; color: #64748b; border: 2px dashed #e2e8f0; margin: 1rem; border-radius: 1rem;">No export default App found. Please export a default component named App.</div>';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('root').innerHTML = '<div style="color: #ef4444; padding: 1.5rem; background: #fef2f2; border: 1px solid #fee2e2; margin: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 14px;"><strong>Transpilation Error:</strong><br/>' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
            } else {
                fullHtml = `<!DOCTYPE html><html><body><div id="root"></div><script>${htmlCode}<\/script></body></html>`;
            }
        }
        setPreviewHtml(fullHtml);
    }, []);

    const runCode = useCallback(async () => {
        if (!exercise || isRunning) return;
        setIsRunning(true);
        setOutput("");

        if (isFrontend) {
            updatePreview(code, language);
            setOutput("✓ Preview updated successfully");
            setIsRunning(false);
            return;
        }

        try {
            const response = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: exercise.language }),
            });

            const result = await response.json();

            if (result.error && result.error.trim()) {
                setOutput(`Error: ${result.error}\n\n⏱ Execution time: ${result.executionTime}ms`);
            } else if (result.output !== undefined) {
                setOutput(
                    `${result.output}\n\n✓ Execution time: ${result.executionTime}ms`
                );
            } else {
                setOutput("(No output)");
            }
        } catch {
            try {
                if (exercise.language === "javascript") {
                    let capturedOutput = "";
                    const mockConsole = {
                        log: (...args: unknown[]) => {
                            capturedOutput +=
                                args
                                    .map((a) =>
                                        typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
                                    )
                                    .join(" ") + "\n";
                        },
                    };
                    const fn = new Function("console", code);
                    fn(mockConsole);
                    setOutput(capturedOutput.trimEnd() || "(No output)");
                } else {
                    setOutput(
                        "⚠ Code execution service unavailable. Please try again."
                    );
                }
            } catch (e: unknown) {
                setOutput(
                    `Error: ${e instanceof Error ? e.message : "Unknown error"}`
                );
            }
        }

        setIsRunning(false);
    }, [code, exercise, isRunning, isFrontend, language, updatePreview]);

    const handleMarkComplete = useCallback(() => {
        if (exercise && !completed) {
            completeExercise(exercise.id, exercise.xpReward);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    }, [exercise, completed, completeExercise]);

    const resetCode = useCallback(() => {
        if (exercise) {
            setCode(exercise.starterCode);
            setOutput("");
            setPreviewHtml("");
        }
    }, [exercise]);

    // Auto-enroll if visiting playground
    useEffect(() => {
        if (courseId && !user.enrolledCourses.includes(courseId)) {
            enrollCourse(courseId);
        }
    }, [courseId, user.enrolledCourses, enrollCourse]);

    if (!course || !exercise) {
        return (
            <main className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Exercise Not Found
                    </h1>
                    <Link href="/courses" className="text-primary-light hover:underline">
                        ← Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    // Get Monaco language
    const monacoLang = language === "cpp" ? "cpp" : language === "jsx" ? "javascript" : language === "tsx" ? "typescript" : language === "reactjs" ? "javascript" : language;

    return (
        <div className="h-screen bg-surface flex flex-col overflow-hidden">
            {/* Paste Blocked Alert */}
            <PasteBlockedAlert show={showPasteAlert} onClose={() => setShowPasteAlert(false)} />

            {/* Flowchart Hint Modal */}
            <FlowchartHintModal
                show={showFlowchart}
                onClose={() => setShowFlowchart(false)}
                exercise={exercise}
                flowchart={exerciseFlowchart}
            />

            {/* Top Bar */}
            <div className="h-14 border-b border-border bg-surface-alt/80 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/courses/${courseId}`}
                        className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{course.title}</span>
                    </Link>
                    <span className="text-border">|</span>
                    <h1 className="text-sm font-semibold text-text-primary truncate max-w-[300px]">
                        {exercise.title}
                    </h1>
                    {completed && (
                        <span className="flex items-center gap-1 text-xs text-success font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                    )}
                    {/* Proctor Badge */}
                    <span className="flex items-center gap-1 text-xs text-danger/80 font-medium bg-danger/5 border border-danger/20 px-2 py-0.5 rounded-full">
                        <ShieldAlert className="w-3 h-3" /> Proctor Mode
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Toggle theory panel */}
                    <button
                        onClick={() => setShowTheoryPanel(!showTheoryPanel)}
                        className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                        title={showTheoryPanel ? "Hide theory" : "Show theory"}
                    >
                        {showTheoryPanel ? (
                            <PanelLeftClose className="w-4 h-4" />
                        ) : (
                            <PanelRightClose className="w-4 h-4" />
                        )}
                    </button>
                    <span className="text-border">|</span>
                    {/* Nav Exercises */}
                    {prevExercise && (
                        <Link
                            href={`/playground/${courseId}/${prevExercise.id}`}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            title="Previous exercise"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    )}
                    <span className="text-xs text-text-muted">
                        {exerciseIndex + 1} / {allExercises.length}
                    </span>
                    {nextExercise && (
                        <Link
                            href={`/playground/${courseId}/${nextExercise.id}`}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                            title="Next exercise"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                    <span className="text-border mx-1">|</span>
                    <span className="flex items-center gap-1 text-xs text-warning font-medium">
                        <Zap className="w-3 h-3" /> {exercise.xpReward} XP
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Theory/Problem */}
                {showTheoryPanel && (
                    <div
                        className={`border-r border-border flex flex-col overflow-hidden transition-all duration-300 ${isFrontend ? "w-1/4" : "w-1/2"
                            }`}
                    >
                        {/* Panel Tabs */}
                        <div className="flex items-center border-b border-border bg-surface-alt/50 shrink-0">
                            <button
                                onClick={() => setShowTheory(true)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors ${showTheory
                                    ? "text-primary-light border-b-2 border-primary"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    Theory
                                </span>
                            </button>
                            <button
                                onClick={() => setShowTheory(false)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors ${!showTheory
                                    ? "text-primary-light border-b-2 border-primary"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Code2 className="w-4 h-4" />
                                    Problem
                                </span>
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {showTheory ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-text-primary mb-3">
                                            {exercise.title}
                                        </h2>
                                        <p className="text-text-secondary text-sm mb-4">
                                            {exercise.description}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {exercise.theory.split("\n").map((line: string, i: number) => {
                                            if (line.startsWith("### ")) {
                                                return (
                                                    <h3
                                                        key={i}
                                                        className="text-base font-semibold text-text-primary mt-4"
                                                    >
                                                        {line.replace("### ", "")}
                                                    </h3>
                                                );
                                            }
                                            if (line.startsWith("```")) {
                                                return null;
                                            }
                                            if (line.startsWith("- ")) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                    >
                                                        <span className="text-primary-light mt-1">•</span>
                                                        <span>{line.replace("- ", "")}</span>
                                                    </div>
                                                );
                                            }
                                            if (line.trim()) {
                                                return (
                                                    <p
                                                        key={i}
                                                        className="text-sm text-text-secondary leading-relaxed"
                                                    >
                                                        {line}
                                                    </p>
                                                );
                                            }
                                            return <br key={i} />;
                                        })}
                                    </div>

                                    {/* Problem Statement in Theory tab too */}
                                    <div className="mt-6 pt-5 border-t border-border">
                                        <h3 className="text-base font-semibold text-text-primary mb-2">
                                            📝 Exercise Question
                                        </h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {exercise.problemStatement}
                                        </p>
                                    </div>

                                    {/* Flowchart Hint Button in Theory */}
                                    {exerciseFlowchart && (
                                        <div className="mt-5">
                                            <button
                                                onClick={() => setShowFlowchart(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-primary-light hover:bg-primary/10 transition-all group"
                                            >
                                                <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                                <span className="text-sm font-medium">View Solution Flowchart</span>
                                                <span className="text-xs text-text-muted">(Visual Hint)</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary mb-2">
                                            Problem Statement
                                        </h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {exercise.problemStatement}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-3 rounded-xl bg-surface-alt border border-border">
                                            <div className="text-xs font-medium text-text-muted mb-1">
                                                Input
                                            </div>
                                            <code className="text-sm text-text-primary font-mono">
                                                {exercise.inputExample}
                                            </code>
                                        </div>
                                        <div className="p-3 rounded-xl bg-surface-alt border border-border">
                                            <div className="text-xs font-medium text-text-muted mb-1">
                                                Expected Output
                                            </div>
                                            <code className="text-sm text-success font-mono">
                                                {exercise.outputExample}
                                            </code>
                                        </div>
                                    </div>

                                    {exercise.constraints.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-text-primary mb-2">
                                                Constraints
                                            </h4>
                                            <ul className="space-y-1">
                                                {exercise.constraints.map((c: string, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                                    >
                                                        <span className="text-warning mt-0.5">⚠</span>
                                                        {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Flowchart Hint Button */}
                                    {exerciseFlowchart && (
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                                            <button
                                                onClick={() => setShowFlowchart(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary-light hover:bg-primary/15 transition-all group"
                                            >
                                                <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                                <span className="text-sm font-medium">💡 Need Help? View Flowchart</span>
                                            </button>
                                            <p className="text-[10px] text-text-muted text-center mt-1.5">
                                                See a visual diagram of how to approach this exercise
                                            </p>
                                        </div>
                                    )}

                                    {/* Hints */}
                                    <div>
                                        <button
                                            onClick={() => setShowHints(!showHints)}
                                            className="flex items-center gap-2 text-sm font-medium text-primary-light hover:text-primary transition-colors"
                                        >
                                            {showHints ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                            <Lightbulb className="w-4 h-4" />
                                            {showHints
                                                ? "Hide Hints"
                                                : `Show Hints (${exercise.hints.length})`}
                                        </button>
                                        {showHints && (
                                            <div className="mt-3 space-y-2">
                                                {exercise.hints
                                                    .slice(0, currentHintIndex + 1)
                                                    .map((hint: string, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="p-3 rounded-lg bg-warning/5 border border-warning/20 text-sm text-text-secondary animate-fade-in"
                                                        >
                                                            <span className="font-medium text-warning">
                                                                Hint {i + 1}:
                                                            </span>{" "}
                                                            {hint}
                                                        </div>
                                                    ))}
                                                {currentHintIndex < exercise.hints.length - 1 && (
                                                    <button
                                                        onClick={() => setCurrentHintIndex((p) => p + 1)}
                                                        className="text-xs text-primary-light hover:text-primary"
                                                    >
                                                        Show next hint →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Middle Panel - Code Editor */}
                <div
                    className={`flex flex-col overflow-hidden border-r border-border transition-all duration-300 ${isFrontend
                        ? showTheoryPanel
                            ? "w-[38%]"
                            : "w-1/2"
                        : showTheoryPanel
                            ? "w-1/2"
                            : "w-full"
                        }`}
                >
                    {/* Editor Toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-2 py-1 rounded bg-surface-hover border border-border text-xs text-text-primary focus:outline-none"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="jsx">React (JSX)</option>
                                <option value="tsx">React (TSX)</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                            <button
                                onClick={resetCode}
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                                title="Reset code"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {!completed && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-success/30 text-success hover:bg-success/10 transition-all"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Complete
                                </button>
                            )}
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold gradient-primary text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                            >
                                {isRunning ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Play className="w-3.5 h-3.5" />
                                )}
                                {isRunning ? "Running..." : "Run Code"}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className={`${isFrontend ? "flex-1" : "flex-1"} min-h-0`}>
                        <MonacoEditor
                            height="100%"
                            language={monacoLang}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            onMount={handleEditorDidMount}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                                lineNumbersMinChars: 3,
                                renderLineHighlight: "line",
                                tabSize: 2,
                                insertSpaces: true,
                                wordWrap: "on",
                                automaticLayout: true,
                                smoothScrolling: true,
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                            }}
                        />
                    </div>

                    {/* Output Console - only for non-frontend languages */}
                    {!isFrontend && (
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
                            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
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
                    )}
                </div>

                {/* Right Panel - Browser Preview (frontend languages only) */}
                {isFrontend && (
                    <div
                        className={`flex flex-col overflow-hidden transition-all duration-300 ${showTheoryPanel ? "w-[38%]" : "w-1/2"
                            }`}
                    >
                        {/* Preview Header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-alt/50 shrink-0">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <Globe className="w-4 h-4 text-primary-light" />
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
                                    ref={iframeRef}
                                    srcDoc={previewHtml}
                                    className="w-full h-full border-0"
                                    title="Code Preview"
                                    sandbox="allow-scripts allow-modals"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-surface-alt">
                                    <div className="text-center">
                                        <Globe className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                                        <p className="text-text-muted text-sm">
                                            Write some HTML/CSS and it will preview here
                                        </p>
                                        <p className="text-text-muted/60 text-xs mt-1">
                                            Auto-updates as you type
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Console output for frontend */}
                        <div className="h-28 border-t border-border bg-surface-alt flex flex-col shrink-0">
                            <div className="flex items-center justify-between px-4 py-1.5 border-b border-border">
                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <Terminal className="w-3.5 h-3.5" />
                                    Console
                                </div>
                                {output && (
                                    <button
                                        onClick={() => setOutput("")}
                                        className="p-0.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
                                {output ? (
                                    <pre
                                        className={`whitespace-pre-wrap ${output.includes("Error") ? "text-danger" : "text-success"
                                            }`}
                                    >
                                        {output}
                                    </pre>
                                ) : (
                                    <span className="text-text-muted text-xs">
                                        Preview updates automatically as you type...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="glass rounded-xl p-4 flex items-center gap-3 shadow-2xl border-success/30 border">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-text-primary">
                                Exercise Completed! 🎉
                            </div>
                            <div className="text-xs text-text-secondary">
                                +{exercise.xpReward} XP earned
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PlaygroundPage({
    params,
}: {
    params: Promise<{ courseId: string; exerciseId: string }>;
}) {
    const resolvedParams = use(params);
    return (
        <AppProvider>
            <PlaygroundContent
                courseId={resolvedParams.courseId}
                exerciseId={resolvedParams.exerciseId}
            />
        </AppProvider>
    );
}
