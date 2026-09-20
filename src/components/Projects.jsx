import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const projectImages = {
        "DSA-Problems": "/projects/DsaProblems.png",
        "File-Fusion": "/projects/Filefusion.png",
        "Portfolio-Website": "/projects/portfolio-website.png",
    };

    useEffect(() => {
        fetch("https://api.github.com/users/MohammadAbdullahAnsari/repos")
            .then((response) => response.json())
            .then((data) => {
                setRepos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("GitHub API Error:", error);
                setLoading(false);
            });
    }, []);
    const getProjectImage = (repo) => {
        return `https://opengraph.githubassets.com/1/MohammadAbdullahAnsari/${repo.name}`;
    };
    return (
        <section
            id="projects"
            className="min-h-screen w-full bg-[#070b17] text-white px-5 md:px-8 py-20"
        >
            <div className="max-w-7xl mx-auto">

                <p className="text-center text-purple-400 font-medium tracking-widest">
                    MY WORK
                </p>

                <h2 className="text-center text-5xl md:text-6xl font-bold mt-3">
                    Pro
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        jects
                    </span>
                </h2>

                <p className="text-center text-gray-400 max-w-2xl mx-auto mt-5">
                    Here are some of the projects I've built. Each project represents
                    my learning, problem-solving skills, and passion for development.
                </p>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">

                    <button className="px-6 py-2 rounded-full bg-purple-600 text-white">
                        All
                    </button>

                    <button className="px-6 py-2 rounded-full bg-[#111827] border border-purple-500/20 text-gray-300 hover:border-purple-500/50 transition">
                        Web Apps
                    </button>

                    <button className="px-6 py-2 rounded-full bg-[#111827] border border-purple-500/20 text-gray-300 hover:border-purple-500/50 transition">
                        React
                    </button>

                    <button className="px-6 py-2 rounded-full bg-[#111827] border border-purple-500/20 text-gray-300 hover:border-purple-500/50 transition">
                        Full Stack
                    </button>

                    <button className="px-6 py-2 rounded-full bg-[#111827] border border-purple-500/20 text-gray-300 hover:border-purple-500/50 transition">
                        Other
                    </button>

                </div>

                {/* Projects */}
                <div className="relative mt-12">

                    {/* Left Button */}
                    <button
                        onClick={() => {
                            document
                                .getElementById("projects-slider")
                                .scrollBy({ left: -400, behavior: "smooth" });
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full bg-purple-600 text-white
        hover:bg-purple-500 transition shadow-lg"
                    >
                        ←
                    </button>

                    {/* Projects */}
                    <div
                        id="projects-slider"
                        className="flex gap-8 overflow-x-auto scroll-smooth px-14
        [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: "none" }}
                    >

                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                className="min-w-[85%] md:min-w-[45%] lg:min-w-[31%]"
                            >
                                <ProjectCard
                                    image={projectImages[repo.name] || "/projects/default.png"}
                                    category={repo.language || "Other"}
                                    title={repo.name}
                                    description={repo.description || "No description available."}
                                    technologies={[repo.language || "Other"]}
                                    github={repo.html_url}
                                    demo="#"
                                />
                            </div>
                        ))}

                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => {
                            document
                                .getElementById("projects-slider")
                                .scrollBy({ left: 400, behavior: "smooth" });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10
        w-10 h-10 rounded-full bg-purple-600 text-white
        hover:bg-purple-500 transition shadow-lg"
                    >
                        →
                    </button>

                </div>

            </div>
        </section>
    );
}

export default Projects;