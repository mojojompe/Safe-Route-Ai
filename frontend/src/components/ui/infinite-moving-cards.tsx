import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string;
        name: string;
        title: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item) => (
                    <li
                        className="group w-[380px] max-w-full relative rounded-2xl flex-shrink-0 px-8 py-8 md:w-[480px] transition-all duration-500 hover:scale-105 overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #0a4d2e 0%, #0d5c38 50%, #0a4d2e 100%)",
                            boxShadow: "0 10px 40px rgba(0, 211, 90, 0.15), 0 0 0 1px rgba(0, 211, 90, 0.1)"
                        }}
                        key={item.name}
                    >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: "radial-gradient(circle at top right, rgba(0, 211, 90, 0.15), transparent 70%)"
                            }}
                        />

                        {/* Star Rating */}
                        <div className="relative z-20 flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-sr-green text-sm" />
                            ))}
                        </div>

                        <blockquote className="relative z-20">
                            {/* Quote Icon */}
                            <div className="absolute -top-2 -left-2 text-6xl text-sr-green/20 font-serif leading-none">"</div>

                            {/* Quote Text */}
                            <p className="relative text-base leading-relaxed text-gray-100 font-normal mb-6 italic">
                                {item.quote}
                            </p>

                            {/* Divider */}
                            <div className="w-12 h-0.5 bg-gradient-to-r from-sr-green to-transparent mb-4" />

                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                                {/* Avatar Placeholder */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sr-green to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {item.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-white">
                                        {item.name}
                                    </span>
                                    <span className="text-sm text-gray-300 font-medium">
                                        {item.title}
                                    </span>
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10">
                                <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-sr-green rounded-bl-full" />
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};
