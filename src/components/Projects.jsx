import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProjectCard from "./ProjectCard";

/* ---------- config ---------- */

const USERNAME = "MohammadAbdullahAnsari";

const FILTERS = ["All", "Web Apps", "React", "Full Stack", "Other"];

// Image order for every card:
//   1. the custom "Social preview" you upload in the GitHub repo settings (automatic)
//   2. your own screenshot below (put files in /public/projects and list them here)
//   3. a purple placeholder
const projectImages = {
    "DSA-Problems": "/projects/DsaProblems.png",
    "File-Fusion": "/projects/Filefusion.png",
    "Portfolio-Website": "/projects/portfolio-website.png",
};

// Optional per-repo overrides: category + tech chips (+ demo / description)
const PROJECT_META = {
    "DSA-Problems": { category: "Other" },
    "File-Fusion": { category: "Web Apps", tech: ["HTML", "CSS", "JavaScript"] },
    "Portfolio-Website": { category: "React", tech: ["React", "Tailwind CSS"] },
};

const HANDWRITING = { fontFamily: "'Caveat', 'Comic Sans MS', cursive" };

/* ---------- helpers ---------- */

const CACHE_HOURS = 6;

// GitHub's REST API doesn't expose the social preview, so we read the repo
// page's og:image through Microlink (free, CORS-enabled). Custom uploads are
// served from repository-images.githubusercontent.com; the auto-generated
// default card (opengraph.githubassets.com) is ignored on purpose.
async function fetchSocialPreview(repoName) {
    const key = `gh-social:${USERNAME}/${repoName}`;
    try {
        const cached = JSON.parse(localStorage.getItem(key) || "null");
        if (cached && Date.now() - cached.t < CACHE_HOURS * 3600 * 1000) {
            return cached.url;
        }
    } catch {
        /* ignore storage problems */
    }

    try {
        const page = `https://github.com/${USERNAME}/${repoName}`;
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(page)}`);
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const found = json?.data?.image?.url || null;
        const url = found && found.includes("repository-images.githubusercontent.com") ? found : null;
        try {
            localStorage.setItem(key, JSON.stringify({ url, t: Date.now() }));
        } catch {
            /* ignore */
        }
        return url;
    } catch {
        return null; // rate-limited / offline -> fall back to local image
    }
}

const prettyName = (name) => name.replace(/[-_]+/g, " ");

function getCategory(repo) {
    const meta = PROJECT_META[repo.name];
    if (meta?.category) return meta.category;

    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    if (topics.some((t) => ["fullstack", "full-stack", "mern", "express", "mongodb", "nodejs"].includes(t)))
        return "Full Stack";
    if (topics.includes("react")) return "React";
    if (["JavaScript", "TypeScript", "HTML", "CSS", "Vue"].includes(repo.language))
        return "Web Apps";
    return "Other";
}

function getTech(repo) {
    const meta = PROJECT_META[repo.name];
    if (meta?.tech) return meta.tech;
    const list = [repo.language, ...(repo.topics || [])].filter(Boolean);
    const unique = [...new Set(list)].slice(0, 3);
    return unique.length ? unique : ["Other"];
}

/* ---------- component ---------- */

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filter, setFilter] = useState("All");
    const [index, setIndex] = useState(0);
    const [socialImages, setSocialImages] = useState({});
    const sliderRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`)
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                if (Array.isArray(data)) setRepos(data);
                else setError(true); // e.g. rate-limit message object
                setLoading(false);
            })
            .catch((err) => {
                console.error("GitHub API Error:", err);
                if (!cancelled) {
                    setError(true);
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const projects = useMemo(
        () =>
            repos
                .filter((r) => !r.fork && r.name.toLowerCase() !== USERNAME.toLowerCase())
                .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
                .map((r) => ({ repo: r, category: getCategory(r) })),
        [repos]
    );

    const visible = projects.filter((p) => filter === "All" || p.category === filter);

    // look up each repo's custom GitHub social preview (a few at a time)
    useEffect(() => {
        if (!projects.length) return;
        let cancelled = false;

        (async () => {
            const queue = projects.map((p) => p.repo.name);
            const worker = async () => {
                while (queue.length && !cancelled) {
                    const name = queue.shift();
                    const url = await fetchSocialPreview(name);
                    if (url && !cancelled) {
                        setSocialImages((prev) => ({ ...prev, [name]: url }));
                    }
                }
            };
            await Promise.all([worker(), worker(), worker()]);
        })();

        return () => {
            cancelled = true;
        };
    }, [projects]);

    // back to the first card when the filter changes
    useEffect(() => {
        const el = sliderRef.current;
        if (el) el.scrollTo({ left: 0 });
        setIndex(0);
    }, [filter]);

    /* --- mobile slider --- */
    const GAP = 16;

    const step = () => {
        const el = sliderRef.current;
        const card = el?.firstElementChild;
        return card ? card.offsetWidth + GAP : 0;
    };

    const slide = (dir) => {
        const el = sliderRef.current;
        if (el) el.scrollBy({ left: dir * step(), behavior: "smooth" });
    };

    const onScroll = () => {
        const el = sliderRef.current;
        const s = step();
        if (el && s) setIndex(Math.round(el.scrollLeft / s));
    };

    return (
        <section
            id="projects"
            className="relative overflow-hidden w-full bg-[#070b17] text-white px-5 sm:px-8 pt-24 pb-20"
        >
            {/* background glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-purple-700/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-purple-700/20 blur-3xl" />

            <div className="relative max-w-7xl mx-auto">

                {/* handwritten notes (large screens only) */}
                <div
                    className="hidden xl:flex absolute left-4 top-10 items-end gap-2 select-none"
                    aria-hidden="true"
                >
                    <p className="text-purple-300 text-2xl leading-7 -rotate-12" style={HANDWRITING}>
                        Ideas<br />into<br />Reality
                    </p>
                    <svg width="46" height="26" viewBox="0 0 46 26" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M3 4 C 20 2, 34 8, 42 20" />
                        <path d="M32 20 L42 21 L40 11" />
                    </svg>
                </div>
                <p
                    className="hidden xl:block absolute right-4 top-4 text-purple-300 text-2xl leading-7 rotate-6 select-none"
                    style={HANDWRITING}
                    aria-hidden="true"
                >
                    Build<br />Learn<br />Improve<br />Repeat<br />...
                </p>

                {/* Heading */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-4">
                        <p className="text-purple-400 font-medium tracking-[0.2em]">MY WORK</p>
                        <span className="w-12 h-0.5 rounded-full bg-purple-500" />
                    </div>

                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mt-3">
                        Pro
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                            jects
                        </span>
                    </h2>

                    <p className="text-gray-300 max-w-2xl mx-auto mt-5 text-base sm:text-lg leading-relaxed">
                        Here are some of the projects I've built. Each project represents
                        my learning, problem-solving skills, and passion for development.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8">
                    {FILTERS.map((f) => {
                        const active = filter === f;
                        return (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                aria-pressed={active}
                                className={`px-5 sm:px-7 py-2.5 rounded-full text-sm sm:text-base transition ${
                                    active
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                                        : "bg-[#0d1224] border border-white/10 text-gray-200 hover:border-purple-500/50"
                                }`}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* Projects: slider on phones, grid from md up */}
                <div className="mt-10">

                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-[26rem] rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <p className="text-center text-amber-400 text-sm">
                            Couldn't load projects from GitHub (possibly rate-limited). Try again in a while.
                        </p>
                    )}

                    {!loading && !error && visible.length === 0 && (
                        <p className="text-center text-gray-400">
                            No projects in this category yet.
                        </p>
                    )}

                    {!loading && !error && visible.length > 0 && (
                        <>
                            <div
                                ref={sliderRef}
                                onScroll={onScroll}
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-5 -mx-5 px-5 pb-2 [&::-webkit-scrollbar]:hidden
                                    md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:snap-none"
                                style={{ scrollbarWidth: "none" }}
                            >
                                {visible.map(({ repo, category }) => (
                                    <div
                                        key={repo.id}
                                        className="w-[88%] sm:w-[70%] shrink-0 snap-start md:w-auto md:shrink"
                                    >
                                        <ProjectCard
                                            image={socialImages[repo.name] || projectImages[repo.name]}
                                            fallbackImage={projectImages[repo.name]}
                                            category={category === "Web Apps" ? "Web App" : category}
                                            title={prettyName(repo.name)}
                                            description={repo.description || "No description available."}
                                            technologies={getTech(repo)}
                                            github={repo.html_url}
                                            demo={repo.homepage || "#"}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* slide buttons + dots (phones only) */}
                            {visible.length > 1 && (
                                <div className="md:hidden flex items-center justify-center gap-5 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => slide(-1)}
                                        disabled={index <= 0}
                                        aria-label="Previous project"
                                        className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transition active:scale-95 disabled:opacity-30"
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {visible.map((p, i) => (
                                            <span
                                                key={p.repo.id}
                                                className={`h-2 rounded-full transition-all ${
                                                    i === index ? "w-6 bg-purple-400" : "w-2 bg-white/20"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => slide(1)}
                                        disabled={index >= visible.length - 1}
                                        aria-label="Next project"
                                        className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center shadow-lg transition active:scale-95 disabled:opacity-30"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* footer note */}
                <div className="flex items-center justify-center gap-4 mt-12 text-gray-400">
                    <span className="w-10 sm:w-14 h-px bg-purple-500/50" />
                    <p className="text-sm sm:text-lg">More Projects Coming Soon</p>
                    <span className="w-10 sm:w-14 h-px bg-purple-500/50" />
                </div>
            </div>
        </section>
    );
}

export default Projects;