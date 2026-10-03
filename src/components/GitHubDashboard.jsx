import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaGithub,
    FaBook,
    FaRegStar,
    FaStar,
    FaCodeBranch,
    FaUsers,
    FaCalendarAlt,
    FaThumbtack,
    FaFire,
    FaRegCheckCircle,
    FaChartBar,
    FaExternalLinkAlt,
    FaDesktop,
    FaTerminal,
    FaCloud,
    FaChevronDown,
} from "react-icons/fa";

/*
  ============================================================================
  GITHUB DASHBOARD — fantasy game-UI theme (matches Hero / Skills / Projects /
  LeetCode dashboard)

  THEME: follows the same day/night switch as the Hero navbar. Hero sets
  document.documentElement.dataset.theme = "light" | "dark" and every colour
  here (sky, sun/moon, panel, text, stats, heatmap, donut) reacts to it.

  All GitHub API calls and data logic are unchanged — only the look and
  effects are new.
  ============================================================================
*/

const USERNAME = "MohammadAbdullahAnsari";
const PROFILE_URL = `https://github.com/${USERNAME}`;

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
    [4, 4, 14, 0, 30], [9, 3, 17, 3, -20], [15, 5, 12, 6, 24], [22, 3, 19, 1, -30],
    [29, 4, 15, 8, 18], [36, 3, 18, 4, -16], [43, 5, 13, 9, 26], [50, 3, 20, 2, -24],
    [57, 4, 16, 7, 20], [64, 3, 14, 5, -28], [71, 5, 18, 0, 22], [78, 3, 15, 10, -18],
    [85, 4, 17, 3, 28], [91, 3, 13, 6, -22], [96, 5, 19, 8, 16],
];

/* ---------- helpers ---------- */

const LANG_COLORS = {
    JavaScript: "#facc15",
    TypeScript: "#3b82f6",
    Python: "#22c55e",
    "C++": "#ef4444",
    Java: "#f97316",
    HTML: "#ec4899",
    CSS: "#a855f7",
    C: "#94a3b8",
    Shell: "#14b8a6",
};
const FALLBACK_COLORS = ["#06b6d4", "#f472b6", "#a3e635", "#fb923c"];
const OTHER_COLOR = "#7a6a52";

const repoIcons = [FaDesktop, FaTerminal, FaCloud];

const fmt = (n) => (n === null || n === undefined ? "—" : n.toLocaleString());

async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
}

// Turn a flat list of days into week columns (Sunday-first), padded like GitHub
function buildWeeks(days) {
    if (!days.length) return [];
    const weeks = [];
    let week = new Array(new Date(days[0].date).getUTCDay()).fill(null);
    days.forEach((d) => {
        week.push(d);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });
    if (week.length) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }
    return weeks;
}

function longestStreak(days) {
    let best = 0;
    let run = 0;
    days.forEach((d) => {
        run = d.count > 0 ? run + 1 : 0;
        if (run > best) best = run;
    });
    return best;
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
            className={`gh-reveal ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

/* ---------- small pieces ---------- */

function StatCard({ icon, colorClass, label, value, sub }) {
    return (
        <div className="gh-card gh-rivets p-4 text-center">
            <div className="flex flex-col items-center gap-2">
                <span className={`gh-icon-box w-10 h-10 text-lg ${colorClass}`}>{icon}</span>
                <span className="gh-sub text-sm font-bold whitespace-nowrap">{label}</span>
            </div>
            <p className={`gh-num text-3xl sm:text-4xl mt-2 ${colorClass}`}>{value}</p>
            <p className="gh-muted text-sm mt-2 font-semibold">{sub}</p>
        </div>
    );
}

function SectionTitle({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3">
            <div className="gh-icon-box w-9 h-9 shrink-0">{icon}</div>
            <div>
                <h3 className="gh-display text-xl">{title}</h3>
                {subtitle && <p className="gh-sub text-sm mt-1 font-semibold">{subtitle}</p>}
            </div>
        </div>
    );
}

function Donut({ segments }) {
    const r = 62;
    const c = 2 * Math.PI * r;
    let offset = 0;
    return (
        <div className="relative w-40 h-40 shrink-0 gh-donut">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r={r} fill="none" stroke="var(--track)" strokeWidth="26" />
                {segments.map((s) => {
                    const len = (s.value / 100) * c;
                    const el = (
                        <circle
                            key={s.name}
                            cx="80"
                            cy="80"
                            r={r}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="26"
                            strokeDasharray={`${Math.max(len - 2, 0)} ${c - Math.max(len - 2, 0)}`}
                            strokeDashoffset={-offset}
                        />
                    );
                    offset += len;
                    return el;
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "var(--hex-in)", boxShadow: "inset 0 0 0 2px #d4ab45" }}
                >
                    <FaGithub className="text-4xl" style={{ color: "var(--text)" }} />
                </div>
            </div>
        </div>
    );
}

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

function Hex({ size = 64, children }) {
    return (
        <div
            className="flex items-center justify-center shrink-0"
            style={{ width: size, height: size, clipPath: HEX, background: "linear-gradient(160deg, #ffe48f, #a8741c)" }}
        >
            <div
                className="flex items-center justify-center overflow-hidden"
                style={{ width: size - 5, height: size - 5, clipPath: HEX, background: "var(--hex-in)" }}
            >
                {children}
            </div>
        </div>
    );
}

/* ---------- component ---------- */

function GitHubDashboard({ embedded = true }) {
    const [repos, setRepos] = useState([]);
    const [profile, setProfile] = useState(null);
    const [days, setDays] = useState([]);
    const [totalContribs, setTotalContribs] = useState(null);
    const [commits, setCommits] = useState(null);
    const [prsMerged, setPrsMerged] = useState(null);
    const [issuesClosed, setIssuesClosed] = useState(null);
    const [error, setError] = useState(false);
    // Which panel is open: null | "languages" | "repos"
    const [openPanel, setOpenPanel] = useState(null);
    const toggle = (name) => setOpenPanel((cur) => (cur === name ? null : name));

    useGoogleFonts();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const results = await Promise.allSettled([
                getJson(`https://api.github.com/users/${USERNAME}`),
                getJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100`),
                // GitHub's REST API has no contribution calendar, so this
                // community endpoint (reads the public profile) is used.
                getJson(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`),
                getJson(`https://api.github.com/search/commits?q=author:${USERNAME}&per_page=1`),
                getJson(`https://api.github.com/search/issues?q=author:${USERNAME}+type:pr+is:merged&per_page=1`),
                getJson(`https://api.github.com/search/issues?q=author:${USERNAME}+type:issue+is:closed&per_page=1`),
            ]);
            if (cancelled) return;

            const [prof, rp, cal, cm, pr, is] = results;
            if (prof.status === "fulfilled") setProfile(prof.value);
            if (rp.status === "fulfilled" && Array.isArray(rp.value)) setRepos(rp.value);
            if (cal.status === "fulfilled") {
                const list = cal.value.contributions || [];
                setDays(list);
                const total =
                    cal.value.total?.lastYear ??
                    list.reduce((sum, d) => sum + d.count, 0);
                setTotalContribs(total);
            }
            if (cm.status === "fulfilled") setCommits(cm.value.total_count);
            if (pr.status === "fulfilled") setPrsMerged(pr.value.total_count);
            if (is.status === "fulfilled") setIssuesClosed(is.value.total_count);

            if (results.every((r) => r.status === "rejected")) setError(true);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const ownRepos = useMemo(() => repos.filter((r) => !r.fork), [repos]);

    const totalStars = repos.reduce((t, r) => t + r.stargazers_count, 0);

    const languages = useMemo(() => {
        const count = {};
        ownRepos.forEach((r) => {
            if (r.language) count[r.language] = (count[r.language] || 0) + 1;
        });
        const total = Object.values(count).reduce((a, b) => a + b, 0);
        if (!total) return { list: [], segments: [] };

        const sorted = Object.entries(count)
            .sort((a, b) => b[1] - a[1])
            .map(([name, n], i) => ({
                name,
                value: (n / total) * 100,
                color: LANG_COLORS[name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
            }));

        const top = sorted.slice(0, 4);
        const rest = 100 - top.reduce((s, l) => s + l.value, 0);
        const segments = rest > 0.5
            ? [...top, { name: "Other", value: rest, color: OTHER_COLOR }]
            : top;
        return { list: top, segments };
    }, [ownRepos]);

    const featured = useMemo(
        () =>
            [...ownRepos]
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 3),
        [ownRepos]
    );

    const weeks = useMemo(() => buildWeeks(days), [days]);

    const monthLabels = useMemo(() => {
        const labels = [];
        let last = -1;
        weeks.forEach((w, i) => {
            const first = w.find(Boolean);
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
        return labels;
    }, [weeks]);

    const streak = days.length ? longestStreak(days) : null;

    return (
        <section
            id="github"
            className={
                embedded
                    ? "fh-gh fh-embedded relative w-full min-w-0 p-3"
                    : "fh-gh relative overflow-hidden w-full px-3 sm:px-6 pt-28 pb-28"
            }
        >
            <style>{`
                .fh-gh {
                    --text: #f6ecd2; --sub: #d9cba8; --muted: #b9a982;
                    --tile-a: #403930; --tile-b: #1b1612; --tile-ring: rgba(130,118,100,.85); --tile-hi: rgba(255,255,255,.13);
                    --panel-a: rgba(36,30,26,.92); --panel-b: rgba(18,14,11,.94);
                    --hex-in: #17120e; --track: #120e0b; --line: rgba(246,220,138,.18);
                    --blue: #7cc4ff; --violet: #cdb0ff; --teal: #7fe3c8; --orange: #ff9a3c; --good: #5be07a; --gold: #ffd35e;
                    --c0: #2a241e; --c1: #1f5a33; --c2: #2a8a45; --c3: #43c463; --c4: #8cf59a;
                    --ridge1: #2b2540; --ridge2: #1a1626; --stars: 1; --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
                    color: var(--text); background: #0e1230;
                }
                :root[data-theme="light"] .fh-gh {
                    --text: #3a210e; --sub: #5a3d25; --muted: #7a5a38;
                    --tile-a: #f8e9c8; --tile-b: #dcc08a; --tile-ring: #b78a36; --tile-hi: rgba(255,255,255,.75);
                    --panel-a: rgba(252,240,214,.94); --panel-b: rgba(236,214,166,.95);
                    --hex-in: #f6e6c4; --track: #cdb27c; --line: rgba(90,58,20,.25);
                    --blue: #1b6fb8; --violet: #6b3fb5; --teal: #0f8f7a; --orange: #c2570a; --good: #1f8f3d; --gold: #a86a0a;
                    --c0: #e4cf9f; --c1: #b9dc9a; --c2: #6cb855; --c3: #2f8a2f; --c4: #14602a;
                    --ridge1: #8a86a8; --ridge2: #5e5c7c; --stars: 0; --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .gh-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* embedded inside the shared Dashboard section: it supplies the sky and the sign */
                .fh-gh.fh-embedded, :root[data-theme="light"] .fh-gh.fh-embedded { background: transparent; }
                .fh-embedded .gh-sky, .fh-embedded .gh-stars, .fh-embedded .gh-orb, .fh-embedded .gh-ridges,
                .fh-embedded .gh-vignette, .fh-embedded .gh-ember, .fh-embedded .gh-signwrap { display: none; }
                .fh-embedded { display: flex; flex-direction: column; }
                .fh-embedded > div.relative.z-10 { flex: 1; display: flex; flex-direction: column; }
                .fh-embedded .gh-panel { flex: 1; }

                /* ----- sky ----- */
                .gh-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .gh-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .gh-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-gh .gh-night { opacity: 0; }
                :root[data-theme="light"] .fh-gh .gh-day { opacity: 1; }
                .gh-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 7% 18%, #fff, transparent), radial-gradient(1px 1px at 15% 52%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 24% 10%, #fff, transparent), radial-gradient(1px 1px at 33% 42%, #fff, transparent),
                        radial-gradient(2px 2px at 42% 22%, #ffe9b8, transparent), radial-gradient(1px 1px at 51% 62%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 60% 14%, #fff, transparent), radial-gradient(1px 1px at 68% 46%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 77% 28%, #fff, transparent), radial-gradient(1px 1px at 85% 9%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 94% 50%, #ffe9b8, transparent), radial-gradient(1px 1px at 3% 70%, #fff, transparent);
                    animation: gh-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes gh-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }
                .gh-orb {
                    position: absolute; z-index: 0; top: 6%; left: 7%; width: 76px; height: 76px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s; animation: gh-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-gh .gh-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes gh-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
                .gh-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 34%; z-index: 0; pointer-events: none; }
                .gh-ridges path { transition: fill .7s; }
                .gh-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }
                .gh-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none; opacity: 0;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: gh-rise var(--dur) linear var(--del) infinite;
                }
                :root[data-theme="light"] .fh-gh .gh-ember { animation: none; opacity: 0 !important; }
                @keyframes gh-rise {
                    0% { opacity: 0; transform: translate(0,0); } 10% { opacity: .9; } 85% { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                /* ----- sign ----- */
                .gh-sign {
                    position: relative; display: inline-block; padding: 1rem 2.4rem 1.1rem; border-radius: 12px; transform-origin: 50% -2.2rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: gh-swing 6s ease-in-out infinite;
                }
                @keyframes gh-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .gh-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .gh-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .gh-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .gh-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: gh-shine 5s ease-in-out 1s infinite;
                }
                @keyframes gh-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .gh-rivets { position: relative; }
                .gh-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }

                /* ----- panel + cards ----- */
                .gh-reveal { opacity: 0; transform: translateY(26px) scale(.97); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.56,.64,1); }
                .gh-reveal.is-in { opacity: 1; transform: none; }
                .gh-panel {
                    position: relative; border-radius: 22px; color: var(--text);
                    background: radial-gradient(circle at 20% 0%, var(--tile-hi), transparent 45%), linear-gradient(180deg, var(--panel-a), var(--panel-b));
                    box-shadow: 0 0 0 4px #4d3019, 0 0 0 7px #d4ab45, 0 0 0 9px #4d3019, 0 24px 40px rgba(0,0,0,.5), inset 0 3px 0 var(--tile-hi);
                    transition: background .5s;
                }
                .gh-card {
                    position: relative; border-radius: 16px; color: var(--text);
                    background: radial-gradient(circle at 25% 0%, var(--tile-hi), transparent 55%), linear-gradient(160deg, var(--tile-a), var(--tile-b));
                    box-shadow: inset 0 0 0 2px var(--tile-ring), inset 0 3px 0 var(--tile-hi), inset 0 -5px 8px rgba(0,0,0,.28), 0 8px 14px rgba(0,0,0,.35);
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, background .5s;
                }
                @media (hover: hover) {
                    .gh-card:hover { transform: translateY(-4px); box-shadow: inset 0 0 0 2px #f0c24f, inset 0 3px 0 var(--tile-hi), 0 0 22px rgba(255,170,50,.4), 0 12px 18px rgba(0,0,0,.4); }
                }
                .gh-icon-box {
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 12px; color: #ffe08a;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 22px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 2px #caa43d, inset 0 2px 0 rgba(255,255,255,.14), 0 4px 6px rgba(0,0,0,.4);
                }
                /* stat icons keep the wood box but take a bright icon colour */
                .gh-icon-box.gh-c-blue { color: #8fd0ff; } .gh-icon-box.gh-c-gold { color: #ffd35e; }
                .gh-icon-box.gh-c-teal { color: #8febd3; } .gh-icon-box.gh-c-violet { color: #d6bcff; }
                .gh-sub { color: var(--sub); } .gh-muted { color: var(--muted); }
                .gh-divider { border-color: var(--line); }
                .gh-num { font-family: 'Lilita One', sans-serif; letter-spacing: .01em; text-shadow: 0 2px 0 rgba(0,0,0,.28); }
                .gh-c-blue { color: var(--blue); } .gh-c-violet { color: var(--violet); } .gh-c-teal { color: var(--teal); }
                .gh-c-orange { color: var(--orange); } .gh-c-good { color: var(--good); } .gh-c-gold { color: var(--gold); }

                .gh-btn {
                    display: inline-flex; align-items: center; gap: .6rem; padding: .75rem 1.5rem; border-radius: 10px; color: #fff;
                    font-family: 'Lilita One', sans-serif; font-size: 1.05rem; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    position: relative; overflow: hidden;
                    background: linear-gradient(180deg, #d9433c, #a02220 55%, #7d1614);
                    box-shadow: inset 0 0 0 2px #d9ae45, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 8px 12px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s;
                }
                .gh-btn:hover { filter: brightness(1.14); transform: translateY(-2px); }
                .gh-btn:active { transform: translateY(4px); }
                .gh-btn:focus-visible, .gh-tab:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .gh-btn::after { content: ""; position: absolute; top: 0; left: -80%; width: 40%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,235,170,.55), transparent); transform: skewX(-20deg); animation: gh-sheen 4.2s ease-in-out 1.5s infinite; pointer-events: none; }
                @keyframes gh-sheen { 0% { left: -80%; } 35%, 100% { left: 140%; } }

                .gh-scroll {
                    position: relative; display: inline-block; padding: .7rem 1.1rem; border-radius: 8px; color: #4a2e12; font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.2rem; line-height: 1.2;
                    background: linear-gradient(180deg, #f8e7bd, #e3c98f); box-shadow: inset 0 0 0 2px #b78a36, 0 5px 8px rgba(0,0,0,.35); rotate: 1.2deg;
                }
                .gh-note { display: inline-block; padding: .7rem 1.3rem; border-radius: 10px; color: #f8e9c2; font-weight: 700; background: linear-gradient(180deg, #6b4428, #3b2310); box-shadow: inset 0 0 0 2px #caa43d, 0 6px 10px rgba(0,0,0,.4); }

                /* ----- accordion tabs ----- */
                .gh-tab {
                    width: 100%; display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; border-radius: 12px; color: #f7e9c4;
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 1px rgba(241,196,82,.35), inset 0 2px 0 rgba(255,255,255,.08), 0 4px 0 #070504, 0 6px 8px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s;
                }
                .gh-tab:hover { transform: translateY(-2px); filter: brightness(1.18); }
                .gh-tab:active { transform: translateY(3px); }
                .gh-tab.on { background: linear-gradient(180deg, #d9433c, #a02220 60%, #7d1614); box-shadow: inset 0 0 0 2px #e4bb55, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 6px 10px rgba(0,0,0,.45); }
                .gh-tab-title { font-family: 'Lilita One', sans-serif; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.65); }
                .gh-open { animation: gh-open .45s cubic-bezier(.34,1.56,.64,1) both; transform-origin: top; }
                @keyframes gh-open { from { opacity: 0; transform: translateY(-10px) scaleY(.9); } to { opacity: 1; transform: none; } }

                .gh-donut { animation: gh-donut 1s cubic-bezier(.22,1,.36,1) both; }
                @keyframes gh-donut { from { opacity: 0; transform: rotate(-120deg) scale(.7); } to { opacity: 1; transform: none; } }

                .gh-row { display: flex; align-items: center; gap: .85rem; padding: .75rem .5rem; border-radius: 10px; transition: background .2s, transform .2s; }
                .gh-row:hover { background: rgba(255,200,80,.12); transform: translateX(3px); }
                .gh-star { display: inline-flex; align-items: center; gap: .4rem; padding: .15rem .6rem; border-radius: 9999px; font-family: 'Lilita One', sans-serif; font-size: .9rem; color: #ffe9a6; background: linear-gradient(180deg, #6b4428, #3b2310); box-shadow: inset 0 0 0 1.5px #caa43d; }

                /* ----- heatmap ----- */
                .gh-cell { aspect-ratio: 1; border-radius: 3px; transition: transform .12s; }
                .gh-cell:hover { transform: scale(1.5); position: relative; z-index: 2; box-shadow: 0 0 0 1px #ffe08a; }
                .gh-l0 { background: var(--c0); } .gh-l1 { background: var(--c1); } .gh-l2 { background: var(--c2); }
                .gh-l3 { background: var(--c3); } .gh-l4 { background: var(--c4); box-shadow: 0 0 6px rgba(120,255,150,.55); }
                .gh-stat { border-radius: 12px; padding: .75rem; background: var(--track); box-shadow: inset 0 0 0 1.5px rgba(212,171,69,.5); }

                @media (prefers-reduced-motion: reduce) {
                    .fh-gh *, .fh-gh *::before, .fh-gh *::after { animation: none !important; transition: none !important; }
                    .gh-reveal { opacity: 1; transform: none; }
                    .gh-ember { display: none; }
                }
            `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="gh-sky gh-night" />
            <div className="gh-sky gh-day" />
            <div className="gh-stars" aria-hidden="true" />
            <div className="gh-orb" aria-hidden="true" />
            <svg className="gh-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path style={{ fill: "var(--ridge1)" }} opacity=".85" d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z" />
                <path style={{ fill: "var(--ridge2)" }} d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z" />
            </svg>
            <div className="gh-vignette" />
            {EMBERS.map(([l, s, d, dl, dx], i) => (
                <span
                    key={i}
                    className="gh-ember"
                    aria-hidden="true"
                    style={{ left: `${l}%`, width: s, height: s, "--dur": `${d}s`, "--del": `${dl}s`, "--dx": `${dx}px` }}
                />
            ))}

            <div className={`relative z-10 w-full min-w-0 ${embedded ? "" : "max-w-5xl mx-auto"}`}>

                {/* hanging sign */}
                <div className="gh-signwrap text-center pt-10 mb-12">
                    <div className="gh-sign gh-rivets">
                        <span className="gh-chain" style={{ left: "16%" }} />
                        <span className="gh-chain" style={{ right: "16%" }} />
                        <h2 className="gh-display text-3xl sm:text-5xl lg:text-6xl">
                            <span className="gh-name" data-text="GitHub Dashboard"><span>GitHub Dashboard</span></span>
                        </h2>
                    </div>
                </div>

                <div className="gh-panel p-4 sm:p-6 md:p-8">

                    {/* Header */}
                    <Reveal>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                            <div className="flex items-center gap-4">
                                <Hex size={72}>
                                    <FaGithub className="text-4xl" style={{ color: "var(--text)" }} />
                                </Hex>
                                <div>
                                    <p className="gh-display text-2xl sm:text-3xl leading-tight">Code. Build.</p>
                                    <p className="gh-display text-2xl sm:text-3xl leading-tight gh-c-gold">Share. Repeat.</p>
                                    <p className="gh-sub text-sm mt-1 font-semibold">@{USERNAME}</p>
                                </div>
                            </div>

                            <div className="sm:text-right">
                                <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" className="gh-btn">
                                    View Profile
                                    <FaExternalLinkAlt className="text-sm" />
                                </a>
                                <div className="mt-4">
                                    <p className="gh-scroll">“Good code tells a story.”</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {error && (
                        <p className="mt-6 text-center">
                            <span className="gh-note">
                                Couldn't reach the GitHub API (you may have hit the hourly rate limit). Try again later.
                            </span>
                        </p>
                    )}

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <Reveal delay={0}>
                            <StatCard
                                icon={<FaBook />}
                                colorClass="gh-c-blue"
                                label="Repositories"
                                value={<CountUp value={profile?.public_repos ?? (repos.length || null)} />}
                                sub="Public Repos"
                            />
                        </Reveal>
                        <Reveal delay={80}>
                            <StatCard
                                icon={<FaRegStar />}
                                colorClass="gh-c-gold"
                                label="Total Stars"
                                value={<CountUp value={repos.length ? totalStars : null} />}
                                sub="Across all repos"
                            />
                        </Reveal>
                        <Reveal delay={160}>
                            <StatCard
                                icon={<FaCodeBranch />}
                                colorClass="gh-c-teal"
                                label="Total Commits"
                                value={<CountUp value={commits} />}
                                sub="Public commits"
                            />
                        </Reveal>
                        <Reveal delay={240}>
                            <StatCard
                                icon={<FaUsers />}
                                colorClass="gh-c-violet"
                                label="Followers"
                                value={<CountUp value={profile?.followers ?? null} />}
                                sub="Amazing people"
                            />
                        </Reveal>
                    </div>

                    {/* Contribution Activity */}
                    <Reveal delay={80} className="mt-5">
                        <div className="gh-card gh-rivets p-5">
                            <div className="flex items-start justify-between gap-3">
                                <SectionTitle
                                    icon={<FaCalendarAlt />}
                                    title="Contribution Activity"
                                    subtitle="Your GitHub activity over the past year"
                                />
                                <p className="gh-num gh-c-gold text-lg whitespace-nowrap">365 Days</p>
                            </div>

                            {/* Phones: compact summary instead of the 680px-wide heatmap */}
                            <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
                                <div className="gh-stat">
                                    <p className="gh-sub text-xs font-bold">Contributions</p>
                                    <p className="gh-num gh-c-good text-2xl mt-1"><CountUp value={totalContribs} /></p>
                                </div>
                                <div className="gh-stat">
                                    <p className="gh-sub text-xs font-bold">Longest streak</p>
                                    <p className="gh-num gh-c-orange text-2xl mt-1">
                                        {streak === null ? "—" : `${streak} days`}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:block mt-5 overflow-x-auto">
                                {weeks.length === 0 ? (
                                    <p className="gh-muted text-sm py-10 text-center font-semibold">
                                        Loading activity…
                                    </p>
                                ) : (
                                    <div className="min-w-[680px]">

                                        {/* month labels */}
                                        <div
                                            className="grid pl-10 text-xs gh-sub font-bold"
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
                                            {/* day labels */}
                                            <div
                                                className="grid text-xs gh-sub font-bold w-8 shrink-0"
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

                                            {/* cells */}
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
                                                            title={`${d.count} contributions on ${d.date}`}
                                                            className={`gh-cell gh-l${d.level ?? 0}`}
                                                        />
                                                    ) : (
                                                        <div key={`pad-${i}`} className="aspect-square" />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* legend */}
                                        <div className="flex items-center justify-end gap-1.5 mt-3 text-xs gh-sub font-bold">
                                            <span className="mr-1">Less</span>
                                            {[0, 1, 2, 3, 4].map((l) => (
                                                <span key={l} className={`w-3 h-3 rounded-[3px] gh-l${l}`} />
                                            ))}
                                            <span className="ml-1">More</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>

                    {/* Languages / Featured repos: click a button to show one panel at a time */}
                    <div className="mt-6">

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: "languages", title: "Top Languages" },
                                { id: "repos", title: "Featured Repositories" },
                            ].map((tab) => {
                                const active = openPanel === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => toggle(tab.id)}
                                        aria-expanded={active}
                                        aria-controls={`panel-${tab.id}`}
                                        className={`gh-tab min-w-0 flex-col sm:flex-row text-center sm:text-left ${active ? "on" : ""}`}
                                    >
                                        <span className="gh-icon-box w-9 h-9 shrink-0">
                                            <FaThumbtack />
                                        </span>
                                        <span className="gh-tab-title flex-1 min-w-0 text-sm sm:text-lg leading-tight">
                                            {tab.title}
                                        </span>
                                        <FaChevronDown
                                            className={`text-sm transition-transform ${active ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Top Languages panel */}
                        {openPanel === "languages" && (
                            <div id="panel-languages" className="gh-card gh-rivets gh-open p-5 mt-4">
                                {languages.list.length === 0 ? (
                                    <p className="gh-muted text-sm font-semibold">Loading…</p>
                                ) : (
                                    <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-6 sm:gap-12">
                                        <ul className="space-y-4 w-full sm:w-auto sm:min-w-[220px]">
                                            {languages.list.map((l) => (
                                                <li key={l.name} className="flex items-center gap-3 text-sm font-bold">
                                                    <span
                                                        className="w-4 h-4 rounded-full shrink-0"
                                                        style={{ background: l.color, boxShadow: "0 0 0 2px #d4ab45" }}
                                                    />
                                                    <span>{l.name}</span>
                                                    <span className="gh-sub ml-auto pl-3">
                                                        {l.value.toFixed(1)}%
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Donut segments={languages.segments} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Featured Repositories panel */}
                        {openPanel === "repos" && (
                            <div id="panel-repos" className="gh-card gh-rivets gh-open p-4 sm:p-5 mt-4">
                                <div className="divide-y gh-divider">
                                    {featured.length === 0 && (
                                        <p className="gh-muted text-sm py-2 font-semibold">Loading…</p>
                                    )}
                                    {featured.map((repo, i) => {
                                        const Icon = repoIcons[i % repoIcons.length];
                                        return (
                                            <a
                                                key={repo.id}
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="gh-row"
                                            >
                                                <div className="gh-icon-box w-10 h-10 sm:w-11 sm:h-11 shrink-0">
                                                    <Icon />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-extrabold truncate">{repo.name}</p>
                                                    <p className="text-xs gh-sub font-semibold line-clamp-2 sm:line-clamp-1">
                                                        {repo.description || "No description available."}
                                                    </p>
                                                </div>
                                                <span className="gh-star shrink-0">
                                                    <FaStar className="text-yellow-400" />
                                                    {repo.stargazers_count}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom stats */}
                    <Reveal delay={80} className="mt-6">
                        <div className="gh-card gh-rivets p-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6">

                                <div className="lg:pr-4">
                                    <p className="gh-sub text-sm text-center font-bold">Longest Streak</p>
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <FaFire className="text-4xl gh-c-orange" />
                                        <p className="gh-num text-3xl gh-c-orange">
                                            <CountUp value={streak} />{" "}
                                            <span className="text-sm font-normal gh-c-good">days</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:border-l gh-divider lg:px-4">
                                    <p className="gh-sub text-sm text-center font-bold">PRs Merged</p>
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <FaCodeBranch className="text-3xl gh-c-violet" />
                                        <p className="gh-num text-3xl gh-c-violet"><CountUp value={prsMerged} /></p>
                                    </div>
                                </div>

                                <div className="lg:border-l gh-divider lg:px-4">
                                    <p className="gh-sub text-sm text-center font-bold">Issues Closed</p>
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <FaRegCheckCircle className="text-3xl gh-c-blue" />
                                        <p className="gh-num text-3xl gh-c-blue"><CountUp value={issuesClosed} /></p>
                                    </div>
                                </div>

                                <div className="lg:border-l gh-divider lg:pl-4">
                                    <p className="gh-sub text-sm text-center font-bold">Total Contributions</p>
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <FaChartBar className="text-3xl gh-c-good" />
                                        <p className="gh-num text-3xl gh-c-good"><CountUp value={totalContribs} /></p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}

export default GitHubDashboard;