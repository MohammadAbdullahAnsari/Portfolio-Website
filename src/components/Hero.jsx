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
    { id: "skills", label: "Skills", icon: FaUser },
    { id: "projects", label: "Projects", icon: FaCode },
    
    { id: "dashboard", label: "Dashboard", icon: FaCode },

    
    { id: "contact", label: "Contact", icon: FaEnvelope },
];

const LOGO_TEXT = "CODERX";
const HANDWRITING = { fontFamily: "'Caveat', 'Comic Sans MS', cursive" };

const FIRST_NAME = "Mohammad";
const LAST_NAME = "Abdullah Ansari";

// words the typing effect cycles through
const ROLES = ["Full Stack Developer", "DSA Solver", "Problem Solver", "Lifelong Learner"];

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

/* ---------- effects: helpers ---------- */

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Typing / deleting text
function useTypewriter(words) {
    const [text, setText] = useState("");

    useEffect(() => {
        if (prefersReducedMotion()) {
            setText(words[0]);
            return;
        }
        let word = 0;
        let chars = 0;
        let deleting = false;
        let timer;

        const tick = () => {
            const current = words[word];
            if (!deleting) {
                chars++;
                setText(current.slice(0, chars));
                if (chars === current.length) {
                    deleting = true;
                    timer = setTimeout(tick, 1500);
                    return;
                }
                timer = setTimeout(tick, 75);
            } else {
                chars--;
                setText(current.slice(0, chars));
                if (chars === 0) {
                    deleting = false;
                    word = (word + 1) % words.length;
                    timer = setTimeout(tick, 350);
                    return;
                }
                timer = setTimeout(tick, 35);
            }
        };

        timer = setTimeout(tick, 1100);
        return () => clearTimeout(timer);
    }, [words]);

    return text;
}

// Buttons that get pulled toward the cursor
function Magnetic({ children, strength = 0.3, className = "" }) {
    const ref = useRef(null);

    const move = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => {
        if (ref.current) ref.current.style.transform = "translate(0, 0)";
    };

    return (
        <div
            ref={ref}
            onMouseMove={move}
            onMouseLeave={leave}
            className={`inline-block transition-transform duration-200 ease-out ${className}`}
        >
            {children}
        </div>
    );
}

// Floating particle network that reacts to the mouse
function ParticleField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let w = 0;
        let h = 0;
        let particles = [];
        let raf = 0;
        let visible = true;
        const mouse = { x: -9999, y: -9999 };

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(80, Math.floor((w * h) / 16000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.6,
            }));
        };

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const onLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };

        const LINK = 120;
        const MOUSE_R = 150;

        const step = () => {
            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // gently pushed away from the cursor
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < MOUSE_R && d > 0) {
                    const f = (MOUSE_R - d) / MOUSE_R;
                    p.x += (dx / d) * f * 1.4;
                    p.y += (dy / d) * f * 1.4;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(196,181,253,0.8)";
                ctx.fill();
            }

            // lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < LINK) {
                        ctx.strokeStyle = `rgba(139,92,246,${(1 - d / LINK) * 0.28})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
                // lines from the cursor to nearby particles
                const p = particles[i];
                const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (dm < MOUSE_R + 30) {
                    ctx.strokeStyle = `rgba(232,121,249,${(1 - dm / (MOUSE_R + 30)) * 0.55})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(step);
        };

        const start = () => {
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(step);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        // pause when the hero is off-screen or the tab is hidden
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            visible ? start() : stop();
        });
        const onVisibility = () => (document.hidden ? stop() : start());

        resize();
        io.observe(canvas);
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseout", onLeave);
        document.addEventListener("visibilitychange", onVisibility);
        start();

        return () => {
            stop();
            io.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseout", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
        />
    );
}

/* ---------- component ---------- */

function Hero() {
    const [activeSection, setActiveSection] = useState("home");
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState("dark");
    const lastY = useRef(0);
    const rootRef = useRef(null);
    const barRef = useRef(null);

    const typed = useTypewriter(ROLES);

    // Scroll: hide/show the mobile bar, shrink the navbar, fill the progress bar
    useEffect(() => {
        let idleTimer;

        // navbar shrink + progress bar (also runs once on load)
        const updateChrome = () => {
            const y = window.scrollY;
            setScrolled(y > 20);
            if (barRef.current) {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                const p = max > 0 ? Math.min(y / max, 1) : 0;
                barRef.current.style.transform = `scaleX(${p})`;
            }
        };

        const onScroll = () => {
            const y = window.scrollY;
            // hide the bottom bar while scrolling down, bring it back on scroll up...
            setShowMobileNav(!(y > lastY.current && y > 80));
            lastY.current = y;
            updateChrome();

            // ...and always bring it back when scrolling stops
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setShowMobileNav(true), 1200);
        };

        lastY.current = window.scrollY;
        updateChrome();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener("scroll", onScroll);
        };
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

    // Mouse: cursor spotlight (--sx/--sy) + parallax/tilt strength (--px/--py)
    const onMouseMove = (e) => {
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.style.setProperty("--px", String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty("--py", String((e.clientY / window.innerHeight - 0.5) * 2));
    };
    const onMouseLeave = () => {
        const el = rootRef.current;
        if (!el) return;
        el.style.setProperty("--px", "0");
        el.style.setProperty("--py", "0");
    };

    return (
        <section
            id="home"
            ref={rootRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="min-h-screen relative overflow-hidden bg-[#070b17] text-white"
        >
            <style>{`
                /* ---------- entrance animations (use translate/scale props so they never fight hover transforms) ---------- */
                .hero-rise  { opacity: 0; animation: hero-rise .9s cubic-bezier(.22,1,.36,1) var(--d, 0ms) forwards; }
                .hero-pop   { opacity: 0; animation: hero-pop .7s cubic-bezier(.34,1.56,.64,1) var(--d, 0ms) forwards; }
                .hero-letter{ display: inline-block; opacity: 0; animation: hero-letter .8s cubic-bezier(.22,1,.36,1) forwards; animation-delay: calc(var(--i) * 45ms + 250ms); }
                .hero-photo-in { opacity: 0; animation: hero-photo 1.2s cubic-bezier(.22,1,.36,1) .3s forwards; }
                @keyframes hero-rise   { from { opacity: 0; translate: 0 28px; } to { opacity: 1; translate: 0 0; } }
                @keyframes hero-pop    { from { opacity: 0; scale: .5; } to { opacity: 1; scale: 1; } }
                @keyframes hero-letter { from { opacity: 0; translate: 0 60%; rotate: 8deg; filter: blur(6px); } to { opacity: 1; translate: 0 0; rotate: 0deg; filter: blur(0); } }
                @keyframes hero-photo  { from { opacity: 0; scale: .7; rotate: -12deg; } to { opacity: 1; scale: 1; rotate: 0deg; } }

                /* ---------- gradient name: wipes in, then shimmers forever ---------- */
                .hero-name-grad {
                    background-size: 200% auto;
                    animation: hero-wipe 1s cubic-bezier(.22,1,.36,1) .85s both, hero-shimmer 5s linear 1.9s infinite;
                }
                @keyframes hero-wipe    { from { clip-path: inset(-20% 100% -20% 0); opacity: 0; } to { clip-path: inset(-20% -5% -20% 0); opacity: 1; } }
                @keyframes hero-shimmer { to { background-position: -200% center; } }

                /* ---------- typing caret ---------- */
                .hero-caret { display: inline-block; width: 2px; height: 1.1em; margin-left: 3px; vertical-align: -0.15em; background: #c084fc; animation: hero-blink 1s steps(1) infinite; }
                @keyframes hero-blink { 50% { opacity: 0; } }

                /* ---------- photo: spinning ring, orbiting dots, 3D tilt ---------- */
                .hero-ring {
                    background: conic-gradient(from 0deg, transparent 0 55%, #a855f7 80%, #818cf8 100%);
                    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
                            mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
                    animation: hero-spin 6s linear infinite;
                }
                .hero-orbit   { animation: hero-spin 14s linear infinite; }
                .hero-orbit-2 { animation: hero-spin 22s linear infinite reverse; }
                @keyframes hero-spin { to { transform: rotate(360deg); } }

                .hero-tilt {
                    transform: perspective(900px) rotateX(calc(var(--py, 0) * -7deg)) rotateY(calc(var(--px, 0) * 9deg));
                    transition: transform .2s ease-out;
                    will-change: transform;
                }
                .hero-par {
                    transform: translate(calc(var(--px, 0) * var(--kx, 10) * 1px), calc(var(--py, 0) * var(--ky, 10) * 1px));
                    transition: transform .25s ease-out;
                }

                /* ---------- floating cards ---------- */
                @keyframes hero-float {
                    0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
                    50%      { transform: translateY(-8px) rotate(var(--r, 0deg)); }
                }
                .hero-float { transform: rotate(var(--r, 0deg)); animation: hero-float 5s ease-in-out infinite; }

                /* ---------- buttons ---------- */
                .hero-shine { position: relative; overflow: hidden; }
                .hero-shine::after {
                    content: ""; position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.35), transparent);
                    transform: skewX(-20deg); transition: left .7s ease; pointer-events: none;
                }
                .hero-shine:hover::after { left: 140%; }
                .hero-sheen::after { animation: hero-sheen 4.5s ease-in-out 2.5s infinite; }
                @keyframes hero-sheen { 0% { left: -80%; } 35%, 100% { left: 140%; } }

                .hero-pulse { animation: hero-pulse 2.6s ease-out infinite; }
                @keyframes hero-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(139,92,246,.55), 0 0 25px rgba(124,58,237,.35); }
                    70%  { box-shadow: 0 0 0 14px rgba(139,92,246,0), 0 0 25px rgba(124,58,237,.35); }
                    100% { box-shadow: 0 0 0 0 rgba(139,92,246,0), 0 0 25px rgba(124,58,237,.35); }
                }

                /* ---------- scroll hint + wave ---------- */
                .hero-wheel { animation: hero-wheel 1.8s ease-in-out infinite; }
                @keyframes hero-wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }
                .hero-bob { animation: hero-bob 1.8s ease-in-out infinite; }
                @keyframes hero-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
                .hero-wave-move { animation: hero-wave 24s linear infinite; }
                @keyframes hero-wave { to { transform: translateX(-50%); } }

                /* ---------- respect "reduce motion" ---------- */
                @media (prefers-reduced-motion: reduce) {
                    .hero-rise, .hero-pop, .hero-letter, .hero-photo-in { animation: none !important; opacity: 1 !important; }
                    .hero-name-grad { animation: none !important; }
                    .hero-ring, .hero-orbit, .hero-orbit-2, .hero-float, .hero-sheen::after, .hero-pulse,
                    .hero-wheel, .hero-bob, .hero-wave-move, .hero-caret { animation: none !important; }
                    .hero-tilt, .hero-par { transform: none !important; }
                }
            `}</style>

            {/* background glow */}
            <div className="pointer-events-none absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-purple-700/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-40 w-[30rem] h-[30rem] rounded-full bg-indigo-700/10 blur-3xl" />

            {/* cursor spotlight */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(520px circle at var(--sx, 50%) var(--sy, 30%), rgba(139,92,246,0.14), transparent 60%)",
                }}
            />

            {/* particle network */}
            <ParticleField />

            {/* ---------------- TOP NAVBAR ---------------- */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
                    scrolled
                        ? "bg-[#070b17]/95 border-purple-500/20"
                        : "bg-[#070b17]/70 border-white/5"
                }`}
            >
                <div
                    className={`max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between transition-all duration-300 ${
                        scrolled ? "h-16" : "h-20"
                    }`}
                >
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
                            className="hero-pulse hero-shine inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-sm sm:text-base font-medium hover:scale-105 transition"
                        >
                            Let's Talk
                            <FaArrowRight className="text-sm" />
                        </a>
                    </div>
                </div>

                {/* scroll progress bar */}
                <div
                    ref={barRef}
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500"
                    style={{ transform: "scaleX(0)" }}
                />
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

                            <p
                                className="hero-rise inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200"
                                style={{ "--d": "0ms" }}
                            >
                                <span>👋</span> Hello, I'm
                            </p>

                            <h1
                                className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.05] mt-6"
                                aria-label={`${FIRST_NAME} ${LAST_NAME}`}
                            >
                                <span className="inline-block whitespace-nowrap" aria-hidden="true">
                                    {FIRST_NAME.split("").map((c, i) => (
                                        <span key={i} className="hero-letter" style={{ "--i": i }}>
                                            {c}
                                        </span>
                                    ))}
                                </span>{" "}
                                <span
                                    aria-hidden="true"
                                    className="hero-name-grad text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-300"
                                >
                                    {LAST_NAME}
                                </span>
                            </h1>

                            {/* typing effect */}
                            <h2
                                className="hero-rise font-mono text-sm sm:text-lg text-gray-200 mt-6 h-7"
                                style={{ "--d": "900ms" }}
                            >
                                <span className="sr-only">{ROLES.join(" | ")}</span>
                                <span aria-hidden="true">
                                    <span className="text-purple-400">&gt;</span> {typed}
                                    <span className="hero-caret" />
                                </span>
                            </h2>

                            <p
                                className="hero-rise mt-6 max-w-xl mx-auto md:mx-0 text-gray-400 text-base sm:text-lg leading-relaxed"
                                style={{ "--d": "1050ms" }}
                            >
                                I build modern, responsive, and user-friendly web
                                applications. I love turning ideas into real-world
                                projects and I'm always excited to learn new
                                technologies.
                            </p>

                            {/* Buttons */}
                            <div
                                className="hero-rise flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8"
                                style={{ "--d": "1200ms" }}
                            >
                                <Magnetic>
                                    <a
                                        href="/resume.pdf"
                                        className="hero-shine hero-sheen inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 font-medium shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105 transition"
                                    >
                                        <FaFileAlt />
                                        View Resume
                                    </a>
                                </Magnetic>

                                <Magnetic>
                                    <a
                                        href="#contact"
                                        className="hero-shine inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-purple-500/60 text-white hover:bg-purple-500/10 font-medium hover:scale-105 transition"
                                    >
                                        <FaPaperPlane className="text-purple-400" />
                                        Contact Me
                                    </a>
                                </Magnetic>
                            </div>

                            {/* Socials */}
                            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mt-8">
                                {SOCIALS.map((s, i) => (
                                    <div
                                        key={s.label}
                                        className="hero-pop"
                                        style={{ "--d": `${1350 + i * 120}ms` }}
                                    >
                                        <Magnetic strength={0.4}>
                                            <a
                                                href={s.href}
                                                target={s.href.startsWith("http") ? "_blank" : undefined}
                                                rel="noopener noreferrer"
                                                aria-label={s.label}
                                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-purple-500/60 hover:bg-purple-500/10 hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition"
                                            >
                                                {s.icon}
                                            </a>
                                        </Magnetic>
                                    </div>
                                ))}
                            </div>

                            {/* "Let's connect!" handwritten hint */}
                            <div
                                className="hero-rise hidden sm:flex items-start gap-1 mt-3 ml-14 select-none"
                                style={{ "--d": "1900ms" }}
                                aria-hidden="true"
                            >
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
                        <div className="hero-photo-in relative shrink-0 w-[17rem] h-[17rem] sm:w-[22rem] sm:h-[22rem] lg:w-[28rem] lg:h-[28rem]">

                            {/* tilting layer: glow, rings, photo */}
                            <div className="hero-tilt absolute inset-0">
                                <div className="absolute inset-[6%] rounded-full bg-purple-600/40 blur-3xl" />
                                <div className="absolute inset-0 rounded-full border border-purple-500/25" />
                                <div className="absolute -inset-3 rounded-full border border-indigo-500/10" />

                                {/* spinning light ring */}
                                <div className="hero-ring absolute inset-[3%] rounded-full" />

                                {/* orbiting dots */}
                                <div className="hero-orbit absolute -inset-1 rounded-full">
                                    <span className="absolute -top-1.5 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_16px_#a855f7]" />
                                </div>
                                <div className="hero-orbit-2 absolute inset-[-6%] rounded-full">
                                    <span className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_12px_#e879f9]" />
                                </div>

                                {/* photo */}
                                <div className="absolute inset-[8%] rounded-full p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
                                    <img
                                        src="/profile2.png"
                                        alt="Mohammad Abdullah Ansari"
                                        className="w-full h-full rounded-full object-cover bg-[#1b1440]"
                                    />
                                </div>
                            </div>

                            {/* floating cards (parallax wrapper > pop-in > float) */}
                            <div
                                className="hero-par absolute top-[6%] right-0 sm:-right-4"
                                style={{ "--kx": 18, "--ky": 14 }}
                            >
                                <div className="hero-pop" style={{ "--d": "1500ms" }}>
                                    <div
                                        className="hero-float flex items-center gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                        style={{ "--r": "-6deg" }}
                                    >
                                        <span className="relative flex w-3 h-3">
                                            <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping" />
                                            <span className="relative inline-flex w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                                        </span>
                                        <p className="text-xs sm:text-sm text-gray-100 leading-tight">
                                            Open to<br />Opportunities
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="hero-par absolute top-[38%] left-0 sm:-left-8"
                                style={{ "--kx": -22, "--ky": 10 }}
                            >
                                <div className="hero-pop" style={{ "--d": "1700ms" }}>
                                    <div
                                        className="hero-float px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                        style={{ "--r": "-5deg", animationDelay: "0.8s" }}
                                    >
                                        <p className="text-lg sm:text-xl">💻</p>
                                        <p className="text-xs sm:text-sm text-gray-100 leading-tight mt-1">
                                            Building<br />cool stuff
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="hero-par absolute bottom-[10%] right-0 sm:-right-2"
                                style={{ "--kx": 26, "--ky": -16 }}
                            >
                                <div className="hero-pop" style={{ "--d": "1900ms" }}>
                                    <div
                                        className="hero-float px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#111a33]/90 backdrop-blur border border-purple-500/25 shadow-xl"
                                        style={{ "--r": "-6deg", animationDelay: "1.6s" }}
                                    >
                                        <p className="text-lg sm:text-xl">🎯</p>
                                        <p className="text-xs sm:text-sm text-gray-100 leading-tight mt-1">
                                            Focused on<br />Growth
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* "Code Create Grow Repeat" handwritten note */}
                            <div
                                className="hero-rise hidden lg:flex items-end gap-1 absolute -bottom-10 right-0 select-none"
                                style={{ "--d": "2100ms" }}
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
            

            {/* endlessly flowing wave */}
            <svg
                className="hero-wave-move pointer-events-none absolute bottom-0 left-0 w-[200%] h-28 sm:h-36"
                viewBox="0 0 2880 160"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="hero-wave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b2a8f" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#070b17" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 1440].map((x) => (
                    <g key={x} transform={`translate(${x} 0)`}>
                        <path
                            d="M0 70 C 240 20, 420 20, 660 60 C 900 100, 1100 110, 1440 70 L1440 160 L0 160 Z"
                            fill="url(#hero-wave)"
                        />
                        <path
                            d="M0 70 C 240 20, 420 20, 660 60 C 900 100, 1100 110, 1440 70"
                            fill="none"
                            stroke="#7c3aed"
                            strokeOpacity="0.35"
                        />
                    </g>
                ))}
            </svg>
        </section>
    );
}

export default Hero;