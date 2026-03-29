"use client";

interface MarqueeTextProps {
    texts?: string[];
    speed?: number;
    className?: string;
    separator?: string;
}

export default function MarqueeText({
    texts = ["LEARN", "BUILD", "GROW", "CODE", "PRACTICE", "MASTER", "CREATE", "SHIP"],
    speed = 30,
    className = "",
    separator = "•",
}: MarqueeTextProps) {
    const content = texts.map(t => `${t} ${separator} `).join("");
    // Duplicate for seamless loop
    const doubled = content + content + content;

    return (
        <div className={`overflow-hidden whitespace-nowrap select-none ${className}`}>
            <div
                className="inline-block animate-marquee-scroll"
                style={{ animationDuration: `${speed}s` }}
            >
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-wider text-[#222] uppercase">
                    {doubled}
                </span>
            </div>
        </div>
    );
}
