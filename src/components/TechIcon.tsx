import type { CSSProperties } from "react";

export interface TechIconProps {
  name: string;
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function sizeClass(size: "sm" | "md" | "lg"): string {
  return size === "md" ? "" : `tech-icon-${size}`;
}

export function TechIcon({ name, icon, size = "md", className = "" }: TechIconProps) {
  const classes = ["tech-icon", sizeClass(size), className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="img" aria-label={name}>
      <span
        className="tech-icon-svg"
        dangerouslySetInnerHTML={{ __html: icon }}
        aria-hidden="true"
      />

      <span className="tech-icon-chip" aria-hidden="true">
        {name}
      </span>
    </div>
  );
}
export default TechIcon;
