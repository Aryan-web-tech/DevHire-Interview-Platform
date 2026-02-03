import  {useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function InterviewLobby() {
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const [cameraAllowed, setCameraAllowed] = useState(false)
  const [micAllowed, setMicAllowed] = useState(false)
  const [stream, setStream] = useState(null)  // Media stream from camera + mic
  const [error, setError] = useState(null)

  const videoRef = useRef(null) // ref for video element

  useEffect(() => {
    let localStream;

    const getPermissions = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setCameraAllowed(true)
        setMicAllowed(true)
        setStream(localStream)
      } catch (err) {
        setError("Camera or microphone permission denied")
      }
    }

    getPermissions()

    // cleanup when component unmounts
    return () => {
      localStream?.getTracks().forEach(track => track.stop())
    }
  }, []) // run only once on mount ✅

  // Set video srcObject when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Interview Setup</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Camera Preview</h3>

            {cameraAllowed ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="rounded-lg w-full"
              />
            ) : (
              <p className="text-zinc-400">Camera not available</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Instructions</h3>
            <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-5">
              <li>Join from a quiet environment</li>
              <li>Ensure camera & microphone are working</li>
              <li>Interview may be recorded</li>
              <li>Screen sharing may be required</li>
            </ul>
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-8 flex justify-center">
          <button
            disabled={!cameraAllowed || !micAllowed}
            onClick={() => navigate(`/interview/${interviewId}/call`)}
            className={`px-6 py-3 rounded-lg font-semibold ${
              cameraAllowed && micAllowed
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-zinc-700 cursor-not-allowed"
            }`}
          >
            Join Interview
          </button>
        </div>
      </div>
    </div>
  )
}
