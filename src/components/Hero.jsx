import { useEffect, useRef, useState } from "react";
import {
    FaGithub,
    FaLinkedinIn,
    FaHome,
    FaUser,
    FaCode,
    FaEnvelope,
    FaFileAlt,
    FaPaperPlane,
    FaArrowRight,
    FaRegSun,
    FaRegMoon,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

/* ---------- config ---------- */

// id = the id of the section on your page (the nav scrolls to / highlights it)
const NAV = [
    { id: "home", label: "Home", icon: FaHome },
    { id: "about", label: "About", icon: FaUser },
    { id: "projects", label: "Projects", icon: FaCode },
    { id: "leetcode", label: "LeetCode", icon: SiLeetcode },
    { id: "github", label: "GitHub", icon: FaGithub },
    { id: "contact", label: "Contact", icon: FaEnvelope },
];

const LOGO_TEXT = "CODERX";
const HANDWRITING = { fontFamily: "'Caveat', 'Comic Sans MS', cursive" };

const SOCIALS = [
    {
        label: "GitHub",
        href: "https://github.com/MohammadAbdullahAnsari",
        icon: <FaGithub className="text-2xl sm:text-3xl" />,
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: (
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0a66c2] flex items-center justify-center">
                <FaLinkedinIn className="text-base sm:text-lg" />
            </span>
        ),
    },
    {
        label: "LeetCode",
        href: "https://leetcode.com/u/abdullah7398/",
        icon: <SiLeetcode className="text-2xl sm:text-3xl text-amber-400" />,
    },
    {
        label: "X",
        href: "#",
        icon: <FaXTwitter className="text-xl sm:text-2xl" />,
    },
];

/* ---------- component ---------- */

function Hero() {
    const [activeSection, setActiveSection] = useState("home");
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [theme, setTheme] = useState("dark");
    const lastY = useRef(0);

    // Hide the mobile bottom bar while scrolling down, show it when scrolling up
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setShowMobileNav(!(y > lastY.current && y > 80));
            lastY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Highlight the section that is crossing the middle of the screen
    useEffect(() => {
        const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActiveSection(e.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Cosmetic for now: exposes the choice as <html data-theme="...">
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
        <section
            id="home"
            className="min-h-screen relative overflow-hidden bg-[#070b17] text-white"
        >
            {/* local styles for the floating cards */}
            <style>{`
                @keyframes hero-float {
                    0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
                    50% { transform: translateY(-8px) rotate(var(--r, 0deg)); }
                }
                .hero-float { transform: rotate(var(--r, 0deg)); animation: hero-float 5s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .hero-float { animation: none; } }
            `}</style>

            {/* background glow */}
            <div className="pointer-events-none absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-purple-700/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-40 w-[30rem] h-[30rem] rounded-full bg-indigo-700/10 blur-3xl" />

            {/* ---------------- TOP NAVBAR ---------------- */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#070b17]/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">

                    {/* Logo */}
                    <a href="#home" className="text-3xl font-extrabold tracking-tight">
                        {LOGO_TEXT}
                        <span className="text-purple-500">.</span>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-10">
                        {NAV.map((n) => {
                            const active = activeSection === n.id;
                            return (
                                <a
                                    key={n.id}
                                    href={`#${n.id}`}
                                    className={`relative py-2 text-[15px] transition ${
                                        active ? "text-purple-400" : "text-gray-200 hover:text-purple-400"
                                    }`}
                                >
                                    {n.label}
                                    {active && (
                                        <span className="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">

                        {/* Theme toggle */}
                        <div
                            className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10"
                            role="group"
                            aria-label="Theme"
                        >
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                aria-pressed={theme === "light"}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                                    theme === "light" ? "bg-white/10 text-amber-300" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <FaRegSun />
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                aria-pressed={theme === "dark"}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                                    theme === "dark" ? "bg-white/10 text-purple-300" : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <FaRegMoon />
                            </button>
                        </div>

                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-sm sm:text-base font-medium shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:scale-105 transition"
                        >
                            Let's Talk
                            <FaArrowRight className="text-sm" />
                        </a>
                    </div>
                </div>
            </nav>

            {/* ---------------- MOBILE / TABLET BOTTOM NAV ---------------- */}
            <div
                className={`lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-[#0f172a]/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl px-2 py-3 z-50 transition-transform duration-300 ${
                    showMobileNav ? "translate-y-0" : "translate-y-[150%]"
                }`}
            >
                <div className="flex items-center justify-around">
                    {NAV.map((n) => {
                        const Icon = n.icon;
                        const active = activeSection === n.id;
                        return (
                            <a
                                key={n.id}
                                href={`#${n.id}`}
                                className={`flex flex-col items-center gap-1 transition ${
                                    active ? "text-purple-400" : "text-gray-300 hover:text-purple-400"
                                }`}
                            >
                                <Icon className="text-lg" />
                                <span className="text-[10px]">{n.label}</span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- HERO CONTENT ---------------- */}
            <main className="relative z-10 min-h-screen flex items-center pt-28 pb-32 md:pb-40">
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-14 md:gap-8">

                        {/* -------- LEFT: text -------- */}
                        <div className="w-full md:w-[55%] text-center md:text-left">

                            <p className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200">
                                <span>👋</span> Hello, I'm
                            </p>

                            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.05] mt-6">
                                Mohammad{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-fuchsia-400">
                                    Abdullah Ansari
                                </span>
                            </h1>

                            <h2 className="font-mono text-sm sm:text-lg text-gray-200 mt-6">
                                Full Stack Developer | DSA Solver | Lifelong Learner
                            </h2>

                            <p className="mt-6 max-w-xl mx-auto md:mx-0 text-gray-400 text-base sm:text-lg leading-relaxed">
                                I build modern, responsive, and user-friendly web
                                applications. I love turning ideas into real-world
                                projects and I'm always excited to learn new
                                technologies.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                                <a
                                    href="/resume.pdf"
                                    className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 font-medium shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105 transition"
                                >
                                    <FaFileAlt />
                                    View Resume
                                </a>

                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-purple-500/60 text-white hover:bg-purple-500/10 font-medium hover:scale-105 transition"
                                >
                                    <FaPaperPlane className="text-purple-400" />
                                    Contact Me
                                </a>
                            </div>

                            {/* Socials */}
                            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mt-8">
                                {SOCIALS.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target={s.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-purple-500/60 hover:bg-purple-500/10 hover:-translate-y-1 transition"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>

                            {/* "Let's connect!" handwritten hint */}
                            <div className="hidden sm:flex items-start gap-1 mt-3 ml-14 select-none" aria-hidden="true">
                                <svg width="56" height="44" viewBox="0 0 56 44" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round">
                                    <path d="M8 6 C 6 26, 24 38, 50 36" />
                                    <path d="M3 14 L8 5 L15 12" />
                                </svg>
                                <span
                                    className="text-purple-400 text-xl mt-6 -rotate-6"
                                    style={HANDWRITING}
                                >
                                    Let's connect!
                                </span>
                            </div>
                        </div>

                        {/* -------- RIGHT: photo -------- */}
                        <div className="relative shrink-0 w-[17rem] h-[17rem] sm:w-[22rem] sm:h-[22rem] lg:w-[28rem] lg:h-[28rem]">

                            {/* glow + rings */}
                            <div className="absolute inset-[6%] rounded-full bg-purple-600/40 blur-3xl" />
                            <div className="absolute inset-0 rounded-full border border-purple-500/25" />
                            <div className="absolute -inset-3 rounded-full border border-indigo-500/10" />

                            {/* photo */}
                            <div className="absolute inset-[8%] rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
                                <img
                                    src="/profile2.png"
                                    alt="Mohammad Abdullah Ansari"
                                    className="w-full h-full rounded-full object-cover bg-[#1b1440]"
                                />
                            </div>

                            {/* floating cards */}
                            <div
                                className="hero-float absolute top-[6%] right-0 sm:-right-4 flex items-center gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                style={{ "--r": "-6deg" }}
                            >
                                <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                                <p className="text-xs sm:text-sm text-gray-100 leading-tight">
                                    Open to<br />Opportunities
                                </p>
                            </div>

                            <div
                                className="hero-float absolute top-[38%] left-0 sm:-left-8 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                style={{ "--r": "-5deg", animationDelay: "0.8s" }}
                            >
                                <p className="text-lg sm:text-xl">💻</p>
                                <p className="text-xs sm:text-sm text-gray-100 leading-tight mt-1">
                                    Building<br />cool stuff
                                </p>
                            </div>

                            <div
                                className="hero-float absolute bottom-[10%] right-0 sm:-right-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                style={{ "--r": "-6deg", animationDelay: "1.6s" }}
                            >
                                <p className="text-lg sm:text-xl">🎯</p>
                                <p className="text-xs sm:text-sm text-gray-100 leading-tight mt-1">
                                    Focused on<br />Growth
                                </p>
                            </div>

                            {/* "Code Create Grow Repeat" handwritten note */}
                            <div
                                className="hidden lg:flex items-end gap-1 absolute -bottom-10 right-0 select-none"
                                aria-hidden="true"
                            >
                                <svg width="40" height="50" viewBox="0 0 40 50" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round">
                                    <path d="M12 48 C 2 30, 8 12, 20 6" />
                                    <path d="M12 12 L21 5 L24 16" />
                                </svg>
                                <p className="text-purple-400 text-xl leading-6 -rotate-3" style={HANDWRITING}>
                                    Code<br />Create<br />Grow<br />Repeat
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* scroll-down hint */}
            <a
                href="#about"
                className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-gray-400 hover:text-purple-300 transition"
                aria-label="Scroll down"
            >
                <svg width="26" height="40" viewBox="0 0 26 40" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="2" width="22" height="36" rx="11" />
                    <line x1="13" y1="10" x2="13" y2="17" strokeLinecap="round" />
                </svg>
                <span className="text-sm">Scroll Down</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M7 2 V12 M2.5 8 L7 12.5 L11.5 8" />
                </svg>
            </a>

            {/* wave */}
            <svg
                className="pointer-events-none absolute bottom-0 left-0 w-full h-28 sm:h-36"
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="hero-wave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b2a8f" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#070b17" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0 70 C 240 20, 420 20, 660 60 C 900 100, 1100 110, 1440 40 L1440 160 L0 160 Z"
                    fill="url(#hero-wave)"
                />
                <path
                    d="M0 70 C 240 20, 420 20, 660 60 C 900 100, 1100 110, 1440 40"
                    fill="none"
                    stroke="#7c3aed"
                    strokeOpacity="0.35"
                />
            </svg>
        </section>
    );
}

export default Hero;