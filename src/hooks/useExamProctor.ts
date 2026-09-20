"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type FacialExpression = "Relaxed" | "Focused" | "Tensed" | "Confused";

export interface QuestionTelemetry {
  questionId: string;
  questionTitle: string;
  totalSamples: number;
  tensedCount: number;
  relaxedCount: number;
  focusedCount: number;
  confusedCount: number;
  dominantExpression: FacialExpression;
}

export interface ProctorViolation {
  type: string;
  timestamp: string;
  details?: string;
}

interface UseExamProctorProps {
  activeQuestionId?: string;
  activeQuestionTitle?: string;
  isExamActive: boolean;
  onViolation?: (violation: ProctorViolation) => void;
}

export function useExamProctor({
  activeQuestionId,
  activeQuestionTitle,
  isExamActive,
  onViolation,
}: UseExamProctorProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Real-time metrics
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100
  const [currentExpression, setCurrentExpression] = useState<FacialExpression>("Focused");
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(true);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);

  // Question-level cognitive tracking
  const [questionStats, setQuestionStats] = useState<Record<string, QuestionTelemetry>>({});

  // Refs for audio and video processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastAudioWarningRef = useRef<number>(0);
  const lastHeadWarningRef = useRef<number>(0);
  const lastFaceMissingWarningRef = useRef<number>(0);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger temporary UI warning toast
  const triggerWarning = useCallback((message: string) => {
    setActiveWarning(message);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      setActiveWarning(null);
    }, 3500);
  }, []);

  // ── Request Camera & Microphone Permissions ──
  const requestMediaPermissions = useCallback(async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setPermissionError("Webcam and microphone are not supported on this browser.");
        setHasPermission(false);
        return null;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // keep natural for noise detection
        },
      });

      setStream(mediaStream);
      setHasPermission(true);
      setPermissionError(null);
      return mediaStream;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Camera and microphone access was denied.";
      setPermissionError(errorMsg);
      setHasPermission(false);
      return null;
    }
  }, []);

  // ── Setup Audio Processing ──
  useEffect(() => {
    if (!stream || !isExamActive) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute Root Mean Square (RMS) volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const normalized = Math.min(100, Math.round((rms / 128) * 100));
        setAudioLevel(normalized);

        // Threshold for human voice or significant background noise
        if (normalized > 35) {
          const now = Date.now();
          if (now - lastAudioWarningRef.current > 6000) {
            lastAudioWarningRef.current = now;
            triggerWarning("Voice or background noise detected. Please maintain silence.");
            if (onViolation) {
              onViolation({
                type: "audio_detected",
                timestamp: new Date().toISOString(),
                details: `Noise level: ${normalized}%`,
              });
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.warn("AudioContext initialization warning:", err);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream, isExamActive, onViolation, triggerWarning]);

  // ── Setup Video & Face/Head/Expression Analysis ──
  useEffect(() => {
    if (!stream || !isExamActive) return;

    // Create off-screen canvas for frame analysis
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 120;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let intervalId: NodeJS.Timeout;

    const analyzeVideoFrame = () => {
      const video = videoElementRef.current;
      if (!video || video.readyState < 2 || !ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = frame;

      // 1. Detect Skin-tone pixels to approximate Face Location & Head Pose
      let skinPixels = 0;
      let sumX = 0;
      let sumY = 0;

      // Facial zones for expression analysis
      let upperFaceBrightness = 0; // Forehead / brow region
      let upperFaceCount = 0;
      let lowerFaceBrightness = 0; // Mouth / jaw region
      let lowerFaceCount = 0;
      let leftFaceSkin = 0;
      let rightFaceSkin = 0;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Normalized skin tone heuristic (RGB color space)
          const isSkin =
            r > 60 &&
            g > 40 &&
            b > 20 &&
            r > g &&
            r > b &&
            Math.abs(r - g) > 15 &&
            r - b > 15;

          if (isSkin) {
            skinPixels++;
            sumX += x;
            sumY += y;

            if (x < width / 2) {
              leftFaceSkin++;
            } else {
              rightFaceSkin++;
            }

            if (y < height * 0.45) {
              upperFaceBrightness += (r + g + b) / 3;
              upperFaceCount++;
            } else if (y > height * 0.55 && y < height * 0.85) {
              lowerFaceBrightness += (r + g + b) / 3;
              lowerFaceCount++;
            }
          }
        }
      }

      const totalPixels = width * height;
      const skinRatio = skinPixels / totalPixels;

      // Check if face is present
      const faceDetected = skinRatio > 0.05 && skinRatio < 0.85;
      setIsFaceDetected(faceDetected);

      const now = Date.now();

      if (!faceDetected) {
        if (now - lastFaceMissingWarningRef.current > 8000) {
          lastFaceMissingWarningRef.current = now;
          triggerWarning("Face not detected. Ensure your face is clearly visible.");
          if (onViolation) {
            onViolation({
              type: "face_missing",
              timestamp: new Date().toISOString(),
              details: "No face detected in camera stream",
            });
          }
        }
        return;
      }

      // 2. Head Yaw & Turn Detection
      const centerX = sumX / skinPixels;
      const expectedCenterX = width / 2;
      const xOffsetRatio = (centerX - expectedCenterX) / width;
      const symmetryRatio = Math.abs(leftFaceSkin - rightFaceSkin) / (skinPixels || 1);

      // Looking away if center is skewed by > 18% or high lateral asymmetry
      const lookingAway = Math.abs(xOffsetRatio) > 0.18 || symmetryRatio > 0.42;
      setIsLookingAway(lookingAway);

      if (lookingAway) {
        if (now - lastHeadWarningRef.current > 7000) {
          lastHeadWarningRef.current = now;
          triggerWarning("Head turned / Looking away detected. Please face the screen.");
          if (onViolation) {
            onViolation({
              type: "head_movement_detected",
              timestamp: new Date().toISOString(),
              details: `Head yaw offset: ${(xOffsetRatio * 100).toFixed(1)}%`,
            });
          }
        }
      }

      // 3. Facial Expression Classifier (Tensed vs. Relaxed vs. Focused vs. Confused)
      // Eyebrow furrowing and lip compression cause higher edge variance in the upper/lower face
      const upperAvg = upperFaceCount > 0 ? upperFaceBrightness / upperFaceCount : 128;
      const lowerAvg = lowerFaceCount > 0 ? lowerFaceBrightness / lowerFaceCount : 128;
      const browTension = Math.abs(upperAvg - lowerAvg);

      let detectedExpression: FacialExpression = "Focused";

      if (lookingAway) {
        detectedExpression = "Confused";
      } else if (browTension > 36 || symmetryRatio > 0.28) {
        // High tension or concentrated furrow
        detectedExpression = "Tensed";
      } else if (browTension < 14 && symmetryRatio < 0.15) {
        // Smooth, relaxed posture
        detectedExpression = "Relaxed";
      } else {
        detectedExpression = "Focused";
      }

      setCurrentExpression(detectedExpression);

      // 4. Record sample for current active question
      if (activeQuestionId) {
        setQuestionStats((prev) => {
          const current = prev[activeQuestionId] || {
            questionId: activeQuestionId,
            questionTitle: activeQuestionTitle || "Current Question",
            totalSamples: 0,
            tensedCount: 0,
            relaxedCount: 0,
            focusedCount: 0,
            confusedCount: 0,
            dominantExpression: "Focused",
          };

          const updated = {
            ...current,
            questionTitle: activeQuestionTitle || current.questionTitle,
            totalSamples: current.totalSamples + 1,
            tensedCount: current.tensedCount + (detectedExpression === "Tensed" ? 1 : 0),
            relaxedCount: current.relaxedCount + (detectedExpression === "Relaxed" ? 1 : 0),
            focusedCount: current.focusedCount + (detectedExpression === "Focused" ? 1 : 0),
            confusedCount: current.confusedCount + (detectedExpression === "Confused" ? 1 : 0),
          };

          // Determine dominant expression
          const maxCount = Math.max(
            updated.tensedCount,
            updated.relaxedCount,
            updated.focusedCount,
            updated.confusedCount
          );

          if (maxCount === updated.tensedCount) updated.dominantExpression = "Tensed";
          else if (maxCount === updated.relaxedCount) updated.dominantExpression = "Relaxed";
          else if (maxCount === updated.confusedCount) updated.dominantExpression = "Confused";
          else updated.dominantExpression = "Focused";

          return { ...prev, [activeQuestionId]: updated };
        });
      }
    };

    // Analyze every 350ms (~3 FPS) for high responsiveness with minimal CPU usage
    intervalId = setInterval(analyzeVideoFrame, 350);

    return () => {
      clearInterval(intervalId);
    };
  }, [stream, isExamActive, activeQuestionId, activeQuestionTitle, onViolation, triggerWarning]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [stream]);

  return {
    stream,
    hasPermission,
    permissionError,
    requestMediaPermissions,
    videoElementRef,
    audioLevel,
    currentExpression,
    isLookingAway,
    isFaceDetected,
    activeWarning,
    questionStats,
  };
}
