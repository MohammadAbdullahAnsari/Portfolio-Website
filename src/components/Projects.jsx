import ProjectCard from "./ProjectCard";
function Projects() {
    return (
        <section
            id="projects"
            className="min-h-screen bg-[#070b17] text-white px-5 md:px-8 py-20"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

                    <ProjectCard
                        image="/project1.png"
                        category="Web App"
                        title="My Project"
                        description="A short description of what this project does and the problem it solves."
                        technologies={["React", "Tailwind CSS", "JavaScript"]}
                        github="#"
                        demo="#"
                    />

                    <ProjectCard
                        image="/project1.png"
                        category="Web App"
                        title="My Project"
                        description="A short description of what this project does and the problem it solves."
                        technologies={["React", "Tailwind CSS", "JavaScript"]}
                        github="#"
                        demo="#"
                    />
                    <ProjectCard
                        image="/project1.png"
                        category="Web App"
                        title="My Project"
                        description="A short description of what this project does and the problem it solves."
                        technologies={["React", "Tailwind CSS", "JavaScript"]}
                        github="#"
                        demo="#"
                    />

                </div>
            </div>
        </section>
    );
}

export default Projects;