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

/* Clases para variantes */

const BASE =
    //Layout y fuente
    "inline-flex items-center justify-center gap-2" +
    "px-8 py-3 rounded-2xl" + //padding y radius
    "font-semibold text-base font-heading tracking-[0.06em]" + //fuente
    //Comportamiento
    "cursor-pointer select-none whitespace-nowrap" +
    "transition-all duration-300 ease-in-out" +
    //Accesibilidad
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--color-primary]" +
    //Disabled
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"

/* Componente principal */

export default function Button(props: ButtonComponentProps) {
    const {
        variant = "primary",
        icon,
        isLoading = false,
        loadingText,
        children,
        ...rest
    } = props;

    const content = isLoading ? (
        <>
            <Spinner />
            <span>{loadingText ?? children} </span>
        </>
    ) : (
        <>
            <span>{children} </span>
            {icon && (
                <span className="inline-flex items-center" aria-hidden="true" >{icon} </span>
            )}
        </>
    );

    /* Pirmary */
    if (variant === "primary") {
        const primaryClasses =
            BASE +
            "bg-[linear-gradient(135deg, color-mix(in_srgb,#FF00FF_80%,transparent)_9%,#0097C0_81%)]" +
            "text-white" +
            "shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),0_0_14px_rgba(0,151,192,0.7),0_0_6px_rgba(255,0,255,0.7)]" +
            "hover:bg-[linear-gradient(135deg,#0097C0_9%,color-mix(in_srgb,#FF00FF_80%,transparent)_81%)]" +
            "hover:shadow-[inset_0_2px_60x_rgba(0,0,0,0.15),0_0_18px_rgba(0,151,192,0.8),0_0_10px_rgba(255,0,255,0.8)]";

        //Si tiene href -> link
        if ("href" in props && props.href) {
            const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof SharedProps>
            return (
                <a href={href} className={primaryClasses} {...anchorRest} >
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
                className={primaryClasses}
                aria-busy={isLoading}
                {...buttonRest}
            >
                {content}
            </button>
        )
    }
}