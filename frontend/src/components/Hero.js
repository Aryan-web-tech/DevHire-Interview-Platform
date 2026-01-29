import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <section className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Interview Smarter.
          </span>
          <br />
          Hire Faster.
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
          {user?.role === "interviewer"
            ? "Conduct real-time coding interviews with full visibility, live collaboration, and deep candidate insights."
            : "Showcase your skills in real-time interviews with live coding, instant feedback, and zero friction."}
        </p>

        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold hover:scale-105 transition"
          >
            {user?.role === "interviewer" ? "Create Interview" : "Join Interview"}
          </button>
        </div>
      </div>
    </section>
  );
}
