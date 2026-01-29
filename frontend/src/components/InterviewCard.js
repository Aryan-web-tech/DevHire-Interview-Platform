import { useNavigate } from "react-router-dom";

export default function InterviewCard({ interview}) {
  const navigate = useNavigate();

  const formatDateTimeIST = (utcDate) => {
  const date = new Date(utcDate);

  return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const statusColors = {
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    live: "bg-green-500/20 text-green-400 border-green-500/40",
    completed: "bg-zinc-700/40 text-zinc-400 border-zinc-600"
  };

  return (
    <div
      onClick={() => navigate(`/interview/${interview.id}/lobby`)}
      className="cursor-pointer group
                 bg-zinc-900 border border-zinc-700 rounded-xl p-6
                 transition-all duration-300
                 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20
                 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white">
          {interview.title}
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-full border ${statusColors[interview.status]}`}
        >
          {interview.status.toUpperCase()}
        </span>
      </div>

      {/* Date */}
      <p className="text-sm text-zinc-400 mt-2">
        {formatDateTimeIST(interview.scheduled_at)} IST
      </p>


      {/* Optional description */}
      {interview.description && (
        <p className="text-sm text-zinc-500 mt-3 line-clamp-2">
          {interview.description}
        </p>
      )}

      {/* Hover hint */}
      <p className="mt-4 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition">
        Click to join meeting →
      </p>
    </div>
  );
}
