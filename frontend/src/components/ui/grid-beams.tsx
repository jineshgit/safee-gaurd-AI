"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const GridBeams = ({
    className,
    strokeColor = "rgba(255, 255, 255, 0.1)", // Even subtler default
    beamColor = "rgba(59, 130, 246, 0.5)", // Blue-ish beam
    width = 50,
    height = 50,
    numBeams = 4, // Number of concurrent beams
}: {
    className?: string;
    strokeColor?: string;
    beamColor?: string;
    width?: number;
    height?: number;
    numBeams?: number;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Generate beams
    const [beams, setBeams] = useState<{ id: number; x: number; y: number; horizontal: boolean }[]>([]);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const interval = setInterval(() => {
            const newBeam = {
                id: Date.now(),
                // Snap to grid lines
                x: Math.floor(Math.random() * (dimensions.width / width)) * width,
                y: Math.floor(Math.random() * (dimensions.height / height)) * height,
                horizontal: Math.random() > 0.5,
            };

            setBeams((prev) => [...prev.slice(-numBeams), newBeam]);
        }, 2000); // Add a new beam every 2s

        return () => clearInterval(interval);
    }, [dimensions, width, height, numBeams]);

    return (
        <div
            ref={containerRef}
            className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
            style={{
                backgroundImage: `
          linear-gradient(to right, ${strokeColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${strokeColor} 1px, transparent 1px)
        `,
                backgroundSize: `${width}px ${height}px`,
                maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            }}
        >
            {beams.map((beam) => (
                <Beam
                    key={beam.id}
                    x={beam.x}
                    y={beam.y}
                    horizontal={beam.horizontal}
                    color={beamColor}
                    length={beam.horizontal ? width * 4 : height * 4}
                />
            ))}
        </div>
    );
};

const Beam = ({
    x,
    y,
    horizontal,
    color,
    length = 200,
}: {
    x: number;
    y: number;
    horizontal: boolean;
    color: string;
    length?: number;
}) => {
    return (
        <div
            className={cn(
                "absolute rounded-full opacity-0 animate-beam",
                horizontal ? "h-[2px]" : "w-[2px]"
            )}
            style={{
                left: x,
                top: y,
                width: horizontal ? length : "2px",
                height: horizontal ? "2px" : length,
                background: `linear-gradient(to ${horizontal ? "right" : "bottom"}, transparent, ${color}, transparent)`,
                // We use a custom animation defined in globals.css or inline style for simplicity
                // But for "running" effect, we animate the offset.
                // Actually simplest is to just render it and let it fade/move via CSS animation keyframes
                // Let's use a one-shot animation.
                animation: `beam-move 3s linear forwards`,
                "--tx": horizontal ? `${length}px` : "0px",
                "--ty": horizontal ? "0px" : `${length}px`,
            } as React.CSSProperties}
        />
    );
};

// We need to add 'beam-move' keyframes to global CSS or use framer-motion.
// Since we used raw CSS animations elsewhere, let's keep it consistent.
// HOWEVER, to make it "run", we really need motion.
// I'll assume we add keyframes in globals.css shortly.
