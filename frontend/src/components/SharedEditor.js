import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
];

export default function SharedEditor({ interviewId, user }) {
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket once
    socketRef.current = io("http://localhost:8000");

    socketRef.current.on("connect", () => {
      console.log("Connected to socket", socketRef.current.id);
      // Join interview room
      socketRef.current.emit("join-room", { interviewId, user });
    });

    // Listen to editor updates from other participants
    socketRef.current.on("editor-update", ({ code: newCode }) => {
      setCode(newCode); // directly update
    });

    socketRef.current.on("language-change", ({ language: lang }) => {
      setLanguage(lang);
    });

    socketRef.current.on("user-typing", (user) => {
      setTypingUser(user.email);
    });

    socketRef.current.on("user-stop-typing", () => {
      setTypingUser(null);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [interviewId, user]);

  const handleCodeChange = (value) => {
    if (value === undefined) return;

    setCode(value); // update locally
    socketRef.current.emit("editor-change", { interviewId, code: value });

    socketRef.current.emit("typing", { interviewId, user });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit("stop-typing", { interviewId });
    }, 800);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    socketRef.current.emit("language-change", { interviewId, language: selectedLang });
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 text-sm">
        <span className="text-zinc-400">{typingUser && `${typingUser} is typing...`}</span>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-zinc-900 text-white text-sm px-2 py-1 rounded-md border border-zinc-700"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
