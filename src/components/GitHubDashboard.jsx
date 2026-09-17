import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

function GitHubDashboard() {
    const [repos, setRepos] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch("https://api.github.com/users/MohammadAbdullahAnsari/repos")
            .then((response) => response.json())
            .then((data) => setRepos(data));
        fetch("https://api.github.com/users/MohammadAbdullahAnsari")
            .then((response) => response.json())
            .then((data) => setProfile(data));
    }, []);
    const totalStars = repos.reduce(
        (total, repo) => total + repo.stargazers_count,
        0
    );
    const languageCount = repos.reduce((languages, repo) => {
        if (repo.language) {
            languages[repo.language] =
                (languages[repo.language] || 0) + 1;
        }

        return languages;
    }, {});
    const totalLanguages = Object.values(languageCount).reduce(
        (total, count) => total + count,
        0
    );
    const languagePercentage = Object.entries(languageCount).map(
        ([language, count]) => ({
            language,
            percentage: Math.round((count / totalLanguages) * 100)
        })
    );
    return (

        <div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">
    <FaGithub className="text-4xl text-white" />

    <div>
        <p className="text-3xl font-bold">
            GitHub
        </p>

        <p className="text-2xl font-bold text-blue-400">
            Dashboard
        </p>
    </div>
</div>

                <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition"
                >
                    View Profile ↗
                </a>

            </div>
            {/* GitHub Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Repositories */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-xl p-5">
                    <p className="text-gray-400 text-sm">
                        Repositories
                    </p>

                    <p className="text-3xl font-bold text-blue-400 mt-2">
                        {repos.length}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Public Repos
                    </p>
                </div>

                {/* Stars */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-xl p-5">
                    <p className="text-gray-400 text-sm">
                        Total Stars
                    </p>

                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                        {totalStars}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Across all repos
                    </p>
                </div>

                {/* Commits */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-xl p-5">
                    <p className="text-gray-400 text-sm">
                        Total Commits
                    </p>

                    <p className="text-3xl font-bold text-green-400 mt-2">
                        1,042
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        In the last year
                    </p>
                </div>

                {/* Followers */}
                <div className="bg-[#0f172a] border border-purple-500/20 rounded-xl p-5">
                    <p className="text-gray-400 text-sm">
                        Followers
                    </p>

                    <p className="text-3xl font-bold text-purple-400 mt-2">
                        {profile?.followers}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                        Amazing people
                    </p>
                </div>

            </div>
            {/* Contribution Activity */}
            <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6 mt-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">
                            Contribution Activity
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                            Your GitHub activity over the past year
                        </p>
                    </div>

                    <p className="text-blue-400 font-semibold">
                        365 Days
                    </p>
                </div>

                {/* Heatmap */}
                <div className="mt-6 overflow-x-auto">

                    <div className="grid grid-cols-12 gap-2 min-w-150">

                        {Array.from({ length: 120 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-4 h-4 rounded-sm bg-green-500/20 hover:bg-green-500 transition"
                            ></div>
                        ))}

                    </div>

                </div>

            </div>
            {/* Top Languages */}
            <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6 mt-6">

                <h3 className="text-xl font-semibold">
                    Top Languages
                </h3>

                <div className="mt-5 space-y-4">


                    {languagePercentage.map((item) => (
                        <div key={item.language}>

                            <div className="flex justify-between text-sm">
                                <span>{item.language}</span>

                                <span className="text-gray-400">
                                    {item.percentage}%
                                </span>
                            </div>

                            <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                                <div
                                    className="h-2 bg-purple-400 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>

                        </div>
                    ))}




                </div>
            </div>
            {/* Featured Repositories */}
            <div className="bg-[#0f172a] border border-purple-500/20 rounded-2xl p-6 mt-6">

                <h3 className="text-xl font-semibold">
                    Featured Repositories
                </h3>

                <div className="grid grid-cols-1 gap-4 mt-5">

                    {/* Repository 1 */}
                    {repos.slice(0, 3).map((repo) => (
                        <div
                            key={repo.id}
                            className="p-4 rounded-xl bg-[#111827] border border-purple-500/10 hover:border-purple-500/40 transition"
                        >

                            <div className="flex items-center justify-between">

                                <h4 className="font-semibold">
                                    {repo.name}
                                </h4>

                                <span className="text-sm text-gray-400">
                                    ⭐ {repo.stargazers_count}
                                </span>

                            </div>

                            <p className="text-sm text-gray-400 mt-2">
                                {repo.description || "No description available."}
                            </p>

                            <div className="flex items-center justify-between mt-4">

                                <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400">
                                    {repo.language || "Other"}
                                </span>

                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    View Repo ↗
                                </a>

                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}

export default GitHubDashboard;