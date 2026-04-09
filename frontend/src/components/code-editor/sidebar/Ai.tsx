import { useAiChat } from "@/api/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Message } from "../SideBar";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


const Ai = ({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const { mutate, isPending } = useAiChat();
  const [value, setValue] = useState("");

  const handleAiChat = (prompt: string) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);

    setMessages((prev) => [...prev, { role: "ai", text: "..." }]);

    mutate(
      { prompt },
      {
        onSuccess: (data) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated.pop();
            return [...updated, { role: "ai", text: data.text }];
          });
          setValue("");
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center text-center font-bold text-lg border-b border-[var(--border)] shadow bg-[var(--surface)] text-[var(--text-primary)]">
        <img src="/logo.png" alt="" className="size-16" />
        <p className="-m-2 font-bold text-[var(--hive-purple)]">SyntaxHive AI</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0f1117] text-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`w-fit max-w-[90%] p-2 rounded-lg shadow ${msg.role === "user"
                  ? "bg-[#2f2f31] text-white"
                  : "bg-gray-800 text-gray-100"
                }`}
            >
              {msg.role === "ai" && msg.text === "..." ? (
                <span className="animate-pulse">...</span>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");

                      return !inline && match ? (
                        <div className="relative group">
                          <button
                            className="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded z-10"
                            onClick={() => navigator.clipboard.writeText(codeString)}
                          >
                            Copy
                          </button>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            // @ts-expect-error Types mismatch in renderer
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-gray-800 px-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-2 border-t border-[var(--border)] bg-[var(--surface)] flex items-center gap-2 sticky bottom-0">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your prompt..."
          className="flex-1 bg-gray-800 text-white border-gray-600 outline-0 focus-visible:ring-main focus-visible:ring-1 focus:border-0"
          onKeyDown={(e) => e.key === "Enter" && handleAiChat(value)}
        />
        <Button
          disabled={isPending}
          onClick={() => handleAiChat(value)}
          className="bg-primary hover:bg-[var(--accent-hover)] text-white cursor-pointer hover-scale"
        >
          {isPending ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default Ai;
