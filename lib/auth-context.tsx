"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type UserRole = "customer" | "employee" | "admin";

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  employeeId?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (
    identifier: string,
    password?: string
  ) => { success: boolean; error?: string };
  loginWithMobile: (mobile: string) => { success: boolean; error?: string };
  checkUserExists: (mobile: string) => boolean;
  register: (user: Omit<User, "id">) => {
    success: boolean;
    user?: User;
    error?: string;
  };
  logout: () => void;
  getOtp: (mobile: string) => string;
  verifyOtp: (otp: string) => boolean;
  generateOtp: () => string;
  pendingOtp: string | null;
  changePassword: (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => { success: boolean; error?: string };
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

let employeeCounter = 10001;

const defaultAdmin: User & { password?: string } = {
  id: "admin-001",
  name: "Admin",
  mobile: "9999999999",
  role: "admin",
  password: "Admin@123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    defaultAdmin,
  ]);
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);

  const generateOtp = useCallback(() => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtp(otp);
    return otp;
  }, []);

  // Simulate sending OTP (in real app, this would trigger SMS API)
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

  const checkUserExists = useCallback((mobile: string) => {
    return users.some((u) => u.mobile === mobile || u.employeeId === mobile);
  }, [users]);

  const loginWithMobile = useCallback((mobile: string) => {
    const found = users.find((u) => u.mobile === mobile || u.employeeId === mobile);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, error: "User not found" };
  }, [users]);

  const login = useCallback(
    (identifier: string, password?: string) => {
      const found = users.find(
        (u) =>
          u.mobile === identifier ||
          u.employeeId === identifier ||
          (u.role === "admin" && u.name.toLowerCase() === identifier.toLowerCase())
      );

      if (found) {
        // If password is provided, verify it (mostly for Admin)
        if (password && found.password === password) {
          setUser(found);
          return { success: true };
        }
        // If no password provided, strictly fail if it's password-based login flow
        if (password && found.password !== password) {
          return { success: false, error: "Invalid credentials" };
        }
        // This path shouldn't really be hit if we use loginWithMobile for OTP
      }
      return { success: false, error: "Invalid credentials" };
    },
    [users]
  );

  const register = useCallback(
    (userData: Omit<User, "id">) => {
      const exists = users.find((u) => u.mobile === userData.mobile);
      if (exists) {
        return { success: false, error: "Mobile number already registered" };
      }

      let newUser: User;

      if (userData.role === "employee") {
        const empId = String(employeeCounter++);
        newUser = {
          ...userData,
          id: `emp-${empId}`,
          employeeId: empId,
        };
      } else {
        newUser = {
          ...userData,
          id: `cust-${Date.now()}`,
        };
      }

      setUsers((prev) => [...prev, newUser]);
      setUser(newUser);
      return { success: true, user: newUser };
    },
    [users]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const changePassword = useCallback(
    (userId: string, oldPassword: string, newPassword: string) => {
      const foundIdx = users.findIndex(
        (u) => u.id === userId && u.password === oldPassword
      );
      if (foundIdx === -1) {
        return { success: false, error: "Current password is incorrect" };
      }
      setUsers((prev) => {
        const updated = [...prev];
        updated[foundIdx] = { ...updated[foundIdx], password: newPassword };
        return updated;
      });
      return { success: true };
    },
    [users]
  );

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
    setUsers((prev) =>
      prev.map((u) => (u.id === user?.id ? { ...u, ...userData } : u))
    );
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
