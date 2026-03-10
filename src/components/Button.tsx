import { type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

/* types */

type Variant = "primary" | "outline" | "ghost" | "link";

type Size = "xs" | "sm" | "md" | "lg" | "xl"

/* Props compartidas entre <a> y <button> */
//con href -> <a>
//sin href -> <button>

type SharedProps = {
    variant?: Variant;
    size?: Size;
    icon?: ReactNode;
    font?: "heading" | "body";
    weight?: 400 | 500 | 600 | 700;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
    children: ReactNode
}

/* Props para <a> */
type AnchorProps = SharedProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href: string;
};
/* Props para <button> */
type ButtonProps = SharedProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> & {
    href?: never;
};

type ButtonComponentProps = AnchorProps | ButtonProps

/* Spinner SVG*/
function Spinner() {
    return (
        <svg
            className="animate-spin"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            {/* Pista */}
            <circle
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={2.5}
                strokeOpacity={0.25}
            />
            {/* Arco activo */}
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
            />
        </svg>
    )
}

/* Contenido interno (compartido) */

type ContentProps = {
    isLoading: boolean;
    loadingText?: string;
    icon?: ReactNode;
    isLink?: boolean;
    children: ReactNode
}

function ButtonContent({ isLoading, loadingText, isLink, icon, children }: ContentProps) {
    if (isLoading) {
        return (
            <>
                <Spinner />
                <span>{loadingText ?? children} </span>
            </>
        )
    }
    return (
        <>
            <span>{children} </span>
            {icon && (
                <span className={isLink ? "btn-link-icon" : "inline-flex items-center"} aria-hidden="true" >
                    {icon}
                </span>
            )}
        </>
    )

}

/* HELPERS */
/* Tamaño */
function sizeClass(size: Size): string {
    return size === "md" ? "" : `btn-${size}`;
}
/* Fuentes */
function fontClass(font?: "heading" | "body"): string {
    if (!font) return "";
    return `btn-font-${font}`
}
function weightClass(weight?: 400 | 500 | 600 | 700): string {
    if (!weight) return "";
    return `btn-weight-${weight}`

}


/* render */

function renderElement(
    classes: string,
    content: ReactNode,
    props: ButtonComponentProps,
    rest: Record<string, unknown>,
    isLoading: boolean
) {
    if ("href" in props && props.href) {
        const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof SharedProps>
        return (
            <a href={href} className={classes} {...anchorRest} >
                {content}
            </a>
        )
    }
    const { type = "button", disabled, ...buttonRest } = rest as Omit<ButtonProps, keyof SharedProps>
    return (
        <button
            type={type as "button" | "submit" | "reset"}
            disabled={disabled || isLoading}
            className={classes}
            aria-busy={isLoading || undefined}
            {...buttonRest}
        >
            {content}
        </button>
    )
}
/* Componente principal */

export default function Button(props: ButtonComponentProps) {
    const {
        variant = "primary",
        size = "md",
        icon,
        font,
        weight,
        isLoading = false,
        loadingText,
        className = "",
        children,
        ...rest
    } = props;

    const sc = sizeClass(size)
    const fc = fontClass(font)
    const wc = weightClass(weight)

    const content = (
        <ButtonContent
            isLoading={isLoading}
            loadingText={loadingText}
            icon={icon}
            isLink={variant === "link"}
        >
            {children}
        </ButtonContent>
    );

    /* VARIANTE LINK */
    if (variant === "link") {
        const classes = ["btn-link", sc, fc, wc, className].filter(Boolean).join(" ");
        return renderElement(classes, content, props, rest as Record<string, unknown>, isLoading)
    }

    /* VARIANTE PRIMARY - OUTLINE - GHOST */

    const variantClass: Record<Exclude<Variant, "link">, string> = {
        primary: "btn-primary",
        outline: "btn-outline",
        ghost: "btn-ghost"
    }

    const classes = ["btn", variantClass[variant as Exclude<Variant, "link">], sc, fc, wc, className].filter(Boolean).join(" ")
    return renderElement(classes, content, props, rest as Record<string, unknown>, isLoading)
}