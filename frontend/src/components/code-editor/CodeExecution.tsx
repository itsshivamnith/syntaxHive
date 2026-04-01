import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useExecuteCode } from "@/api/execution";
import { Play } from "lucide-react";
import Loader from "../ui/loader";
import { socket } from "./socket/socket";

interface CodeExecutionProps {
  code: string;
  language: string;
  roomId: string | null;
}

const CodeExecution = ({ code, language, roomId }: CodeExecutionProps) => {
  const [sharedOutput, setSharedOutput] = useState<string[]>([]);
  const [sharedError, setSharedError] = useState("");
  const { mutate, isPending } = useExecuteCode();
  const [sharedIsPending, setSharedIsPending] = useState(false);
  const [sharedInput, setSharedInput] = useState("");

  const languageToId: Record<string, number> = {
    javascript: 102,
    python: 109,
    cpp: 105,
    java: 91,
    typescript: 101,
    csharp: 51,
    php: 98,
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setSharedInput(newValue)
    socket.emit("inputSync", roomId, newValue);
  }

  const runCode = () => {
    const id = languageToId[language];
    setSharedError("");
    setSharedOutput([]);
    mutate(
      {
        id,
        sourceCode: code,
        input: sharedInput,
      },
      {
        onSuccess: (data) => {
          const output = data?.stdout ? data.stdout.split("\n") : [];
          const error = data?.stderr || data?.compile_output || data?.message || (data?.status?.id !== 3 && data?.status?.description ? data.status.description : "");

          setSharedOutput(output);
          setSharedError(error);

          socket.emit("outputSync", roomId, output);
          socket.emit("errorSync", roomId, error);
        },
        onError: (error) => {
          setSharedError(error.message);
          setSharedOutput([]);
          socket.emit("errorSync", roomId, error.message);
        }
      }
    );
  };

  useEffect(() => {
    setSharedIsPending(isPending);
    socket.emit("isPendingSync", roomId, isPending);
  }, [roomId, isPending]);

  useEffect(() => {
    socket.on("updateOutput", (output) => {
      setSharedOutput(output);
    });

    socket.on("updateError", (error) => {
      setSharedError(error);
    });

    socket.on("updateIsPending", (isPending) => {
      setSharedIsPending(isPending);
    });

    socket.on("updateInput", (input) => {
      setSharedInput(input);
    });

    return () => {
      socket.off("updateOutput");
      socket.off("updateError");
      socket.off("updateIsPending");
      socket.off("updateInput");
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[var(--surface)] min-h-0">
      <textarea
        className="w-full p-2 text-white rounded-md bg-[#1b1e28] focus:outline-white/20 focus:outline-2 shrink-0"
        placeholder="Enter input for your program..."
        value={sharedInput}
        onChange={handleInput}
        rows={6}
      />
      <Button
        onClick={runCode}
        className="bg-primary px-4 py-2 text-white rounded-md w-fit hover:bg-[var(--accent-hover)] my-4 cursor-pointer flex gap-1 items-center justify-center shrink-0 hover-scale"
        disabled={sharedIsPending}
      >
        {sharedIsPending ? (
          <>
            <Loader className="fill-black" />
            Running...
          </>
        ) : (
          <>
            <Play />
            Run Code
          </>
        )}
      </Button>

      <div
        className={`flex-1 p-2 rounded-md overflow-auto bg-[#1b1e28] border ${
          sharedError ? "border-red-500" : "border-white/20"
        }`}
      >
        {sharedError ? (
          <pre className="text-red-500 whitespace-pre-wrap break-words m-0">
            {sharedError}
          </pre>
        ) : sharedIsPending ? (
          <pre className="text-gray-400">Executing...</pre>
        ) : sharedOutput && sharedOutput.length > 0 ? (
          sharedOutput.map((line: string, i: number) => (
            <div key={i}>{line}</div>
          ))
        ) : (
          <pre className="text-gray-400">Your output will be shown here</pre>
        )}
      </div>
    </div>
  );
};

export default CodeExecution;
