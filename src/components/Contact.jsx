import { useState } from "react";
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

const inputClass = (hasError) =>
    `w-full px-5 py-4 rounded-xl bg-[#111827] border text-white placeholder-gray-600 outline-none focus:ring-1 transition ${
        hasError
            ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
            : "border-purple-500/20 focus:border-purple-500 focus:ring-purple-500"
    }`;

function Contact() {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | success | error
    const [feedback, setFeedback] = useState("");

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
        <section
            id="contact"
            className="min-h-screen bg-[#070b17] text-white px-5 md:px-8 py-20"
        >
            <div className="max-w-7xl mx-auto">

                {/* Section Heading */}
                <div className="text-center mb-12">
                    <p className="text-purple-400 font-medium tracking-widest">
                        GET IN TOUCH
                    </p>

                    <h2 className="text-4xl md:text-6xl font-bold mt-3">
                        Contact{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                            Me
                        </span>
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto mt-5">
                        Have a project idea, question, or just want to connect?
                        Feel free to reach out.
                    </p>
                </div>

                {/* Contact Box */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-3xl p-6 md:p-10 shadow-[0_0_40px_rgba(139,92,246,0.08)]">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

                        {/* LEFT SIDE */}
                        <div className="flex flex-col justify-center">

                            {/* Character + text row */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                {/* Character Image (save your character as public/character.png) */}
                                <img
                                    src="/contactpic2.png"
                                    alt="Developer character with laptop"
                                    className="w-44 sm:w-52 shrink-0 select-none"
                                    draggable="false"
                                />

                                {/* Text */}
                                <div className="text-center sm:text-left">
                                    <p className="text-purple-400 font-medium tracking-[0.25em] text-xs">
                                        CONTACT
                                    </p>

                                    <h3 className="text-4xl md:text-5xl font-bold mt-3">
                                        Let's{" "}
                                        <span className="text-purple-500">Connect</span>
                                    </h3>

                                    <p className="text-gray-400 text-base leading-relaxed mt-4 max-w-md">
                                        I'm always open to discussing new projects,
                                        opportunities, collaborations, or just talking
                                        about tech and ideas.
                                    </p>

                                    {/* Email */}
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">

                                        <a
                                            href="mailto:ansari.abdullah8381@gmail.com"
                                            className="w-14 h-14 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:border-purple-400 transition"
                                            aria-label="Send an email"
                                        >
                                            <FaEnvelope className="text-xl" />
                                        </a>

                                        <div className="text-left">
                                            <p className="text-gray-400 text-sm">Drop an Email</p>
                                            <a
                                                href="mailto:ansari.abdullah8381@gmail.com"
                                                className="text-white font-semibold text-base md:text-lg hover:text-purple-400 transition break-all"
                                            >
                                                ansari.abdullah8381@gmail.com
                                            </a>
                                        </div>

                                        {/* "Click to Email" hand-drawn hint (hidden on small screens) */}
                                        <div className="hidden xl:flex flex-col items-start -ml-1 select-none">
                                            <svg
                                                width="90"
                                                height="34"
                                                viewBox="0 0 90 34"
                                                fill="none"
                                                stroke="#a78bfa"
                                                strokeWidth="1.5"
                                                strokeDasharray="4 4"
                                                strokeLinecap="round"
                                            >
                                                <path d="M84 30 C 80 4, 52 -4, 40 14" />
                                                <path d="M46 6 L38 15 L50 18" strokeDasharray="0" />
                                            </svg>
                                            <span
                                                className="text-purple-400 text-lg -mt-1 -rotate-6"
                                                style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
                                            >
                                                Click to Email
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-8">

                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="w-14 h-14 rounded-full bg-[#0a2540] border border-sky-500/50 flex items-center justify-center hover:scale-110 transition"
                                >
                                    <span className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center">
                                        <FaLinkedinIn className="text-lg" />
                                    </span>
                                </a>

                                <a
                                    href="https://github.com/MohammadAbdullahAnsari"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="w-14 h-14 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center hover:scale-110 transition"
                                >
                                    <FaGithub className="text-3xl" />
                                </a>

                                <a
                                    href="#"
                                    aria-label="X"
                                    className="w-14 h-14 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center hover:scale-110 transition"
                                >
                                    <span className="w-9 h-9 rounded-lg bg-black flex items-center justify-center">
                                        <FaXTwitter className="text-lg" />
                                    </span>
                                </a>

                                {/* 4th icon: swap href / icon for your own platform */}
                                <a
                                    href="#"
                                    aria-label="Portfolio profile"
                                    className="w-14 h-14 rounded-full bg-pink-500/10 border-2 border-pink-500 flex items-center justify-center hover:scale-110 transition shadow-[0_0_18px_rgba(236,72,153,0.35)]"
                                >
                                    <span className="w-6 h-6 rotate-45 rounded-md border-[5px] border-pink-400" />
                                </a>

                            </div>

                            {/* Download CV */}
                            <a
                                href="/resume.pdf"
                                download
                                className="flex items-center justify-center gap-3 mt-7 w-full sm:w-72 px-7 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold hover:scale-105 transition shadow-[0_0_25px_rgba(139,92,246,0.3)]"
                            >
                                <FaDownload />
                                Download CV
                            </a>

                        </div>

                        {/* RIGHT SIDE - FORM */}
                        <div className="md:border-l md:border-purple-500/20 md:pl-16">

                            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                                <div>
                                    <label htmlFor="contact-name" className="block text-sm text-gray-400 mb-2">
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
                                        className={inputClass(errors.name)}
                                    />
                                    {errors.name && (
                                        <p id="err-name" className="text-red-400 text-sm mt-2">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="contact-email" className="block text-sm text-gray-400 mb-2">
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
                                        className={inputClass(errors.email)}
                                    />
                                    {errors.email && (
                                        <p id="err-email" className="text-red-400 text-sm mt-2">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-sm text-gray-400 mb-2">
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
                                        className={`${inputClass(errors.message)} resize-none`}
                                    ></textarea>
                                    {errors.message && (
                                        <p id="err-message" className="text-red-400 text-sm mt-2">{errors.message}</p>
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
                                    className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.25)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {status === "sending" ? (
                                        <>
                                            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
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
                                <div role="status" aria-live="polite">
                                    {status === "success" && (
                                        <p className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                                            <FaCheckCircle className="mt-0.5 shrink-0 text-lg" />
                                            {feedback}
                                        </p>
                                    )}
                                    {status === "error" && (
                                        <p className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                                            <FaExclamationCircle className="mt-0.5 shrink-0 text-lg" />
                                            {feedback}
                                        </p>
                                    )}
                                </div>

                            </form>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default Contact;