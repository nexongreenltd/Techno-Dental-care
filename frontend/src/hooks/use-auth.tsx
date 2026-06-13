import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setToken, clearToken } from "@/lib/api";

export type AppRole = "patient" | "doctor" | "admin";

export type DentalUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: AppRole;
  gender?: string | null;
  dob?: string | null;
};

type AuthState = {
  user: DentalUser | null;
  roles: AppRole[];
  primaryRole: AppRole | null;
  loading: boolean;
  signOut: () => void;
  signIn: (token: string, user: DentalUser) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DentalUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("dental_token") : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await api.get<DentalUser>("/api/auth/me");
      setUser(u);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUser();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      roles: user ? [user.role] : [],
      primaryRole: user?.role ?? null,
      loading,
      signOut: () => {
        clearToken();
        setUser(null);
      },
      signIn: (token: string, u: DentalUser) => {
        setToken(token);
        setUser(u);
      },
      refreshUser: loadUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
