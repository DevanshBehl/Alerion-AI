import { cn } from "../../lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center pointer-events-none",
                className
            )}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-950 to-neutral-950/0" />
            <div
                className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_20%,black)]"
                style={{
                    maskImage:
                        "radial-gradient(ellipse at center, transparent 20%, black)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at center, transparent 20%, black)",
                }}
            />

            {/*  Simplified beams for performance/implementation ease without heavy SVG paths */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-30">
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent rotate-45 transform origin-bottom-left animate-beam" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent -rotate-45 transform origin-bottom-right animate-beam-delay" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent rotate-12 transform origin-bottom-left animate-pulse" />
            </div>

        </div>
    );
};
