import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService, AuthUser } from "../services/authService";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  setSession: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((currentUser) => setUser(currentUser))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async setSession(token: string) {
        localStorage.setItem("token", token);
        const userData = await authService.me();
        setUser(userData);
      },
      logout() {
        localStorage.removeItem("token");
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
