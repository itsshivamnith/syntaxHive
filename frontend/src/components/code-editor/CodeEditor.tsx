import { useSearchParams } from "react-router-dom";
import CodeEditorNav from "./CodeEditorNav";
import SideBar from "./SideBar";
import Editor from "./Editor";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useState } from "react";
import { starterCode } from "./starterCode";

export type Mode = "friends" | "solo";

const CodeEditor = () => {
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomid");
  const rawMode = searchParams.get("mode");
  const language = searchParams.get("language") ?? "javascript";

  const mode: Mode =
    rawMode === "friends" || rawMode === "solo" ? rawMode : "solo";

  const [code, setCode] = useState(starterCode[language] || "");

  return (
    <ProtectedRoute>
      <div className="bg-black h-screen flex flex-col">
        <CodeEditorNav roomId={roomId} mode={mode} code={code} language={language} />
        <div className="bg-black h-[2px]" />
        <div className="flex flex-1 min-h-0">
          <SideBar mode={mode} />
          <Editor
            language={language}
            roomId={roomId}
            code={code}
            setCode={setCode}
          />
        </div>
        <div className="bg-black h-[2px]" />
      </div>
    </ProtectedRoute>
  );
};

export default CodeEditor;
