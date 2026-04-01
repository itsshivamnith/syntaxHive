import { useUser } from "@/api/useUser";
import type React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../ui/loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useUser();

  if (isLoading) return <div><Loader className="size-20 fill-[var(--hive-purple)] mt-96"/></div>;
  if (error) return <Navigate to="/signin" replace />;
  if (!data) return <Navigate to="/signin" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
