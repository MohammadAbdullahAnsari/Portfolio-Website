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

/* ---------- config ---------- */

const USERNAME = "abdullah7398";
const PROFILE_URL = `https://leetcode.com/u/${USERNAME}/`;

// Public instance of alfa-leetcode-api. It runs on a free host, so the first
// request after a quiet period can take ~30-60s. For a faster/more reliable
// setup, deploy your own copy (Docker/Vercel) and change this URL.
const API_BASE = "https://alfa-leetcode-api.onrender.com";

/* ---------- helpers ---------- */

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

function Hex({ size = 64, from, to, children }) {
    return (
        <div
            className="flex items-center justify-center"
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
                    width: size - 4,
                    height: size - 4,
                    clipPath: HEX,
                    background: "#0d1224",
                }}
            >
                {children}
            </div>
        </div>
    );
}

const levelColors = [
    "bg-[#191533]",
    "bg-[#2c1f5c]",
    "bg-[#4c2f9e]",
    "bg-[#7c3aed]",
    "bg-[#a78bfa]",
];

const toLevel = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4);

const cardClass =
    "rounded-2xl border border-purple-500/20 bg-[#0d1224]/80 backdrop-blur";

const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());

const LANG_STYLE = {
    Java: { icon: FaJava, color: "text-orange-400", bar: "bg-orange-500" },
    JavaScript: { icon: SiJavascript, color: "text-yellow-400", bar: "bg-yellow-400" },
    TypeScript: { icon: SiTypescript, color: "text-blue-400", bar: "bg-blue-500" },
    Python: { icon: FaPython, color: "text-blue-400", bar: "bg-blue-500" },
    Python3: { icon: FaPython, color: "text-blue-400", bar: "bg-blue-500" },
    "C++": { icon: SiCplusplus, color: "text-sky-400", bar: "bg-purple-500" },
    C: { icon: SiC, color: "text-slate-300", bar: "bg-slate-400" },
};
const FALLBACK_STYLE = { icon: FaCode, color: "text-purple-300", bar: "bg-pink-500" };

const BADGE_COLORS = [
    ["#4ade80", "#15803d"],
    ["#fbbf24", "#b45309"],
    ["#c084fc", "#6d28d9"],
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

/* ---------- component ---------- */

function LeetCodeDashboard() {
    const [solved, setSolved] = useState(null);
    const [contest, setContest] = useState(null);
    const [badges, setBadges] = useState([]);
    const [langs, setLangs] = useState([]);
    const [calendar, setCalendar] = useState(null); // { "YYYY-MM-DD": count }
    const [error, setError] = useState(false);
    const heatRef = useRef(null);

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
        <div id="leetcode" className="w-full max-w-full min-w-0 px-3 sm:px-4 py-10 overflow-x-hidden">
            <div className="w-full min-w-0 max-w-4xl mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#12112b] to-[#0a0d1c] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(124,58,237,0.12)] text-white">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                    <div className="flex items-center gap-4">
                        <SiLeetcode className="text-5xl sm:text-6xl" style={{ color: "#f8fafc" }} />
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold leading-tight">LeetCode</p>
                            <p className="text-2xl sm:text-3xl font-bold leading-tight text-orange-400">
                                Dashboard
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Solve Today. Build Tomorrow.
                            </p>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <a
                            href={PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/40 bg-purple-500/5 text-purple-100 hover:bg-purple-500/15 transition"
                        >
                            View Profile
                            <FaExternalLinkAlt className="text-sm" />
                        </a>
                        <p className="text-gray-400 text-sm italic mt-4 max-w-[230px] sm:ml-auto">
                            “A problem a day keeps the imposter away.”
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="mt-6 text-sm text-amber-400">
                        Couldn't load LeetCode data. The API may be waking up or rate-limited — wait a minute and refresh.
                    </p>
                )}

                {/* Solved Statistics: Total on top for phones, then Easy/Medium/Hard in a row */}
                <div className={`${cardClass} mt-8 p-4 sm:p-5 md:p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-5 lg:gap-0">

                        <div className="flex items-center gap-4 lg:pr-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-green-500/10 border border-green-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                                <FaCode className="text-2xl sm:text-3xl text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm">Total Solved</p>
                                <p className="text-3xl sm:text-4xl font-bold text-green-400 leading-tight">
                                    {fmt(total)}
                                </p>
                                <p className="text-gray-400 text-sm">Problems</p>
                            </div>
                        </div>

                        {/* On lg these three become direct grid columns (lg:contents) */}
                        <div className="grid grid-cols-3 border-t border-white/10 pt-5 lg:pt-0 lg:border-t-0 lg:contents">

                            <div className="lg:border-l lg:border-white/10 lg:pl-6">
                                <p className="flex items-center gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                    <FaCircle className="text-green-400 text-[10px]" />
                                    Easy
                                </p>
                                <p className="text-2xl sm:text-4xl font-bold text-cyan-200 mt-1">
                                    {fmt(solved?.easySolved)}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">{pct(solved?.easySolved)}</p>
                            </div>

                            <div className="border-l border-white/10 pl-3 sm:pl-6">
                                <p className="flex items-center gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                    <FaCircle className="text-orange-400 text-[10px]" />
                                    Medium
                                </p>
                                <p className="text-2xl sm:text-4xl font-bold text-orange-400 mt-1">
                                    {fmt(solved?.mediumSolved)}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">{pct(solved?.mediumSolved)}</p>
                            </div>

                            <div className="border-l border-white/10 pl-3 sm:pl-6">
                                <p className="flex items-center gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                                    <FaCircle className="text-red-400 text-[10px]" />
                                    Hard
                                </p>
                                <p className="text-2xl sm:text-4xl font-bold text-red-400 mt-1">
                                    {fmt(solved?.hardSolved)}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">{pct(solved?.hardSolved)}</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Rating & Rank */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                    <div className={`${cardClass} p-4 sm:p-5 flex items-center gap-4 sm:gap-5`}>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                            <FaTrophy className="text-4xl text-purple-400" />
                        </div>
                        <div>
                            <p className="text-gray-300 text-sm">Contest Rating</p>
                            <p className="text-3xl sm:text-4xl font-bold text-purple-400 leading-tight">
                                {attended ? fmt(Math.round(contest.contestRating)) : "—"}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">
                                {attended
                                    ? `Top ${contest.contestTopPercentage}%`
                                    : contest
                                        ? "No contests yet"
                                        : "Loading…"}
                            </p>
                        </div>
                    </div>

                    <div className={`${cardClass} p-4 sm:p-5 flex items-center gap-4 sm:gap-5`}>
                        <Hex size={80} from="#c084fc" to="#6d28d9">
                            {contestBadge?.icon ? (
                                <img
                                    src={abs(contestBadge.icon)}
                                    alt={contestBadge.displayName}
                                    className="w-12 h-12 object-contain"
                                />
                            ) : (
                                <FaChessKnight className="text-4xl text-purple-400" />
                            )}
                        </Hex>
                        <div>
                            <p className="text-gray-300 text-sm">Current Rank</p>
                            <p className="text-3xl font-bold text-purple-400 leading-tight">
                                {contestBadge
                                    ? contestBadge.displayName
                                    : attended
                                        ? `#${fmt(contest.contestGlobalRanking)}`
                                        : "Unranked"}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">
                                {attended
                                    ? `Global rank of ${fmt(contest.totalParticipants)}`
                                    : "Keep improving!"}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Languages & Badges */}
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 mt-5">

                    {/* Top Languages */}
                    <div className={`${cardClass} p-4 sm:p-5 min-w-0`}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                <FaCode className="text-purple-300" />
                            </div>
                            <h3 className="text-lg font-semibold">Top Languages</h3>
                        </div>

                        <div className="mt-5 space-y-4">
                            {languages.length === 0 && (
                                <p className="text-gray-500 text-sm">Loading…</p>
                            )}
                            {languages.map((l) => {
                                const Icon = l.style.icon;
                                return (
                                    <div
                                        key={l.name}
                                        className="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2rem_6rem_1fr_3.5rem] items-center gap-x-3 gap-y-2"
                                    >
                                        <span className="flex justify-center">
                                            <Icon className={`text-2xl ${l.style.color}`} />
                                        </span>
                                        <span className="text-sm truncate">{l.name}</span>
                                        {/* bar drops under the name on phones */}
                                        <div className="col-span-3 order-last sm:order-none sm:col-span-1 h-2 rounded-full bg-[#171b30]">
                                            <div
                                                className={`h-2 rounded-full ${l.style.bar}`}
                                                style={{ width: `${l.width}%` }}
                                            />
                                        </div>
                                        <span className="text-right text-sm text-gray-300">
                                            {l.value.toFixed(1)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className={`${cardClass} p-4 sm:p-5 min-w-0`}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-300">
                                <FaMedal />
                            </div>
                            <h3 className="text-lg font-semibold">
                                Badges{badges.length ? ` (${badges.length})` : ""}
                            </h3>
                        </div>

                        {badges.length === 0 ? (
                            <p className="text-gray-500 text-sm mt-5">
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
                                            <p className="text-xs mt-2 leading-tight">{b.displayName}</p>
                                            <p className="text-[11px] text-gray-500">{date}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="border-t border-white/10 mt-5 pt-4 text-center">
                            <a
                                href={PROFILE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition"
                            >
                                View All Badges
                                <FaArrowRight className="text-xs" />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Submission Activity */}
                <div className={`${cardClass} p-5 mt-5`}>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                <FaCalendarAlt className="text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Submission Activity</h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    Your coding activity over the past year
                                </p>
                            </div>
                        </div>

                        <p className="text-purple-400 font-semibold sm:text-right">
                            {calendar ? `${fmt(totalSubs)} submissions` : "365 Days"}
                        </p>
                    </div>

                    {/* Phones: compact summary instead of the heatmap */}
                    <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#111827] border border-purple-500/15 p-3">
                            <p className="text-gray-400 text-xs">Submissions</p>
                            <p className="text-2xl font-bold text-purple-400 mt-1">
                                {calendar ? fmt(totalSubs) : "—"}
                            </p>
                        </div>
                        <div className="rounded-xl bg-[#111827] border border-purple-500/15 p-3">
                            <p className="text-gray-400 text-xs">Active days</p>
                            <p className="text-2xl font-bold text-purple-400 mt-1">
                                {calendar ? fmt(activeDays) : "—"}
                            </p>
                        </div>
                    </div>

                    <div ref={heatRef} className="hidden md:block mt-5 overflow-x-auto pb-1">
                        {weeks.length === 0 ? (
                            <p className="text-gray-500 text-sm py-10 text-center">
                                Loading activity…
                            </p>
                        ) : (
                            <div className="min-w-[680px]">

                                <div
                                    className="grid pl-10 text-xs text-gray-400"
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
                                        className="grid text-xs text-gray-400 w-8 shrink-0"
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
                                                    className={`aspect-square rounded-[3px] ${levelColors[toLevel(d.count)]} hover:ring-1 hover:ring-purple-300`}
                                                />
                                            ) : (
                                                <div key={`pad-${i}`} className="aspect-square" />
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-gray-400">
                                    <span className="mr-1">Less</span>
                                    {levelColors.map((c, i) => (
                                        <span key={i} className={`w-3 h-3 rounded-[3px] ${c}`} />
                                    ))}
                                    <span className="ml-1">More</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default LeetCodeDashboard;