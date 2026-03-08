"use client";

import { useState, useEffect, useRef } from "react";

interface TypingTextProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
}

export default function TypingText({
    texts,
    typingSpeed = 60,
    deletingSpeed = 30,
    pauseDuration = 2000,
    className = "",
}: TypingTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentFullText = texts[textIndex];

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        if (isDeleting) {
            if (displayText.length === 0) {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
                return;
            }
            const timer = setTimeout(() => {
                setDisplayText((prev) => prev.slice(0, -1));
            }, deletingSpeed);
            return () => clearTimeout(timer);
        }

        if (displayText.length === currentFullText.length) {
            setIsPaused(true);
            return;
        }

        const timer = setTimeout(() => {
            setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, textIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-[2px] h-[1em] bg-primary-light ml-0.5 animate-blink align-middle" />
        </span>
    );
}
