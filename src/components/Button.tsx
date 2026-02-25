import React from "react";

type Size = "small" | "medium" | "large";
type Variant = "solid" | "outline" | "ghost" | "link";

interface BaseProps {
    label?: string;
    children?: React.ReactNode;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    size?: Size;
    variant?: Variant;
    loading?: boolean;
    className?: string;
    as?: "button" | "a";
    href?: string;
}

type ButtonProps = BaseProps & (React.BaseHTMLAttributes<HTMLButtonElement> | React.AnchorHTMLAttributes<HTMLAnchorElement>)

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const sizeClasses: Record<Size, string> = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
}

const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantClasses: Record<Variant, string> = {
    solid: "btn btn-solid",
    outline: "btn btn-outline",
    ghost: "btn btn-ghost",
    link: "btn btn-link"
}

const Button: React.FC<ButtonProps> = ({
    as = "button",
    size = "medium",
    variant = "solid",
    className,
    children,
    label,
    iconLeft,
    iconRight,
    loading,
    href,
    ...props
}) => {
    const Comp: any = as === "a" ? "a" : "button";

    return (
        <Comp {...(as === "a" ? { href } : {})}
            className={cn(base, sizeClasses[size], variantClasses[variant], className)}>
            {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" stopOpacity="0.25" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            ) : (
                <>
                    {iconLeft && <span className="inline-flex">{iconLeft}</span>}
                    <span>{children ?? label} </span>
                    {iconRight && <span className="inline-flex">{iconRight} </span>}
                </>
            )}
        </Comp>
    )
}
export default Button;