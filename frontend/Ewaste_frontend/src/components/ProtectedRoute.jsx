import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function ({ role, children }) {
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);

  if (!payload || payload.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
