import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function MeetingEndModal() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-3xl p-10 text-center max-w-md w-full shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold mb-4 text-green-400">
          🎉 Interview Completed
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Thank you {user.role === "candidate" ? "for attending" : "for conducting"} the interview.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold hover:scale-105 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
