import type { ReactNode } from "react";

export interface TechIconProps {
    name: string;
    icon: ReactNode | string;
    size?: "sm" | "md" | "lg";
    className?: string
}

function sizeClass(size: "sm" | "md" | "lg"): string {
    return size === "md" ? "" : `tech-icon-${size}`
}

function isSvgString(str: string): boolean {
    return str.trimStart().startsWith("<");
}

export function TechIcon({ name, icon, size = "md", className = "" }: TechIconProps) {
    const classes = ["tech-icon", sizeClass(size), className].filter(Boolean).join(" ")
    return (
        <div className={classes} role="img" aria-label={name}>
            <span className="tech-icon-svg">
                {
                    typeof icon === "string" ? (
                        isSvgString(icon) ? (<span dangerouslySetInnerHTML={{ __html: icon }} />) : (<img src={icon} alt="" aria-hidden="true" />)
                    ) : (icon)
                }
            </span>
            <span className="tech-icon-chip" aria-hidden="true" >
                {name}
            </span>


        </div>
    )
}
export default TechIcon