import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Navbar from "../components/Navbar";

export default function Recordings() {
  const { user } = useContext(AuthContext);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/interview/recordings/${user.id}`,);
        setRecordings(res.data);
      } catch (err) {
        console.error("Failed to fetch recordings", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchRecordings();
  }, [user?.id]);

  if (loading) {
    return <div className="text-white p-6">Loading recordings...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Your Interview Recordings</h1>

        {recordings.length === 0 ? (
          <p className="text-zinc-400">
            No recordings available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-zinc-900 rounded-xl p-4 shadow-md"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {rec.title}
                </h3>

                <p className="text-sm text-zinc-400 mb-3">
                  {new Date(rec.scheduled_at).toLocaleString()}
                </p>

                <video
                  src={rec.recording_url}
                  controls
                  className="w-full rounded-lg"
                />

                <a
                  href={rec.recording_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-indigo-400 text-sm hover:underline"
                >
                  Open in new tab
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
