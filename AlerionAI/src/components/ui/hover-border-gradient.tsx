import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = "button",
    duration = 1,
    clockwise = true,
    ...props
}: React.PropsWithChildren<
    {
        as?: React.ElementType;
        containerClassName?: string;
        className?: string;
        duration?: number;
        clockwise?: boolean;
    } & React.HTMLAttributes<HTMLElement>
>) {
    const [hovered, setHovered] = React.useState<boolean>(false);

    return (
        <Tag
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "relative flex rounded-full border border-white/10 content-center bg-black/20 hover:bg-black/10 transition-colors duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
                containerClassName
            )}
            {...props}
        >
            <div
                className={cn(
                    "w-auto text-white z-10 bg-black/50 px-6 py-3 rounded-[inherit] backdrop-blur-xl",
                    className
                )}
            >
                {children}
            </div>
            <motion.div
                className={cn(
                    "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
                )}
                style={{
                    filter: "blur(2px)",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
                initial={{ background: "transparent" }}
                animate={{
                    background: hovered
                        ? [
                            "conic-gradient(from 0deg at 50% 50%, #3b82f6 0deg, transparent 60deg, transparent 300deg, #3b82f6 360deg)",
                        ]
                        : "transparent",
                }}
                transition={{
                    duration: duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                }}
            />
            <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
        </Tag>
    );
}
