"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { FlowchartNode, FlowchartEdge } from "@/types";

interface FlowchartDiagramProps {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
}

export default function FlowchartDiagram({
    nodes,
    edges,
}: FlowchartDiagramProps) {
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

    const layout = useCallback(() => {
        if (!nodes.length) return { positions: new Map<string, { x: number; y: number; w: number; h: number }>(), totalHeight: 0 };

        const positions = new Map<string, { x: number; y: number; w: number; h: number }>();
        const nodeW = 200;
        const nodeH = 48;
        const gapY = 70;
        const centerX = dimensions.width / 2;

        const outEdges = new Map<string, FlowchartEdge[]>();
        edges.forEach((e) => {
            if (!outEdges.has(e.from)) outEdges.set(e.from, []);
            outEdges.get(e.from)!.push(e);
        });

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

        nodes.forEach((n) => {
            if (!levels.has(n.id)) {
                levels.set(n.id, nodes.indexOf(n));
            }
        });

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

            const midY = (fromY + toY) / 2;
            ctx.moveTo(fromX, fromY);
            ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
            ctx.stroke();

            const angle = Math.atan2(toY - midY, toX - toX) || Math.PI / 2;
            const arrowSize = 8;
            ctx.beginPath();
            ctx.fillStyle = "rgba(99, 102, 241, 0.7)";
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

            if (edge.label) {
                const labelX = (fromX + toX) / 2;
                const labelY = midY - 6;
                ctx.font = "11px Inter, system-ui, sans-serif";
                ctx.fillStyle = "#818cf8";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
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

        nodes.forEach((node) => {
            const pos = positions.get(node.id);
            if (!pos) return;
            const { x, y, w, h } = pos;
            let bgColor = "rgba(30, 41, 59, 0.9)";
            let borderColor = "rgba(99, 102, 241, 0.4)";
            let textColor = "#e2e8f0";
            let shape: "rect" | "diamond" | "rounded" | "parallelogram" = "rect";

            switch (node.type) {
                case "start": bgColor = "rgba(16, 185, 129, 0.15)"; borderColor = "rgba(16, 185, 129, 0.6)"; textColor = "#10b981"; shape = "rounded"; break;
                case "end": bgColor = "rgba(239, 68, 68, 0.15)"; borderColor = "rgba(239, 68, 68, 0.6)"; textColor = "#ef4444"; shape = "rounded"; break;
                case "decision": bgColor = "rgba(245, 158, 11, 0.15)"; borderColor = "rgba(245, 158, 11, 0.6)"; textColor = "#f59e0b"; shape = "diamond"; break;
                case "io": bgColor = "rgba(6, 182, 212, 0.15)"; borderColor = "rgba(6, 182, 212, 0.6)"; textColor = "#06b6d4"; shape = "parallelogram"; break;
                default: bgColor = "rgba(99, 102, 241, 0.12)"; borderColor = "rgba(99, 102, 241, 0.5)"; textColor = "#818cf8";
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
                ctx.beginPath();
                ctx.moveTo(cx, y); ctx.lineTo(x + w, cy); ctx.lineTo(cx, y + h); ctx.lineTo(x, cy);
                ctx.closePath();
            } else if (shape === "parallelogram") {
                const skew = 12;
                ctx.beginPath();
                ctx.moveTo(x + skew, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - skew, y + h); ctx.lineTo(x, y + h);
                ctx.closePath();
            } else {
                const radius = 10;
                ctx.beginPath();
                ctx.moveTo(x + radius, y); ctx.lineTo(x + w - radius, y); ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
                ctx.lineTo(x + w, y + h - radius); ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
                ctx.lineTo(x + radius, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
                ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
            }

            ctx.fill();
            ctx.stroke();

            ctx.font = "12px Inter, system-ui, sans-serif";
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const maxLabelWidth = w - 20;
            let label = node.label;
            if (ctx.measureText(label).width > maxLabelWidth) {
                while (ctx.measureText(label + "…").width > maxLabelWidth && label.length > 0) label = label.slice(0, -1);
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
