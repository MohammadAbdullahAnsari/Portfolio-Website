import { useEffect } from "react";
import LeetCodeDashboard from "./LeetCodeDashboard";
import GitHubDashboard from "./GitHubDashboard";

/*
  DASHBOARD — wrapper section (id="dashboard", the one your navbar links to).

  It draws the shared sky, sign and heading ONCE, then renders the two
  dashboards with the `embedded` prop so they skip their own background and
  sign. Follows the day/night switch from the Hero navbar through
  document.documentElement.dataset.theme ("light" | "dark").

  Layout: the themed panels are wide, so they stack in one column and sit
  side by side only from 1536px up (2xl). Change `2xl:grid-cols-2` below if
  you want the two-column layout earlier.
*/

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
    [4, 4, 14, 0, 30], [9, 3, 17, 3, -20], [15, 5, 12, 6, 24], [22, 3, 19, 1, -30],
    [29, 4, 15, 8, 18], [36, 3, 18, 4, -16], [43, 5, 13, 9, 26], [50, 3, 20, 2, -24],
    [57, 4, 16, 7, 20], [64, 3, 14, 5, -28], [71, 5, 18, 0, 22], [78, 3, 15, 10, -18],
    [85, 4, 17, 3, 28], [91, 3, 13, 6, -22], [96, 5, 19, 8, 16],
];

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

function Dashboard() {
    useGoogleFonts();

    return (
        <section
            id="dashboard"
            className="fh-db relative min-h-screen w-full max-w-full overflow-hidden px-5 md:px-8 pt-28 pb-24"
        >
            <style>{`
                .fh-db {
                    --text: #f6ecd2; --sub: #d9cba8; --ridge1: #2b2540; --ridge2: #1a1626; --stars: 1; --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif; color: var(--text); background: #0e1230;
                }
                :root[data-theme="light"] .fh-db {
                    --text: #3a210e; --sub: #5a3d25; --ridge1: #8a86a8; --ridge2: #5e5c7c; --stars: 0; --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .db-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                .db-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .db-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .db-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-db .db-night { opacity: 0; }
                :root[data-theme="light"] .fh-db .db-day { opacity: 1; }
                .db-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 7% 18%, #fff, transparent), radial-gradient(1px 1px at 15% 52%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 24% 10%, #fff, transparent), radial-gradient(1px 1px at 33% 42%, #fff, transparent),
                        radial-gradient(2px 2px at 42% 22%, #ffe9b8, transparent), radial-gradient(1px 1px at 51% 62%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 60% 14%, #fff, transparent), radial-gradient(1px 1px at 68% 46%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 77% 28%, #fff, transparent), radial-gradient(1px 1px at 85% 9%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 94% 50%, #ffe9b8, transparent), radial-gradient(1px 1px at 3% 70%, #fff, transparent);
                    animation: db-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes db-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }
                .db-orb {
                    position: absolute; z-index: 0; top: 4%; right: 7%; width: 76px; height: 76px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s; animation: db-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-db .db-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes db-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
                .db-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 22%; z-index: 0; pointer-events: none; }
                .db-ridges path { transition: fill .7s; }
                .db-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }
                .db-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none; opacity: 0;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: db-rise var(--dur) linear var(--del) infinite;
                }
                :root[data-theme="light"] .fh-db .db-ember { animation: none; opacity: 0 !important; }
                @keyframes db-rise {
                    0% { opacity: 0; transform: translate(0,0); } 10% { opacity: .9; } 85% { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                .db-sign {
                    position: relative; display: inline-block; padding: 1rem 2.6rem 1.15rem; border-radius: 12px; transform-origin: 50% -2.2rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: db-swing 6s ease-in-out infinite;
                }
                @keyframes db-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .db-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .db-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .db-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .db-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: db-shine 5s ease-in-out 1s infinite;
                }
                @keyframes db-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .db-rivets { position: relative; }
                .db-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .db-pill {
                    display: inline-block; padding: .45rem 1.4rem; border-radius: 10px; font-family: 'Lilita One', sans-serif; letter-spacing: .05em; color: #f3e2b4; text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 2px rgba(202,164,61,.75), inset 0 2px 0 rgba(255,255,255,.08), 0 5px 10px rgba(0,0,0,.45);
                }
                .db-sub { color: var(--sub); text-shadow: 0 1px 4px rgba(0,0,0,.35); }
                :root[data-theme="light"] .fh-db .db-sub { text-shadow: 0 1px 0 rgba(255,255,255,.5); }

                @media (prefers-reduced-motion: reduce) {
                    .fh-db *, .fh-db *::before, .fh-db *::after { animation: none !important; transition: none !important; }
                    .db-ember { display: none; }
                }
            `}</style>

            {/* ---------------- SHARED BACKGROUND ---------------- */}
            <div className="db-sky db-night" />
            <div className="db-sky db-day" />
            <div className="db-stars" aria-hidden="true" />
            <div className="db-orb" aria-hidden="true" />
            <svg className="db-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path style={{ fill: "var(--ridge1)" }} opacity=".85" d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z" />
                <path style={{ fill: "var(--ridge2)" }} d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z" />
            </svg>
            <div className="db-vignette" />
            {EMBERS.map(([l, s, d, dl, dx], i) => (
                <span
                    key={i}
                    className="db-ember"
                    aria-hidden="true"
                    style={{ left: `${l}%`, width: s, height: s, "--dur": `${d}s`, "--del": `${dl}s`, "--dx": `${dx}px` }}
                />
            ))}

            <div className="relative z-10 max-w-[1500px] mx-auto">

                {/* Section Heading */}
                <div className="text-center mb-16 pt-10">
                    <div className="db-sign db-rivets">
                        <span className="db-chain" style={{ left: "16%" }} />
                        <span className="db-chain" style={{ right: "16%" }} />
                        <h2 className="db-display text-4xl sm:text-5xl lg:text-6xl">
                            <span className="db-name" data-text="Developer Dashboard"><span>Developer Dashboard</span></span>
                        </h2>
                    </div>

                    <p className="mt-8">
                        <span className="db-pill">CODING PROFILES</span>
                    </p>

                    <p className="db-sub max-w-2xl mx-auto mt-5 text-base sm:text-lg font-semibold leading-relaxed">
                        My live coding activity, problem-solving progress, GitHub projects,
                        and contribution statistics — all in one place.
                    </p>
                </div>

                {/* Two Dashboards: stacked, side by side from 2xl */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="min-w-0 w-full max-w-5xl mx-auto 2xl:max-w-none">
                        <LeetCodeDashboard embedded />
                    </div>
                    <div className="min-w-0 w-full max-w-5xl mx-auto 2xl:max-w-none">
                        <GitHubDashboard embedded />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Dashboard;