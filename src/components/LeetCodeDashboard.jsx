import { FaCode, FaCircle, FaTrophy, FaMedal } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
function LeetCodeDashboard() {
    return (
        <div
            id="leetcode"

        >
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">
    <SiLeetcode className="text-4xl text-yellow-400" />

    <div>
        <p className="text-3xl font-bold">
            LeetCode
        </p>

        <p className="text-2xl font-bold text-orange-400">
            Dashboard
        </p>
    </div>
</div>

                    <a
                        href="#"
                        className="text-gray-300 hover:text-purple-400 transition"
                    >
                        View Profile ↗
                    </a>

                </div>
                {/* Solved Statistics */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Total Solved */}
                        <div className="p-4 rounded-xl bg-green-500/10">
                            <FaCode className="text-3xl text-green-400" />
                            <p className="text-gray-400 text-sm">
                                Total Solved
                            </p>
                            <p className="text-4xl font-bold text-green-400 mt-2">
                                512
                            </p>


                        </div>

                        {/* Easy */}
                        <div>
                            <p className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaCircle className="text-green-400 text-xs" />
                                Easy
                            </p>

                            <p className="text-3xl font-semibold text-green-400 mt-2">
                                198
                            </p>
                        </div>

                        {/* Medium */}
                        <div>
                            <p className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaCircle className="text-orange-400 text-xs" />
                                Medium
                            </p>

                            <p className="text-3xl font-semibold text-orange-400 mt-2">
                                276
                            </p>
                        </div>

                        {/* Hard */}
                        <div>
                            <p className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaCircle className="text-red-400 text-xs" />
                                Hard
                            </p>

                            <p className="text-3xl font-semibold text-red-400 mt-2">
                                38
                            </p>
                        </div>

                    </div>

                </div>
                {/* Rating & Rank */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* Contest Rating */}
                    <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6">

                        <div className="flex items-center gap-4">

                            <div className="p-4 rounded-xl bg-purple-500/10">
                                <FaTrophy className="text-3xl text-purple-400" />
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Contest Rating
                                </p>

                                <p className="text-4xl font-bold text-purple-400 mt-2">
                                    1742
                                </p>

                                <p className="text-gray-500 mt-1">
                                    Top 19.35%
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Current Rank */}
                    <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6">

                        <div className="flex items-center gap-4">

                            <div className="p-4 rounded-xl bg-orange-500/10">
                                <FaMedal className="text-3xl text-orange-400" />
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm">
                                    Current Rank
                                </p>

                                <p className="text-3xl font-bold text-orange-400 mt-2">
                                    Knight
                                </p>

                                <p className="text-gray-500 mt-1">
                                    Keep improving!
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
                {/* Languages & Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* Top Languages */}
                    <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6">

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <FaCode className="text-purple-400" />
                            </div>

                            <h3 className="text-xl font-semibold">
                                Top Languages
                            </h3>
                        </div>
                        <div className="mt-5 space-y-4">

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span>Java</span>
                                    <span className="text-gray-400">45%</span>
                                </div>

                                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                                    <div className="w-[45%] h-2 bg-orange-400 rounded-full"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span>JavaScript</span>
                                    <span className="text-gray-400">30%</span>
                                </div>

                                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                                    <div className="w-[30%] h-2 bg-yellow-400 rounded-full"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span>Python</span>
                                    <span className="text-gray-400">25%</span>
                                </div>

                                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                                    <div className="w-[25%] h-2 bg-blue-400 rounded-full"></div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Badges */}
                    <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6">

                        <div className="flex items-center gap-3">

                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <FaMedal className="text-purple-400" />
                            </div>

                            <h3 className="text-xl font-semibold">
                                Badges
                            </h3>

                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5">

                            <div className="text-center p-4 rounded-xl bg-[#111827]">
                                🏆
                                <p className="text-sm mt-2">100 Days</p>
                            </div>

                            <div className="text-center p-4 rounded-xl bg-[#111827]">
                                ⚡
                                <p className="text-sm mt-2">50 Days</p>
                            </div>

                            <div className="text-center p-4 rounded-xl bg-[#111827]">
                                🎯
                                <p className="text-sm mt-2">Problem Solver</p>
                            </div>

                        </div>

                    </div>

                </div>
                {/* Submission Activity */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6 mt-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Submission Activity
                            </h3>

                            <p className="text-gray-400 text-sm mt-1">
                                Your coding activity over the past year
                            </p>
                        </div>

                        <p className="text-purple-400 font-semibold">
                            365 Days
                        </p>
                    </div>


                    {/* Heatmap */}
                    <div className="mt-6 overflow-x-auto">

                        <div className="grid grid-cols-12 gap-2 min-w-175">

                            {Array.from({ length: 120 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="w-4 h-4 rounded-sm bg-purple-500/20 hover:bg-purple-500 transition"
                                ></div>
                            ))}

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default LeetCodeDashboard;
