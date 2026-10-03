import { useEffect } from "react";

/*
  FOOTER — fantasy game-UI theme (matches the rest of the site).
  Follows the day/night switch from the Hero navbar through
  document.documentElement.dataset.theme ("light" | "dark").
  Content is the same as before, plus a small "back to top" button.
*/

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

function Torch({ className = "" }) {
    return (
        <div className={`ft-torch ${className}`} aria-hidden="true">
            <div className="ft-torch-glow" />
            <div className="ft-flame"><i /><i /><i /></div>
            <div className="ft-cup" />
        </div>
    );
}

function Footer() {
    useGoogleFonts();

    const toTop = () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    };

    return (
        <footer className="fh-ft relative overflow-hidden px-5 md:px-8 pt-16 pb-10">
            <style>{`
                .fh-ft {
                    --text: #f6ecd2; --sub: #d9cba8; --muted: #b3a27c; --gold: #ffd35e;
                    --ground-a: #241d19; --ground-b: #0f0b09; --line: rgba(246,220,138,.25);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif; color: var(--text);
                    background: linear-gradient(180deg, var(--ground-a), var(--ground-b));
                    transition: background .5s;
                }
                :root[data-theme="light"] .fh-ft {
                    --text: #3a210e; --sub: #5a3d25; --muted: #7a5a38; --gold: #a86a0a;
                    --ground-a: #e8cf9c; --ground-b: #c9a566; --line: rgba(90,58,20,.3);
                }
                .ft-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* stone battlement along the top edge */
                .ft-wall { position: absolute; left: 0; right: 0; top: 0; height: 22px; z-index: 1; filter: drop-shadow(0 4px 4px rgba(0,0,0,.4)); }
                .ft-wall::before {
                    content: ""; position: absolute; inset: 0;
                    background:
                        repeating-linear-gradient(90deg, #5e554c 0 34px, transparent 34px 54px) top / 100% 12px no-repeat,
                        linear-gradient(180deg, #6b6157, #3a332d) bottom / 100% 10px no-repeat;
                    box-shadow: inset 0 -3px 0 #d4ab45;
                }
                .ft-wall::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 3px; background: linear-gradient(90deg, transparent, #d4ab45, transparent); }

                .ft-glow { position: absolute; left: 50%; bottom: -40%; width: 90%; height: 80%; translate: -50% 0; background: radial-gradient(closest-side, rgba(255,150,50,.22), transparent); animation: ft-breathe 5s ease-in-out infinite; pointer-events: none; }
                :root[data-theme="light"] .fh-ft .ft-glow { background: radial-gradient(closest-side, rgba(255,230,150,.55), transparent); }
                @keyframes ft-breathe { 0%,100% { opacity: .6; } 50% { opacity: 1; } }

                /* torches */
                .ft-torch { position: absolute; z-index: 2; bottom: 1.2rem; width: 44px; height: 96px; pointer-events: none; }
                .ft-torch-glow { position: absolute; left: 50%; bottom: 20px; width: 170px; height: 170px; margin-left: -85px; border-radius: 9999px; background: radial-gradient(circle, rgba(255,150,40,.5), transparent 68%); animation: ft-flicker 1.9s ease-in-out infinite; }
                :root[data-theme="light"] .fh-ft .ft-torch-glow { opacity: .5; }
                .ft-flame { position: absolute; left: 50%; bottom: 26px; width: 28px; height: 56px; margin-left: -14px; mix-blend-mode: screen; filter: blur(.6px); }
                .ft-flame i { position: absolute; left: 50%; bottom: 0; transform-origin: 50% 100%; border-radius: 55% 55% 50% 50% / 78% 78% 28% 28%; animation: ft-dance .8s ease-in-out infinite alternate; }
                .ft-flame i:nth-child(1) { width: 28px; height: 56px; margin-left: -14px; background: radial-gradient(ellipse at 50% 85%, #ff9a22, #e0420f 70%, transparent); }
                .ft-flame i:nth-child(2) { width: 18px; height: 40px; margin-left: -9px; background: radial-gradient(ellipse at 50% 85%, #ffd35e, #ff9a22 75%, transparent); animation-delay: -.25s; }
                .ft-flame i:nth-child(3) { width: 9px; height: 24px; margin-left: -4.5px; background: radial-gradient(ellipse at 50% 85%, #fff6cf, #ffd35e 80%, transparent); animation-delay: -.5s; }
                .ft-cup { position: absolute; left: 50%; bottom: 0; width: 30px; height: 30px; margin-left: -15px; clip-path: polygon(0 0, 100% 0, 78% 100%, 22% 100%); background: linear-gradient(180deg, #8a7a66, #3a322a); }
                .ft-cup::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 6px; background: linear-gradient(180deg, #f6dc8a, #a9791c); }
                @keyframes ft-dance { 0% { transform: scale(1,1) skewX(-5deg); } 50% { transform: scale(.94,1.1) skewX(4deg); } 100% { transform: scale(1.04,.95) skewX(-3deg); } }
                @keyframes ft-flicker { 0%,100% { opacity: .6; scale: 1; } 40% { opacity: .95; scale: 1.1; } 70% { opacity: .75; scale: .96; } }

                /* content */
                .ft-name { position: relative; display: inline-block; isolation: isolate; line-height: 1.1; }
                .ft-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 6px #2e1706; text-shadow: 0 4px 0 #1f0f04, 0 8px 12px rgba(0,0,0,.45); }
                .ft-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: ft-shine 6s ease-in-out 1s infinite;
                }
                @keyframes ft-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }

                .ft-pill {
                    display: inline-block; padding: .55rem 1.5rem; border-radius: 10px; font-family: 'Lilita One', sans-serif; letter-spacing: .02em; color: #f3e2b4; text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: linear-gradient(180deg, #342d26, #17120e);
                    box-shadow: inset 0 0 0 2px rgba(202,164,61,.75), inset 0 2px 0 rgba(255,255,255,.08), 0 5px 10px rgba(0,0,0,.45);
                }
                .ft-pill b { color: #ffd35e; font-weight: 400; }

                .ft-divider { display: flex; align-items: center; justify-content: center; gap: .8rem; color: var(--gold); font-size: .75rem; }
                .ft-divider::before, .ft-divider::after { content: ""; height: 2px; width: min(30%, 12rem); background: linear-gradient(90deg, transparent, var(--gold)); }
                .ft-divider::after { background: linear-gradient(270deg, transparent, var(--gold)); }

                .ft-copy { color: var(--sub); font-weight: 700; font-size: .9rem; }

                .ft-top {
                    width: 3rem; height: 3rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; color: #fff;
                    background: linear-gradient(180deg, #d9433c, #8d1b19);
                    box-shadow: inset 0 0 0 2px #e4bb55, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 6px 8px rgba(0,0,0,.4);
                    transition: transform .12s, filter .15s;
                }
                .ft-top:hover { transform: translateY(-3px); filter: brightness(1.15); }
                .ft-top:active { transform: translateY(3px); }
                .ft-top:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .ft-top svg { animation: ft-bob 2s ease-in-out infinite; }
                @keyframes ft-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -3px; } }

                @media (prefers-reduced-motion: reduce) {
                    .fh-ft *, .fh-ft *::before, .fh-ft *::after { animation: none !important; transition: none !important; }
                }
            `}</style>

            <div className="ft-wall" aria-hidden="true" />
            <div className="ft-glow" aria-hidden="true" />
            <Torch className="hidden sm:block left-[6%] lg:left-[14%]" />
            <Torch className="hidden sm:block right-[6%] lg:right-[14%]" />

            <div className="relative z-10 max-w-7xl mx-auto text-center">

                <button type="button" onClick={toTop} className="ft-top" aria-label="Back to top">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 12 L9 5 L15 12" />
                    </svg>
                </button>

                <h2 className="ft-display text-3xl sm:text-4xl mt-6">
                    <span className="ft-name" data-text="Mohammad Abdullah Ansari">
                        <span>Mohammad Abdullah Ansari</span>
                    </span>
                </h2>

                <p className="mt-5">
                    <span className="ft-pill">
                        Full Stack Developer <b>|</b> DSA Solver
                    </span>
                </p>

                <div className="ft-divider mt-8" aria-hidden="true">◆</div>

                <p className="ft-copy mt-6">
                    © {new Date().getFullYear()} Mohammad Abdullah Ansari. All rights reserved.
                </p>

            </div>
        </footer>
    );
}

export default Footer;