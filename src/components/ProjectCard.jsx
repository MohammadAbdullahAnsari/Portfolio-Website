import { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";

/*
  Fantasy game-UI project card (matches Hero / Skills / Projects).
  Follows the global day/night switch via  document.documentElement.dataset.theme.

  Props are the same as before:
    image, fallbackImage, category, title, description, technologies[], github, demo
  Image order: image -> fallbackImage -> built-in placeholder.
  If there is no live demo (demo is empty or "#") the Live Demo button is hidden.
*/

function ProjectCard({ image, fallbackImage, category, title, description, technologies = [], github, demo }) {
    const [src, setSrc] = useState(image || fallbackImage || "");
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setSrc(image || fallbackImage || "");
        setFailed(false);
    }, [image, fallbackImage]);

    const onImgError = () => {
        if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage);
        else setFailed(true);
    };

    const hasDemo = demo && demo !== "#";

    return (
        <article className="pc-card">
            <style>{`
                .pc-card {
                    --text: #f6ecd2; --sub: #d9cba8;
                    --tile-a: #403930; --tile-b: #1b1612; --tile-ring: rgba(130,118,100,.85); --tile-hi: rgba(255,255,255,.13);
                    position: relative; display: flex; flex-direction: column; height: 100%; padding: 10px 10px 14px; border-radius: 18px;
                    background: radial-gradient(circle at 25% 0%, var(--tile-hi), transparent 50%), linear-gradient(160deg, var(--tile-a), var(--tile-b));
                    box-shadow: inset 0 0 0 2px var(--tile-ring), inset 0 3px 0 var(--tile-hi), inset 0 -6px 10px rgba(0,0,0,.3), 0 12px 20px rgba(0,0,0,.45);
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, background .5s;
                }
                :root[data-theme="light"] .pc-card {
                    --text: #3a210e; --sub: #5a3d25;
                    --tile-a: #f8e9c8; --tile-b: #dcc08a; --tile-ring: #b78a36; --tile-hi: rgba(255,255,255,.75);
                }
                @media (hover: hover) {
                    .pc-card:hover { transform: translateY(-8px); box-shadow: inset 0 0 0 2px #f0c24f, inset 0 3px 0 var(--tile-hi), 0 0 28px rgba(255,170,50,.45), 0 18px 24px rgba(0,0,0,.5); }
                    .pc-card:hover .pc-img { transform: scale(1.07); }
                }
                .pc-rivets::before {
                    content: ""; position: absolute; inset: 5px; pointer-events: none; z-index: 3;
                    background:
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right top / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) left bottom / 9px 9px no-repeat,
                        radial-gradient(circle, #f6dc8a 0 1.8px, #6b4a14 2.4px 3.2px, transparent 3.6px) right bottom / 9px 9px no-repeat;
                }
                .pc-shot { position: relative; aspect-ratio: 16 / 10; padding: 4px; border-radius: 12px; background: linear-gradient(135deg, #fbe28a, #c28a25 45%, #f3cf70 70%, #8c5f12); box-shadow: 0 6px 10px rgba(0,0,0,.4); }
                .pc-shot-in { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 8px; background: linear-gradient(135deg, #2a2350, #12102a); }
                .pc-shot-in::after { content: ""; position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 26px rgba(0,0,0,.5); }
                .pc-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(.22,1,.36,1); }
                .pc-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(246,220,138,.7); font-size: 2.6rem; background: radial-gradient(circle at 50% 40%, rgba(255,160,50,.25), transparent 65%); }
                .pc-tag {
                    position: absolute; z-index: 4; top: 14px; left: 0; padding: .28rem 1.3rem .28rem .8rem; color: #fff;
                    font-family: 'Lilita One', sans-serif; font-size: .85rem; letter-spacing: .03em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    clip-path: polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%);
                    background: linear-gradient(180deg, #d9433c, #8d1b19);
                    box-shadow: inset 0 2px 0 rgba(255,255,255,.3);
                }
                .pc-glare { position: absolute; inset: 0; z-index: 2; overflow: hidden; pointer-events: none; }
                .pc-glare::before { content: ""; position: absolute; top: 0; left: -70%; width: 35%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,240,190,.45), transparent); transform: skewX(-18deg); }
                .pc-card:hover .pc-glare::before { animation: pc-sweep .9s ease-out; }
                @keyframes pc-sweep { to { left: 160%; } }

                .pc-title { font-family: 'Lilita One', sans-serif; font-size: 1.45rem; line-height: 1.15; letter-spacing: .02em; text-transform: capitalize; color: var(--text); text-shadow: 0 2px 0 rgba(0,0,0,.25); }
                .pc-desc { color: var(--sub); font-family: 'Nunito', system-ui, sans-serif; font-weight: 600; font-size: .95rem; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                .pc-chip {
                    padding: .15rem .65rem; border-radius: 6px; font-family: 'Lilita One', sans-serif; font-size: .78rem; color: #f8e9c2; text-shadow: 0 2px 0 rgba(0,0,0,.7);
                    background: repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 2px, transparent 2px 22px), linear-gradient(180deg, #6b4428, #3b2310);
                    box-shadow: inset 0 0 0 1.5px #caa43d, inset 0 2px 0 rgba(255,255,255,.14), 0 2px 4px rgba(0,0,0,.4);
                }
                .pc-btn {
                    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .7rem 1rem; border-radius: 10px; color: #fff;
                    font-family: 'Lilita One', sans-serif; font-size: 1rem; letter-spacing: .02em; text-shadow: 0 2px 0 rgba(0,0,0,.6);
                    transition: transform .12s, filter .15s, box-shadow .12s;
                }
                .pc-btn:hover { filter: brightness(1.14); transform: translateY(-2px); }
                .pc-btn:active { transform: translateY(4px); }
                .pc-btn:focus-visible { outline: 3px solid #ffd978; outline-offset: 3px; }
                .pc-btn-dark { background: linear-gradient(180deg, #34302b, #1a1612 60%, #100d0a); box-shadow: inset 0 0 0 2px #caa43d, inset 0 3px 0 rgba(255,255,255,.12), 0 4px 0 #070504, 0 8px 10px rgba(0,0,0,.4); }
                .pc-btn-red { background: linear-gradient(180deg, #d9433c, #a02220 55%, #7d1614); box-shadow: inset 0 0 0 2px #d9ae45, inset 0 3px 0 rgba(255,255,255,.3), 0 4px 0 #4e0c0b, 0 8px 10px rgba(0,0,0,.4); }

                @media (prefers-reduced-motion: reduce) {
                    .pc-card, .pc-img, .pc-btn { transition: none !important; }
                    .pc-card:hover .pc-glare::before { animation: none; }
                }
            `}</style>

            <div className="pc-shot pc-rivets">
                <div className="pc-shot-in">
                    {src && !failed ? (
                        <img className="pc-img" src={src} alt={`${title} preview`} loading="lazy" onError={onImgError} />
                    ) : (
                        <div className="pc-empty" aria-hidden="true"><FaCode /></div>
                    )}
                    <div className="pc-glare" />
                </div>
                {category && <span className="pc-tag">{category}</span>}
            </div>

            <div className="flex flex-col flex-1 px-2 pt-4">
                <h3 className="pc-title">{title}</h3>
                <p className="pc-desc mt-2">{description}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                    {technologies.map((t) => (
                        <span key={t} className="pc-chip">{t}</span>
                    ))}
                </div>

                <div className="flex gap-3 mt-auto pt-5">
                    <a href={github} target="_blank" rel="noopener noreferrer" className="pc-btn pc-btn-dark">
                        <FaGithub /> Code
                    </a>
                    {hasDemo && (
                        <a href={demo} target="_blank" rel="noopener noreferrer" className="pc-btn pc-btn-red">
                            <FaExternalLinkAlt className="text-sm" /> Live Demo
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;