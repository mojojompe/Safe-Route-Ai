import { cn } from "../../lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassCardProps) => {
    return (
        <div
            className={cn(
                "bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg rounded-3xl",
                hoverEffect && "hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
