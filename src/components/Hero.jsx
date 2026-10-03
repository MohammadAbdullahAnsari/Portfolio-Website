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
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

/*
  ============================================================================
  FANTASY GAME-UI HERO  (matches the reference: wooden nav, red pennant tab,
  chunky metallic title, framed portrait on a stone wall, hanging banner,
  torches, sunset sky)

  Effects included
    - floating ember particles (canvas) + spark burst when you click a button
    - flickering flames / torch glow, pulsing sun, drifting clouds
    - mouse parallax (sky, mountains, frame scene move at different depths)
    - portrait frame drops in and settles, then gently floats
    - banner sways, ribbons wave, light sweep across the frame
    - shining gold title, rotating glow on the role pills
    - press-down game buttons with sheen
    - day / night toggle (sun & moon switch)

  Setup
    - Fonts (Lilita One, Caveat, Nunito) load automatically from Google Fonts.
    - Optional painted background: put an image at  public/hero-bg.jpg  and it
      is layered over the CSS sky automatically.
    - Photo: /profile2.png  (looks best with a plain / transparent background —
      the frame supplies the grey stone backdrop).
  ============================================================================
*/

/* ---------- config ---------- */

const NAV = [
    { id: "home", label: "Home", icon: FaHome },
    { id: "skills", label: "Skills", icon: FaUser },
    { id: "projects", label: "Projects", icon: FaCode },
    { id: "dashboard", label: "Dashboard", icon: FaCode },
    { id: "contact", label: "Contact", icon: FaEnvelope },
];

const LOGO_TEXT = "ABDULLAH";
const FIRST_NAME = "Mohammad";
const LAST_NAME = "Abdullah Ansari";
const ROLES = ["Problem Solver", "Web Developer", "DSA Learner"];

const SOCIALS = [
    {
        label: "GitHub",
        href: "https://github.com/MohammadAbdullahAnsari",
        icon: <FaGithub className="text-3xl" />,
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: (
            <span className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center">
                <FaLinkedinIn className="text-lg" />
            </span>
        ),
    },
    {
        label: "LeetCode",
        href: "https://leetcode.com/u/abdullah7398/",
        icon: <SiLeetcode className="text-3xl text-amber-400" />,
    },
    {
        label: "X",
        href: "#",
        icon: <FaXTwitter className="text-2xl" />,
    },
];

/* stone wall rows (flex-grow values) and ivy leaves [left %, top px, rotate, size] */
const WALL = [
    [18, 13, 20, 15, 12, 19],
    [12, 20, 14, 18, 15, 20],
];
const LEAVES = [
    [4, -10, -30, 22], [11, -4, 20, 18], [19, -12, -10, 24], [28, -3, 40, 16],
    [37, -9, -25, 20], [46, -2, 15, 17], [55, -11, -35, 23], [64, -4, 30, 18],
    [72, -10, -15, 21], [81, -3, 45, 17], [89, -9, -20, 22], [95, -2, 25, 16],
];
const FORE_BLOBS = [
    { l: "-5%", b: "-7%", w: 280, h: 190, r: -12, c: "#1f3a14" },
    { l: "6%", b: "-9%", w: 220, h: 150, r: 10, c: "#2c4f1a" },
    { l: "-3%", b: "8%", w: 120, h: 130, r: 30, c: "#3a5a1c" },
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

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- ember particles (canvas) ---------- */

function useEmbers(canvasRef, emitRef) {
    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        const reduce = prefersReducedMotion();
        let w = 0, h = 0, dpr = 1, raf = 0;
        let parts = [];
        let sparks = [];

        const spawn = (init) => ({
            x: Math.random() * w,
            y: init ? Math.random() * h : h + 10,
            r: Math.random() * 2.4 + 0.8,
            vy: -(Math.random() * 0.55 + 0.25),
            sway: Math.random() * 6.28,
            sp: Math.random() * 0.02 + 0.006,
            amp: Math.random() * 0.6 + 0.2,
            hue: Math.random() * 25 + 18,
            a: Math.random() * 0.6 + 0.35,
            tw: Math.random() * 6.28,
        });

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = c.clientWidth;
            h = c.clientHeight;
            c.width = w * dpr;
            c.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.round(Math.min(85, w / 16));
            parts = Array.from({ length: n }, () => spawn(true));
        };

        const glow = (x, y, r, hue, a) => {
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, `hsla(${hue},100%,68%,${a})`);
            g.addColorStop(1, `hsla(${hue},100%,50%,0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 6.283);
            ctx.fill();
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = "lighter";
            for (const p of parts) {
                if (!reduce) {
                    p.sway += p.sp;
                    p.tw += 0.06;
                    p.x += Math.sin(p.sway) * p.amp + 0.15;
                    p.y += p.vy;
                    if (p.y < -12 || p.x > w + 12) Object.assign(p, spawn(false));
                }
                glow(p.x, p.y, p.r * 4, p.hue, p.a * (0.6 + 0.4 * Math.sin(p.tw)));
            }
            sparks = sparks.filter((s) => s.life > 0);
            for (const s of sparks) {
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.09;
                s.vx *= 0.985;
                s.life -= 1;
                glow(s.x, s.y, s.r * 3.5, s.hue, Math.max(s.life / s.max, 0));
            }
            if (!reduce) raf = requestAnimationFrame(draw);
        };

        emitRef.current = (clientX, clientY) => {
            if (reduce) return;
            const rect = c.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            for (let i = 0; i < 26; i++) {
                const a = Math.random() * 6.283;
                const sp = Math.random() * 3.2 + 0.8;
                const life = 35 + Math.random() * 30;
                sparks.push({
                    x, y,
                    vx: Math.cos(a) * sp,
                    vy: Math.sin(a) * sp - 1.4,
                    r: Math.random() * 1.8 + 0.8,
                    hue: 30 + Math.random() * 20,
                    life, max: life,
                });
            }
        };

        resize();
        draw();
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            emitRef.current = null;
        };
    }, [canvasRef, emitRef]);
}

/* ---------- small pieces ---------- */

function Torch({ className = "", style, scale = 1 }) {
    return (
        <div className={`fh-torch ${className}`} style={{ "--s": scale, ...style }} aria-hidden="true">
            <div className="fh-torch-glow" />
            <div className="fh-flame">
                <i /><i /><i />
            </div>
            <div className="fh-torch-cup" />
        </div>
    );
}

/* ---------- component ---------- */

function Hero() {
    const [activeSection, setActiveSection] = useState("home");
    const [showMobileNav, setShowMobileNav] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [roleIdx, setRoleIdx] = useState(0);
    const lastY = useRef(0);
    const barRef = useRef(null);
    const rootRef = useRef(null);
    const canvasRef = useRef(null);
    const emitRef = useRef(null);

    useGoogleFonts();
    useEmbers(canvasRef, emitRef);

    /* scroll chrome + progress bar */
    useEffect(() => {
        let idleTimer;
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
            lastY.current = window.scrollY;
            updateChrome();
            // hide the bottom bar while the page is moving, bring it back once it stops
            setShowMobileNav(false);
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setShowMobileNav(true), 450);
        };
        lastY.current = window.scrollY;
        updateChrome();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    /* active section */
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

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    /* role glow rotation */
    useEffect(() => {
        if (prefersReducedMotion()) return;
        const t = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2000);
        return () => clearInterval(t);
    }, []);

    /* mouse parallax (writes CSS vars, no re-render) */
    const onMouseMove = (e) => {
        if (prefersReducedMotion() || !rootRef.current) return;
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        rootRef.current.style.setProperty("--mx", mx.toFixed(3));
        rootRef.current.style.setProperty("--my", my.toFixed(3));
    };

    /* spark burst on buttons */
    const onClick = (e) => {
        if (e.target.closest && e.target.closest("[data-spark]") && emitRef.current) {
            emitRef.current(e.clientX, e.clientY);
        }
    };

    return (
        <section
            id="home"
            ref={rootRef}
            onMouseMove={onMouseMove}
            onClick={onClick}
            className={`fh-root min-h-screen relative overflow-hidden text-white ${
                theme === "light" ? "fh-day" : ""
            }`}
            style={{ fontFamily: "'Nunito', 'Segoe UI', system-ui, sans-serif", "--mx": 0, "--my": 0 }}
        >
            <style>{`
                .fh-root {
                    --sky: linear-gradient(180deg, #151a3a 0%, #2c2c58 28%, #5a3a58 52%, #b4533a 78%, #f0903a 100%);
                    --sun: rgba(255,160,50,.95);
                    --cloud: rgba(255,150,90,.55);
                    --cloud2: rgba(120,90,160,.5);
                    --ridge1: #2b2540;
                    --ridge2: #1a1626;
                    --veil: rgba(8,6,18,.45);
                    --edge: rgba(5,3,2,.78);
                    --gold: #f1c452;
                    --gold-d: #b98a22;
                    --wood-1: #6b4428;
                    --wood-2: #3b2310;
                }
                .fh-root.fh-day {
                    --sky: linear-gradient(180deg, #5fa8e0 0%, #8cc4ea 35%, #f7cf9a 72%, #f7a86a 100%);
                    --sun: rgba(255,226,140,.95);
                    --cloud: rgba(255,255,255,.75);
                    --cloud2: rgba(255,214,170,.7);
                    --ridge1: #6d6a8c;
                    --ridge2: #4a4a66;
                    --veil: rgba(255,255,255,0);
                    --edge: rgba(40,20,10,.35);
                }
                .fh-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .01em; }
                .fh-hand { font-family: 'Caveat', cursive; }

                /* ---------- sky / scenery ---------- */
                .fh-bg {
                    position: absolute; inset: 0; z-index: 0;
                    background:
                        linear-gradient(180deg, var(--veil), transparent 40%, rgba(10,6,4,.35) 100%),
                        url('/hero-bg.jpg') center/cover no-repeat,
                        var(--sky);
                }
                .fh-sun {
                    position: absolute; z-index: 0; right: -8%; bottom: -12%; width: 70vw; height: 70vw; max-width: 1100px; max-height: 1100px;
                    background: radial-gradient(circle, var(--sun) 0%, rgba(255,140,40,.45) 28%, transparent 62%);
                    animation: fh-sun 7s ease-in-out infinite;
                    transform: translate(calc(var(--mx) * -8px), calc(var(--my) * -5px));
                }
                @keyframes fh-sun { 0%,100% { opacity: .8; scale: 1; } 50% { opacity: 1; scale: 1.06; } }

                .fh-cloud {
                    position: absolute; z-index: 0; border-radius: 9999px; filter: blur(14px);
                    background: linear-gradient(90deg, transparent, var(--cloud), transparent);
                    animation: fh-drift var(--t, 70s) linear infinite;
                }
                @keyframes fh-drift { from { translate: -20vw 0; } to { translate: 30vw 0; } }
                .fh-clouds { position: absolute; inset: 0; z-index: 0; transform: translate(calc(var(--mx) * -12px), calc(var(--my) * -6px)); transition: transform .25s ease-out; }

                .fh-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 52%; z-index: 0; pointer-events: none; transform: translate(calc(var(--mx) * -16px), calc(var(--my) * -4px)); transition: transform .25s ease-out; }

                .fh-vignette {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    background: radial-gradient(120% 95% at 50% 35%, transparent 45%, var(--edge) 100%);
                }
                .fh-embers { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; pointer-events: none; }

                /* ---------- foreground leaves ---------- */
                .fh-blob {
                    position: absolute; border-radius: 50% 40% 55% 45%; filter: blur(7px); opacity: .95;
                    background: radial-gradient(circle at 35% 35%, var(--c), #0d1a08 85%);
                    transform: rotate(var(--r)) translate(calc(var(--mx) * 14px), calc(var(--my) * 8px));
                    transition: transform .25s ease-out;
                }
                .fh-leaf {
                    position: absolute; border-radius: 0 100% 0 100%;
                    background: linear-gradient(135deg, #7fb83a, #2f5a1a);
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 2px 3px rgba(0,0,0,.5);
                    animation: fh-leaf 5s ease-in-out infinite;
                }
                @keyframes fh-leaf { 0%,100% { rotate: -4deg; } 50% { rotate: 5deg; } }

                /* ---------- nav ---------- */
                .fh-nav-shell { position: relative; filter: drop-shadow(0 8px 10px rgba(0,0,0,.5)); transition: transform .3s; }
                .fh-nav-bg {
                    --bv: 15px;
                    position: absolute; inset: 0; pointer-events: none;
                    clip-path: polygon(var(--bv) 0, calc(100% - var(--bv)) 0, 100% var(--bv), 100% calc(100% - var(--bv)), calc(100% - var(--bv)) 100%, var(--bv) 100%, 0 calc(100% - var(--bv)), 0 var(--bv));
                    background: linear-gradient(180deg, #f1c452, #9b6c1a);
                }
                .fh-nav-bg::before {
                    --bv: 12px;
                    content: ""; position: absolute; inset: 3px;
                    clip-path: polygon(var(--bv) 0, calc(100% - var(--bv)) 0, 100% var(--bv), 100% calc(100% - var(--bv)), calc(100% - var(--bv)) 100%, var(--bv) 100%, 0 calc(100% - var(--bv)), 0 var(--bv));
                    background:
                        repeating-linear-gradient(90deg, rgba(0,0,0,.2) 0 2px, transparent 2px 70px),
                        linear-gradient(180deg, #5a3a22 0%, #3a2312 55%, #2a180b 100%);
                }
                .fh-nav-bg::after {
                    content: ""; position: absolute; inset: 0;
                    background:
                        radial-gradient(circle at 13px 50%, #f6dc8a 0 2.5px, #6b4a14 3px 4px, transparent 4.5px),
                        radial-gradient(circle at calc(100% - 13px) 50%, #f6dc8a 0 2.5px, #6b4a14 3px 4px, transparent 4.5px);
                }
                .fh-tab {
                    position: relative; isolation: isolate; font-family: 'Lilita One', sans-serif; letter-spacing: .02em;
                    padding: .55rem 1.3rem; border-radius: 9px; font-size: 1rem; color: #f7e9c4;
                    text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    transition: transform .15s, filter .15s, color .15s;
                }
                .fh-tab:not(.fh-tab-on) {
                    background: linear-gradient(180deg, #2f2923, #17120e);
                    box-shadow: inset 0 0 0 1px rgba(241,196,82,.28), inset 0 2px 0 rgba(255,255,255,.07), 0 2px 4px rgba(0,0,0,.5);
                }
                .fh-tab:not(.fh-tab-on):hover { transform: translateY(-2px); color: #ffd978; filter: brightness(1.2); }
                .fh-tab-on { color: #fff; }
                .fh-pennant {
                    position: absolute; z-index: -1; left: -6px; right: -6px; top: -14px; bottom: -28px;
                    clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
                    background: linear-gradient(180deg, #f6d36e, #a8741c);
                    animation: fh-pennant 3.4s ease-in-out infinite; transform-origin: top center;
                }
                .fh-pennant::before {
                    content: ""; position: absolute; inset: 3px;
                    clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
                    background: linear-gradient(180deg, #d3433c 0%, #9c1f1d 70%, #7a1413 100%);
                    box-shadow: inset 0 3px 0 rgba(255,255,255,.28);
                }
                .fh-pennant::after {
                    content: ""; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,230,160,.6), transparent);
                    transform: skewX(-18deg); animation: fh-sheen 4.5s ease-in-out 1s infinite;
                }
                @keyframes fh-pennant { 0%,100% { rotate: -0.8deg; } 50% { rotate: 0.8deg; } }

                .fh-toggle {
                    background: linear-gradient(180deg, #1d1814, #0f0c09);
                    box-shadow: inset 0 0 0 2px rgba(241,196,82,.6), inset 0 3px 6px rgba(0,0,0,.7);
                }
                .fh-toggle-btn { width: 2.3rem; height: 2.3rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; transition: all .25s; color: rgba(250,220,150,.6); }
                .fh-toggle-btn.on-sun { background: radial-gradient(circle, #ffe9a6, #e9a626); color: #6a3d00; box-shadow: 0 0 14px rgba(255,200,70,.8); }
                .fh-toggle-btn.on-moon { background: radial-gradient(circle, #2b2f66, #12143a); color: #ffe9a6; box-shadow: 0 0 12px rgba(120,130,255,.5); }



                /* ---------- "Let's Talk" button (top bar, phones/tablets) ---------- */
                .fh-talk {
                    display: inline-flex; align-items: center; gap: .5rem; padding: .6rem 1.05rem; border-radius: 10px; color: #fff; white-space: nowrap;
                    font-family: 'Lilita One', sans-serif; font-size: 1rem; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    background: linear-gradient(180deg, #d9433c, #a02220 55%, #7d1614);
                    box-shadow: inset 0 0 0 2px #d9ae45, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 7px 10px rgba(0,0,0,.45);
                    transition: transform .12s, filter .15s;
                }
                .fh-talk:hover { filter: brightness(1.12); }
                .fh-talk:active { transform: translateY(3px); }
                .fh-talk:focus-visible { outline: 3px solid #ffd978; outline-offset: 2px; }

                .fh-progress { height: 5px; margin-top: 8px; border-radius: 9999px; background: rgba(0,0,0,.45); box-shadow: inset 0 0 0 1px rgba(241,196,82,.35); overflow: hidden; }

                /* ---------- text effects ---------- */
                .fh-outline { color: #f6cd5f; text-shadow: 2px 0 #3a1f0a, -2px 0 #3a1f0a, 0 2px #3a1f0a, 0 -2px #3a1f0a, 2px 2px #3a1f0a, -2px 2px #3a1f0a, 0 4px 0 #3a1f0a, 0 6px 8px rgba(0,0,0,.5); }

                .fh-name { position: relative; display: block; isolation: isolate; line-height: 1.02; text-transform: uppercase; }
                .fh-name::before {
                    content: attr(data-text); position: absolute; inset: 0; z-index: -1;
                    -webkit-text-stroke: 9px #3a1f0a;
                    text-shadow: 0 6px 0 #2a1305, 0 12px 16px rgba(0,0,0,.55);
                }
                .fh-name-white {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(180deg, #ffffff 0%, #e9e9ee 45%, #b8b8c4 100%);
                }
                .fh-name-gold {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image:
                        linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%),
                        linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%;
                    background-repeat: no-repeat;
                    background-position: 160% 0, 0 0;
                    animation: fh-gold-shine 5s ease-in-out 1.6s infinite;
                }
                @keyframes fh-gold-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }

                .fh-underline { position: relative; height: 3px; background: linear-gradient(90deg, #ffd978 0%, #f0a820 60%, rgba(240,168,32,.2)); transform-origin: left; animation: fh-grow .9s .45s cubic-bezier(.22,1,.36,1) both; }
                .fh-underline::after { content: ""; position: absolute; right: -2px; top: -4px; border-left: 11px solid #ffd978; border-top: 5.5px solid transparent; border-bottom: 5.5px solid transparent; }
                @keyframes fh-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

                /* ---------- plank / pill / stone surfaces ---------- */
                .fh-rivets { position: relative; }
                .fh-rivets::before {
                    content: ""; position: absolute; inset: 3px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .fh-plank {
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 38px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 2px #caa43d, inset 0 3px 0 rgba(255,255,255,.14), 0 5px 10px rgba(0,0,0,.5);
                    border-radius: 8px;
                }
                .fh-pill {
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 2px rgba(202,164,61,.75), inset 0 2px 0 rgba(255,255,255,.08), 0 6px 12px rgba(0,0,0,.5);
                    border-radius: 10px;
                }
                .fh-role { transition: color .4s, text-shadow .4s; color: #f3e2b4; text-shadow: 0 2px 0 rgba(0,0,0,.7); }
                .fh-role.on { color: #ffd86e; text-shadow: 0 0 14px rgba(255,190,60,.9), 0 2px 0 rgba(0,0,0,.7); }

                .fh-tile {
                    background: linear-gradient(180deg, #3a342d, #1a1511);
                    box-shadow: inset 0 0 0 2px rgba(120,110,95,.7), inset 0 2px 0 rgba(255,255,255,.12), inset 0 -4px 6px rgba(0,0,0,.5), 0 6px 12px rgba(0,0,0,.5);
                    border-radius: 12px;
                    transition: transform .18s, box-shadow .18s;
                }
                .fh-tile:hover { transform: translateY(-5px) scale(1.04); box-shadow: inset 0 0 0 2px #e9b84a, inset 0 2px 0 rgba(255,255,255,.18), 0 0 20px rgba(255,160,40,.55), 0 10px 14px rgba(0,0,0,.5); }
                .fh-tile:active { transform: translateY(0) scale(.97); }

                /* ---------- buttons ---------- */
                .fh-btn {
                    position: relative; overflow: hidden; border-radius: 10px;
                    font-family: 'Lilita One', sans-serif; font-size: 1.25rem; letter-spacing: .02em;
                    text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    transition: transform .12s, box-shadow .12s, filter .15s;
                }
                .fh-btn-red {
                    background: linear-gradient(180deg, #d9433c 0%, #a02220 55%, #7d1614 100%);
                    box-shadow: inset 0 0 0 3px #d9ae45, inset 0 4px 0 rgba(255,255,255,.3), 0 6px 0 #4e0c0b, 0 12px 16px rgba(0,0,0,.5);
                }
                .fh-btn-dark {
                    background: linear-gradient(180deg, #34302b 0%, #1a1612 60%, #100d0a 100%);
                    box-shadow: inset 0 0 0 3px #caa43d, inset 0 4px 0 rgba(255,255,255,.12), 0 6px 0 #070504, 0 12px 16px rgba(0,0,0,.5);
                }
                .fh-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }
                .fh-btn:active { transform: translateY(5px); }
                .fh-btn-red:active { box-shadow: inset 0 0 0 3px #d9ae45, inset 0 4px 0 rgba(255,255,255,.3), 0 1px 0 #4e0c0b, 0 4px 8px rgba(0,0,0,.5); }
                .fh-btn-dark:active { box-shadow: inset 0 0 0 3px #caa43d, inset 0 4px 0 rgba(255,255,255,.12), 0 1px 0 #070504, 0 4px 8px rgba(0,0,0,.5); }
                .fh-shine::after {
                    content: ""; position: absolute; top: 0; left: -80%; width: 40%; height: 100%;
                    background: linear-gradient(105deg, transparent, rgba(255,235,170,.6), transparent);
                    transform: skewX(-20deg); animation: fh-sheen 4.2s ease-in-out 1.5s infinite; pointer-events: none;
                }
                @keyframes fh-sheen { 0% { left: -80%; } 35%, 100% { left: 140%; } }

                /* ---------- entrance ---------- */
                .fh-rise { opacity: 0; animation: fh-rise .8s cubic-bezier(.22,1,.36,1) var(--d, 0ms) forwards; }
                .fh-pop  { opacity: 0; animation: fh-pop .6s cubic-bezier(.34,1.56,.64,1) var(--d, 0ms) forwards; }
                @keyframes fh-rise { from { opacity: 0; translate: 0 26px; } to { opacity: 1; translate: 0 0; } }
                @keyframes fh-pop  { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }

                /* ---------- scene (frame, wall, banner) ---------- */
                .fh-scene { position: relative; transform: translate(calc(var(--mx) * 9px), calc(var(--my) * 6px)); transition: transform .25s ease-out; }
                .fh-frame-drop { opacity: 0; animation: fh-drop 1.1s cubic-bezier(.3,1.4,.5,1) .35s forwards; }
                @keyframes fh-drop {
                    0%   { opacity: 0; translate: 0 -420px; rotate: -7deg; }
                    55%  { opacity: 1; translate: 0 12px; rotate: 1.6deg; }
                    75%  { translate: 0 -6px; rotate: -.6deg; }
                    100% { opacity: 1; translate: 0 0; rotate: 0deg; }
                }
                .fh-frame { position: relative; animation: fh-float 6s ease-in-out 1.6s infinite; transform: perspective(900px) rotateY(calc(var(--mx) * 3deg)) rotateX(calc(var(--my) * -2deg)); transition: transform .25s ease-out; }
                @keyframes fh-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -7px; } }

                .fh-gold {
                    position: relative; aspect-ratio: 4 / 5; padding: 10px;
                    clip-path: polygon(0 7%, 7% 0, 93% 0, 100% 7%, 100% 93%, 93% 100%, 7% 100%, 0 93%);
                    background: linear-gradient(135deg, #fbe28a 0%, #c28a25 45%, #f3cf70 70%, #8c5f12 100%);
                }
                .fh-photo {
                    position: relative; width: 100%; height: 100%; overflow: hidden;
                    clip-path: polygon(0 7%, 7% 0, 93% 0, 100% 7%, 100% 93%, 93% 100%, 7% 100%, 0 93%);
                    background:
                        radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), transparent 45%),
                        radial-gradient(circle at 70% 70%, rgba(0,0,0,.18), transparent 50%),
                        #8d8b86;
                }
                .fh-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .fh-photo::after { content: ""; position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 45px rgba(0,0,0,.5); }
                .fh-glare { position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }
                .fh-glare::before {
                    content: ""; position: absolute; top: -10%; left: -60%; width: 35%; height: 120%;
                    background: linear-gradient(105deg, transparent, rgba(255,240,190,.5), transparent);
                    transform: skewX(-18deg); animation: fh-glare 6s ease-in-out 2.4s infinite;
                }
                @keyframes fh-glare { 0% { left: -60%; } 30%, 100% { left: 150%; } }

                .fh-post { position: absolute; top: -.9rem; bottom: .4rem; width: 2.3rem; display: flex; flex-direction: column; gap: 4px; z-index: -1; }
                .fh-post.l { left: -1.1rem; } .fh-post.r { right: -1.1rem; }
                .fh-post i { flex: 1; border-radius: 9px; background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 9px), linear-gradient(135deg, #8a5c35, #4a2c14); box-shadow: inset 0 2px 0 rgba(255,255,255,.18), inset 0 -3px 4px rgba(0,0,0,.4), 0 2px 3px rgba(0,0,0,.5); }
                .fh-post i:nth-child(2n) { flex: 1.3; }

                .fh-ribbon {
                    position: absolute; width: 5.2rem; height: 3.4rem; z-index: 4;
                    clip-path: polygon(0 10%, 100% 0, 78% 45%, 100% 100%, 0 90%, 12% 50%);
                    background: linear-gradient(180deg, #d3403a, #7c1716);
                    transform-origin: left center; animation: fh-wave 3.2s ease-in-out infinite;
                }
                @keyframes fh-wave { 0%,100% { transform: rotate(var(--r0)) skewY(0deg); } 50% { transform: rotate(var(--r1)) skewY(7deg); } }

                .fh-wall { position: absolute; left: -3rem; right: -3rem; bottom: 0; z-index: 3; display: flex; flex-direction: column; gap: 6px; filter: drop-shadow(0 12px 16px rgba(0,0,0,.6)); }
                .fh-wall-row { display: flex; gap: 6px; }
                .fh-stone-b {
                    height: 3.3rem; min-width: 0; border-radius: 11px;
                    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.1), transparent 55%), linear-gradient(150deg, #5e554c, #352e28);
                    box-shadow: inset 0 3px 0 rgba(255,255,255,.14), inset 0 -4px 6px rgba(0,0,0,.45);
                }
                .fh-stone-b.moss { background: linear-gradient(180deg, rgba(86,138,44,.9) 0 18%, transparent 40%), radial-gradient(circle at 30% 20%, rgba(255,255,255,.1), transparent 55%), linear-gradient(150deg, #5e554c, #352e28); }

                /* ---------- flames / torches ---------- */
                .fh-torch { position: absolute; z-index: 5; width: 44px; height: 96px; transform: scale(var(--s, 1)); transform-origin: bottom center; pointer-events: none; }
                .fh-torch-glow { position: absolute; left: 50%; bottom: 20px; width: 190px; height: 190px; margin-left: -95px; border-radius: 9999px; background: radial-gradient(circle, rgba(255,150,40,.55), transparent 68%); animation: fh-flicker 1.9s ease-in-out infinite; }
                .fh-flame { position: absolute; left: 50%; bottom: 26px; width: 28px; height: 56px; margin-left: -14px; mix-blend-mode: screen; filter: blur(.6px); }
                .fh-flame i { position: absolute; left: 50%; bottom: 0; transform-origin: 50% 100%; border-radius: 55% 55% 50% 50% / 78% 78% 28% 28%; animation: fh-dance .8s ease-in-out infinite alternate; }
                .fh-flame i:nth-child(1) { width: 28px; height: 56px; margin-left: -14px; background: radial-gradient(ellipse at 50% 85%, #ff9a22, #e0420f 70%, transparent); }
                .fh-flame i:nth-child(2) { width: 18px; height: 40px; margin-left: -9px; background: radial-gradient(ellipse at 50% 85%, #ffd35e, #ff9a22 75%, transparent); animation-delay: -.25s; }
                .fh-flame i:nth-child(3) { width: 9px; height: 24px; margin-left: -4.5px; background: radial-gradient(ellipse at 50% 85%, #fff6cf, #ffd35e 80%, transparent); animation-delay: -.5s; }
                .fh-torch-cup { position: absolute; left: 50%; bottom: 0; width: 30px; height: 30px; margin-left: -15px; clip-path: polygon(0 0, 100% 0, 78% 100%, 22% 100%); background: linear-gradient(180deg, #8a7a66, #3a322a); }
                .fh-torch-cup::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: linear-gradient(180deg, #f6dc8a, #a9791c); }
                @keyframes fh-dance {
                    0%   { transform: scale(1, 1) skewX(-5deg); }
                    50%  { transform: scale(.94, 1.1) skewX(4deg); }
                    100% { transform: scale(1.04, .95) skewX(-3deg); }
                }
                @keyframes fh-flicker { 0%,100% { opacity: .6; scale: 1; } 40% { opacity: .95; scale: 1.1; } 70% { opacity: .75; scale: .96; } }

                /* ---------- hanging banner ---------- */
                .fh-bpole { position: absolute; top: 0; bottom: 0; width: 1.1rem; border-radius: 6px; background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 14px), linear-gradient(90deg, #6e4526, #3d2411); box-shadow: inset 2px 0 0 rgba(255,255,255,.15), 0 4px 6px rgba(0,0,0,.5); }
                .fh-beam { position: absolute; top: .9rem; left: -1.6rem; right: -1.6rem; height: .9rem; border-radius: 5px; transform: rotate(-3deg); background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 12px), linear-gradient(180deg, #84552f, #46290f); box-shadow: 0 4px 6px rgba(0,0,0,.5); }
                .fh-cloth-wrap { position: absolute; top: 1.5rem; left: 1.4rem; right: 1.4rem; transform-origin: 50% 0; animation: fh-sway 4.6s ease-in-out infinite; }
                @keyframes fh-sway { 0%,100% { rotate: -2.2deg; } 50% { rotate: 2.6deg; } }
                .fh-cloth { position: relative; padding: 2.2rem 1rem 3.6rem; clip-path: polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%); background: linear-gradient(90deg, rgba(0,0,0,.18), transparent 25%, transparent 70%, rgba(0,0,0,.2)), linear-gradient(180deg, #b32f2c, #771615); box-shadow: inset 0 0 0 3px rgba(241,196,82,.35); }
                .fh-banner-text { font-family: 'Caveat', cursive; font-weight: 700; color: #fff3e0; font-size: 1.9rem; line-height: 1.12; rotate: -13deg; text-shadow: 0 2px 2px rgba(0,0,0,.45); }

                @media (prefers-reduced-motion: reduce) {
                    .fh-root *, .fh-root *::before, .fh-root *::after { animation: none !important; transition: none !important; }
                    .fh-rise, .fh-pop, .fh-frame-drop { opacity: 1 !important; }
                }
            `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="fh-bg" />
            <div className="fh-sun" />
            <div className="fh-clouds" aria-hidden="true">
                <div className="fh-cloud" style={{ top: "14%", left: "10%", width: "46vw", height: 70, "--t": "90s" }} />
                <div className="fh-cloud" style={{ top: "30%", left: "40%", width: "52vw", height: 90, "--t": "120s", background: "linear-gradient(90deg, transparent, var(--cloud2), transparent)" }} />
                <div className="fh-cloud" style={{ top: "48%", left: "-10%", width: "60vw", height: 80, "--t": "100s" }} />
                <div className="fh-cloud" style={{ top: "6%", left: "55%", width: "34vw", height: 50, "--t": "80s", background: "linear-gradient(90deg, transparent, var(--cloud2), transparent)" }} />
            </div>

            <svg className="fh-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path fill="var(--ridge1)" opacity=".85" d="M0 260 L120 210 L200 250 L330 170 L430 240 L560 190 L690 260 L820 200 L950 250 L1080 160 L1200 230 L1320 190 L1440 240 L1440 400 L0 400 Z" />
                <path fill="var(--ridge2)" d="M0 330 L90 300 L180 330 L300 280 L420 335 L560 295 L700 345 L850 300 L1000 340 L1130 290 L1260 335 L1360 305 L1440 330 L1440 400 L0 400 Z" />
                {/* tiny castle silhouette */}
                <g fill="var(--ridge2)">
                    <rect x="1040" y="236" width="46" height="60" />
                    <rect x="1034" y="222" width="12" height="20" />
                    <rect x="1080" y="222" width="12" height="20" />
                    <path d="M1051 236 L1063 206 L1075 236 Z" />
                </g>
            </svg>

            <div className="fh-vignette" />
            <canvas ref={canvasRef} className="fh-embers" aria-hidden="true" />

            {/* ---------------- TOP NAVBAR ---------------- */}
            <nav className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 pt-3">
                <div className="fh-nav-shell max-w-6xl mx-auto">
                    <div className="fh-nav-bg" />
                    <div
                        className={`relative flex items-center justify-between gap-3 px-5 sm:px-9 transition-all ${
                            scrolled ? "py-2.5" : "py-3.5"
                        }`}
                    >
                        {/* Logo */}
                        <a href="#home" className="flex items-center gap-2.5 shrink-0">
                            <svg width="42" height="46" viewBox="0 0 42 46" aria-hidden="true">
                                <defs>
                                    <linearGradient id="fhShield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0" stopColor="#e24a3f" />
                                        <stop offset="1" stopColor="#8a1716" />
                                    </linearGradient>
                                    <linearGradient id="fhRim" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0" stopColor="#ffe48f" />
                                        <stop offset="1" stopColor="#b9801c" />
                                    </linearGradient>
                                </defs>
                                <path d="M21 3 L37 9 V22 C37 33 30 40 21 44 C12 40 5 33 5 22 V9 Z" fill="url(#fhShield)" stroke="url(#fhRim)" strokeWidth="2.6" />
                                <path d="M21 8 L33 12.5 V22 C33 30 28 36 21 39.5 Z" fill="#f6d47a" opacity=".85" />
                                <path d="M11 33 L21 14 M31 33 L21 14" stroke="#7a1413" strokeWidth="2.4" strokeLinecap="round" />
                                <path d="M5 4 L11 10 M9 2 L12 8" stroke="#e24a3f" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="fh-display fh-outline text-2xl sm:text-3xl">{LOGO_TEXT}</span>
                        </a>

                        {/* Desktop links */}
                        <div className="hidden lg:flex items-center gap-3">
                            {NAV.map((n) => {
                                const active = activeSection === n.id;
                                return (
                                    <a key={n.id} href={`#${n.id}`} className={`fh-tab ${active ? "fh-tab-on" : ""}`}>
                                        {active && (
                                            <span className="fh-pennant" aria-hidden="true" />
                                        )}
                                        {n.label}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Theme toggle */}
                        <div className="hidden md:flex items-center gap-1 fh-toggle rounded-full p-1">
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                aria-pressed={theme === "light"}
                                aria-label="Day theme"
                                className={`fh-toggle-btn ${theme === "light" ? "on-sun" : ""}`}
                            >
                                ☀
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                aria-pressed={theme === "dark"}
                                aria-label="Night theme"
                                className={`fh-toggle-btn ${theme === "dark" ? "on-moon" : ""}`}
                            >
                                ☽
                            </button>
                        </div>

                        {/* Phones / tablets: theme button + Let's Talk (the links live in the bottom bar) */}
                        <div className="flex lg:hidden items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                aria-label={theme === "dark" ? "Switch to day theme" : "Switch to night theme"}
                                className="md:hidden fh-toggle rounded-full p-1"
                            >
                                <span className={`fh-toggle-btn ${theme === "dark" ? "on-moon" : "on-sun"}`}>
                                    {theme === "dark" ? "☽" : "☀"}
                                </span>
                            </button>
                            <a href="#contact" data-spark className="fh-talk">
                                Let's Talk
                                <FaArrowRight className="text-sm" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* quest progress bar */}
                <div className="fh-progress max-w-6xl mx-auto">
                    <div
                        ref={barRef}
                        className="h-full origin-left bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500"
                        style={{ transform: "scaleX(0)" }}
                    />
                </div>

            </nav>

            {/* ---------------- MOBILE BOTTOM NAV ---------------- */}
            <div
                className={`lg:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[94%] max-w-lg fh-plank px-2 py-2.5 z-50 transition-all duration-300 ${
                    showMobileNav ? "translate-y-0 opacity-100" : "translate-y-[170%] opacity-0 pointer-events-none"
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
                                    active ? "text-amber-300 -translate-y-0.5" : "text-amber-100/70"
                                }`}
                            >
                                <Icon className="text-base" />
                                <span className="fh-display text-[11px]">{n.label}</span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- FOREGROUND LEAVES ---------------- */}
            <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden" aria-hidden="true">
                {FORE_BLOBS.map((b, i) => (
                    <div key={i} className="fh-blob" style={{ left: b.l, bottom: b.b, width: b.w, height: b.h, "--r": `${b.r}deg`, "--c": b.c }} />
                ))}
                <div className="fh-blob" style={{ left: "-6%", top: "-6%", width: 200, height: 150, "--r": "20deg", "--c": "#2c4a16" }} />
            </div>

            {/* ---------------- HERO CONTENT ---------------- */}
            <main className="relative z-10 min-h-screen flex items-center pt-36 pb-28">
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8">
                    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-16 md:gap-8">

                        {/* -------- LEFT: text -------- */}
                        <div className="w-full md:w-[54%] text-center md:text-left">

                            <div className="fh-rise inline-block" style={{ "--d": "0ms" }}>
                                <span className="fh-plank fh-rivets fh-display inline-block px-6 py-2 text-lg sm:text-xl text-amber-100" style={{ textShadow: "0 2px 0 rgba(0,0,0,.7)" }}>
                                    HELLO, I'M
                                </span>
                            </div>

                            <h1 className="fh-display text-5xl sm:text-6xl xl:text-7xl mt-5">
                                <span className="fh-rise fh-name block" data-text={FIRST_NAME} style={{ "--d": "150ms" }}>
                                    <span className="fh-name-white">{FIRST_NAME}</span>
                                </span>
                                <span className="fh-rise fh-name block" data-text={LAST_NAME} style={{ "--d": "280ms" }}>
                                    <span className="fh-name-gold">{LAST_NAME}</span>
                                </span>
                            </h1>

                            <div className="fh-underline mx-auto md:mx-0 mt-3 w-64 sm:w-[26rem] max-w-full" />

                            <div className="fh-rise mt-6" style={{ "--d": "450ms" }}>
                                <span className="fh-pill inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-6 py-3 fh-display text-base sm:text-xl">
                                    <span className="text-amber-400 text-sm">◆</span>
                                    {ROLES.map((r, i) => (
                                        <span key={r} className="flex items-center gap-2 sm:gap-3">
                                            <span className={`fh-role ${roleIdx === i ? "on" : ""}`}>{r}</span>
                                            {i < ROLES.length - 1 && <span className="text-amber-500/60">|</span>}
                                        </span>
                                    ))}
                                    <span className="text-amber-400 text-sm">◆</span>
                                </span>
                            </div>

                            <p
                                className="fh-rise mt-6 max-w-xl mx-auto md:mx-0 text-gray-100/90 text-base sm:text-lg leading-relaxed"
                                style={{ "--d": "550ms", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}
                            >
                                I build modern, responsive, and user-friendly web
                                applications. I love turning ideas into real-world
                                projects and I'm always excited to learn new
                                technologies.
                            </p>

                            {/* Buttons */}
                            <div className="fh-rise flex flex-wrap items-center justify-center md:justify-start gap-5 mt-8" style={{ "--d": "700ms" }}>
                                <a href="/resume.pdf" data-spark className="fh-btn fh-btn-red fh-shine fh-rivets inline-flex items-center gap-3 px-8 py-4 text-white">
                                    <FaFileAlt className="text-amber-200 text-2xl" />
                                    View Resume
                                </a>
                                <a href="#contact" data-spark className="fh-btn fh-btn-dark fh-rivets inline-flex items-center gap-3 px-8 py-4 text-amber-50">
                                    <FaPaperPlane className="text-white text-2xl" />
                                    Contact Me
                                </a>
                            </div>

                            {/* Socials */}
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-9">
                                {SOCIALS.map((s, i) => (
                                    <div key={s.label} className="fh-pop" style={{ "--d": `${850 + i * 110}ms` }}>
                                        <a
                                            href={s.href}
                                            data-spark
                                            target={s.href.startsWith("http") ? "_blank" : undefined}
                                            rel="noopener noreferrer"
                                            aria-label={s.label}
                                            className="fh-tile fh-rivets w-[4.5rem] h-[4.5rem] flex items-center justify-center text-white"
                                        >
                                            {s.icon}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* -------- RIGHT: framed portrait on the wall + banner -------- */}
                        <div className="fh-scene shrink-0 pb-24 lg:pr-12 xl:pr-24">
                            <div className="fh-frame-drop relative">
                                <div className="fh-frame w-[15.5rem] sm:w-[19rem] lg:w-[20rem] xl:w-[23rem]">
                                    <div className="fh-post l" aria-hidden="true"><i /><i /><i /><i /><i /></div>
                                    <div className="fh-post r" aria-hidden="true"><i /><i /><i /><i /><i /></div>

                                    <span className="fh-ribbon" aria-hidden="true" style={{ left: "-3.6rem", top: "3.2rem", "--r0": "-14deg", "--r1": "-4deg", transform: "rotate(-14deg)" }} />
                                    <span className="fh-ribbon" aria-hidden="true" style={{ right: "-3.6rem", bottom: "3rem", transform: "scaleX(-1) rotate(-10deg)", "--r0": "-10deg", "--r1": "-2deg", background: "linear-gradient(180deg,#c93a35,#701312)" }} />

                                    <div className="fh-gold" style={{ filter: "drop-shadow(0 16px 22px rgba(0,0,0,.55))" }}>
                                        <div className="fh-photo">
                                            <img src="/profile2.png" alt="Mohammad Abdullah Ansari" />
                                            <div className="fh-glare" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* stone wall */}
                            <div className="fh-wall" aria-hidden="true">
                                {WALL.map((row, ri) => (
                                    <div key={ri} className="fh-wall-row" style={{ paddingLeft: ri ? "1.2rem" : 0, paddingRight: ri ? 0 : "1.2rem" }}>
                                        {row.map((g, i) => (
                                            <div key={i} className={`fh-stone-b ${ri === 0 && i % 3 === 0 ? "moss" : ""}`} style={{ flexGrow: g, flexBasis: 0 }} />
                                        ))}
                                    </div>
                                ))}
                                {LEAVES.map(([l, t, r, s], i) => (
                                    <span key={i} className="fh-leaf" style={{ left: `${l}%`, top: t, width: s, height: s * 1.2, rotate: `${r}deg`, animationDelay: `${i * 0.35}s` }} />
                                ))}
                            </div>

                            {/* torches */}
                            <Torch style={{ left: "-2.6rem", bottom: "6.2rem" }} scale={0.75} />
                            <Torch style={{ right: "-1.6rem", bottom: "6.2rem" }} scale={0.6} className="hidden sm:block" />

                            {/* hanging banner (large screens) */}
                            <div className="hidden lg:block absolute z-[4] right-[-3rem] xl:right-[-1rem] bottom-16 w-[10rem] xl:w-[11rem] h-[24rem]" style={{ top: "-1.5rem" }}>
                                <div className="fh-bpole" style={{ left: 0 }} />
                                <div className="fh-bpole" style={{ right: 0 }} />
                                <div className="fh-beam" />
                                <div className="fh-cloth-wrap">
                                    <div className="fh-cloth">
                                        <p className="fh-banner-text">
                                            Code<br />Create<br />Grow<br />Repeat
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Torch style={{ right: "-6.2rem", bottom: "5.4rem" }} scale={1.1} className="hidden xl:block" />
                        </div>

                    </div>
                </div>
            </main>
        </section>
    );
}

export default Hero;