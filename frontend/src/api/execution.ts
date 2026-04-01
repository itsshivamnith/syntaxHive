import { useMutation } from "@tanstack/react-query";

interface RunCodeProp {
  id: number;
  sourceCode: string;
  input: string;
}

const runCode = async ({ id, sourceCode, input }: RunCodeProp) => {
  const res = await fetch(
    `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": import.meta.env.VITE_EXECUTION_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: id,
        source_code: sourceCode,
        stdin: input,
      }),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to execute code");
  }
  return data;
};

export const useExecuteCode = () => {
  return useMutation({
    mutationFn: (props: RunCodeProp) => runCode(props),
  });
};