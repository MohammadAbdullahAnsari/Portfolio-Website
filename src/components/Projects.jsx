import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProjectCard from "./ProjectCard";

/*
  ============================================================================
  PROJECTS — fantasy game-UI theme (matches Hero / Skills)

  THEME: follows the same day/night switch as the Hero navbar. Hero sets
  document.documentElement.dataset.theme = "light" | "dark" and all colours
  here (sky, sun/moon, mountains, text, cards) react to it.

  The GitHub fetching, social-preview lookup, filters and mobile slider logic
  are unchanged — only the look and effects are new.
  ============================================================================
*/

/* ---------- config ---------- */

const USERNAME = "MohammadAbdullahAnsari";

const FILTERS = ["All", "Web Apps", "React", "Full Stack", "Other"];

// Image order for every card:
//   1. the custom "Social preview" you upload in the GitHub repo settings (automatic)
//   2. your own screenshot below (put files in /public/projects and list them here)
//   3. a placeholder
const projectImages = {
  "DSA-Problems": "/projects/DsaProblems.webp",
  "File-Fusion": "/projects/Filefusion.webp",
  "Portfolio-Website": "/projects/portfolio.webp",
};

// Optional per-repo overrides: category + tech chips (+ demo / description)
const PROJECT_META = {
  "DSA-Problems": { category: "Other" },
  "File-Fusion": { category: "Web Apps", tech: ["HTML", "CSS", "JavaScript"] },
  "Portfolio-Website": { category: "React", tech: ["React", "Tailwind CSS"] },
};

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
  [4, 4, 14, 0, 30],
  [9, 3, 17, 3, -20],
  [15, 5, 12, 6, 24],
  [22, 3, 19, 1, -30],
  [29, 4, 15, 8, 18],
  [36, 3, 18, 4, -16],
  [43, 5, 13, 9, 26],
  [50, 3, 20, 2, -24],
  [57, 4, 16, 7, 20],
  [64, 3, 14, 5, -28],
  [71, 5, 18, 0, 22],
  [78, 3, 15, 10, -18],
  [85, 4, 17, 3, 28],
  [91, 3, 13, 6, -22],
  [96, 5, 19, 8, 16],
];

/* ---------- helpers ---------- */

const CACHE_HIT_HOURS = 6; // remember a found image for 6 hours
const CACHE_MISS_MINUTES = 10; // remember "no custom image" only briefly, so a fresh upload shows up soon

// Where does the image come from?
// 1) our own /api/social-preview function (Vercel) - reliable, reads the repo page on GitHub
// 2) fallback: Microlink (used on `npm run dev`, where /api doesn't exist)
// Only images GitHub serves from repository-images.githubusercontent.com (real
// uploads) are used; the auto-generated card (opengraph.githubassets.com) is ignored.
const isCustomPreview = (url) =>
  !!url && url.includes("repository-images.githubusercontent.com");

async function lookupOwnApi(repoName) {
  const res = await fetch(
    `/api/social-preview?repo=${encodeURIComponent(repoName)}`,
  );
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("application/json")) throw new Error("no api");
  const json = await res.json();
  return isCustomPreview(json.url) ? json.url : null;
}

async function lookupMicrolink(repoName) {
  const page = `https://github.com/${USERNAME}/${repoName}`;
  const res = await fetch(
    `https://api.microlink.io/?url=${encodeURIComponent(page)}`,
  );
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  const found = json?.data?.image?.url || null;
  return isCustomPreview(found) ? found : null;
}

async function fetchSocialPreview(repoName) {
  const key = `gh-social:${USERNAME}/${repoName}`;

  try {
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (cached) {
      const ttl = cached.url
        ? CACHE_HIT_HOURS * 3600e3
        : CACHE_MISS_MINUTES * 60e3;
      if (Date.now() - cached.t < ttl) return cached.url;
    }
  } catch {
    /* ignore storage problems */
  }

  let url;
  try {
    url = await lookupOwnApi(repoName);
  } catch {
    try {
      url = await lookupMicrolink(repoName);
    } catch {
      return null; // both failed -> use the local screenshot / placeholder
    }
  }

  try {
    localStorage.setItem(key, JSON.stringify({ url, t: Date.now() }));
  } catch {
    /* ignore */
  }
  return url;
}

const prettyName = (name) => name.replace(/[-_]+/g, " ");

function getCategory(repo) {
  const meta = PROJECT_META[repo.name];
  if (meta?.category) return meta.category;

  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  if (
    topics.some((t) =>
      [
        "fullstack",
        "full-stack",
        "mern",
        "express",
        "mongodb",
        "nodejs",
      ].includes(t),
    )
  )
    return "Full Stack";
  if (topics.includes("react")) return "React";
  if (
    ["JavaScript", "TypeScript", "HTML", "CSS", "Vue"].includes(repo.language)
  )
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

/* ---------- component ---------- */

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState(0);
  const [socialImages, setSocialImages] = useState({});
  const sliderRef = useRef(null);

  useGoogleFonts();

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
        .filter(
          (r) => !r.fork && r.name.toLowerCase() !== USERNAME.toLowerCase(),
        )
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .map((r) => ({ repo: r, category: getCategory(r) })),
    [repos],
  );

  const visible = projects.filter(
    (p) => filter === "All" || p.category === filter,
  );

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
      className="fh-projects relative overflow-hidden w-full px-5 sm:px-8 pt-28 pb-28"
    >
      <style>{`
                .fh-projects {
                    --text: #f6ecd2; --sub: #d9cba8;
                    --tile-a: #403930; --tile-b: #1b1612; --tile-ring: rgba(130,118,100,.8); --tile-hi: rgba(255,255,255,.13);
                    --ridge1: #2b2540; --ridge2: #1a1626; --stars: 1; --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
                    color: var(--text); background: #0e1230;
                }
                :root[data-theme="light"] .fh-projects {
                    --text: #3a210e; --sub: #5a3d25;
                    --tile-a: #f7e8c6; --tile-b: #dcc08a; --tile-ring: #b78a36; --tile-hi: rgba(255,255,255,.7);
                    --ridge1: #8a86a8; --ridge2: #5e5c7c; --stars: 0; --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .pj-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* ----- sky (night / day cross-fade) ----- */
                .pj-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .pj-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .pj-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-projects .pj-night { opacity: 0; }
                :root[data-theme="light"] .fh-projects .pj-day { opacity: 1; }
                .pj-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 7% 18%, #fff, transparent), radial-gradient(1px 1px at 15% 52%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 24% 10%, #fff, transparent), radial-gradient(1px 1px at 33% 42%, #fff, transparent),
                        radial-gradient(2px 2px at 42% 22%, #ffe9b8, transparent), radial-gradient(1px 1px at 51% 62%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 60% 14%, #fff, transparent), radial-gradient(1px 1px at 68% 46%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 77% 28%, #fff, transparent), radial-gradient(1px 1px at 85% 9%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 94% 50%, #ffe9b8, transparent), radial-gradient(1px 1px at 3% 70%, #fff, transparent);
                    animation: pj-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes pj-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }
                .pj-orb {
                    position: absolute; z-index: 0; top: 6%; left: 8%; width: 76px; height: 76px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s; animation: pj-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-projects .pj-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes pj-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
                .pj-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 36%; z-index: 0; pointer-events: none; }
                .pj-ridges path { transition: fill .7s; }
                .pj-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }

                .pj-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none; opacity: 0;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: pj-rise var(--dur) linear var(--del) infinite;
                }
                :root[data-theme="light"] .fh-projects .pj-ember { animation: none; opacity: 0 !important; }
                @keyframes pj-rise {
                    0% { opacity: 0; transform: translate(0,0); } 10% { opacity: .9; } 85% { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                /* ----- title sign ----- */
                .pj-sign {
                    position: relative; display: inline-block; padding: 1rem 2.6rem 1.15rem; border-radius: 12px; transform-origin: 50% -2.2rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: pj-swing 6s ease-in-out infinite;
                }
                @keyframes pj-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .pj-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .pj-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .pj-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .pj-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: pj-shine 5s ease-in-out 1s infinite;
                }
                @keyframes pj-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .pj-rivets { position: relative; }
                .pj-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .pj-sub { color: var(--sub); text-shadow: 0 1px 4px rgba(0,0,0,.35); }
                :root[data-theme="light"] .fh-projects .pj-sub { text-shadow: 0 1px 0 rgba(255,255,255,.5); }

                /* ----- filter tabs ----- */
                .pj-tab {
                    font-family: 'Lilita One', sans-serif; letter-spacing: .02em; font-size: 1rem; color: #f7e9c4; padding: .5rem 1.25rem; border-radius: 9px;
                    text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 1px rgba(241,196,82,.35), inset 0 2px 0 rgba(255,255,255,.08), 0 4px 0 #070504, 0 6px 8px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s, color .15s;
                }
                .pj-tab:hover { transform: translateY(-2px); color: #ffd978; filter: brightness(1.2); }
                .pj-tab:active { transform: translateY(3px); }
                .pj-tab:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .pj-tab.on { color: #fff; background: linear-gradient(180deg, #d9433c, #a02220 60%, #7d1614); box-shadow: inset 0 0 0 2px #e4bb55, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 6px 10px rgba(0,0,0,.45); }

                /* ----- states ----- */
                .pj-skel { height: 26rem; border-radius: 18px; background: linear-gradient(160deg, var(--tile-a), var(--tile-b)); box-shadow: inset 0 0 0 2px var(--tile-ring); animation: pj-pulse 1.6s ease-in-out infinite; }
                @keyframes pj-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
                .pj-note { display: inline-block; padding: .7rem 1.4rem; border-radius: 10px; color: #f8e9c2; font-weight: 700; background: linear-gradient(180deg, #6b4428, #3b2310); box-shadow: inset 0 0 0 2px #caa43d, 0 6px 10px rgba(0,0,0,.4); }
                .pj-pop { animation: pj-pop .6s cubic-bezier(.34,1.56,.64,1) var(--d, 0ms) both; }
                @keyframes pj-pop { from { opacity: 0; transform: translateY(26px) scale(.92); } to { opacity: 1; transform: none; } }

                /* ----- slider controls ----- */
                .pj-arrow { width: 2.9rem; height: 2.9rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #fff;
                    background: linear-gradient(180deg, #d9433c, #8d1b19); box-shadow: inset 0 0 0 2px #e4bb55, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 6px 8px rgba(0,0,0,.4);
                    transition: transform .12s, opacity .2s; }
                .pj-arrow:active { transform: translateY(3px); }
                .pj-arrow:disabled { opacity: .35; }
                .pj-dot { height: .5rem; border-radius: 9999px; transition: all .3s; background: rgba(255,255,255,.3); box-shadow: inset 0 0 0 1px rgba(0,0,0,.3); }
                :root[data-theme="light"] .fh-projects .pj-dot { background: rgba(80,50,20,.3); }
                .pj-dot.on { width: 1.5rem; background: linear-gradient(90deg, #ffe88f, #e9a626); }

                /* ----- banners ----- */
                .pj-pole { position: absolute; left: 0; right: 0; top: 0; height: .8rem; border-radius: 5px; background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 12px), linear-gradient(180deg, #84552f, #46290f); box-shadow: 0 4px 6px rgba(0,0,0,.5); }
                .pj-flag { transform-origin: 50% 0; margin-top: .6rem; animation: pj-sway 4.6s ease-in-out infinite; }
                @keyframes pj-sway { 0%,100% { rotate: -2.4deg; } 50% { rotate: 2.8deg; } }
                .pj-cloth { padding: 1.9rem .8rem 3.2rem; clip-path: polygon(0 0, 100% 0, 100% 86%, 50% 100%, 0 86%); background: linear-gradient(90deg, rgba(0,0,0,.2), transparent 25%, transparent 70%, rgba(0,0,0,.22)), linear-gradient(180deg, #b32f2c, #771615); box-shadow: inset 0 0 0 3px rgba(241,196,82,.35); }
                .pj-hand { font-family: 'Caveat', cursive; font-weight: 700; color: #fff3e0; font-size: 1.5rem; line-height: 1.1; rotate: -12deg; text-shadow: 0 2px 2px rgba(0,0,0,.45); }

                /* ----- footer ribbon ----- */
                .pj-ribbon { position: relative; display: inline-block; padding: .9rem 3.2rem; color: #fff; font-family: 'Lilita One', sans-serif; font-size: 1.15rem; letter-spacing: .04em; text-shadow: 0 2px 0 rgba(0,0,0,.65); }
                .pj-ribbon-bg { position: absolute; inset: 0; z-index: -1; clip-path: polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%); background: linear-gradient(180deg, #f1c452, #a8741c); }
                .pj-ribbon-bg::before { content: ""; position: absolute; inset: 3px; clip-path: polygon(0 0, 100% 0, 96.4% 50%, 100% 100%, 0 100%, 3.6% 50%); background: linear-gradient(180deg, #cf3f39, #8d1b19 70%, #741312); box-shadow: inset 0 3px 0 rgba(255,255,255,.25); }
                .pj-ribbon-bg::after { content: ""; position: absolute; top: 0; left: -60%; width: 35%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,230,160,.5), transparent); transform: skewX(-18deg); animation: pj-sweep 5s ease-in-out 1.5s infinite; }
                @keyframes pj-sweep { 0% { left: -60%; } 40%, 100% { left: 150%; } }

                @media (prefers-reduced-motion: reduce) {
                    .fh-projects *, .fh-projects *::before, .fh-projects *::after { animation: none !important; transition: none !important; }
                    .pj-ember { display: none; }
                }
            `}</style>

      {/* ---------------- BACKGROUND ---------------- */}
      <div className="pj-sky pj-night" />
      <div className="pj-sky pj-day" />
      <div className="pj-stars" aria-hidden="true" />
      <div className="pj-orb" aria-hidden="true" />
      <svg
        className="pj-ridges"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          style={{ fill: "var(--ridge1)" }}
          opacity=".85"
          d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z"
        />
        <path
          style={{ fill: "var(--ridge2)" }}
          d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z"
        />
      </svg>
      <div className="pj-vignette" />
      {EMBERS.map(([l, s, d, dl, dx], i) => (
        <span
          key={i}
          className="pj-ember"
          aria-hidden="true"
          style={{
            left: `${l}%`,
            width: s,
            height: s,
            "--dur": `${d}s`,
            "--del": `${dl}s`,
            "--dx": `${dx}px`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* hanging banners (large screens only) */}
        <div
          className="hidden xl:block absolute -left-4 top-2 w-28"
          aria-hidden="true"
        >
          <div className="pj-pole" />
          <div className="pj-flag">
            <div className="pj-cloth">
              <p className="pj-hand">
                Ideas
                <br />
                into
                <br />
                Reality
              </p>
            </div>
          </div>
        </div>
        <div
          className="hidden xl:block absolute -right-4 top-2 w-28"
          aria-hidden="true"
        >
          <div className="pj-pole" />
          <div className="pj-flag" style={{ animationDelay: "-2s" }}>
            <div className="pj-cloth">
              <p className="pj-hand">
                Build
                <br />
                Learn
                <br />
                Improve
                <br />
                Repeat
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center pt-10">
          <div className="pj-sign pj-rivets">
            <span className="pj-chain" style={{ left: "16%" }} />
            <span className="pj-chain" style={{ right: "16%" }} />
            <h2 className="pj-display text-5xl sm:text-6xl lg:text-7xl">
              <span className="pj-name" data-text="Projects">
                <span>Projects</span>
              </span>
            </h2>
          </div>

          <p className="pj-sub max-w-2xl mx-auto mt-8 text-base sm:text-lg leading-relaxed font-semibold">
            Here are some of the projects I've built. Each project represents my
            learning, problem-solving skills, and passion for development.
          </p>
        </div>

        {/* Filters */}
        <div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10"
          role="group"
          aria-label="Project categories"
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`pj-tab ${active ? "on" : ""}`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Projects: slider on phones, grid from md up */}
        <div className="mt-12">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="pj-skel" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center">
              <span className="pj-note">
                Couldn't load projects from GitHub (possibly rate-limited). Try
                again in a while.
              </span>
            </p>
          )}

          {!loading && !error && visible.length === 0 && (
            <p className="text-center">
              <span className="pj-note">No projects in this category yet.</span>
            </p>
          )}

          {!loading && !error && visible.length > 0 && (
            <>
              <div
                ref={sliderRef}
                onScroll={onScroll}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-5 -mx-5 px-5 pt-3 pb-4 [&::-webkit-scrollbar]:hidden
                                    md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:snap-none"
                style={{ scrollbarWidth: "none" }}
              >
                {visible.map(({ repo, category }, i) => (
                  <div
                    key={`${filter}-${repo.id}`}
                    className="pj-pop w-[88%] sm:w-[70%] shrink-0 snap-start md:w-auto md:shrink"
                    style={{ "--d": `${(i % 6) * 80}ms` }}
                  >
                    <ProjectCard
                      image={
                        socialImages[repo.name] || projectImages[repo.name]
                      }
                      fallbackImage={projectImages[repo.name]}
                      category={category === "Web Apps" ? "Web App" : category}
                      title={prettyName(repo.name)}
                      description={
                        repo.description || "No description available."
                      }
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
                    className="pj-arrow"
                  >
                    <FaChevronLeft />
                  </button>

                  <div className="flex items-center gap-2">
                    {visible.map((p, i) => (
                      <span
                        key={p.repo.id}
                        className={`pj-dot ${i === index ? "on" : ""}`}
                        style={i === index ? undefined : { width: ".5rem" }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => slide(1)}
                    disabled={index >= visible.length - 1}
                    aria-label="Next project"
                    className="pj-arrow"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* footer note */}
        <div className="text-center mt-16">
          <div className="pj-ribbon">
            <span className="pj-ribbon-bg" aria-hidden="true" />
            More Projects Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
