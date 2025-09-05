import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../utils/api";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: "FARMER" | "BUYER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "FARMER" | "BUYER" | "ADMIN"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/users/me");
          // ✅ backend returns user object directly
          setUser(res.data);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data.data;
      if (!token || !user) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      setUser(user);

      alert(`✅ Logged in as ${user.name} (${user.role})`);
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "FARMER" | "BUYER" | "ADMIN"
  ) => {
    try {
      await api.post("/auth/register", { name, email, password, role });
      alert(`🎉 Registered successfully as ${role}`);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Register failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("👋 Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
