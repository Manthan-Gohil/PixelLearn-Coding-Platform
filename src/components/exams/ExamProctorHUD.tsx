"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Eye,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
} from "lucide-react";
import { FacialExpression } from "@/hooks/useExamProctor";

interface ExamProctorHUDProps {
  stream: MediaStream | null;
  videoElementRef: React.RefObject<HTMLVideoElement | null>;
  audioLevel: number; // 0 to 100
  currentExpression: FacialExpression;
  isLookingAway: boolean;
  isFaceDetected: boolean;
  activeWarning: string | null;
}

export default function ExamProctorHUD({
  stream,
  videoElementRef,
  audioLevel,
  currentExpression,
  isLookingAway,
  isFaceDetected,
  activeWarning,
}: ExamProctorHUDProps) {
  const [collapsed, setCollapsed] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Bind mediaStream to video elements
  useEffect(() => {
    if (stream) {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
      }
    }
  }, [stream, videoElementRef]);

  // Expression styling configuration
  const getExpressionBadge = (expr: FacialExpression) => {
    switch (expr) {
      case "Tensed":
        return {
          label: "Tensed",
          icon: "⚡",
          classes: "bg-red-500/20 text-red-400 border-red-500/40",
          glow: "shadow-red-500/10",
        };
      case "Relaxed":
        return {
          label: "Relaxed",
          icon: "🌿",
          classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          glow: "shadow-emerald-500/10",
        };
      case "Confused":
        return {
          label: "Confused",
          icon: "❓",
          classes: "bg-purple-500/20 text-purple-400 border-purple-500/40",
          glow: "shadow-purple-500/10",
        };
      case "Focused":
      default:
        return {
          label: "Focused",
          icon: "🎯",
          classes: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          glow: "shadow-blue-500/10",
        };
    }
  };

  const badge = getExpressionBadge(currentExpression);

  return (
    <>
      {/* ── Active Warning Notification Toast ── */}
      {activeWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[400] max-w-lg w-full px-4 animate-slide-down">
          <div className="bg-red-950/90 border-2 border-red-500/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/50">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-extrabold text-red-300">Proctor Alert</p>
              <p className="text-neutral-200 mt-0.5">{activeWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Hidden video element for hook canvas frame extraction ── */}
      <video
        ref={videoElementRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />

      {/* ── Floating Picture-in-Picture Proctor Widget ── */}
      <div className="fixed bottom-4 right-4 z-[150] select-none">
        <div className="bg-[#121212]/95 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-56 sm:w-64">
          {/* Header / Proctor Status Bar */}
          <div className="px-3 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-mono text-[11px] font-bold text-neutral-300 tracking-wider">
                LIVE PROCTOR
              </span>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors"
              title={collapsed ? "Expand Proctor View" : "Minimize"}
            >
              {collapsed ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {!collapsed && (
            <div>
              {/* Webcam Viewport */}
              <div className="relative aspect-video bg-black/80 overflow-hidden flex items-center justify-center">
                {stream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-500 text-xs">
                    <VideoOff className="w-6 h-6" />
                    <span>No Camera Feed</span>
                  </div>
                )}

                {/* Head Pose & Gaze Status Overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  {!isFaceDetected ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/80 text-white font-bold backdrop-blur-sm">
                      Face Missing
                    </span>
                  ) : isLookingAway ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-yellow-500/80 text-black font-bold backdrop-blur-sm animate-pulse">
                      Looking Away
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/80 text-white font-bold backdrop-blur-sm flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" /> Gaze Centered
                    </span>
                  )}
                </div>

                {/* Audio Level Indicator */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <Volume2 className="w-3 h-3 text-neutral-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-100 rounded-full ${
                        audioLevel > 35
                          ? "bg-red-500"
                          : audioLevel > 15
                          ? "bg-[#E6C212]"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${Math.min(100, audioLevel)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {audioLevel > 35 ? "VOICE" : "QUIET"}
                  </span>
                </div>
              </div>

              {/* Cognitive & Facial Expression Badge */}
              <div className="p-2.5 bg-[#0e0e0e] border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-neutral-400">
                  <span>Expression:</span>
                </div>

                <div
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shadow-sm transition-all ${badge.classes}`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact collapsed strip */}
          {collapsed && (
            <div className="p-2 flex items-center justify-between text-xs bg-[#0e0e0e]">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">{badge.icon}</span>
                <span className="text-[11px] font-bold text-neutral-300">{badge.label}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">REC ON</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
