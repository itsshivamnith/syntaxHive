import { useMutation } from "@tanstack/react-query";

interface RunCodeProp {
  language: string;
  sourceCode: string;
  input: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error:  string;
}

const runCode = async ({ language, sourceCode, input }: RunCodeProp): Promise<ExecutionResult> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, sourceCode, input }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to execute code");

  return data as ExecutionResult;
};

export const useExecuteCode = () => {
  return useMutation({
    mutationFn: (props: RunCodeProp) => runCode(props),
  });
};