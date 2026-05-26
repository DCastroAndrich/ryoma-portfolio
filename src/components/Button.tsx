import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "link";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonWeight = 400 | 500 | 600 | 700;

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: ButtonWeight;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

type AnchorProps = BaseProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  > & {
    href: string;
    type?: never;
  };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
  };

type Props = AnchorProps | NativeButtonProps;

const baseClasses = `
btn
inline-flex items-center justify-center gap-2
font-heading
tracking-[0.06em]
select-none
transition-all
duration-300
`;

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-4 py-2 rounded-[10px] text-xs",
  sm: "px-4 py-2 rounded-xl text-xs sm:text-sm leading-none",
  md: "px-5 py-2.5 rounded-2xl text-xs sm:text-sm md:text-base",
  lg: "px-6 py-3 rounded-[18px] text-sm sm:text-base lg:text-lg",
  xl: "px-10 py-5 rounded-[20px] text-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  link: "btn-link rounded-none p-0 font-body tracking-[0.01em]",
};

const weightClasses: Record<ButtonWeight, string> = {
  400: "font-normal",
  500: "font-medium",
  600: "font-semibold",
  700: "font-bold",
};

export default function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    weight = 600,
    fullWidth = false,
    className = "",
    children,
    disabled = false,
  } = props;

  const widthClass = fullWidth ? "w-full sm:w-auto" : "";

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    weightClasses[weight],
    widthClass,
    disabled ? "opacity-45 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props) {
    const {
      href,
      target,
      rel,
      fullWidth: _fullWidth,
      ...anchorProps
    } = props as AnchorProps;

    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : rel}
        aria-disabled={disabled}
        className={classes}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const {
    type = "button",
    fullWidth: _fullWidth,
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
}