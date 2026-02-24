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

const sizeClasses: Record<Size, string> = {
    small: "h8 px-3 text-sm",
    medium: "h10 px-4 text-base",
    large: "h12 px-6 text-lg",
}

// continuar desde aca... con los tipos base
