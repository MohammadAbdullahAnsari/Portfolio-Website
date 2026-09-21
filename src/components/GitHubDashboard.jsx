import { useEffect, useMemo, useState } from "react";
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

const USERNAME = "MohammadAbdullahAnsari";
const PROFILE_URL = `https://github.com/${USERNAME}`;

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
const OTHER_COLOR = "#475569";

const levelColors = [
    "bg-[#0f2a1c]",
    "bg-[#0e4429]",
    "bg-[#006d32]",
    "bg-[#26a641]",
    "bg-[#39d353]",
];

const repoIcons = [FaDesktop, FaTerminal, FaCloud];

const fmt = (n) => (n === null || n === undefined ? "—" : n.toLocaleString());

const cardClass =
    "rounded-2xl border border-white/10 bg-[#0d1224]/80 backdrop-blur";

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

/* ---------- small pieces ---------- */

function StatCard({ icon, iconColor, label, value, valueColor, sub }) {
    return (
        <div className={`${cardClass} p-4 text-center`}>
            <div className="flex items-center gap-3 justify-center">
                <span className={`text-xl ${iconColor}`}>{icon}</span>
                <span className="text-gray-300 text-sm">{label}</span>
            </div>
            <p className={`text-4xl font-bold mt-3 ${valueColor}`}>{value}</p>
            <p className="text-gray-400 text-sm mt-2">{sub}</p>
        </div>
    );
}

function SectionTitle({ icon, iconBg, iconColor, title, subtitle }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}
            >
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                {subtitle && (
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

function Donut({ segments }) {
    const r = 62;
    const c = 2 * Math.PI * r;
    let offset = 0;
    return (
        <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r={r} fill="none" stroke="#151a2e" strokeWidth="26" />
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
                <div className="w-16 h-16 rounded-full bg-[#0a0d1c] flex items-center justify-center">
                    <FaGithub className="text-4xl text-white" />
                </div>
            </div>
        </div>
    );
}

/* ---------- component ---------- */

function GitHubDashboard() {
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
        <div id="github" className="w-full max-w-full min-w-0 px-3 sm:px-4 py-10 overflow-x-hidden">
            <div className="w-full min-w-0 max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c1122] to-[#080b16] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(59,130,246,0.08)] text-white">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                    <div className="flex items-center gap-4">
                        <FaGithub className="text-6xl text-white" />
                        <div>
                            <p className="text-3xl font-bold leading-tight">GitHub</p>
                            <p className="text-3xl font-bold leading-tight text-blue-400">
                                Dashboard
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Code. Build. Share. Repeat.
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
                        <p className="text-gray-400 text-sm italic mt-4">
                            “Good code tells a story.”
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="mt-6 text-sm text-amber-400">
                        Couldn't reach the GitHub API (you may have hit the hourly rate limit). Try again later.
                    </p>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <StatCard
                        icon={<FaBook />}
                        iconColor="text-blue-400"
                        label="Repositories"
                        value={fmt(profile?.public_repos ?? (repos.length || null))}
                        valueColor="text-sky-300"
                        sub="Public Repos"
                    />
                    <StatCard
                        icon={<FaRegStar />}
                        iconColor="text-yellow-400"
                        label="Total Stars"
                        value={repos.length ? fmt(totalStars) : "—"}
                        valueColor="text-white"
                        sub="Across all repos"
                    />
                    <StatCard
                        icon={<FaCodeBranch />}
                        iconColor="text-green-400"
                        label="Total Commits"
                        value={fmt(commits)}
                        valueColor="text-cyan-200"
                        sub="Public commits"
                    />
                    <StatCard
                        icon={<FaUsers />}
                        iconColor="text-purple-400"
                        label="Followers"
                        value={fmt(profile?.followers ?? null)}
                        valueColor="text-purple-400"
                        sub="Amazing people"
                    />
                </div>

                {/* Contribution Activity */}
                <div className={`${cardClass} p-5 mt-5`}>
                    <div className="flex items-start justify-between">
                        <SectionTitle
                            icon={<FaCalendarAlt />}
                            iconBg="bg-blue-500/15"
                            iconColor="text-blue-400"
                            title="Contribution Activity"
                            subtitle="Your GitHub activity over the past year"
                        />
                        <p className="text-purple-400 font-semibold">365 Days</p>
                    </div>

                    {/* Phones: compact summary instead of the 680px-wide heatmap */}
                    <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#111827] border border-white/10 p-3">
                            <p className="text-gray-400 text-xs">Contributions</p>
                            <p className="text-2xl font-bold text-green-400 mt-1">{fmt(totalContribs)}</p>
                        </div>
                        <div className="rounded-xl bg-[#111827] border border-white/10 p-3">
                            <p className="text-gray-400 text-xs">Longest streak</p>
                            <p className="text-2xl font-bold text-orange-400 mt-1">
                                {streak === null ? "—" : `${streak} days`}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block mt-5 overflow-x-auto">
                        {weeks.length === 0 ? (
                            <p className="text-gray-500 text-sm py-10 text-center">
                                Loading activity…
                            </p>
                        ) : (
                            <div className="min-w-[680px]">

                                {/* month labels */}
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
                                    {/* day labels */}
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
                                                    className={`aspect-square rounded-[3px] ${levelColors[d.level ?? 0]} hover:ring-1 hover:ring-green-300`}
                                                />
                                            ) : (
                                                <div key={`pad-${i}`} className="aspect-square" />
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* legend */}
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

                {/* Languages / Featured repos: click a button to show one panel at a time */}
                <div className="mt-5">

                    <div className="grid grid-cols-2 gap-3">
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
                                    className={`${cardClass} min-w-0 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left transition ${
                                        active
                                            ? "border-blue-500/60 bg-blue-500/10"
                                            : "hover:border-blue-500/40"
                                    }`}
                                >
                                    <span className="w-9 h-9 shrink-0 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                                        <FaThumbtack />
                                    </span>
                                    <span className="flex-1 min-w-0 text-sm sm:text-lg font-semibold leading-tight">
                                        {tab.title}
                                    </span>
                                    <FaChevronDown
                                        className={`text-gray-400 text-sm transition-transform ${
                                            active ? "rotate-180 text-blue-400" : ""
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Top Languages panel */}
                    {openPanel === "languages" && (
                        <div id="panel-languages" className={`${cardClass} p-5 mt-3`}>
                            {languages.list.length === 0 ? (
                                <p className="text-gray-500 text-sm">Loading…</p>
                            ) : (
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-6 sm:gap-12">
                                    <ul className="space-y-4 w-full sm:w-auto sm:min-w-[220px]">
                                        {languages.list.map((l) => (
                                            <li key={l.name} className="flex items-center gap-3 text-sm">
                                                <span
                                                    className="w-4 h-4 rounded-full shrink-0"
                                                    style={{ background: l.color }}
                                                />
                                                <span>{l.name}</span>
                                                <span className="text-gray-300 ml-auto pl-3">
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
                        <div id="panel-repos" className={`${cardClass} p-4 sm:p-5 mt-3`}>
                            <div className="divide-y divide-white/10">
                                {featured.length === 0 && (
                                    <p className="text-gray-500 text-sm py-2">Loading…</p>
                                )}
                                {featured.map((repo, i) => {
                                    const Icon = repoIcons[i % repoIcons.length];
                                    return (
                                        <a
                                            key={repo.id}
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 sm:gap-4 py-3 hover:bg-white/[0.03] rounded-lg transition"
                                        >
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg bg-[#151a2e] flex items-center justify-center text-gray-300">
                                                <Icon />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold truncate">{repo.name}</p>
                                                <p className="text-xs text-gray-400 line-clamp-2 sm:line-clamp-1">
                                                    {repo.description || "No description available."}
                                                </p>
                                            </div>
                                            <span className="flex items-center gap-1.5 text-sm text-gray-200 shrink-0">
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
                <div className={`${cardClass} p-5 mt-5`}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6">

                        <div className="lg:pr-4">
                            <p className="text-gray-300 text-sm text-center">Longest Streak</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <FaFire className="text-4xl text-orange-500" />
                                <p className="text-3xl font-bold text-orange-400">
                                    {fmt(streak)}{" "}
                                    <span className="text-sm font-normal text-green-400">days</span>
                                </p>
                            </div>
                        </div>

                        <div className="lg:border-l lg:border-white/10 lg:px-4">
                            <p className="text-gray-300 text-sm text-center">PRs Merged</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <FaCodeBranch className="text-3xl text-purple-400" />
                                <p className="text-3xl font-bold text-purple-400">{fmt(prsMerged)}</p>
                            </div>
                        </div>

                        <div className="lg:border-l lg:border-white/10 lg:px-4">
                            <p className="text-gray-300 text-sm text-center">Issues Closed</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <FaRegCheckCircle className="text-3xl text-blue-400" />
                                <p className="text-3xl font-bold text-blue-400">{fmt(issuesClosed)}</p>
                            </div>
                        </div>

                        <div className="lg:border-l lg:border-white/10 lg:pl-4">
                            <p className="text-gray-300 text-sm text-center">Total Contributions</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <FaChartBar className="text-3xl text-green-400" />
                                <p className="text-3xl font-bold text-green-400">{fmt(totalContribs)}</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default GitHubDashboard;