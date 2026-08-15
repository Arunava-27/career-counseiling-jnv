import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../shared/api";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "authed" | "anonymous">("checking");

  useEffect(() => {
    api
      .me()
      .then(() => setStatus("authed"))
      .catch(() => setStatus("anonymous"));
  }, []);

  if (status === "checking") return null;
  if (status === "anonymous") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
