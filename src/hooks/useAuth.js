import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
import { useState, useEffect } from "react";

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthState({
        user: "Admin User",
        role: "ADMIN",
      });
    }
  }, []);

  return { authState };
}
