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
            className={`theme-switch  ${theme} ${className} `}
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }} >
            <span className="theme-slider">
                {/* contenedor */}
                <span className="theme-knob">
                    {/* moon dots */}
                    <svg className="theme-moon-dot dot-1" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>
                    <svg className="theme-moon-dot dot-2" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>
                    <svg className="theme-moon-dot dot-3" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>

                    {/* rays */}
                    <svg className="theme-light-ray ray-1" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>
                    <svg className="theme-light-ray ray-2" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>
                    <svg className="theme-light-ray ray-3" viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={50} />
                    </svg>
                </span>

                {/* clouds */}
                <div className="theme-clouds">
                    <svg className="theme-cloud dark c1" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
                    <svg className="theme-cloud dark c2" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
                    <svg className="theme-cloud dark c3" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>

                    <svg className="theme-cloud light c4" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
                    <svg className="theme-cloud light c5" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
                    <svg className="theme-cloud light c6" viewBox="0 0 100 100"><circle cx={50} cy={50} r={50} /></svg>
                </div>

                {/* stars */}
                <div className="theme-stars">
                    <svg className="theme-star s1" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" /></svg>
                    <svg className="theme-star s2" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" /></svg>
                    <svg className="theme-star s3" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" /></svg>
                </div>




            </span>
        </button>
    );
};

export default ThemeToggle;