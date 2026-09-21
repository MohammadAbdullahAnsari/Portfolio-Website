import { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

/*
  Props:
  image          main preview image (e.g. your GitHub social preview)
  fallbackImage  used if `image` fails to load (e.g. your own screenshot)
  category, title, description, technologies (array), github, demo
*/
function ProjectCard({
    image,
    fallbackImage,
    category,
    title,
    description,
    technologies = [],
    github,
    demo,
}) {
    const [src, setSrc] = useState(image || fallbackImage || null);
    const [broken, setBroken] = useState(!(image || fallbackImage));

    // the GitHub preview can arrive after the card first renders
    useEffect(() => {
        const next = image || fallbackImage || null;
        setSrc(next);
        setBroken(!next);
    }, [image, fallbackImage]);

    const handleError = () => {
        if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage);
        else setBroken(true);
    };

    const hasDemo = demo && demo !== "#";

    return (
        <article className="group h-full flex flex-col rounded-2xl border border-purple-500/25 bg-[#0a0f1f]/85 backdrop-blur p-3 sm:p-4 transition duration-300 hover:-translate-y-1.5 hover:border-purple-500/60 hover:shadow-[0_18px_45px_-15px_rgba(124,58,237,0.5)]">

            {/* Preview image */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#0d1224]">
                {broken ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-900/60 via-[#0d1224] to-indigo-900/40 px-4 text-center">
                        <span className="text-5xl font-extrabold text-white/15">
                            {title?.[0]?.toUpperCase() || "P"}
                        </span>
                        <span className="text-sm text-purple-200/70 line-clamp-1">{title}</span>
                    </div>
                ) : (
                    <img
                        src={src}
                        alt={`${title} preview`}
                        loading="lazy"
                        onError={handleError}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
            </div>

            {/* Title + category */}
            <div className="flex items-start justify-between gap-3 mt-4">
                <h3 className="text-xl font-semibold leading-tight break-words min-w-0">
                    {title}
                </h3>
                <span className="shrink-0 px-3.5 py-1.5 rounded-full text-sm bg-indigo-500/15 border border-indigo-400/20 text-indigo-200">
                    {category}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-[15px] leading-relaxed mt-2 line-clamp-2 min-h-[3rem]">
                {description}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2 mt-4">
                {technologies.map((t) => (
                    <span
                        key={t}
                        className="px-3 py-1.5 rounded-lg text-sm bg-indigo-500/10 border border-indigo-400/15 text-indigo-200"
                    >
                        {t}
                    </span>
                ))}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-5">
                <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#111827] border border-white/10 hover:border-purple-500/50 hover:bg-[#151d33] transition"
                >
                    <FaGithub className="text-lg" />
                    GitHub
                </a>

                {hasDemo ? (
                    <a
                        href={demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-purple-500/60 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 transition"
                    >
                        <FaExternalLinkAlt className="text-sm" />
                        Live Demo
                    </a>
                ) : (
                    <span
                        aria-disabled="true"
                        title="Live demo coming soon"
                        className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/10 text-gray-500 cursor-not-allowed"
                    >
                        <FaExternalLinkAlt className="text-sm" />
                        Live Demo
                    </span>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;