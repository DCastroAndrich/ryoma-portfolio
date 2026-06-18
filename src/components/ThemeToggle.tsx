import React, { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  className?: string;
}

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [mounted, theme]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
          setTheme(event.matches ? "dark" : "light");
        }
      } catch {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    mq.onchange = onChange;
    return () => {
      mq.onchange = null;
    };
  }, [mounted]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const rootClassName = useMemo(
    () => `theme-switch ${theme} ${className}`.trim(),
    [theme, className],
  );

  if (!mounted) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked="false"
        aria-label="Alternar tema"
        className={rootClassName}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Alternar tema"
      className={rootClassName}
      onClick={toggle}
      style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
    >
      <span className="theme-slider">
        <span className="theme-knob">
          <svg className="theme-moon-dot dot-1" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-moon-dot dot-2" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-moon-dot dot-3" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg className="theme-light-ray ray-1" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-light-ray ray-2" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-light-ray ray-3" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </span>

        <div className="theme-clouds" aria-hidden="true">
          <svg className="theme-cloud dark c1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-cloud dark c2" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-cloud dark c3" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg className="theme-cloud light c4" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-cloud light c5" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="theme-cloud light c6" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        <div className="theme-stars" aria-hidden="true">
          <svg className="theme-star s1" viewBox="0 0 20 20">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
          </svg>
          <svg className="theme-star s2" viewBox="0 0 20 20">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
          </svg>
          <svg className="theme-star s3" viewBox="0 0 20 20">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
          </svg>
        </div>
      </span>
    </button>
  );
}