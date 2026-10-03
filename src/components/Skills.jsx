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

/*
  ============================================================================
  SKILLS — fantasy game-UI theme (matches Hero.jsx)

  THEME: this section follows the same day/night switch as the Hero navbar.
  Hero sets  document.documentElement.dataset.theme = "light" | "dark",
  and every colour here is driven by that attribute — so clicking the
  sun / moon in the navbar changes this section too (sky, tiles, text).

  Effects: sky cross-fade (night <-> day), twinkling stars, moon/sun orb,
  rising embers, swaying banner, hanging sign, inventory-slot tiles with
  glow + sheen on hover, category filter tabs, pop-in reveal on scroll.
  ============================================================================
*/

/* ---------- content (edit these) ---------- */
/* color = icon colour in night mode, light = icon colour in day mode (optional) */

const SKILLS = [
    { name: "React", icon: FaReact, color: "#61dafb", light: "#0e8fb4", cat: "Frontend" },
    { name: "JavaScript", icon: SiJavascript, color: "#f0db4f", light: "#b89a00", cat: "Frontend" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8", light: "#0b8bc2", cat: "Frontend" },
    { name: "HTML", icon: FaHtml5, color: "#e34f26", cat: "Frontend" },
    { name: "CSS", icon: FaCss3Alt, color: "#2965f1", cat: "Frontend" },
    { name: "Node.js", icon: FaNodeJs, color: "#3fa845", cat: "Backend" },
    { name: "Express.js", icon: SiExpress, color: "#e8e8e8", light: "#2f2f2f", cat: "Backend" },
    { name: "MongoDB", icon: SiMongodb, color: "#4faa41", cat: "Backend" },
    { name: "MySQL", icon: SiMysql, color: "#4fb0e6", light: "#1f7fb3", cat: "Backend" },
    { name: "Spring Boot", icon: SiSpringboot, color: "#6cb52d", cat: "Backend" },
    { name: "Java", icon: FaJava, color: "#f58219", cat: "Languages" },
    // { name: "C++", icon: SiCplusplus, color: "#5c95d4", cat: "Languages" },
    { name: "Python", icon: SiPython, color: "#f5c445", light: "#3b78a8", cat: "Languages" },
    { name: "Git", icon: FaGitAlt, color: "#f1502f", cat: "Tools" },
    { name: "GitHub", icon: FaGithub, color: "#f0f0f0", light: "#24292f", cat: "Tools" },
    { name: "VS Code", icon: FaCode, color: "#3b9de0", cat: "Tools" },
    { name: "Postman", icon: SiPostman, color: "#f47154", cat: "Tools" },
    // { name: "Vercel", icon: SiVercel, color: "#f2f2f2", light: "#111", cat: "Tools" },
];

const FILTERS = ["All", "Frontend", "Backend", "Languages", "Tools"];
const TAGS = ["Tools", "Ideas", "Progress", "A Brighter Tomorrow"];

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
    [4, 4, 14, 0, 30], [9, 3, 17, 3, -20], [15, 5, 12, 6, 24], [22, 3, 19, 1, -30],
    [29, 4, 15, 8, 18], [36, 3, 18, 4, -16], [43, 5, 13, 9, 26], [50, 3, 20, 2, -24],
    [57, 4, 16, 7, 20], [64, 3, 14, 5, -28], [71, 5, 18, 0, 22], [78, 3, 15, 10, -18],
    [85, 4, 17, 3, 28], [91, 3, 13, 6, -22], [96, 5, 19, 8, 16],
];

/* ---------- helpers ---------- */

function useGoogleFonts() {
    useEffect(() => {
        const id = "fh-fonts";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Lilita+One&family=Caveat:wght@600;700&family=Nunito:wght@500;700;800&display=swap";
        document.head.appendChild(link);
    }, []);
}

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
            className={`sk-reveal ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

/* ---------- component ---------- */

function Skills() {
    const [filter, setFilter] = useState("All");
    useGoogleFonts();

    const list = filter === "All" ? SKILLS : SKILLS.filter((s) => s.cat === filter);

    return (
        <section id="skills" className="fh-skills relative overflow-hidden px-5 sm:px-8 pt-28 pb-32">
            <style>{`
                .fh-skills {
                    --text: #f6ecd2;
                    --sub: #d9cba8;
                    --tile-a: #403930;
                    --tile-b: #1b1612;
                    --tile-ring: rgba(130,118,100,.8);
                    --tile-hi: rgba(255,255,255,.13);
                    --ridge1: #2b2540;
                    --ridge2: #1a1626;
                    --stars: 1;
                    --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
                    color: var(--text);
                    background: #0e1230;
                }
                :root[data-theme="light"] .fh-skills {
                    --text: #3a210e;
                    --sub: #5a3d25;
                    --tile-a: #f7e8c6;
                    --tile-b: #dcc08a;
                    --tile-ring: #b78a36;
                    --tile-hi: rgba(255,255,255,.7);
                    --ridge1: #8a86a8;
                    --ridge2: #5e5c7c;
                    --stars: 0;
                    --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .sk-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* ---------- sky (night and day layers cross-fade) ---------- */
                .sk-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .sk-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .sk-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-skills .sk-night { opacity: 0; }
                :root[data-theme="light"] .fh-skills .sk-day { opacity: 1; }

                .sk-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 8% 20%, #fff, transparent),
                        radial-gradient(1px 1px at 17% 55%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 26% 12%, #fff, transparent),
                        radial-gradient(1px 1px at 34% 40%, #fff, transparent),
                        radial-gradient(2px 2px at 44% 24%, #ffe9b8, transparent),
                        radial-gradient(1px 1px at 52% 60%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 61% 15%, #fff, transparent),
                        radial-gradient(1px 1px at 69% 48%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 78% 30%, #fff, transparent),
                        radial-gradient(1px 1px at 86% 8%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 93% 52%, #ffe9b8, transparent),
                        radial-gradient(1px 1px at 4% 72%, #fff, transparent);
                    animation: sk-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes sk-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }

                .sk-orb {
                    position: absolute; z-index: 0; top: 7%; right: 9%; width: 84px; height: 84px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s;
                    animation: sk-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-skills .sk-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes sk-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }

                .sk-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 38%; z-index: 0; pointer-events: none; }
                .sk-ridges path { transition: fill .7s; }
                .sk-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }

                /* ---------- embers ---------- */
                .sk-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: sk-rise var(--dur) linear var(--del) infinite; opacity: 0;
                }
                :root[data-theme="light"] .fh-skills .sk-ember { opacity: 0 !important; animation: none; }
                @keyframes sk-rise {
                    0%   { opacity: 0; transform: translate(0, 0); }
                    10%  { opacity: .9; }
                    85%  { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                /* ---------- reveal ---------- */
                .sk-reveal { opacity: 0; transform: translateY(26px) scale(.92); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.56,.64,1); }
                .sk-reveal.is-in { opacity: 1; transform: none; }

                /* ---------- title sign ---------- */
                .sk-sign { position: relative; display: inline-block; padding: 1rem 2.6rem 1.15rem; border-radius: 12px;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: sk-swing 6s ease-in-out infinite; transform-origin: 50% -2.2rem;
                }
                @keyframes sk-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .sk-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .sk-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .sk-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .sk-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: sk-shine 5s ease-in-out 1s infinite;
                }
                @keyframes sk-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .sk-rivets { position: relative; }
                .sk-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .sk-sub { color: var(--sub); text-shadow: 0 1px 4px rgba(0,0,0,.35); transition: color .5s; }
                :root[data-theme="light"] .fh-skills .sk-sub { text-shadow: 0 1px 0 rgba(255,255,255,.5); }

                /* ---------- filter tabs ---------- */
                .sk-tab {
                    font-family: 'Lilita One', sans-serif; letter-spacing: .02em; font-size: 1rem; color: #f7e9c4;
                    padding: .5rem 1.2rem; border-radius: 9px; text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 1px rgba(241,196,82,.35), inset 0 2px 0 rgba(255,255,255,.08), 0 4px 0 #070504, 0 6px 8px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s, color .15s;
                }
                .sk-tab:hover { transform: translateY(-2px); color: #ffd978; filter: brightness(1.2); }
                .sk-tab:active { transform: translateY(3px); }
                .sk-tab:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .sk-tab.on {
                    color: #fff; background: linear-gradient(180deg, #d9433c, #a02220 60%, #7d1614);
                    box-shadow: inset 0 0 0 2px #e4bb55, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 6px 10px rgba(0,0,0,.45);
                }

                /* ---------- inventory slots ---------- */
                .sk-slot { --ic: var(--c); }
                :root[data-theme="light"] .fh-skills .sk-slot { --ic: var(--cl, var(--c)); }
                .sk-box {
                    position: relative; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 14px;
                    background: radial-gradient(circle at 30% 20%, var(--tile-hi), transparent 55%), linear-gradient(160deg, var(--tile-a), var(--tile-b));
                    box-shadow: inset 0 0 0 2px var(--tile-ring), inset 0 3px 0 var(--tile-hi), inset 0 -5px 8px rgba(0,0,0,.35), 0 8px 14px rgba(0,0,0,.4);
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, background .5s;
                }
                .sk-box::after {
                    content: ""; position: absolute; top: 0; left: -90%; width: 45%; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,240,190,.55), transparent);
                    transform: skewX(-20deg); pointer-events: none;
                }
                .sk-glow { position: absolute; inset: 14%; border-radius: 9999px; background: radial-gradient(circle, var(--c) 0%, transparent 70%); opacity: 0; transition: opacity .3s; }
                .sk-ico { position: relative; font-size: clamp(2rem, 4.4vw, 2.9rem); color: var(--ic); transition: transform .3s cubic-bezier(.34,1.56,.64,1), filter .3s; filter: drop-shadow(0 3px 2px rgba(0,0,0,.45)); }
                .sk-label {
                    position: relative; margin: .7rem auto 0; width: 94%; text-align: center; padding: .25rem .4rem; border-radius: 7px;
                    font-family: 'Lilita One', sans-serif; font-size: .82rem; color: #f8e9c2; text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 26px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 1.5px #caa43d, inset 0 2px 0 rgba(255,255,255,.14), 0 3px 6px rgba(0,0,0,.4);
                }
                @media (hover: hover) {
                    .sk-slot:hover .sk-box { transform: translateY(-8px) rotate(-1.5deg); box-shadow: inset 0 0 0 2px #f0c24f, inset 0 3px 0 var(--tile-hi), 0 0 24px var(--c), 0 14px 18px rgba(0,0,0,.45); }
                    .sk-slot:hover .sk-box::after { animation: sk-sweep .8s ease-out; }
                    .sk-slot:hover .sk-glow { opacity: .55; }
                    .sk-slot:hover .sk-ico { transform: scale(1.18) rotate(-5deg); filter: drop-shadow(0 0 12px var(--c)); }
                }
                @keyframes sk-sweep { to { left: 150%; } }

                /* ---------- banner ---------- */
                .sk-flag-pole { position: absolute; left: 50%; top: 0; width: 100%; height: .8rem; margin-left: -50%; border-radius: 5px; background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 12px), linear-gradient(180deg, #84552f, #46290f); box-shadow: 0 4px 6px rgba(0,0,0,.5); }
                .sk-flag { transform-origin: 50% 0; animation: sk-sway 4.6s ease-in-out infinite; }
                @keyframes sk-sway { 0%,100% { rotate: -2.4deg; } 50% { rotate: 2.8deg; } }
                .sk-cloth { padding: 1.9rem .8rem 3.2rem; clip-path: polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%); background: linear-gradient(90deg, rgba(0,0,0,.2), transparent 25%, transparent 70%, rgba(0,0,0,.22)), linear-gradient(180deg, #b32f2c, #771615); box-shadow: inset 0 0 0 3px rgba(241,196,82,.35); }
                .sk-hand { font-family: 'Caveat', cursive; font-weight: 700; color: #fff3e0; font-size: 1.55rem; line-height: 1.1; rotate: -12deg; text-shadow: 0 2px 2px rgba(0,0,0,.45); }

                /* ---------- tagline ribbon ---------- */
                .sk-ribbon { position: relative; display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .6rem 1rem; padding: .9rem 3rem; color: #fff; font-family: 'Lilita One', sans-serif; font-size: 1.1rem; letter-spacing: .04em; text-shadow: 0 2px 0 rgba(0,0,0,.65); }
                .sk-ribbon-bg { position: absolute; inset: 0; z-index: -1; clip-path: polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%); background: linear-gradient(180deg, #f1c452, #a8741c); }
                .sk-ribbon-bg::before { content: ""; position: absolute; inset: 3px; clip-path: polygon(0 0, 100% 0, 96.4% 50%, 100% 100%, 0 100%, 3.6% 50%); background: linear-gradient(180deg, #cf3f39, #8d1b19 70%, #741312); box-shadow: inset 0 3px 0 rgba(255,255,255,.25); }
                .sk-ribbon-bg::after { content: ""; position: absolute; top: 0; left: -60%; width: 35%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,230,160,.5), transparent); transform: skewX(-18deg); animation: sk-sweep2 5s ease-in-out 1.5s infinite; }
                @keyframes sk-sweep2 { 0% { left: -60%; } 40%, 100% { left: 150%; } }

                @media (prefers-reduced-motion: reduce) {
                    .fh-skills *, .fh-skills *::before, .fh-skills *::after { animation: none !important; transition: none !important; }
                    .sk-reveal { opacity: 1; transform: none; }
                    .sk-ember { display: none; }
                }
            `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="sk-sky sk-night" />
            <div className="sk-sky sk-day" />
            <div className="sk-stars" aria-hidden="true" />
            <div className="sk-orb" aria-hidden="true" />
            <svg className="sk-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path style={{ fill: "var(--ridge1)" }} opacity=".85" d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z" />
                <path style={{ fill: "var(--ridge2)" }} d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z" />
            </svg>
            <div className="sk-vignette" />
            {EMBERS.map(([l, s, d, dl, dx], i) => (
                <span
                    key={i}
                    className="sk-ember"
                    aria-hidden="true"
                    style={{ left: `${l}%`, width: s, height: s, "--dur": `${d}s`, "--del": `${dl}s`, "--dx": `${dx}px` }}
                />
            ))}

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* hanging banner (large screens only) */}
                <div className="hidden xl:block absolute -left-24 -top-6 w-28" aria-hidden="true">
                    <div className="sk-flag-pole" />
                    <div className="sk-flag" style={{ marginTop: ".6rem" }}>
                        <div className="sk-cloth">
                            <p className="sk-hand">Code<br />Create<br />Grow<br />Repeat</p>
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <Reveal>
                    <div className="text-center pt-10">
                        <div className="sk-sign sk-rivets">
                            <span className="sk-chain" style={{ left: "16%" }} />
                            <span className="sk-chain" style={{ right: "16%" }} />
                            <h2 className="sk-display text-5xl sm:text-6xl lg:text-7xl">
                                <span className="sk-name" data-text="My Skills"><span>My Skills</span></span>
                            </h2>
                        </div>

                        <p className="sk-sub max-w-2xl mx-auto mt-8 text-base sm:text-lg leading-relaxed font-semibold">
                            Technologies and tools I use to build, learn and bring ideas to life.
                            <br className="hidden sm:block" />
                            Always exploring, always improving.
                        </p>
                    </div>
                </Reveal>

                {/* Filter tabs */}
                <Reveal delay={120}>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-10" role="tablist" aria-label="Skill categories">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                role="tab"
                                aria-selected={filter === f}
                                onClick={() => setFilter(f)}
                                className={`sk-tab ${filter === f ? "on" : ""}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </Reveal>

                {/* Skills grid */}
                <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8 sm:gap-x-6">
                    {list.map(({ name, icon: Icon, color, light }, i) => (
                        <Reveal key={`${filter}-${name}`} delay={(i % 8) * 60}>
                            <div className="sk-slot" style={{ "--c": color, "--cl": light || color }}>
                                <div className="sk-box sk-rivets">
                                    <span className="sk-glow" />
                                    <Icon className="sk-ico" />
                                </div>
                                <p className="sk-label">{name}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Footer tagline */}
                <Reveal delay={200} className="mt-20">
                    <div className="text-center">
                        <div className="sk-ribbon">
                            <span className="sk-ribbon-bg" aria-hidden="true" />
                            {TAGS.map((t, i) => (
                                <span key={t} className="flex items-center gap-4">
                                    {t}
                                    {i < TAGS.length - 1 && <span className="text-amber-300 text-xs">◆</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

export default Skills;