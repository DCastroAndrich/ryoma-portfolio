import React, { useEffect, useState } from "react";

const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {

    const getInitial = () => {
        try {
            if (typeof window === "undefined") return "light";
            const stored = localStorage.getItem("theme");
            if (stored === "dark") return "dark";
            if (stored === "light") return "light";

            //fallback
            return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        } catch {
            return "light"
        }
    }

    const [theme, setTheme] = useState<string>("light")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setTheme(getInitial())
        setMounted(true)
    }, [])


    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        try {
            localStorage.setItem("theme", theme)
        } catch { }
    }, [theme, mounted])

    /* Si el usuario cambia el tema y no tiene guardada ninguna preferencia */

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia || !mounted) return;

        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
            try {
                const stored = localStorage.getItem("theme");
                if (stored === null) {
                    const matches = "matches" in e ? (e as MediaQueryListEvent).matches : mq.matches
                    setTheme(matches ? "dark" : "light")
                }
            } catch { }
        }
        if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", onChange as EventListener);
            return () => mq.removeEventListener("change", onChange as EventListener)
        } else {
            (mq as any).onchange = onChange;
            return () => {
                try {
                    (mq as any).onchange = null
                } catch { }
            }
        }
    }, [mounted]);

    const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

    if (!mounted) {
        return (
            <button type="button" role="switch" aria-checked={false} aria-label="Alternar tema" disabled className={`realtive inline-flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className} `} style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }} >
                <span className="relative inline-block w-6 h-6" />

            </button>
        )
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Alternar tema"
            onClick={toggle}
            className={`relative inline-flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className} `}
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }} >
            {/* contenedor */}
            <span className="relative inline-block w-6 h-6">
                {/* Moon */}
                <svg className={`absolute inset-0 w-6 h-6 transform transition-all duration-300 ease-in-out ${theme === "dark" ? "opacity-100 translate-y-0 scale-100 rotate-0" : "opacity-0 -translate-y-1 scale-90 rotate-12"}`} viewBox="0 0 24 24" fill="none" aria-hidden  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
                </svg>

                {/* Sun */}
                <svg className={`absolute inset-0 w-6 h-6 transform transition-all duration-300 ease-in-out ${theme === "light" ? "opacity-100 translate-y-0 scale-100 rotate-0" : "opacity-0 translate-y-1 scale-90 -rotate-12"}`} viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 4.5v-2M12 21.5v-2M4.5 12h-2M21.5 12h-2M5.64 5.64l-1.41-1.41M19.77 19.77l-1.41-1.41M5.64 18.36l-1.41 1.41M19.77 4.23l-1.41 1.41M12 8a4 4 0 100 8 4 4 0 000-8z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
        </button>
    );
};

export default ThemeToggle;