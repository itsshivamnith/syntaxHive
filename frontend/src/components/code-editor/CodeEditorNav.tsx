import { Button } from "../ui/button";
import { Save, Copy, LogOut, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Mode } from "./CodeEditor";
import { socket } from "./socket/socket";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/api/useUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CodeEditorNavProps {
  roomId: string | null;
  mode: Mode;
  code: string;
  language: string;
}

const CodeEditorNav = ({
  roomId,
  mode,
  code,
  language,
}: CodeEditorNavProps) => {
  const { data } = useUser();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState<null | "solo" | "friends">(
    null
  );

  const languagesExtension: Record<string, string> = {
    javascript: "index.js",
    python: "main.py",
    cpp: "main.cpp",
    java: "Main.java",
    typescript: "index.ts",
    html: "index.html",
    csharp: "Program.cs",
    php: "index.php",
  };

  const handlelinkCopy = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success("Copied");
    } else {
      toast.error("No room ID to copy");
    }
  };

  const handleExport = (code: string, filename : string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmExit = () => {
    if (showConfirm === "friends" && roomId) {
      socket.emit("leaveRoom", roomId, data.user.name);
      toast.success("You left the room");
      navigate("/start");
    } else if (showConfirm === "solo") {
      navigate("/start");
    }
    setShowConfirm(null);
  };

  useEffect(() => {
    socket.on("userLeave", (message) => {
      toast(message, { position: "bottom-center" });
    });
    socket.on("userJoined", (message) => {
      toast(message, { position: "bottom-center" });
    });

    return () => {
      socket.off("userLeave");
      socket.off("userJoined");
    };
  }, []);

  return (
    <>
      <nav className="flex justify-between items-center pr-4 bg-[#101218]">
        <div className="flex items-center gap-50">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="size-15" />
            <h1 className="-m-3 font-code text-white">SyntaxHive</h1>
          </div>
          {mode === "friends" && (
            <div className="flex items-center gap-4">
              <div className="border border-gray-800 rounded-md flex items-center">
                <div className="px-2">{roomId}</div>
                <Button
                  title="Copy Room Id"
                  onClick={handlelinkCopy}
                  className="cursor-pointer bg-primary hover:bg-[var(--accent-hover)] text-white hover-scale"
                >
                  <Copy />
                </Button>
              </div>
              <Button
                title="Leave"
                className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border"
                onClick={() => setShowConfirm("friends")}
              >
                <LogOut />
                Leave
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {mode === "solo" && (
            <Button
              className="bg-transparent hover:bg-gray-800 cursor-pointer border-white/20 border"
              onClick={() => setShowConfirm("solo")}
            >
              <ArrowLeft />
              Back to Main Menu
            </Button>
          )}
          <Button
            title="Save/Export This File"
            className="cursor-pointer bg-primary text-white hover:bg-[var(--accent-hover)] hover-scale"
            onClick={() => handleExport(code, languagesExtension[language])}
          >
            <Save />
            Save/Export
          </Button>
        </div>
      </nav>

      <Dialog open={!!showConfirm} onOpenChange={() => setShowConfirm(null)}>
        <DialogContent className="sm:max-w-[425px] glass-panel text-[var(--text-primary)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              {showConfirm === "solo"
                ? "Exit Solo Session?"
                : "Leave Coding Room?"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {showConfirm === "solo"
                ? "Are you sure you want to exit solo mode? Any unsaved changes may be lost."
                : "Are you sure you want to leave this coding room? Any unsaved changes may be lost."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
            >
              Stay
            </Button>
            <Button
              variant="destructive"
              onClick={confirmExit}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {showConfirm === "solo" ? "Exit" : "Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CodeEditorNav;
