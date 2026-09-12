import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

// The backend has no GET /auth/me — /auth/login and /auth/register both
// return the full AuthResponse (token + user fields) directly, so the
// session is hydrated from that response and cached in localStorage.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("coldchain_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("coldchain_token"));
  const [loading] = useState(false);

  const applySession = useCallback((newToken, newUser) => {
    localStorage.setItem("coldchain_token", newToken);
    localStorage.setItem("coldchain_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("coldchain_token");
    localStorage.removeItem("coldchain_user");
    setToken(null);
    setUser(null);
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const data = res.data; // AuthResponse: { token, userId, name, email, role }
    const userData = { id: data.userId, name: data.name, email: data.email, role: data.role };
    applySession(data.token, userData);
    return data;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    const data = res.data; // AuthResponse, same shape — registration logs the user in
    const userData = { id: data.userId, name: data.name, email: data.email, role: data.role };
    applySession(data.token, userData);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
