import { type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

/* types */

type Variant = "primary" | "outline";

/* Props compartidas entre <a> y <button> */
//con href -> <a>
//sin href -> <button>

type SharedProps = {
    variant?: Variant;
    icon?: ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
    children: ReactNode
}

/* Props para <a> */
type AnchorProps = SharedProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href?: string;
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
    children: ReactNode
}

function ButtonContent({ isLoading, loadingText, icon, children }: ContentProps) {
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
                <span className="inline-flex items-center" aria-hidden="true" >
                    {icon}
                </span>
            )}
        </>
    )

}

/* Componente principal */

export default function Button(props: ButtonComponentProps) {
    const {
        variant = "primary",
        icon,
        isLoading = false,
        loadingText,
        className = "",
        children,
        ...rest
    } = props;

    const content = (
        <ButtonContent isLoading={isLoading} loadingText={loadingText} icon={icon} >
            {children}
        </ButtonContent>
    );

    /* VARIANTE PRIMARY */
    if (variant === "primary") {
        const classes = `btn btn-primary &{className}`.trim()

        //Si tiene href -> link
        if ("href" in props && props.href) {
            const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof SharedProps>
            return (
                <a href={href} className={classes} {...anchorRest} >
                    {content}
                </a>
            )
        }

        //Si no tiene href -> button
        const { type = "button", disabled, ...buttonRest } = rest as Omit<ButtonProps, keyof SharedProps>
        return (
            <button
                type={type}
                disabled={disabled || isLoading}
                className={classes}
                aria-busy={isLoading || undefined}
                {...buttonRest}
            >
                {content}
            </button>
        )
    }

    /* VARIANTE OUTLINE */

    const wrapperClasses = `btn-outline-wrapper ${className}`.trim()
    const innerClasses = "btn btn-outline-inner"

    const outlineContent = (
        <span className={innerClasses}>
            {content}
        </span>
    )

    if ("href" in props && props.href) {
        const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof SharedProps>
        return (
            <a href={href} className={wrapperClasses} {...anchorRest} >
                {outlineContent}
            </a>
        )
    }

    const { type = "button", disabled, ...buttonRest } = rest as Omit<ButtonProps, keyof SharedProps>
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={wrapperClasses}
            aria-busy={isLoading || undefined}
            {...buttonRest}
        >
            {outlineContent}
        </button>
    )
}