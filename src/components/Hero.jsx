import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { useState, useEffect } from "react";
import {
    FaHome,
    FaUser,
    FaCode,
    FaEnvelope,
    FaLaptopCode,
} from "react-icons/fa";
function Hero() {
    const [showMobileNav, setShowMobileNav] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);
useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setShowMobileNav(false);
        } else {
            setShowMobileNav(true);
        }

        setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, [lastScrollY]);
    const [activeSection, setActiveSection] = useState("home");
    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);
    return (
        <section
            id="home"
            className="min-h-screen relative overflow-hidden bg-[#070b17] text-white"
        >
            <nav className=" fixed top-0 left-0 w-full z-50 bg-[#070b17]/85 backdrop-blur-lg border-b border-purple-500/20">

                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    {/* Logo */}
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        SGT GHOST PRICE
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">

                        <a
                            href="#home"
                            className={`flex flex-col items-center gap-1 transition ${activeSection === "home"
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                                }`}>
                            <FaHome className="text-xl" />
                            <span className="text-sm">Home</span>
                            {activeSection === "home" && (
                                <div className="w-8 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                            )}
                        </a>

                        <a
                            href="#about"
                            className={`flex flex-col items-center gap-1 transition ${activeSection === "about"
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                                }`}
                        >
                            <FaUser className="text-xl" />
                            <span className="text-sm">About</span>
                            {activeSection === "about" && (
                                <div className="w-8 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                            )}
                        </a>

                        <a
                            href="#projects"
                            className={`flex flex-col items-center gap-1 transition ${activeSection === "projects"
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                                }`}
                        >
                            <FaCode className="text-xl" />
                            <span className="text-sm">Projects</span>
                            {activeSection === "projects" && (
                                <div className="w-8 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                            )}
                        </a>

                        <a
                            href="#dashboard"
                            className={`flex flex-col items-center gap-1 transition ${activeSection === "dashboard"
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                                }`}
                        >
                            <FaLaptopCode className="text-xl" />
                            <span className="text-sm">Dashboard</span>

                            {activeSection === "dashboard" && (
                                <div className="w-8 h-0.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                            )}
                        </a>

                        <a
                            href="#contact"
                            className={`flex flex-col items-center gap-1 transition ${activeSection === "contact"
                                ? "text-purple-400"
                                : "text-gray-300 hover:text-purple-400"
                                }`}
                        >
                            <FaEnvelope className="text-xl" />
                            <span className="text-sm">Contact</span>
                        </a>

                    </div>

                </div>

                {/* Mobile Bottom Navbar */}
               
            </nav>
            <div
    className={`md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#0f172a]/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl px-3 py-3 z-100 transition-transform duration-300 ${
        showMobileNav ? "translate-y-0" : "translate-y-[150%]"
    }`}
>

                    <div className="flex items-center justify-around">

                        <a
                            href="#home"
                            className="flex flex-col items-center gap-1 text-gray-300 hover:text-purple-400 transition"
                        >
                            <FaHome className="text-lg" />
                            <span className="text-[11px]">Home</span>
                        </a>

                        <a
                            href="#about"
                            className="flex flex-col items-center gap-1 text-gray-300 hover:text-purple-400 transition"
                        >
                            <FaUser className="text-lg" />
                            <span className="text-[11px]">About</span>
                        </a>

                        <a
                            href="#projects"
                            className="flex flex-col items-center gap-1 text-gray-300 hover:text-purple-400 transition"
                        >
                            <FaCode className="text-lg" />
                            <span className="text-[11px]">Projects</span>
                        </a>

                        <a
                            href="#dashboard"
                            className="flex flex-col items-center gap-1 text-gray-300 hover:text-purple-400 transition"
                        >
                            <FaLaptopCode className="text-lg" />
                            <span className="text-[11px]">Dashboard</span>
                        </a>

                        <a
                            href="#contact"
                            className="flex flex-col items-center gap-1 text-gray-300 hover:text-purple-400 transition"
                        >
                            <FaEnvelope className="text-lg" />
                            <span className="text-[11px]">Contact</span>
                        </a>

                    </div>
                </div>
            <main className="relative z-10 min-h-[calc(100vh-88px)] flex items-center">
                <div className="w-full max-w-7xl mx-auto px-8 ">
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">

                        <div className="order-2 md:order-1">
                            <p className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">Hello I'm</p>
                            <h1 className="text-5xl md:text-7x font-bold mt-6">Mohammad{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500">
                                    Abdullah Ansari
                                </span></h1>
                            <h2 className="text-xl md:text-2xl font-medium text-gray-300 mt-4">
                                Full Stack Developer | DSA Solver
                            </h2>

                            <p className="mt-6 max-w-xl text-gray-400 text-base md:text-lg leading-relaxed">
                                I build modern and responsive web applications using React and modern
                                technologies.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <a href="" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition hover:scale-105">

                                    View Resume</a>
                                <a href="" className="px-6 py-3 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition hover:scale-105">View Contact</a>

                            </div>

                            <div className="flex items-center gap-10 mt-8">
                                <a href="#" className="text-gray-400 hover:text-purple-400 hover:scale-125 transition ">
                                    <FaGithub size={24} />
                                </a>

                                <a href="#" className="text-gray-400 hover:text-purple-400 hover:scale-125 transition">
                                    <FaLinkedin size={24} />
                                </a>

                                <a href="#" className="text-gray-400 hover:text-purple-400 thover:scale-125 transition">
                                    <SiLeetcode size={24} />
                                </a>

                                <a href="#" className="text-gray-400 hover:text-purple-400 hover:scale-125 transition">
                                    <MdEmail size={26} />
                                </a>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative flex items-center justify-center md:-translate-x-8">

                            <div className="absolute w-80 h-80 bg-purple-600/30 rounded-full blur-3xl">
                            </div>
                            <div className="absolute w-80 h-80 border border-purple-500/20 rounded-full">
                            </div>

                            <div className="absolute w-96 h-96 border border-indigo-500/10 rounded-full">
                            </div>

                            {/* Profile Section */}
                            <div className="relative p-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500">
                                <img
                                    src="/profile2.png"
                                    alt="Profile"
                                    className="w-52 h-52 md:w-64 md:h-64 rounded-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute -top-4 -right-10 bg-[#111827] border border-purple-500/30 px-4 py-3 rounded-xl shadow-lg animate-bounce">
                                <p className="text-sm text-gray-300 ">
                                    🚀 Open to Opportunities
                                </p>
                            </div>
                            <div className="absolute top-1/2 -left-16 bg-[#111827] border border-purple-500/30 px-4 py-3 rounded-xl shadow-lg animate-bounce">
                                <p className="text-sm text-gray-300">
                                    💻 Building Cool Stuff
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-8 bg-[#111827] border border-purple-500/30 px-4 py-3 rounded-xl shadow-lg animate-bounce">
                                <p className="text-sm text-gray-300">
                                    📈 Focused on Growth
                                </p>
                            </div>
                        </div>



                    </div>

                </div>

            </main>

        </section>
    );
}

export default Hero;