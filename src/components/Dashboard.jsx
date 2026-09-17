import LeetCodeDashboard from "./LeetCodeDashboard";
import GitHubDashboard from "./GitHubDashboard";

function Dashboard() {
  return (
    <section
  id="dashboard"
  className="min-h-screen bg-[#070b17] text-white px-5 md:px-8 py-20"
>
      <div className="max-w-[1500px] mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-purple-400 text-sm">
            Coding Profiles
          </p>

          <h2 className="text-5xl md:text-6xl font-bold mt-3">
            Developer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Dashboard
            </span>
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            My live coding activity, problem-solving progress, GitHub projects,
            and contribution statistics — all in one place.
          </p>
        </div>

        {/* Two Dashboards */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <LeetCodeDashboard />
          <GitHubDashboard />
        </div>

      </div>
    </section>
  );
}

export default Dashboard;