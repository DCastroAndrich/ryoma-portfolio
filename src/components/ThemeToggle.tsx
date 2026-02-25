import React, { useEffect, useState } from "react";

const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {

    const getInitial = () => {
        try {
            const stored = localStorage.getItem("theme");
            if (stored === "dark") return "dark";
            if (stored === "light") return "light";

            //fallback
            return window.matchMedia && window.matchMedia("(prefers-color-scheme: darl)").matches ? "dark" : "light"

        } catch {
            return "light"

        }
    }

    const [theme, setTheme] = useState<string>(() => (typeof window !== "undefined" ? getInitial() : "light"))

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        try {
            localStorage.setItem("theme", theme)
        } catch { }
    }, [theme])

    /* Si el usuario cambia el tema y no tiene guardada ninguna preferencia */

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return

        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = (e: MediaQueryListEvent) => {
            try {
                const stored = localStorage.getItem("theme");
                if (stored === "null") {
                    setTheme(e.matches ? "dark" : "light")
                }
            } catch { }
        }
        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange)
        } else {
            (mq as any).onchange = onChange;
            return () => {
                try {
                    (mq as any).onchange = null

                } catch { }
            }
        }
    }, []);

    const toggle = () => setTheme(prev => (prev === "dark" ? "light" : "dark"))

    return (
        <button type="button" aria-pressed={theme === "dark"} aria-label="Alternar tema" onClick={toggle} className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className} `} >
            {/* Moon */}
            <svg className={`w-5 h-5 transition-opacity duration-200 ${theme === "dark" ? "opacity-100" : "opacity-60"}`} viewBox="0 0 24 24" fill="none" aria-hidden  >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
            </svg>

            {/* Sun */}
            <svg className={`w-5 h-5 absolute transition-opacity duration-200 ${theme === "light" ? "opacity-100" : "opacity-0"}`} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 4.5v-2M12 21.5v-2M4.5 12h-2M21.5 12h-2M5.64 5.64l-1.41-1.41M19.77 19.77l-1.41-1.41M5.64 18.36l-1.41 1.41M19.77 4.23l-1.41 1.41M12 8a4 4 0 100 8 4 4 0 000-8z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export default ThemeToggle;