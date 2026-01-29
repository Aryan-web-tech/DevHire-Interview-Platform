import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import {
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  StreamVideo,
  SpeakerLayout,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  RecordCallButton,
  ScreenShareButton
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import MeetingEndModal from "../components/MeetingEndModal";
import SharedEditor from "../components/SharedEditor";

export default function InterviewCall() {
  const { interviewId } = useParams();
  const { user } = useContext(AuthContext);

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [callEnded, setCallEnded] = useState(false);

  const joinedRef = useRef(false);

  const handleExit = useCallback( async () => {
    try {
      if (call) {
        await call.camera.disable();
        await call.microphone.disable();
        await call.leave();

        // Stop local hardware (turns off camera light)
        const localStreams = call.localParticipant?.streams || [];
        localStreams.forEach((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        });
      }
    } catch (err) {
      console.warn("Error cleaning up call:", err);
    } finally {
      setCallEnded(true); // show modal to candidate too
    }
  },[call]);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    const joinCall = async () => {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/v1/interview/${interviewId}/call`,
          { userId: user.id }
        );

        const { apiKey, token, streamCallId } = res.data;

        const streamClient = new StreamVideoClient({
          apiKey,
          user: { id: user.id, name: user.email },
          token,
        });

        const streamCall = streamClient.call("default", streamCallId);
        await streamCall.join();

        setClient(streamClient);
        setCall(streamCall);
      } catch (err) {
        joinedRef.current = false;
        console.error("Failed to join call", err);
      }
    };

    joinCall().catch(console.error);
  }, [interviewId, user]);

  useEffect(() => {
    if (!call) return;

    const handleCallEnded = async () => {
      try {
        await axios.patch(
          `http://localhost:8000/api/v1/interview/${interviewId}/complete`
        );
      } catch (err) {
        console.error("Failed to mark interview completed", err);
      }
      await handleExit(); // cleanup + show modal
    };

    call.on("call.ended", handleCallEnded);

    return () => {
      call.off("call.ended", handleCallEnded);
    };
  }, [call, interviewId, handleExit]);

  if (!client || !call) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Joining interview...
      </div>
    );
  }

  return (
  <>
    {!callEnded && (
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            {/* FULL SCREEN CONTAINER */}
            <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">

              {/* MAIN CONTENT */}
              <div className="flex-1 flex overflow-hidden">

                {/* VIDEO AREA */}
                <div className="flex-[3] overflow-hidden bg-black">
                  <SpeakerLayout />
                </div>

                {/* EDITOR AREA */}
                <div className="flex-[2] overflow-hidden border-l border-zinc-800">
                  <SharedEditor interviewId={interviewId} user={user} />
                </div>

              </div>

              {/* CONTROLS BAR */}
              <div className="h-20 flex items-center justify-center gap-4 bg-zinc-900 border-t border-zinc-800">
                <ToggleVideoPublishingButton />
                <ToggleAudioPublishingButton />
                <RecordCallButton />
                
                <ScreenShareButton />

                {user.role === "candidate" ? (
                  <button
                    onClick={handleExit}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    Leave Call
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await call.endCall();
                    }}
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    End Call
                  </button>
                )}
              </div>

            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    )}

    {/* Interview Completed Modal */}
    {callEnded && <MeetingEndModal />}
  </>
);

}
