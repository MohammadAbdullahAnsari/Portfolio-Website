import { useEffect, useRef, useState } from "react";
// NOTE: HTML/CSS/VS Code use the stable Font Awesome (fa) icon set on
// purpose. Their equivalents in react-icons/si (simple-icons) get renamed or
// removed between react-icons versions (e.g. SiCss3 -> SiCss,
// SiVisualstudiocode was dropped entirely), which breaks the build.
import {
    FaReact,
    FaNodeJs,
    FaJava,
    FaGitAlt,
    FaGithub,
    FaHtml5,
    FaCss3Alt,
    FaCode,
} from "react-icons/fa";
import {
    SiJavascript,
    SiTailwindcss,
    SiExpress,
    SiMongodb,
    SiMysql,
    SiSpringboot,
    SiCplusplus,
    SiPython,
    SiPostman,
    SiVercel,
} from "react-icons/si";

/* ---------- content (edit these) ---------- */

const SKILLS = [
    { name: "React", icon: FaReact, color: "#61dafb" },
    { name: "JavaScript", icon: SiJavascript, color: "#f0db4f" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8" },
    { name: "HTML", icon: FaHtml5, color: "#e34f26" },
    { name: "CSS", icon: FaCss3Alt, color: "#2965f1" },
    { name: "Node.js", icon: FaNodeJs, color: "#3fa845" },
    { name: "Express.js", icon: SiExpress, color: "#e8e8e8" },
    { name: "MongoDB", icon: SiMongodb, color: "#4faa41" },
    { name: "MySQL", icon: SiMysql, color: "#4fb0e6" },
    { name: "Java", icon: FaJava, color: "#f58219" },
    { name: "Spring Boot", icon: SiSpringboot, color: "#6cb52d" },
    // { name: "C++", icon: SiCplusplus, color: "#5c95d4" },
    { name: "Python", icon: SiPython, color: "#f5c445" },
    { name: "Git", icon: FaGitAlt, color: "#f1502f" },
    { name: "GitHub", icon: FaGithub, color: "#f0f0f0" },
    { name: "VS Code", icon: FaCode, color: "#3b9de0" },
    { name: "Postman", icon: SiPostman, color: "#f47154" },
    // { name: "Vercel", icon: SiVercel, color: "#f2f2f2" },
];

const TAGS = ["TOOLS", "IDEAS", "PROGRESS", "A BRIGHTER TOMORROW"];

const HANDWRITING = { fontFamily: "'Caveat', 'Comic Sans MS', cursive" };

/* ---------- reveal-on-scroll helper ---------- */

function Reveal({ children, delay = 0, className = "" }) {
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
            className={`skills-reveal ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

/* ---------- component ---------- */

function Skills() {
    return (
        <section
            id="skills"
            className="relative overflow-hidden bg-[#070b17] text-white px-5 sm:px-8 pt-24 pb-24"
        >
            <style>{`
                .skills-reveal {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
                }
                .skills-reveal.is-in { opacity: 1; transform: none; }

                .skills-drift   { animation: skills-drift 15s ease-in-out infinite alternate; }
                .skills-drift-2 { animation: skills-drift 19s ease-in-out infinite alternate-reverse; }
                @keyframes skills-drift {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(36px, -26px) scale(1.15); }
                }

                .skills-shimmer { background-size: 200% auto; animation: skills-shimmer 5s linear infinite; }
                @keyframes skills-shimmer { to { background-position: -200% center; } }

                .skill-tile { transition: transform .35s cubic-bezier(.34,1.56,.64,1); }
                .skill-icon-wrap {
                    position: relative;
                    transition: transform .35s cubic-bezier(.34,1.56,.64,1), filter .35s;
                }
                .skill-glow {
                    position: absolute;
                    inset: -14px;
                    border-radius: 9999px;
                    background: radial-gradient(circle, var(--glow, rgba(139,92,246,.5)) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity .35s;
                }
                .skill-ellipse {
                    width: 46px;
                    height: 8px;
                    border-radius: 9999px;
                    margin: 10px auto 0;
                    background: radial-gradient(closest-side, var(--glow, #a855f7), transparent);
                    opacity: .55;
                    transition: opacity .35s, transform .35s;
                }

                @media (hover: hover) {
                    .skill-tile:hover { transform: translateY(-6px); }
                    .skill-tile:hover .skill-icon-wrap {
                        transform: scale(1.15) rotate(-4deg);
                        filter: drop-shadow(0 0 14px var(--glow, rgba(167,139,250,.8)));
                    }
                    .skill-tile:hover .skill-glow { opacity: .6; }
                    .skill-tile:hover .skill-ellipse { opacity: .9; transform: scaleX(1.3); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .skills-reveal { opacity: 1; transform: none; transition: none; }
                    .skills-drift, .skills-drift-2, .skills-shimmer { animation: none !important; }
                    .skill-tile, .skill-icon-wrap, .skill-glow, .skill-ellipse { transition: none; }
                }
            `}</style>

            {/* background glows */}
            <div className="skills-drift pointer-events-none absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-purple-700/20 blur-3xl" />
            <div className="skills-drift-2 pointer-events-none absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-indigo-700/15 blur-3xl" />

            <div className="relative max-w-6xl mx-auto">

                {/* handwritten corner note (large screens only) */}
                <div
                    className="hidden xl:flex absolute -left-4 -top-2 items-end gap-2 select-none"
                    aria-hidden="true"
                >
                    <p className="text-purple-300 text-2xl leading-7 -rotate-6" style={HANDWRITING}>
                        Code<br />Create<br />Grow<br />Repeat
                    </p>
                    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M22 4 C 8 8, 4 26, 14 40" />
                        <path d="M6 30 L13 41 L20 32" />
                    </svg>
                </div>

                {/* Heading */}
                <Reveal>
                    <div className="text-center">
                        

                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mt-5">
                            My{" "}
                            <span className="skills-shimmer text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400">
                                Skills
                            </span>
                        </h2>

                        <p className="text-gray-400 max-w-2xl mx-auto mt-5 text-base sm:text-lg leading-relaxed font-mono">
                            Technologies and tools I use to build, learn and bring ideas to life.
                            <br className="hidden sm:block" />
                            Always exploring, always improving.
                        </p>
                    </div>
                </Reveal>

                {/* Skills grid */}
                <div className="mt-14 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-x-4 gap-y-10 sm:gap-x-6">
                    {SKILLS.map(({ name, icon: Icon, color }, i) => (
                        <Reveal key={name} delay={(i % 9) * 60}>
                            <div
                                className="skill-tile flex flex-col items-center text-center"
                                style={{ "--glow": color }}
                            >
                                <div className="skill-icon-wrap w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                                    <span className="skill-glow" />
                                    <Icon
                                        className="relative text-4xl sm:text-5xl"
                                        style={{ color }}
                                    />
                                </div>
                                <span className="skill-ellipse" style={{ "--glow": color }} />
                                <p className="mt-2 text-xs sm:text-sm text-gray-200 font-mono">
                                    {name}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Footer tagline */}
                <Reveal delay={200} className="mt-16">
                    <div className="flex items-center justify-center gap-3 sm:gap-5 text-purple-300 text-[10px] sm:text-sm tracking-[0.25em] font-mono flex-wrap">
                        <span className="hidden sm:block w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-purple-500/70" />
                        {TAGS.map((t, i) => (
                            <span key={t} className="flex items-center gap-3 sm:gap-5">
                                {t}
                                {i < TAGS.length - 1 && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70" />
                                )}
                            </span>
                        ))}
                        <span className="hidden sm:block w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-purple-500/70" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export default Skills;