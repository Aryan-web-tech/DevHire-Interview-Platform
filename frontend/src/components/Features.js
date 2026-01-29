const Card = ({ title, desc }) => (
  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:scale-105 transition">
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default function Features({ role }) {
  const interviewerFeatures = [
    ["Live Code Monitoring", "Watch the candidate write code in real time"],
    ["Interview Scheduling", "Schedule and manage interviews easily"],
    ["Session Recording", "Record interview sessions for later review"],
  ];


  const candidateFeatures = [
    ["Collaborative Editor", "Code together with the interviewer in real time"],
    ["Multiple Languages", "Choose from supported programming languages"],
    ["Simple Interview Flow", "Join interviews with a single click"],
  ];


  const features =
    role === "interviewer" ? interviewerFeatures : candidateFeatures;

  return (
    <section className="bg-black px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14 text-white">
          Built for{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {role === "interviewer" ? "Interviewers" : "Candidates"}
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(([title, desc]) => (
            <Card key={title} title={title} desc={desc} />
          ))}
        </div>
      </div>
    </section>
  );
}
