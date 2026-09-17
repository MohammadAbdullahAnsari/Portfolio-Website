import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
function ProjectCard({
    image,
    category,
    title,
    description,
    technologies,
    github,
    demo
}) {
    return (
        <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl overflow-hidden hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition duration-300">

            {/* Project Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
            />

            <div className="p-6">

                {/* Category */}
                <p className="text-sm text-purple-400">
                    {category}
                </p>

                {/* Title */}
                <h3 className="text-2xl font-semibold mt-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mt-3">
                    {description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-5">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">

                    <a
                        href={github}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                    >
                        <FaGithub />
                        GitHub
                    </a>

                    <a
                        href={demo}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 transition"
                    >
                        <FaExternalLinkAlt />
                        Live Demo
                    </a>

                </div>
            </div>
        </div>
    );
}

export default ProjectCard;