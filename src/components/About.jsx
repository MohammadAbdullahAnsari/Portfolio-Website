import { FaReact, FaNodeJs, FaGitAlt, FaCode, FaGraduationCap, FaChartBar } from "react-icons/fa";
import { SiJavascript, SiTailwindcss } from "react-icons/si";

function About() {
    return (
        <section
            id="about"
            className="min-h-screen relative overflow-hidden bg-[#0b1020] text-white px-5 md:px-8 py-20"
            
        >
            
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center">
                    About{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        Me
                    </span>
                </h2>
                <p className="mt-4 text-gray-400 max-w-2xl">
                    A passionate developer focused on building modern web applications
                    and solving challenging problems with code.
                </p>

                <div className="mt-12 grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h3 className="text-2xl font-semibold">
                            Who I Am
                        </h3>

                        <p className="mt-4 text-gray-400 leading-relaxed">
                            I am a Full Stack Developer and DSA enthusiast who enjoys creating
                            responsive, user-friendly applications and improving problem-solving
                            skills through competitive programming.
                        </p>
                        <p className="mt-4 text-gray-400 leading-relaxed">
                            I enjoy learning new technologies, building real-world projects,
                            and continuously improving my problem-solving skills.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-purple-500/10">
                                    <FaGraduationCap className="text-2xl text-purple-400" />
                                </div>

                                <div>
                                    <h4 className="font-semibold">Student</h4>
                                    <p className="text-sm text-gray-400">
                                        Always Learning
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-indigo-500/10">
                                    <FaCode className="text-2xl text-indigo-400" />
                                </div>

                                <div>
                                    <h4 className="font-semibold">Developer</h4>
                                    <p className="text-sm text-gray-400">
                                        Building Solutions
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-purple-500/10">
                                    <FaChartBar className="text-2xl text-purple-400" />
                                </div>

                                <div>
                                    <h4 className="font-semibold">Problem Solver</h4>
                                    <p className="text-sm text-gray-400">
                                        One Step Better
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-3xl font-semibold">
                            Skills
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-5 rounded-xl bg-[#0f172a] border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1 transition">
                                <FaReact className="text-3xl text-cyan-400" />
                                <h4 className="font-medium">React</h4>

                                <p className="text-sm text-gray-400 mt-1">
                                    Frontend Development
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-[#0f172a] border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1 transition">
                                <FaNodeJs className="text-3xl text-green-400" />
                                <h4 className="font-medium">Node.js </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    Backend Development
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-[#0f172a] border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1 transition">
                                <FaCode className="text-3xl text-purple-400" />
                                <h4 className="font-medium">DSA</h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    Problem Solving
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-[#0f172a] border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1 transition">
                                <FaGitAlt className="text-3xl text-orange-500" />
                                <h4 className="font-medium">Git & Github</h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    Version Control
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-[#0f172a] border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1 transition">
                                <h4 className="font-medium">React</h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    Frontend Development
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;