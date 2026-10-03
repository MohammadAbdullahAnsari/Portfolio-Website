import { useEffect, useRef, useState } from "react";
import {
    FaLinkedinIn,
    FaGithub,
    FaEnvelope,
    FaPaperPlane,
    FaDownload,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/*
  ============================================================================
  CONTACT — fantasy game-UI theme (matches Hero / Skills / Projects /
  dashboards)

  THEME: follows the same day/night switch as the Hero navbar. Hero sets
  document.documentElement.dataset.theme = "light" | "dark" and every colour
  here (sky, sun/moon, panel, inputs, text) reacts to it.

  The form logic (validation, honeypot, Web3Forms submit, status messages) is
  unchanged — only the look and effects are new.
  ============================================================================
*/

/* ---------- contact form settings ---------- */

// Get a free access key at https://web3forms.com (enter your email, the key is
// sent to your inbox), then put it in .env as VITE_WEB3FORMS_KEY=your_key
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const EMPTY = { name: "", email: "", message: "" };

function validate(values) {
    const errors = {};
    if (values.name.trim().length < 2) errors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
        errors.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10)
        errors.message = "Your message should be at least 10 characters.";
    return errors;
}

/* floating embers: [left %, size px, duration s, delay s, drift px] */
const EMBERS = [
    [4, 4, 14, 0, 30], [9, 3, 17, 3, -20], [15, 5, 12, 6, 24], [22, 3, 19, 1, -30],
    [29, 4, 15, 8, 18], [36, 3, 18, 4, -16], [43, 5, 13, 9, 26], [50, 3, 20, 2, -24],
    [57, 4, 16, 7, 20], [64, 3, 14, 5, -28], [71, 5, 18, 0, 22], [78, 3, 15, 10, -18],
    [85, 4, 17, 3, 28], [91, 3, 13, 6, -22], [96, 5, 19, 8, 16],
];

/* celebration sparks when the message is sent: [x px, y px, delay ms] */
const SPARKS = [
    [-90, -60, 0], [-50, -90, 40], [0, -100, 80], [50, -90, 20], [90, -60, 60],
    [-110, -10, 100], [110, -10, 30], [-70, 30, 70], [70, 30, 110], [0, 50, 50],
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
            className={`ct-reveal ${shown ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

/* ---------- component ---------- */

function Contact() {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [feedback, setFeedback] = useState("");

    useGoogleFonts();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
        if (status !== "idle" && status !== "sending") setStatus("idle");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === "sending") return;

        const found = validate(values);
        setErrors(found);
        if (Object.keys(found).length) return;

        // hidden honeypot: real people never tick it, bots often do
        if (e.currentTarget.elements.botcheck?.checked) {
            setValues(EMPTY);
            setStatus("success");
            setFeedback("Thanks! Your message has been sent.");
            return;
        }

        if (!ACCESS_KEY) {
            console.warn("Missing VITE_WEB3FORMS_KEY: contact form is not configured.");
            setStatus("error");
            setFeedback(
                "The contact form isn't set up yet. Please email me directly instead."
            );
            return;
        }

        setStatus("sending");
        setFeedback("");

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: ACCESS_KEY,
                    subject: `New portfolio message from ${values.name.trim()}`,
                    from_name: "Portfolio Contact Form",
                    name: values.name.trim(),
                    email: values.email.trim(),
                    message: values.message.trim(),
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setValues(EMPTY);
                setStatus("success");
                setFeedback("Thanks! Your message has been sent. I'll get back to you soon.");
            } else {
                setStatus("error");
                setFeedback(data.message || "Something went wrong. Please try again.");
            }
        } catch {
            // network problem: keep what the visitor typed
            setStatus("error");
            setFeedback("Couldn't send your message. Check your connection and try again.");
        }
    };

    return (
        <section id="contact" className="fh-ct relative overflow-hidden min-h-screen px-4 sm:px-6 md:px-8 pt-28 pb-28">
            <style>{`
                .fh-ct {
                    --text: #f6ecd2; --sub: #d9cba8; --muted: #a89877;
                    --tile-a: #403930; --tile-b: #1b1612; --tile-ring: rgba(130,118,100,.85); --tile-hi: rgba(255,255,255,.13);
                    --panel-a: rgba(36,30,26,.92); --panel-b: rgba(18,14,11,.94);
                    --field-a: #15110e; --field-b: #231d18; --line: rgba(246,220,138,.2);
                    --gold: #ffd35e; --err: #ff8a8a;
                    --ridge1: #2b2540; --ridge2: #1a1626; --stars: 1; --edge: rgba(5,3,2,.7);
                    font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
                    color: var(--text); background: #0e1230;
                }
                :root[data-theme="light"] .fh-ct {
                    --text: #3a210e; --sub: #5a3d25; --muted: #8a6c48;
                    --tile-a: #f8e9c8; --tile-b: #dcc08a; --tile-ring: #b78a36; --tile-hi: rgba(255,255,255,.75);
                    --panel-a: rgba(252,240,214,.94); --panel-b: rgba(236,214,166,.95);
                    --field-a: #e6d0a0; --field-b: #f6e8c8; --line: rgba(90,58,20,.25);
                    --gold: #a86a0a; --err: #b3201f;
                    --ridge1: #8a86a8; --ridge2: #5e5c7c; --stars: 0; --edge: rgba(60,30,10,.28);
                    background: #6db3e6;
                }
                .ct-display { font-family: 'Lilita One', 'Impact', sans-serif; letter-spacing: .02em; }

                /* ----- sky ----- */
                .ct-sky { position: absolute; inset: 0; z-index: 0; transition: opacity .7s ease; }
                .ct-night { background: linear-gradient(180deg, #0c1030 0%, #1d1f4d 38%, #432f50 70%, #8c4636 100%); opacity: 1; }
                .ct-day   { background: linear-gradient(180deg, #5faae2 0%, #9dcdee 40%, #f9dcae 78%, #f6b27a 100%); opacity: 0; }
                :root[data-theme="light"] .fh-ct .ct-night { opacity: 0; }
                :root[data-theme="light"] .fh-ct .ct-day { opacity: 1; }
                .ct-stars {
                    position: absolute; inset: 0 0 35% 0; z-index: 0; opacity: var(--stars); transition: opacity .7s;
                    background-image:
                        radial-gradient(1.5px 1.5px at 7% 18%, #fff, transparent), radial-gradient(1px 1px at 15% 52%, #ffe9b8, transparent),
                        radial-gradient(1.5px 1.5px at 24% 10%, #fff, transparent), radial-gradient(1px 1px at 33% 42%, #fff, transparent),
                        radial-gradient(2px 2px at 42% 22%, #ffe9b8, transparent), radial-gradient(1px 1px at 51% 62%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 60% 14%, #fff, transparent), radial-gradient(1px 1px at 68% 46%, #ffe9b8, transparent),
                        radial-gradient(2px 2px at 77% 28%, #fff, transparent), radial-gradient(1px 1px at 85% 9%, #fff, transparent),
                        radial-gradient(1.5px 1.5px at 94% 50%, #ffe9b8, transparent), radial-gradient(1px 1px at 3% 70%, #fff, transparent);
                    animation: ct-twinkle 4s ease-in-out infinite alternate;
                }
                @keyframes ct-twinkle { from { filter: brightness(.7); } to { filter: brightness(1.3); } }
                .ct-orb {
                    position: absolute; z-index: 0; top: 6%; right: 7%; width: 76px; height: 76px; border-radius: 9999px;
                    background: radial-gradient(circle at 35% 35%, #fffbe8, #e9dfb8 60%, #bdb38a);
                    box-shadow: 0 0 40px 14px rgba(255,244,200,.35), 0 0 120px 40px rgba(180,190,255,.2);
                    transition: background .7s, box-shadow .7s; animation: ct-orb 8s ease-in-out infinite;
                }
                :root[data-theme="light"] .fh-ct .ct-orb {
                    background: radial-gradient(circle at 40% 40%, #fff9d0, #ffd35e 60%, #f5a623);
                    box-shadow: 0 0 50px 20px rgba(255,214,90,.6), 0 0 150px 60px rgba(255,190,80,.35);
                }
                @keyframes ct-orb { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
                .ct-ridges { position: absolute; left: -3%; right: -3%; bottom: 0; height: 34%; z-index: 0; pointer-events: none; }
                .ct-ridges path { transition: fill .7s; }
                .ct-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 40%, transparent 50%, var(--edge) 100%); }
                .ct-ember {
                    position: absolute; z-index: 2; bottom: -12px; border-radius: 9999px; pointer-events: none; opacity: 0;
                    background: radial-gradient(circle, #ffe08a 0%, #ff9a22 50%, transparent 72%);
                    box-shadow: 0 0 8px 2px rgba(255,150,40,.7);
                    animation: ct-rise var(--dur) linear var(--del) infinite;
                }
                :root[data-theme="light"] .fh-ct .ct-ember { animation: none; opacity: 0 !important; }
                @keyframes ct-rise {
                    0% { opacity: 0; transform: translate(0,0); } 10% { opacity: .9; } 85% { opacity: .7; }
                    100% { opacity: 0; transform: translate(var(--dx), -105vh); }
                }

                /* ----- sign ----- */
                .ct-sign {
                    position: relative; display: inline-block; padding: 1rem 2.6rem 1.15rem; border-radius: 12px; transform-origin: 50% -2.2rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 2px, transparent 2px 42px), linear-gradient(180deg, #6e4729, #3b2310);
                    box-shadow: inset 0 0 0 3px #d4ab45, inset 0 4px 0 rgba(255,255,255,.14), 0 12px 20px rgba(0,0,0,.45);
                    animation: ct-swing 6s ease-in-out infinite;
                }
                @keyframes ct-swing { 0%,100% { rotate: -.9deg; } 50% { rotate: .9deg; } }
                .ct-chain { position: absolute; top: -2.4rem; width: 3px; height: 2.6rem; background: repeating-linear-gradient(180deg, #d4ab45 0 6px, #7a5516 6px 9px); }
                .ct-name { position: relative; display: block; isolation: isolate; text-transform: uppercase; line-height: 1.05; }
                .ct-name::before { content: attr(data-text); position: absolute; inset: 0; z-index: -1; -webkit-text-stroke: 8px #2e1706; text-shadow: 0 5px 0 #1f0f04, 0 10px 14px rgba(0,0,0,.5); }
                .ct-name span {
                    color: transparent; -webkit-background-clip: text; background-clip: text;
                    background-image: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.95) 50%, transparent 62%), linear-gradient(180deg, #ffe88f 0%, #f7b92c 50%, #d98511 100%);
                    background-size: 250% 100%, 100% 100%; background-repeat: no-repeat; background-position: 160% 0, 0 0;
                    animation: ct-shine 5s ease-in-out 1s infinite;
                }
                @keyframes ct-shine { 0% { background-position: 160% 0, 0 0; } 40%, 100% { background-position: -60% 0, 0 0; } }
                .ct-rivets { position: relative; }
                .ct-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 2;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .ct-sub { color: var(--sub); text-shadow: 0 1px 4px rgba(0,0,0,.35); }
                :root[data-theme="light"] .fh-ct .ct-sub { text-shadow: 0 1px 0 rgba(255,255,255,.5); }

                /* ----- panel ----- */
                .ct-reveal { opacity: 0; transform: translateY(26px) scale(.97); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.56,.64,1); }
                .ct-reveal.is-in { opacity: 1; transform: none; }
                .ct-panel {
                    position: relative; border-radius: 22px; color: var(--text);
                    background: radial-gradient(circle at 20% 0%, var(--tile-hi), transparent 45%), linear-gradient(180deg, var(--panel-a), var(--panel-b));
                    box-shadow: 0 0 0 4px #4d3019, 0 0 0 7px #d4ab45, 0 0 0 9px #4d3019, 0 24px 40px rgba(0,0,0,.5), inset 0 3px 0 var(--tile-hi);
                    transition: background .5s;
                }
                .ct-divider { border-color: var(--line); }
                .ct-text { color: var(--sub); }
                .ct-muted { color: var(--muted); }
                .ct-gold { color: var(--gold); }

                .ct-icon-box {
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 3.5rem; height: 3.5rem; border-radius: 14px; color: #ffe08a; font-size: 1.3rem;
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 22px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 2px #caa43d, inset 0 2px 0 rgba(255,255,255,.14), 0 4px 6px rgba(0,0,0,.4);
                    transition: transform .15s, filter .15s;
                }
                .ct-icon-box:hover { transform: translateY(-3px) rotate(-4deg); filter: brightness(1.2); }
                .ct-email { color: var(--text); font-weight: 800; white-space: nowrap; transition: color .15s; }
                @media (max-width: 420px) { .ct-email { white-space: normal; overflow-wrap: anywhere; font-size: .95rem; } }
                .ct-email:hover { color: var(--gold); }

                .ct-tile {
                    width: 4rem; height: 4rem; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: var(--text); position: relative;
                    background: linear-gradient(180deg, var(--tile-a), var(--tile-b));
                    box-shadow: inset 0 0 0 2px var(--tile-ring), inset 0 2px 0 var(--tile-hi), inset 0 -4px 6px rgba(0,0,0,.4), 0 6px 12px rgba(0,0,0,.4);
                    transition: transform .18s, box-shadow .18s;
                }
                .ct-tile:hover { transform: translateY(-5px) scale(1.05); box-shadow: inset 0 0 0 2px #e9b84a, inset 0 2px 0 var(--tile-hi), 0 0 20px rgba(255,160,40,.55), 0 10px 14px rgba(0,0,0,.5); }
                .ct-tile:active { transform: translateY(0) scale(.97); }

                .ct-btn {
                    position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: .7rem; padding: .95rem 2rem; border-radius: 10px; color: #fff;
                    font-family: 'Lilita One', sans-serif; font-size: 1.2rem; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    transition: transform .12s, filter .15s, box-shadow .12s;
                }
                .ct-btn:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-2px); }
                .ct-btn:active:not(:disabled) { transform: translateY(5px); }
                .ct-btn:disabled { opacity: .75; cursor: not-allowed; }
                .ct-btn:focus-visible, .ct-tile:focus-visible, .ct-icon-box:focus-visible, .ct-email:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .ct-red { background: linear-gradient(180deg, #d9433c 0%, #a02220 55%, #7d1614 100%); box-shadow: inset 0 0 0 3px #d9ae45, inset 0 4px 0 rgba(255,255,255,.3), 0 6px 0 #4e0c0b, 0 12px 16px rgba(0,0,0,.45); }
                .ct-dark { background: linear-gradient(180deg, #34302b 0%, #1a1612 60%, #100d0a 100%); box-shadow: inset 0 0 0 3px #caa43d, inset 0 4px 0 rgba(255,255,255,.12), 0 6px 0 #070504, 0 12px 16px rgba(0,0,0,.45); }
                .ct-red:active:not(:disabled) { box-shadow: inset 0 0 0 3px #d9ae45, inset 0 4px 0 rgba(255,255,255,.3), 0 1px 0 #4e0c0b, 0 4px 8px rgba(0,0,0,.45); }
                .ct-dark:active:not(:disabled) { box-shadow: inset 0 0 0 3px #caa43d, inset 0 4px 0 rgba(255,255,255,.12), 0 1px 0 #070504, 0 4px 8px rgba(0,0,0,.45); }
                .ct-shine::after { content: ""; position: absolute; top: 0; left: -80%; width: 40%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,235,170,.55), transparent); transform: skewX(-20deg); animation: ct-sheen 4.2s ease-in-out 1.5s infinite; pointer-events: none; }
                @keyframes ct-sheen { 0% { left: -80%; } 35%, 100% { left: 140%; } }
                .ct-spin { width: 1rem; height: 1rem; border-radius: 9999px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; animation: ct-rot .8s linear infinite; }
                @keyframes ct-rot { to { transform: rotate(360deg); } }

                /* ----- character ----- */
                .ct-hero { position: relative; flex-shrink: 0; width: 11rem; }
                @media (min-width: 640px) { .ct-hero { width: 13rem; } }
                .ct-hero img { position: relative; z-index: 1; width: 100%; user-select: none; animation: ct-float 5s ease-in-out infinite; filter: drop-shadow(0 12px 14px rgba(0,0,0,.45)); }
                .ct-hero::before { content: ""; position: absolute; left: 50%; top: 55%; width: 120%; aspect-ratio: 1; translate: -50% -50%; border-radius: 9999px; background: radial-gradient(circle, rgba(255,160,50,.45), transparent 65%); animation: ct-glow 3.4s ease-in-out infinite; }
                :root[data-theme="light"] .fh-ct .ct-hero::before { background: radial-gradient(circle, rgba(255,220,120,.6), transparent 65%); }
                .ct-hero::after { content: ""; position: absolute; left: 12%; right: 12%; bottom: -6px; height: 14px; border-radius: 9999px; background: radial-gradient(closest-side, rgba(0,0,0,.5), transparent); animation: ct-shadow 5s ease-in-out infinite; }
                @keyframes ct-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -10px; } }
                @keyframes ct-shadow { 0%,100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(.85); opacity: .7; } }
                @keyframes ct-glow { 0%,100% { opacity: .65; scale: 1; } 50% { opacity: 1; scale: 1.08; } }

                .ct-hint-text { font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.35rem; color: var(--gold); rotate: -6deg; margin-top: -.25rem; }
                .ct-hint svg { animation: ct-nudge 1.8s ease-in-out infinite; }
                @keyframes ct-nudge { 0%,100% { translate: 0 0; } 50% { translate: -4px 3px; } }

                /* ----- form ----- */
                .ct-label { display: block; margin-bottom: .5rem; font-family: 'Lilita One', sans-serif; letter-spacing: .02em; font-size: 1.05rem; color: var(--text); }
                .ct-field {
                    width: 100%; padding: .95rem 1.2rem; border-radius: 12px; color: var(--text); font-weight: 700; outline: none;
                    background: linear-gradient(180deg, var(--field-a), var(--field-b));
                    box-shadow: inset 0 0 0 2px rgba(212,171,69,.55), inset 0 4px 8px rgba(0,0,0,.45);
                    transition: box-shadow .2s, background .5s;
                }
                .ct-field::placeholder { color: var(--muted); font-weight: 600; }
                .ct-field:focus { box-shadow: inset 0 0 0 2px #ffd35e, inset 0 4px 8px rgba(0,0,0,.45), 0 0 18px rgba(255,190,60,.5); }
                .ct-field.bad { box-shadow: inset 0 0 0 2px #e5484d, inset 0 4px 8px rgba(0,0,0,.45); }
                .ct-field.bad:focus { box-shadow: inset 0 0 0 2px #ff6b6b, inset 0 4px 8px rgba(0,0,0,.45), 0 0 18px rgba(255,90,90,.45); }
                .ct-field:disabled { opacity: .7; }
                .ct-err { margin-top: .5rem; font-size: .9rem; font-weight: 800; color: var(--err); animation: ct-shake .35s; }
                @keyframes ct-shake { 0%,100% { translate: 0 0; } 25% { translate: -5px 0; } 75% { translate: 5px 0; } }

                .ct-msg { display: flex; align-items: flex-start; gap: .75rem; padding: 1rem 1.1rem; border-radius: 12px; font-weight: 800; font-size: .92rem; animation: ct-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
                .ct-ok { color: #e6ffe6; background: linear-gradient(180deg, #2f7a3d, #1d5228); box-shadow: inset 0 0 0 2px #d4ab45, 0 6px 10px rgba(0,0,0,.4); }
                .ct-bad { color: #ffe6e6; background: linear-gradient(180deg, #b32f2c, #771615); box-shadow: inset 0 0 0 2px #d4ab45, 0 6px 10px rgba(0,0,0,.4); }
                @keyframes ct-pop { from { opacity: 0; transform: translateY(14px) scale(.9); } to { opacity: 1; transform: none; } }
                .ct-spark { position: absolute; left: 50%; top: 40%; width: 8px; height: 8px; border-radius: 9999px; pointer-events: none; background: radial-gradient(circle, #fff3b0, #ff9a22 60%, transparent 72%); box-shadow: 0 0 8px 2px rgba(255,170,50,.8); opacity: 0; animation: ct-burst 1s ease-out var(--d) forwards; }
                @keyframes ct-burst { 0% { opacity: 1; transform: translate(0,0) scale(1); } 100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(.3); } }

                @media (prefers-reduced-motion: reduce) {
                    .fh-ct *, .fh-ct *::before, .fh-ct *::after { animation: none !important; transition: none !important; }
                    .ct-reveal { opacity: 1; transform: none; }
                    .ct-ember { display: none; }
                }
            `}</style>

            {/* ---------------- BACKGROUND ---------------- */}
            <div className="ct-sky ct-night" />
            <div className="ct-sky ct-day" />
            <div className="ct-stars" aria-hidden="true" />
            <div className="ct-orb" aria-hidden="true" />
            <svg className="ct-ridges" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
                <path style={{ fill: "var(--ridge1)" }} opacity=".85" d="M0 230 L120 180 L220 225 L350 140 L460 215 L590 160 L720 235 L850 170 L980 225 L1110 130 L1230 205 L1340 165 L1440 215 L1440 400 L0 400 Z" />
                <path style={{ fill: "var(--ridge2)" }} d="M0 320 L100 285 L200 322 L320 265 L440 325 L580 280 L720 335 L870 285 L1020 330 L1150 275 L1280 328 L1380 295 L1440 322 L1440 400 L0 400 Z" />
            </svg>
            <div className="ct-vignette" />
            {EMBERS.map(([l, s, d, dl, dx], i) => (
                <span
                    key={i}
                    className="ct-ember"
                    aria-hidden="true"
                    style={{ left: `${l}%`, width: s, height: s, "--dur": `${d}s`, "--del": `${dl}s`, "--dx": `${dx}px` }}
                />
            ))}

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Section Heading */}
                <Reveal>
                    <div className="text-center mb-14 pt-10">
                        <div className="ct-sign ct-rivets">
                            <span className="ct-chain" style={{ left: "16%" }} />
                            <span className="ct-chain" style={{ right: "16%" }} />
                            <h2 className="ct-display text-4xl sm:text-5xl lg:text-6xl">
                                <span className="ct-name" data-text="Contact Me"><span>Contact Me</span></span>
                            </h2>
                        </div>

                        <p className="ct-sub max-w-2xl mx-auto mt-8 text-base sm:text-lg font-semibold leading-relaxed">
                            Have a project idea, question, or just want to connect?
                            Feel free to reach out.
                        </p>
                    </div>
                </Reveal>

                {/* Contact Box */}
                <Reveal delay={100}>
                    <div className="ct-panel p-6 md:p-10">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

                            {/* LEFT SIDE */}
                            <div className="flex flex-col justify-center">

                                {/* Character + text row */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                    {/* Character Image (save your character as public/contactpic2.png) */}
                                    <div className="ct-hero">
                                        <img
                                            src="/contactpic2.png"
                                            alt="Developer character with laptop"
                                            draggable="false"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="text-center sm:text-left">
                                        <h3 className="ct-display text-4xl md:text-5xl leading-tight">
                                            Let's <span className="ct-gold">Connect</span>
                                        </h3>

                                        <p className="ct-text text-base leading-relaxed mt-4 max-w-md font-semibold">
                                            I'm always open to discussing new projects,
                                            opportunities, collaborations, or just talking
                                            about tech and ideas.
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-8">

                                    <a
                                        href="mailto:ansari.abdullah8381@gmail.com"
                                        className="ct-icon-box"
                                        aria-label="Send an email"
                                    >
                                        <FaEnvelope />
                                    </a>

                                    <div className="text-left min-w-0 flex-1 xl:flex-none">
                                        <p className="ct-muted text-sm font-bold">Drop an Email</p>
                                        <a
                                            href="mailto:ansari.abdullah8381@gmail.com"
                                            className="ct-email text-base md:text-lg"
                                        >
                                            ansari.abdullah8381@gmail.com
                                        </a>
                                    </div>

                                    {/* "Click to Email" hand-drawn hint (hidden on small screens) */}
                                    <div className="ct-hint hidden xl:flex shrink-0 flex-col items-start -ml-1 select-none" aria-hidden="true">
                                        <svg
                                            width="90"
                                            height="34"
                                            viewBox="0 0 90 34"
                                            fill="none"
                                            stroke="currentColor"
                                            className="ct-gold"
                                            strokeWidth="1.6"
                                            strokeDasharray="4 4"
                                            strokeLinecap="round"
                                        >
                                            <path d="M84 30 C 80 4, 52 -4, 40 14" />
                                            <path d="M46 6 L38 15 L50 18" strokeDasharray="0" />
                                        </svg>
                                        <span className="ct-hint-text">Click to Email</span>
                                    </div>
                                </div>

                                {/* Social Icons */}
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-9">

                                    <a href="#" aria-label="LinkedIn" className="ct-tile">
                                        <span className="w-9 h-9 rounded-md bg-[#0a66c2] flex items-center justify-center text-white">
                                            <FaLinkedinIn className="text-xl" />
                                        </span>
                                    </a>

                                    <a
                                        href="https://github.com/MohammadAbdullahAnsari"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                        className="ct-tile"
                                    >
                                        <FaGithub className="text-3xl" />
                                    </a>

                                    <a href="#" aria-label="X" className="ct-tile">
                                        <FaXTwitter className="text-2xl" />
                                    </a>

                                    {/* 4th icon: swap href / icon for your own platform */}
                                    <a href="#" aria-label="Portfolio profile" className="ct-tile">
                                        <span className="w-6 h-6 rotate-45 rounded-md border-[5px] border-amber-400" />
                                    </a>

                                </div>

                                {/* Download CV */}
                                <a
                                    href="/resume.pdf"
                                    download
                                    className="ct-btn ct-dark mt-8 w-full sm:w-72"
                                >
                                    <FaDownload className="text-amber-300" />
                                    Download CV
                                </a>

                            </div>

                            {/* RIGHT SIDE - FORM */}
                            <div className="md:border-l ct-divider md:pl-16">

                                <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                                    <div>
                                        <label htmlFor="contact-name" className="ct-label">
                                            Your Name
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Enter your name"
                                            value={values.name}
                                            onChange={handleChange}
                                            disabled={status === "sending"}
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? "err-name" : undefined}
                                            className={`ct-field ${errors.name ? "bad" : ""}`}
                                        />
                                        {errors.name && (
                                            <p id="err-name" className="ct-err">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="contact-email" className="ct-label">
                                            Your Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Enter your email"
                                            value={values.email}
                                            onChange={handleChange}
                                            disabled={status === "sending"}
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? "err-email" : undefined}
                                            className={`ct-field ${errors.email ? "bad" : ""}`}
                                        />
                                        {errors.email && (
                                            <p id="err-email" className="ct-err">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="contact-message" className="ct-label">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows="6"
                                            placeholder="Write your message..."
                                            value={values.message}
                                            onChange={handleChange}
                                            disabled={status === "sending"}
                                            aria-invalid={!!errors.message}
                                            aria-describedby={errors.message ? "err-message" : undefined}
                                            className={`ct-field resize-none ${errors.message ? "bad" : ""}`}
                                        ></textarea>
                                        {errors.message && (
                                            <p id="err-message" className="ct-err">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* spam trap: hidden from people, bots fill it in */}
                                    <input
                                        type="checkbox"
                                        name="botcheck"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        className="hidden"
                                        style={{ display: "none" }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="ct-btn ct-red ct-shine w-full md:w-auto"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <span className="ct-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Send Message
                                            </>
                                        )}
                                    </button>

                                    {/* result message */}
                                    <div role="status" aria-live="polite" className="relative">
                                        {status === "success" && (
                                            <>
                                                <p className="ct-msg ct-ok">
                                                    <FaCheckCircle className="mt-0.5 shrink-0 text-lg" />
                                                    {feedback}
                                                </p>
                                                {SPARKS.map(([x, y, d], i) => (
                                                    <span
                                                        key={i}
                                                        className="ct-spark"
                                                        aria-hidden="true"
                                                        style={{ "--x": `${x}px`, "--y": `${y}px`, "--d": `${d}ms` }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                        {status === "error" && (
                                            <p className="ct-msg ct-bad">
                                                <FaExclamationCircle className="mt-0.5 shrink-0 text-lg" />
                                                {feedback}
                                            </p>
                                        )}
                                    </div>

                                </form>

                            </div>

                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}

export default Contact;