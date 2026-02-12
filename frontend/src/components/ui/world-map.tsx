"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";

interface MapProps {
    dots?: Array<{
        start: { lat: number; lng: number; label?: string };
        end: { lat: number; lng: number; label?: string };
    }>;
    lineColor?: string;
}

export default function WorldMap({
    dots = [],
    lineColor = "#10b981", // sr-green default
}: MapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const svgMap = map.getSVG({
        radius: 0.22,
        color: "#e5e7eb", // slate-200
        shape: "circle",
        backgroundColor: "transparent",
    });

    const projectPoint = (lat: number, lng: number) => {
        const x = (lng + 180) * (800 / 360);
        const y = ((-1 * lat + 90) * (400 / 180));
        return { x, y };
    };

    const createCurvedPath = (
        start: { x: number; y: number },
        end: { x: number; y: number }
    ) => {
        const midX = (start.x + end.x) / 2;
        const midY = Math.min(start.y, end.y) - 50;
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    return (
        <div className="w-full aspect-[2/1] bg-white dark:bg-black relative font-sans">
            <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
                className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
                alt="world map"
            />
            <svg
                ref={svgRef}
                viewBox="0 0 800 400"
                className="w-full h-full absolute top-0 left-0 pointer-events-none select-none"
            >
                {dots.map((dot, i) => {
                    const startPoint = projectPoint(dot.start.lat, dot.start.lng);
                    const endPoint = projectPoint(dot.end.lat, dot.end.lng);
                    return (
                        <g key={`path-group-${i}`}>
                            <motion.path
                                d={createCurvedPath(startPoint, endPoint)}
                                fill="none"
                                stroke="url(#path-gradient)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5 * i,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    repeatDelay: 1,
                                    ease: "linear",
                                }}
                            />
                            <defs>
                                <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
                                    <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
