import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaCode,
    FaCircle,
    FaTrophy,
    FaChessKnight,
    FaJava,
    FaPython,
    FaMedal,
    FaCalendarAlt,
    FaExternalLinkAlt,
    FaArrowRight,
} from "react-icons/fa";
import { SiLeetcode, SiJavascript, SiCplusplus, SiTypescript, SiC } from "react-icons/si";

/*
  ============================================================================
  LEETCODE DASHBOARD — fantasy game-UI theme (matches Hero / Skills / Projects)

  THEME: follows the same day/night switch as the Hero navbar. Hero sets
  document.documentElement.dataset.theme = "light" | "dark" and every colour
  here (sky, sun/moon, panel, text, stats, heatmap) reacts to it.

  The LeetCode API calls and all the data logic are unchanged — only the look
  and effects are new (count-up numbers, ember heatmap, swaying sign, etc.).

  NOTE: the root keeps your original id="leetcode". Your navbar links to
  #dashboard, so make sure the wrapper you render this in has id="dashboard"
  (or change the id below to "dashboard" if nothing else uses it).
  ============================================================================
*/

/* ---------- config ---------- */

const USERNAME = "abdullah7398";
const PROFILE_URL = `https://leetcode.com/u/${USERNAME}/`;

// Public instance of alfa-leetcode-api. It runs on a free host, so the first
// request after a quiet period can take ~30-60s. For a faster/more reliable
// setup, deploy your own copy (Docker/Vercel) and change this URL.
const API_BASE = "https://alfa-leetcode-api.onrender.com";

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
    [4, 4, 14, 0, 30], [9, 3, 17, 3, -20], [15, 5, 12, 6, 24], [22, 3, 19, 1, -30],
    [29, 4, 15, 8, 18], [36, 3, 18, 4, -16], [43, 5, 13, 9, 26], [50, 3, 20, 2, -24],
    [57, 4, 16, 7, 20], [64, 3, 14, 5, -28], [71, 5, 18, 0, 22], [78, 3, 15, 10, -18],
    [85, 4, 17, 3, 28], [91, 3, 13, 6, -22], [96, 5, 19, 8, 16],
];

/* ---------- helpers ---------- */

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

function Hex({ size = 64, from, to, children }) {
    return (
        <div
            className="flex items-center justify-center shrink-0"
            style={{
                width: size,
                height: size,
                clipPath: HEX,
                background: `linear-gradient(160deg, ${from}, ${to})`,
            }}
        >
            <div
                className="flex items-center justify-center overflow-hidden"
                style={{
                    width: size - 5,
                    height: size - 5,
                    clipPath: HEX,
                    background: "var(--hex-in)",
                }}
            >
                {children}
            </div>
        </div>
    );
}

const toLevel = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4);

const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());

const LANG_STYLE = {
    Java: { icon: FaJava, color: "text-orange-400", bar: "bg-orange-500" },
    JavaScript: { icon: SiJavascript, color: "text-yellow-400", bar: "bg-yellow-400" },
    TypeScript: { icon: SiTypescript, color: "text-blue-400", bar: "bg-blue-500" },
    Python: { icon: FaPython, color: "text-blue-400", bar: "bg-blue-500" },
    Python3: { icon: FaPython, color: "text-blue-400", bar: "bg-blue-500" },
    "C++": { icon: SiCplusplus, color: "text-sky-400", bar: "bg-sky-500" },
    C: { icon: SiC, color: "text-slate-300", bar: "bg-slate-400" },
};
const FALLBACK_STYLE = { icon: FaCode, color: "text-amber-300", bar: "bg-amber-500" };

const BADGE_COLORS = [
    ["#4ade80", "#15803d"],
    ["#fbbf24", "#b45309"],
    ["#f0b64a", "#8a5a12"],
    ["#2dd4bf", "#0f766e"],
];

const abs = (url) => (url && url.startsWith("/") ? `https://leetcode.com${url}` : url);

async function getJson(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
}

// The calendar may come back as an object or as a JSON string
function parseCalendar(data) {
    let cal = data?.submissionCalendar ?? data;
    if (typeof cal === "string") {
        try {
            cal = JSON.parse(cal);
        } catch {
            cal = {};
        }
    }
    return cal && typeof cal === "object" ? cal : {};
}

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

/* numbers count up when the data arrives */
function CountUp({ value }) {
    const [n, setN] = useState(0);

    useEffect(() => {
        if (value === null || value === undefined || Number.isNaN(Number(value))) return;
        const target = Number(value);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setN(target);
            return;
        }
        let raf;
        let start;
        const tick = (t) => {
            if (start === undefined) start = t;
            const p = Math.min((t - start) / 1100, 1);
            setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value]);

    if (value === null || value === undefined) return "—";
    return Number(n).toLocaleString();
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
            { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`lc-reveal ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

/* ---------- component ---------- */

function LeetCodeDashboard({ embedded = true }) {
    const [solved, setSolved] = useState(null);
    const [contest, setContest] = useState(null);
    const [badges, setBadges] = useState([]);
    const [langs, setLangs] = useState([]);
    const [calendar, setCalendar] = useState(null); // { "YYYY-MM-DD": count }
    const [error, setError] = useState(false);
    const heatRef = useRef(null);

    useGoogleFonts();

    useEffect(() => {
        let cancelled = false;
        const year = new Date().getUTCFullYear();

        async function load() {
            const results = await Promise.allSettled([
                getJson(`/${USERNAME}/solved`),
                getJson(`/${USERNAME}/contest`),
                getJson(`/${USERNAME}/badges`),
                getJson(`/${USERNAME}/language`),
                getJson(`/${USERNAME}/calendar?year=${year}`),
                getJson(`/${USERNAME}/calendar?year=${year - 1}`),
            ]);
            if (cancelled) return;

            const [sv, ct, bd, lg, cal1, cal0] = results;

            if (sv.status === "fulfilled") setSolved(sv.value);
            if (ct.status === "fulfilled") setContest(ct.value);
            if (bd.status === "fulfilled") setBadges(bd.value.badges || []);
            if (lg.status === "fulfilled") setLangs(lg.value.languageProblemCount || []);

            if (cal1.status === "fulfilled" || cal0.status === "fulfilled") {
                const merged = {};
                [cal0, cal1].forEach((r) => {
                    if (r.status !== "fulfilled") return;
                    const c = parseCalendar(r.value);
                    Object.entries(c).forEach(([ts, n]) => {
                        const key = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
                        merged[key] = (merged[key] || 0) + Number(n);
                    });
                });
                setCalendar(merged);
            }

            if (results.every((r) => r.status === "rejected")) setError(true);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    /* --- derived data --- */

    const total = solved?.solvedProblem ?? null;
    const pct = (n) =>
        total && n !== undefined ? `${((n / total) * 100).toFixed(1)}%` : "—";

    const languages = useMemo(() => {
        const sum = langs.reduce((s, l) => s + l.problemsSolved, 0);
        if (!sum) return [];
        const list = [...langs]
            .sort((a, b) => b.problemsSolved - a.problemsSolved)
            .slice(0, 4)
            .map((l) => ({
                name: l.languageName,
                value: (l.problemsSolved / sum) * 100,
                style: LANG_STYLE[l.languageName] || FALLBACK_STYLE,
            }));
        const max = list[0].value;
        return list.map((l) => ({ ...l, width: (l.value / max) * 100 }));
    }, [langs]);

    // Last 365 days, grouped into Sunday-first week columns
    const { weeks, monthLabels, totalSubs, activeDays } = useMemo(() => {
        if (!calendar) return { weeks: [], monthLabels: [], totalSubs: 0, activeDays: 0 };

        const today = new Date();
        const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
        const days = [];
        for (let i = 364; i >= 0; i--) {
            const d = new Date(end - i * 86400000);
            const key = d.toISOString().slice(0, 10);
            days.push({ date: key, count: calendar[key] || 0 });
        }

        const w = [];
        let week = new Array(new Date(days[0].date).getUTCDay()).fill(null);
        days.forEach((d) => {
            week.push(d);
            if (week.length === 7) {
                w.push(week);
                week = [];
            }
        });
        if (week.length) {
            while (week.length < 7) week.push(null);
            w.push(week);
        }

        const labels = [];
        let last = -1;
        w.forEach((col, i) => {
            const first = col.find(Boolean);
            if (!first) return;
            const m = new Date(first.date).getUTCMonth();
            if (m !== last) {
                labels.push({
                    col: i + 1,
                    name: new Date(first.date).toLocaleString("en", {
                        month: "short",
                        timeZone: "UTC",
                    }),
                });
                last = m;
            }
        });

        return {
            weeks: w,
            monthLabels: labels,
            totalSubs: days.reduce((s, d) => s + d.count, 0),
            activeDays: days.filter((d) => d.count > 0).length,
        };
    }, [calendar]);

    // On phones the heatmap scrolls sideways: start at the most recent weeks
    useEffect(() => {
        const el = heatRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, [weeks.length]);

    // Contest badge (Knight / Guardian) if the user has earned one
    const contestBadge = badges.find((b) =>
        /knight|guardian/i.test(b.displayName || b.name || "")
    );
    const attended = contest?.contestAttend > 0;

    return (
        <section
            id="leetcode"
            className={
                embedded
                    ? "fh-lc fh-embedded relative w-full min-w-0 p-3"
                    : "fh-lc relative overflow-hidden w-full px-3 sm:px-6 pt-28 pb-28"
            }
        >
            <style>{`
                .fh-lc {
                    --text: #f6ecd2; --sub: #d9cba8; --muted: #b9a982;
                    --tile-a: #403930; --tile-b: #1b1612; --tile-ring: rgba(130,118,100,.85); --tile-hi: rgba(255,255,255,.13);
                    --panel-a: rgba(36,30,26,.92); --panel-b: rgba(18,14,11,.94);
                    --hex-in: #17120e; --track: #120e0b; --line: rgba(246,220,138,.18);
                    --easy: #7fe3c8; --medium: #ff9a3c; --hard: #ff6b6b; --good: #5be07a; --gold: #ffd35e;
                    --c0: #2a241e; --c1: #6e421c; --c2: #b2601b; --c3: #f0902a; --c4: #ffd35e;
                    --ridge1: #2b2540; --ridge2: #1a1626; --stars: 1; --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
                    color: var(--text); background: #0e1230;
                }
                :root[data-theme="light"] .fh-lc {
                    --text: #3a210e; --sub: #5a3d25; --muted: #7a5a38;
                    --tile-a: #f8e9c8; --tile-b: #dcc08a; --tile-ring: #b78a36; --tile-hi: rgba(255,255,255,.75);
                    --panel-a: rgba(252,240,214,.94); --panel-b: rgba(236,214,166,.95);
                    --hex-in: #f6e6c4; --track: #cdb27c; --line: rgba(90,58,20,.25);
                    --easy: #0f8f7a; --medium: #c2570a; --hard: #c0292b; --good: #1f8f3d; --gold: #a86a0a;
                    --c0: #e4cf9f; --c1: #f2b866; --c2: #e68a2a; --c3: #c2570a; --c4: #8a2f06;
                    --ridge1: #8a86a8; --ridge2: #5e5c7c; --stars: 0; --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .lc-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* embedded inside the shared Dashboard section: it supplies the sky and the sign */
                .fh-lc.fh-embedded, :root[data-theme="light"] .fh-lc.fh-embedded { background: transparent; }
                .fh-embedded .lc-sky, .fh-embedded .lc-stars, .fh-embedded .lc-orb, .fh-embedded .lc-ridges,
                .fh-embedded .lc-vignette, .fh-embedded .lc-ember, .fh-embedded .lc-signwrap { display: none; }
                .fh-embedded { display: flex; flex-direction: column; }
                .fh-embedded > div.relative.z-10 { flex: 1; display: flex; flex-direction: column; }
                .fh-embedded .lc-panel { flex: 1; }

                /* ----- sky ----- */
                .lc-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .lc-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .lc-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-lc .lc-night { opacity: 0; }
                :root[data-theme="light"] .fh-lc .lc-day { opacity: 1; }
                .lc-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 7% 18%, #fff, transparent), radial-gradient(1px 1px at 15% 52%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 24% 10%, #fff, transparent), radial-gradient(1px 1px at 33% 42%, #fff, transparent),
                        radial-gradient(2px 2px at 42% 22%, #ffe9b8, transparent), radial-gradient(1px 1px at 51% 62%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 60% 14%, #fff, transparent), radial-gradient(1px 1px at 68% 46%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 77% 28%, #fff, transparent), radial-gradient(1px 1px at 85% 9%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 94% 50%, #ffe9b8, transparent), radial-gradient(1px 1px at 3% 70%, #fff, transparent);
                    animation: lc-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes lc-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }
                .lc-orb {
                    position: absolute; z-index: 0; top: 6%; right: 7%; width: 76px; height: 76px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s; animation: lc-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-lc .lc-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes lc-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
                .lc-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 34%; z-index: 0; pointer-events: none; }
                .lc-ridges path { transition: fill .7s; }
                .lc-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }
                .lc-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none; opacity: 0;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: lc-rise var(--dur) linear var(--del) infinite;
                }
                :root[data-theme="light"] .fh-lc .lc-ember { animation: none; opacity: 0 !important; }
                @keyframes lc-rise {
                    0% { opacity: 0; transform: translate(0,0); } 10% { opacity: .9; } 85% { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                /* ----- sign ----- */
                .lc-sign {
                    position: relative; display: inline-block; padding: 1rem 2.4rem 1.1rem; border-radius: 12px; transform-origin: 50% -2.2rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: lc-swing 6s ease-in-out infinite;
                }
                @keyframes lc-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .lc-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .lc-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .lc-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .lc-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: lc-shine 5s ease-in-out 1s infinite;
                }
                @keyframes lc-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .lc-rivets { position: relative; }
                .lc-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }

                /* ----- main panel + cards ----- */
                .lc-reveal { opacity: 0; transform: translateY(26px) scale(.97); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.56,.64,1); }
                .lc-reveal.is-in { opacity: 1; transform: none; }
                .lc-panel {
                    position: relative; border-radius: 22px; color: var(--text);
                    background: radial-gradient(circle at 20% 0%, var(--tile-hi), transparent 45%), linear-gradient(180deg, var(--panel-a), var(--panel-b));
                    box-shadow: 0 0 0 4px #4d3019, 0 0 0 7px #d4ab45, 0 0 0 9px #4d3019, 0 24px 40px rgba(0,0,0,.5), inset 0 3px 0 var(--tile-hi);
                    transition: background .5s;
                }
                .lc-card {
                    position: relative; height: 100%; border-radius: 16px;
                    background: radial-gradient(circle at 25% 0%, var(--tile-hi), transparent 55%), linear-gradient(160deg, var(--tile-a), var(--tile-b));
                    box-shadow: inset 0 0 0 2px var(--tile-ring), inset 0 3px 0 var(--tile-hi), inset 0 -5px 8px rgba(0,0,0,.28), 0 8px 14px rgba(0,0,0,.35);
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, background .5s;
                }
                @media (hover: hover) {
                    .lc-card:hover { transform: translateY(-4px); box-shadow: inset 0 0 0 2px #f0c24f, inset 0 3px 0 var(--tile-hi), 0 0 22px rgba(255,170,50,.4), 0 12px 18px rgba(0,0,0,.4); }
                }
                .lc-icon-box {
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 12px; color: #ffe08a;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 22px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 2px #caa43d, inset 0 2px 0 rgba(255,255,255,.14), 0 4px 6px rgba(0,0,0,.4);
                }
                .lc-sub { color: var(--sub); }
                .lc-muted { color: var(--muted); }
                .lc-divider { border-color: var(--line); }
                .lc-num { font-family: 'Lilita One', sans-serif; letter-spacing: .01em; text-shadow: 0 2px 0 rgba(0,0,0,.28); }
                .lc-good { color: var(--good); } .lc-easy { color: var(--easy); } .lc-medium { color: var(--medium); }
                .lc-hard { color: var(--hard); } .lc-gold { color: var(--gold); }

                .lc-btn {
                    display: inline-flex; align-items: center; gap: .6rem; padding: .75rem 1.5rem; border-radius: 10px; color: #fff;
                    font-family: 'Lilita One', sans-serif; font-size: 1.05rem; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    position: relative; overflow: hidden;
                    background: linear-gradient(180deg, #d9433c, #a02220 55%, #7d1614);
                    box-shadow: inset 0 0 0 2px #d9ae45, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 8px 12px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s;
                }
                .lc-btn:hover { filter: brightness(1.14); transform: translateY(-2px); }
                .lc-btn:active { transform: translateY(4px); }
                .lc-btn:focus-visible, .lc-link:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .lc-btn::after { content: ""; position: absolute; top: 0; left: -80%; width: 40%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,235,170,.55), transparent); transform: skewX(-20deg); animation: lc-sheen 4.2s ease-in-out 1.5s infinite; pointer-events: none; }
                @keyframes lc-sheen { 0% { left: -80%; } 35%, 100% { left: 140%; } }
                .lc-link { display: inline-flex; align-items: center; gap: .5rem; font-family: 'Lilita One', sans-serif; color: var(--gold); transition: transform .15s, filter .15s; }
                .lc-link:hover { transform: translateX(3px); filter: brightness(1.2); }

                .lc-scroll {
                    position: relative; display: inline-block; padding: .7rem 1.1rem; border-radius: 8px; color: #4a2e12; font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.2rem; line-height: 1.2;
                    background: linear-gradient(180deg, #f8e7bd, #e3c98f); box-shadow: inset 0 0 0 2px #b78a36, 0 5px 8px rgba(0,0,0,.35); rotate: 1.2deg;
                }

                .lc-track { height: .7rem; border-radius: 9999px; background: var(--track); box-shadow: inset 0 0 0 1.5px rgba(212,171,69,.55), inset 0 2px 3px rgba(0,0,0,.5); padding: 2px; }
                .lc-fill { height: 100%; border-radius: 9999px; box-shadow: inset 0 2px 0 rgba(255,255,255,.35); transform-origin: left; animation: lc-grow 1s cubic-bezier(.22,1,.36,1) both; }
                @keyframes lc-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

                /* ----- heatmap ----- */
                .lc-cell { aspect-ratio: 1; border-radius: 3px; transition: transform .12s; }
                .lc-cell:hover { transform: scale(1.5); position: relative; z-index: 2; box-shadow: 0 0 0 1px #ffe08a; }
                .lc-l0 { background: var(--c0); } .lc-l1 { background: var(--c1); } .lc-l2 { background: var(--c2); }
                .lc-l3 { background: var(--c3); } .lc-l4 { background: var(--c4); box-shadow: 0 0 6px rgba(255,200,80,.6); }
                .lc-stat { border-radius: 12px; padding: .75rem; background: var(--track); box-shadow: inset 0 0 0 1.5px rgba(212,171,69,.5); }

                .lc-note { display: inline-block; padding: .7rem 1.3rem; border-radius: 10px; color: #f8e9c2; font-weight: 700; background: linear-gradient(180deg, #6b4428, #3b2310); box-shadow: inset 0 0 0 2px #caa43d, 0 6px 10px rgba(0,0,0,.4); }

                @media (prefers-reduced-motion: reduce) {
                    .fh-lc *, .fh-lc *::before, .fh-lc *::after { animation: none !important; transition: none !important; }
                    .lc-reveal { opacity: 1; transform: none; }
                    .lc-ember { display: none; }
                }
            `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="lc-sky lc-night" />
            <div className="lc-sky lc-day" />
            <div className="lc-stars" aria-hidden="true" />
            <div className="lc-orb" aria-hidden="true" />
            <svg className="lc-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path style={{ fill: "var(--ridge1)" }} opacity=".85" d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z" />
                <path style={{ fill: "var(--ridge2)" }} d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z" />
            </svg>
            <div className="lc-vignette" />
            {EMBERS.map(([l, s, d, dl, dx], i) => (
                <span
                    key={i}
                    className="lc-ember"
                    aria-hidden="true"
                    style={{ left: `${l}%`, width: s, height: s, "--dur": `${d}s`, "--del": `${dl}s`, "--dx": `${dx}px` }}
                />
            ))}

            <div className={`relative z-10 w-full min-w-0 ${embedded ? "" : "max-w-5xl mx-auto"}`}>

                {/* hanging sign */}
                <div className="lc-signwrap text-center pt-10 mb-12">
                    <div className="lc-sign lc-rivets">
                        <span className="lc-chain" style={{ left: "16%" }} />
                        <span className="lc-chain" style={{ right: "16%" }} />
                        <h2 className="lc-display text-3xl sm:text-5xl lg:text-6xl">
                            <span className="lc-name" data-text="LeetCode Dashboard"><span>LeetCode Dashboard</span></span>
                        </h2>
                    </div>
                </div>

                <div className="lc-panel p-4 sm:p-6 md:p-8">

                    {/* Header */}
                    <Reveal>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                            <div className="flex items-center gap-4">
                                <Hex size={72} from="#ffe48f" to="#a8741c">
                                    <SiLeetcode className="text-4xl" style={{ color: "#f59e0b" }} />
                                </Hex>
                                <div>
                                    <p className="lc-display text-2xl sm:text-3xl leading-tight">Solve Today.</p>
                                    <p className="lc-display text-2xl sm:text-3xl leading-tight lc-gold">Build Tomorrow.</p>
                                    <p className="lc-sub text-sm mt-1 font-semibold">@{USERNAME}</p>
                                </div>
                            </div>

                            <div className="sm:text-right">
                                <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="lc-btn">
                                    View Profile
                                    <FaExternalLinkAlt className="text-sm" />
                                </a>
                                <div className="mt-4 sm:ml-auto max-w-[240px]">
                                    <p className="lc-scroll">“A problem a day keeps the imposter away.”</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {error && (
                        <p className="mt-6 text-center">
                            <span className="lc-note">
                                Couldn't load LeetCode data. The API may be waking up or rate-limited — wait a minute and refresh.
                            </span>
                        </p>
                    )}

                    {/* Solved Statistics */}
                    <Reveal delay={80} className="mt-8">
                        <div className="lc-card lc-rivets p-4 sm:p-5 md:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-5 lg:gap-0">

                                <div className="flex items-center gap-4 lg:pr-6">
                                    <div className="lc-icon-box w-14 h-14 sm:w-16 sm:h-16">
                                        <FaCode className="text-2xl sm:text-3xl" />
                                    </div>
                                    <div>
                                        <p className="lc-sub text-sm font-bold">Total Solved</p>
                                        <p className="lc-num lc-good text-4xl sm:text-5xl leading-tight">
                                            <CountUp value={total} />
                                        </p>
                                        <p className="lc-muted text-sm font-semibold">Problems</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 border-t lc-divider pt-5 lg:pt-0 lg:border-t-0 lg:contents">

                                    <div className="lg:border-l lc-divider lg:pl-6">
                                        <p className="flex items-center gap-1.5 sm:gap-2 lc-sub text-xs sm:text-sm font-bold">
                                            <FaCircle className="lc-easy text-[10px]" />
                                            Easy
                                        </p>
                                        <p className="lc-num lc-easy text-3xl sm:text-4xl mt-1"><CountUp value={solved?.easySolved} /></p>
                                        <p className="lc-sub text-sm mt-1 font-semibold">{pct(solved?.easySolved)}</p>
                                    </div>

                                    <div className="border-l lc-divider pl-3 sm:pl-6">
                                        <p className="flex items-center gap-1.5 sm:gap-2 lc-sub text-xs sm:text-sm font-bold">
                                            <FaCircle className="lc-medium text-[10px]" />
                                            Medium
                                        </p>
                                        <p className="lc-num lc-medium text-3xl sm:text-4xl mt-1"><CountUp value={solved?.mediumSolved} /></p>
                                        <p className="lc-sub text-sm mt-1 font-semibold">{pct(solved?.mediumSolved)}</p>
                                    </div>

                                    <div className="border-l lc-divider pl-3 sm:pl-6">
                                        <p className="flex items-center gap-1.5 sm:gap-2 lc-sub text-xs sm:text-sm font-bold">
                                            <FaCircle className="lc-hard text-[10px]" />
                                            Hard
                                        </p>
                                        <p className="lc-num lc-hard text-3xl sm:text-4xl mt-1"><CountUp value={solved?.hardSolved} /></p>
                                        <p className="lc-sub text-sm mt-1 font-semibold">{pct(solved?.hardSolved)}</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Rating & Rank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                        <Reveal delay={120} className="h-full">
                            <div className="lc-card lc-rivets p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                                <div className="lc-icon-box w-16 h-16 sm:w-20 sm:h-20 rounded-2xl">
                                    <FaTrophy className="text-4xl" />
                                </div>
                                <div>
                                    <p className="lc-sub text-sm font-bold">Contest Rating</p>
                                    <p className="lc-num lc-gold text-4xl sm:text-5xl leading-tight">
                                        {attended ? <CountUp value={Math.round(contest.contestRating)} /> : "—"}
                                    </p>
                                    <p className="lc-sub text-sm mt-1 font-semibold">
                                        {attended
                                            ? `Top ${contest.contestTopPercentage}%`
                                            : contest
                                                ? "No contests yet"
                                                : "Loading…"}
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={200} className="h-full">
                            <div className="lc-card lc-rivets p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
                                <Hex size={80} from="#ffe48f" to="#a8741c">
                                    {contestBadge?.icon ? (
                                        <img
                                            src={abs(contestBadge.icon)}
                                            alt={contestBadge.displayName}
                                            className="w-12 h-12 object-contain"
                                        />
                                    ) : (
                                        <FaChessKnight className="text-4xl lc-gold" />
                                    )}
                                </Hex>
                                <div>
                                    <p className="lc-sub text-sm font-bold">Current Rank</p>
                                    <p className="lc-num lc-gold text-3xl leading-tight">
                                        {contestBadge
                                            ? contestBadge.displayName
                                            : attended
                                                ? `#${fmt(contest.contestGlobalRanking)}`
                                                : "Unranked"}
                                    </p>
                                    <p className="lc-sub text-sm mt-1 font-semibold">
                                        {attended
                                            ? `Global rank of ${fmt(contest.totalParticipants)}`
                                            : "Keep improving!"}
                                    </p>
                                </div>
                            </div>
                        </Reveal>

                    </div>

                    {/* Languages & Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 mt-5">

                        {/* Top Languages */}
                        <Reveal delay={80} className="h-full min-w-0">
                            <div className="lc-card lc-rivets p-4 sm:p-5 min-w-0">
                                <div className="flex items-center gap-3">
                                    <div className="lc-icon-box w-9 h-9">
                                        <FaCode />
                                    </div>
                                    <h3 className="lc-display text-xl">Top Languages</h3>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {languages.length === 0 && (
                                        <p className="lc-muted text-sm font-semibold">Loading…</p>
                                    )}
                                    {languages.map((l) => {
                                        const Icon = l.style.icon;
                                        return (
                                            <div
                                                key={l.name}
                                                className="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_6rem_1fr_3.5rem] items-center gap-x-3 gap-y-2"
                                            >
                                                <span className="flex justify-center">
                                                    <Icon className={`text-2xl ${l.style.color}`} style={{ filter: "drop-shadow(0 2px 1px rgba(0,0,0,.45))" }} />
                                                </span>
                                                <span className="text-sm truncate font-bold">{l.name}</span>
                                                {/* bar drops under the name on phones */}
                                                <div className="lc-track col-span-3 order-last sm:order-none sm:col-span-1">
                                                    <div
                                                        className={`lc-fill ${l.style.bar}`}
                                                        style={{ width: `${l.width}%` }}
                                                    />
                                                </div>
                                                <span className="text-right text-sm lc-sub font-bold">
                                                    {l.value.toFixed(1)}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Reveal>

                        {/* Badges */}
                        <Reveal delay={160} className="h-full min-w-0">
                            <div className="lc-card lc-rivets p-4 sm:p-5 min-w-0">
                                <div className="flex items-center gap-3">
                                    <div className="lc-icon-box w-9 h-9">
                                        <FaMedal />
                                    </div>
                                    <h3 className="lc-display text-xl">
                                        Badges{badges.length ? ` (${badges.length})` : ""}
                                    </h3>
                                </div>

                                {badges.length === 0 ? (
                                    <p className="lc-muted text-sm mt-5 font-semibold">
                                        No badges earned yet.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 mt-5">
                                        {badges.slice(0, 4).map((b, i) => {
                                            const [from, to] = BADGE_COLORS[i % BADGE_COLORS.length];
                                            const date = b.creationDate
                                                ? new Date(b.creationDate).toLocaleDateString("en", {
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "";
                                            return (
                                                <div key={b.id} className="flex flex-col items-center text-center">
                                                    <Hex size={60} from={from} to={to}>
                                                        <img
                                                            src={abs(b.icon)}
                                                            alt={b.displayName}
                                                            className="w-9 h-9 object-contain"
                                                        />
                                                    </Hex>
                                                    <p className="text-xs mt-2 leading-tight font-bold">{b.displayName}</p>
                                                    <p className="text-[11px] lc-muted font-semibold">{date}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="border-t lc-divider mt-5 pt-4 text-center">
                                    <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="lc-link text-sm">
                                        View All Badges
                                        <FaArrowRight className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        </Reveal>

                    </div>

                    {/* Submission Activity */}
                    <Reveal delay={80} className="mt-5">
                        <div className="lc-card lc-rivets p-5">

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="lc-icon-box w-9 h-9">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <h3 className="lc-display text-xl">Submission Activity</h3>
                                        <p className="lc-sub text-sm mt-1 font-semibold">
                                            Your coding activity over the past year
                                        </p>
                                    </div>
                                </div>

                                <p className="lc-num lc-gold text-lg sm:text-right">
                                    {calendar ? `${fmt(totalSubs)} submissions` : "365 Days"}
                                </p>
                            </div>

                            {/* Phones: compact summary instead of the heatmap */}
                            <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
                                <div className="lc-stat">
                                    <p className="lc-sub text-xs font-bold">Submissions</p>
                                    <p className="lc-num lc-gold text-2xl mt-1">
                                        {calendar ? <CountUp value={totalSubs} /> : "—"}
                                    </p>
                                </div>
                                <div className="lc-stat">
                                    <p className="lc-sub text-xs font-bold">Active days</p>
                                    <p className="lc-num lc-gold text-2xl mt-1">
                                        {calendar ? <CountUp value={activeDays} /> : "—"}
                                    </p>
                                </div>
                            </div>

                            <div ref={heatRef} className="hidden md:block mt-5 overflow-x-auto pb-1">
                                {weeks.length === 0 ? (
                                    <p className="lc-muted text-sm py-10 text-center font-semibold">
                                        Loading activity…
                                    </p>
                                ) : (
                                    <div className="min-w-[680px]">

                                        <div
                                            className="grid pl-10 text-xs lc-sub font-bold"
                                            style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
                                        >
                                            {monthLabels.map((m) => (
                                                <span
                                                    key={m.col}
                                                    className="whitespace-nowrap"
                                                    style={{ gridColumnStart: m.col, gridRowStart: 1 }}
                                                >
                                                    {m.name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <div
                                                className="grid text-xs lc-sub font-bold w-8 shrink-0"
                                                style={{ gridTemplateRows: "repeat(7, 1fr)" }}
                                            >
                                                <span></span>
                                                <span className="leading-none self-center">Mon</span>
                                                <span></span>
                                                <span className="leading-none self-center">Wed</span>
                                                <span></span>
                                                <span className="leading-none self-center">Fri</span>
                                                <span></span>
                                            </div>

                                            <div
                                                className="grid flex-1 gap-[3px] grid-flow-col"
                                                style={{
                                                    gridTemplateRows: "repeat(7, 1fr)",
                                                    gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
                                                }}
                                            >
                                                {weeks.flat().map((d, i) =>
                                                    d ? (
                                                        <div
                                                            key={d.date}
                                                            title={`${d.count} submissions on ${d.date}`}
                                                            className={`lc-cell lc-l${toLevel(d.count)}`}
                                                        />
                                                    ) : (
                                                        <div key={`pad-${i}`} className="aspect-square" />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-1.5 mt-3 text-xs lc-sub font-bold">
                                            <span className="mr-1">Less</span>
                                            {[0, 1, 2, 3, 4].map((l) => (
                                                <span key={l} className={`w-3 h-3 rounded-[3px] lc-l${l}`} />
                                            ))}
                                            <span className="ml-1">More</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}

export default LeetCodeDashboard;