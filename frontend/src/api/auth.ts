import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const signOutdata = async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to register user");
  }
  return data;
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOutdata,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Logout Succesfully");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed:");
    },
  });
};
