import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate()

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition cursor-pointer"
         onClick={()=>navigate("/")}>
          DevHire
        </h1>

        <div className="flex items-center gap-6">
          {user && (
            <span className="text-sm text-gray-400 hidden sm:block">
              {user.email}
            </span>
          )}

          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
