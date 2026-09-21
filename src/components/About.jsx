import { useEffect, useRef, useState } from "react";
import {
    FaReact,
    FaNodeJs,
    FaGitAlt,
    FaCode,
    FaGraduationCap,
    FaChartBar,
} from "react-icons/fa";
import { SiJavascript, SiTailwindcss } from "react-icons/si";

/* ---------- content (edit these) ---------- */

const HIGHLIGHTS = [
    {
        icon: FaGraduationCap,
        title: "Student",
        sub: "Always Learning",
        wrap: "bg-purple-500/15 border-purple-500/30",
        color: "text-purple-300",
    },
    {
        icon: FaCode,
        title: "Developer",
        sub: "Building Solutions",
        wrap: "bg-indigo-500/15 border-indigo-500/30",
        color: "text-indigo-300",
    },
    {
        icon: FaChartBar,
        title: "Problem Solver",
        sub: "One Step Better",
        wrap: "bg-purple-500/15 border-purple-500/30",
        color: "text-purple-300",
    },
];

const SKILLS = [
    {
        name: "React",
        category: "Frontend Development",
        desc: "Building interactive and responsive UIs.",
        icon: <FaReact className="icon-spin text-4xl sm:text-5xl text-cyan-400" />,
    },
    {
        name: "JavaScript",
        category: "Frontend Development",
        desc: "Creating dynamic and interactive web experiences.",
        icon: <SiJavascript className="text-3xl sm:text-4xl text-yellow-300" />,
    },
    {
        name: "Tailwind CSS",
        category: "UI / Styling",
        desc: "Building modern and responsive designs.",
        icon: <SiTailwindcss className="text-4xl sm:text-5xl text-sky-400" />,
    },
    {
        name: "Node.js",
        category: "Backend Development",
        desc: "Building scalable and efficient servers.",
        icon: <FaNodeJs className="text-4xl sm:text-5xl text-green-500" />,
    },
    {
        name: "Git & GitHub",
        category: "Version Control",
        desc: "Managing code and collaborating effectively.",
        icon: <FaGitAlt className="text-4xl sm:text-5xl text-[#f05133]" />,
    },
    {
        name: "DSA",
        category: "Problem Solving",
        desc: "Improving logic and solving complex problems.",
        icon: (
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
                <FaCode className="text-xl sm:text-2xl text-indigo-300" />
            </span>
        ),
    },
];

const cardClass =
    "rounded-3xl border border-white/10 bg-[#0a0f1f]/80 backdrop-blur transition-colors duration-500 hover:border-purple-500/30";

/* ---------- animation helpers ---------- */

// Fades/slides its children in the first time they scroll into view
function Reveal({ children, delay = 0, from = "up", className = "" }) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`about-reveal about-from-${from} ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

// Spotlight + tilt follow the mouse (only on devices that can hover)
function onCardMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${(y / r.height - 0.5) * -8}deg`);
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 8}deg`);
}

function onCardLeave(e) {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
}

/* ---------- component ---------- */

function About() {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-[#070b17] text-white px-5 sm:px-8 pt-28 pb-24 md:pt-32"
        >
            <style>{`
                /* ---- scroll reveal ---- */
                .about-reveal {
                    opacity: 0;
                    transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
                    will-change: transform, opacity;
                }
                .about-from-up    { transform: translateY(36px); }
                .about-from-left  { transform: translateX(-56px); }
                .about-from-right { transform: translateX(56px); }
                .about-reveal.is-in { opacity: 1; transform: none; }

                /* ---- line / bar that draw themselves ---- */
                .about-line { transform: scaleX(0); transform-origin: left; transition: transform 1s cubic-bezier(.22,1,.36,1) .35s; }
                .is-in .about-line { transform: scaleX(1); }
                .about-bar { transform: scaleY(0); transform-origin: top; transition: transform .8s cubic-bezier(.22,1,.36,1) .5s; }
                .is-in .about-bar { transform: scaleY(1); }

                /* ---- shimmering gradient word ---- */
                .about-shimmer { background-size: 200% auto; animation: about-shimmer 5s linear infinite; }
                @keyframes about-shimmer { to { background-position: -200% center; } }

                /* ---- drifting background glows ---- */
                .about-drift   { animation: about-drift 14s ease-in-out infinite alternate; }
                .about-drift-2 { animation: about-drift 18s ease-in-out infinite alternate-reverse; }
                @keyframes about-drift {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(40px, -30px) scale(1.15); }
                }

                /* ---- skill cards ---- */
                .skill-card {
                    position: relative;
                    overflow: hidden;
                    transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                    transition: transform .25s ease-out, border-color .35s, box-shadow .35s;
                }
                .skill-card > * { position: relative; z-index: 1; }
                .skill-card::before {
                    content: "";
                    position: absolute; inset: 0; z-index: 0;
                    border-radius: inherit;
                    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,.28), transparent 65%);
                    opacity: 0;
                    transition: opacity .3s;
                }
                .skill-card::after {
                    content: "";
                    position: absolute; top: 0; left: -70%; z-index: 2;
                    width: 40%; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,255,255,.09), transparent);
                    transform: skewX(-20deg);
                    transition: left .8s ease;
                    pointer-events: none;
                }
                .skill-icon { transition: transform .4s cubic-bezier(.34,1.56,.64,1), filter .4s; }
                .hl-icon    { transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s; }

                @media (hover: hover) {
                    .skill-card:hover {
                        transform: perspective(700px) translateY(-6px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
                        border-color: rgba(167,139,250,.6);
                        box-shadow: 0 18px 45px -12px rgba(124,58,237,.55);
                    }
                    .skill-card:hover::before { opacity: 1; }
                    .skill-card:hover::after  { left: 130%; }
                    .skill-card:hover .skill-icon {
                        transform: scale(1.18) rotate(-6deg);
                        filter: drop-shadow(0 0 12px rgba(167,139,250,.65));
                    }
                    .skill-card:hover .icon-spin { animation: about-spin 6s linear infinite; }
                    .hl:hover .hl-icon {
                        transform: scale(1.12) rotate(8deg);
                        box-shadow: 0 0 22px rgba(139,92,246,.45);
                    }
                }
                @keyframes about-spin { to { transform: rotate(360deg); } }

                /* ---- respect "reduce motion" ---- */
                @media (prefers-reduced-motion: reduce) {
                    .about-reveal { opacity: 1; transform: none; transition: none; }
                    .about-line, .about-bar { transform: none; transition: none; }
                    .about-shimmer, .about-drift, .about-drift-2, .icon-spin { animation: none !important; }
                    .skill-card, .skill-card::after { transition: none; }
                }
            `}</style>

            {/* background glows (slowly drifting) */}
            <div className="about-drift pointer-events-none absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-purple-700/25 blur-3xl" />
            <div className="about-drift-2 pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-indigo-700/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto">

                {/* Heading */}
                <Reveal from="left">
                    <div className="flex items-center gap-4">
                        <p className="text-purple-400 font-medium tracking-[0.2em] text-sm sm:text-base">
                            ABOUT ME
                        </p>
                        <span className="about-line w-12 h-0.5 rounded-full bg-purple-500" />
                    </div>
                </Reveal>

                <Reveal delay={120}>
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mt-3 leading-tight">
                        About{" "}
                        <span className="about-shimmer text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">
                            Me
                        </span>
                    </h2>
                </Reveal>

                <Reveal delay={240}>
                    <p className="mt-4 max-w-2xl text-gray-300 text-base sm:text-xl leading-relaxed">
                        A passionate developer focused on building modern web
                        applications and solving challenging problems with code.
                    </p>
                </Reveal>

                {/* Cards */}
                <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6">

                    {/* ---------- Who I Am ---------- */}
                    <Reveal from="left" className="min-w-0 h-full">
                        <div className={`${cardClass} h-full p-6 sm:p-9 flex flex-col`}>
                            <h3 className="text-3xl font-bold">Who I Am</h3>

                            <p className="mt-5 text-gray-300 text-base sm:text-lg leading-relaxed">
                                I am a Full Stack Developer and DSA enthusiast who enjoys
                                creating responsive, user-friendly applications and improving
                                problem-solving skills through competitive programming.
                            </p>
                            <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                                I love learning new technologies, building real-world
                                projects, and turning ideas into functional and beautiful web
                                experiences. I'm always curious, always learning, and always
                                ready for the next challenge.
                            </p>

                            {/* Highlights */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
                                {HIGHLIGHTS.map((h, i) => {
                                    const Icon = h.icon;
                                    return (
                                        <Reveal key={h.title} delay={350 + i * 130}>
                                            <div className="hl flex items-center gap-3">
                                                <div
                                                    className={`hl-icon w-14 h-14 shrink-0 rounded-full border flex items-center justify-center ${h.wrap}`}
                                                >
                                                    <Icon className={`text-2xl ${h.color}`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold">{h.title}</h4>
                                                    <p className="text-sm text-gray-400">{h.sub}</p>
                                                </div>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>

                            {/* Quote */}
                            <div className="mt-auto pt-8">
                                <Reveal delay={700}>
                                    <div className="border-t border-white/10 pt-6">
                                        <div className="flex gap-4">
                                            <span className="about-bar w-0.5 shrink-0 rounded-full bg-purple-500" />
                                            <p className="italic text-gray-300">
                                                “Consistency today, success tomorrow.”
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </Reveal>

                    {/* ---------- Skills ---------- */}
                    <Reveal from="right" delay={150} className="min-w-0 h-full">
                        <div className={`${cardClass} h-full p-5 sm:p-6`}>

                            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-3xl font-bold">Skills</h3>
                                    <span className="about-line w-10 h-0.5 rounded-full bg-purple-500" />
                                </div>
                                <p className="text-[11px] sm:text-xs tracking-wider text-gray-400">
                                    TECHNOLOGIES I WORK WITH
                                </p>
                            </div>

                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SKILLS.map((s, i) => (
                                    <Reveal
                                        key={s.name}
                                        delay={300 + i * 110}
                                        className="min-w-0 h-full"
                                    >
                                        <div
                                            onMouseMove={onCardMove}
                                            onMouseLeave={onCardLeave}
                                            className="skill-card h-full flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0d1224]/70"
                                        >
                                            <div className="skill-icon w-12 sm:w-14 shrink-0 flex justify-center pt-1">
                                                {s.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-lg leading-tight">
                                                    {s.name}
                                                </h4>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {s.category}
                                                </p>
                                                <p className="text-gray-500 text-sm mt-2 leading-snug">
                                                    {s.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}

export default About;