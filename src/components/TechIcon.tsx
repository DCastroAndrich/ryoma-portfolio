import React from "react";

type Props = {
    name: string;
    src?: string;
    size?: number;
    rounded?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const TechIcon: React.FC<Props> = ({ name, src, size = 40, rounded = true, className, children }) => {
    const radiusClass = rounded ? "rounded-full" : "rounded-md";
    const sizeClass = { width: size, height: size };
    return (
        <div className={`group inline-flex flex-col items-center gap-2 ${className ?? ""} `} >
            <div className={`relative flex items-center justify-center p-2 transition-all duration-200 ${radiusClass}`} style={sizeClass} aria-hidden >
                {children ? (
                    <span className="icon-svg text-text-primary transition-colors duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-b group-hover:from-(--gradient-start) group-hover:to-(--gradient-end)" style={{ lineHeight: 0 }}>
                        {children}
                    </span>
                ) : (
                    <>
                        <img src={String(src)} alt={name} className="w-full h-full object-contain filter grayscale contrast-90 transition-all duration-200 group-hover:filter-none" />
                        <span className="absolute inset-0 pointer-events-none rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-80 bg-linear-to-b from-(--gradient-start) to-(--gradient-end) mix-blend-screen" />
                    </>
                )}

            </div>

        /* chip */
            <span className="chip transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 text-xs px-3 py-1 rounded-full bg-white/2 border border-white/4 text-text-muted" >
                {name}
            </span>
        </div>
    )
}

export default TechIcon