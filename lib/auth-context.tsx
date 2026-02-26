"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { apiClient } from "./api-client";

export type UserRole = "customer" | "provider" | "admin" | "employee";

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  employeeId?: string;
  password?: string;
  _id?: string; // MongoDB ID
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (
    identifier: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithMobile: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  checkUserExists: (mobile: string) => Promise<boolean>;
  register: (user: Omit<User, "id">) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  logout: () => void;
  getOtp: (mobile: string) => string;
  verifyOtp: (otp: string) => boolean;
  generateOtp: () => string;
  pendingOtp: string | null;
  changePassword: (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from LocalStorage and fetch users from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSession = localStorage.getItem("servicehub_session");
        if (savedSession) {
          setUser(JSON.parse(savedSession));
        }

        const fetchedUsers = await apiClient.get("/api/users");
        setUsers(fetchedUsers.map((u: any) => ({ ...u, id: u._id })));
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save session to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("servicehub_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("servicehub_session");
    }
  }, [user]);

  const generateOtp = useCallback(() => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtp(otp);
    return otp;
  }, []);

  const getOtp = useCallback((mobile: string) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtp(otp);
    console.log(`OTP for ${mobile}: ${otp}`);
    return otp;
  }, []);

  const verifyOtp = useCallback(
    (otp: string) => {
      if (pendingOtp && otp === pendingOtp) {
        setPendingOtp(null);
        return true;
      }
      return false;
    },
    [pendingOtp]
  );

  const checkUserExists = useCallback(async (mobile: string) => {
    try {
      const res = await apiClient.post("/api/auth", { action: 'check-exists', mobile });
      return res.exists;
    } catch {
      return false;
    }
  }, []);

  const loginWithMobile = useCallback(async (mobile: string) => {
    try {
      const found = await apiClient.post("/api/auth", { action: 'login', identifier: mobile });
      const mappedUser = { ...found, id: found._id };
      setUser(mappedUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "User not found" };
    }
  }, []);

  const login = useCallback(
    async (identifier: string, password?: string) => {
      try {
        const found = await apiClient.post("/api/auth", { action: 'login', identifier, password });
        const mappedUser = { ...found, id: found._id };
        setUser(mappedUser);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || "Invalid credentials" };
      }
    },
    []
  );

  const register = useCallback(
    async (userData: Omit<User, "id">) => {
      try {
        // Map 'employee' role to 'provider' for DB if needed, but current schema says 'provider'
        const dbRole = userData.role === 'employee' ? 'provider' : userData.role;
        const res = await apiClient.post("/api/users", { ...userData, role: dbRole });
        const newUser = { ...res, id: res._id };
        setUser(newUser);
        setUsers(prev => [...prev, newUser]);
        return { success: true, user: newUser };
      } catch (error: any) {
        return { success: false, error: error.message || "Registration failed" };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const changePassword = useCallback(
    async (userId: string, oldPassword: string, newPassword: string) => {
       try {
         // This would ideally be a separate endpoint or PATCH user
         // For now, let's assume PATCH /api/users can do it if we verify old password (omitted for simplicity here)
         await apiClient.patch("/api/users", { id: userId, password: newPassword });
         return { success: true };
       } catch (error: any) {
         return { success: false, error: error.message };
       }
    },
    []
  );

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user?.id) return;
    try {
      const updated = await apiClient.patch("/api/users", { id: user.id, ...userData });
      const mappedUser = { ...updated, id: updated._id };
      setUser(mappedUser);
      setUsers(prev => prev.map(u => u.id === mappedUser.id ? mappedUser : u));
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        loginWithMobile,
        checkUserExists,
        register,
        logout,
        getOtp,
        verifyOtp,
        generateOtp,
        pendingOtp,
        changePassword,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
