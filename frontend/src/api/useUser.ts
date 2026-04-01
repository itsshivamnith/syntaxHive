import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/user`, {
    credentials: "include"
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to register user");
  }
  return data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchData,
    retry: false,
    staleTime: 1000 * 60,
  });
};
