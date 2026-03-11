import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "member" | "admin";

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  instagramHandle?: string;
  profileImage?: string;
  role: UserRole;
  joinedAt: string;
  notificationsEnabled: boolean;
  eventsAttended: number;
  challengesCompleted: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: Omit<User, "id" | "joinedAt" | "eventsAttended" | "challengesCompleted"> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "@connectclub_user";

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "admin-001",
    fullName: "Jenna",
    username: "jenna",
    email: "jenna@connectclub.com",
    password: "admin123",
    phone: "+44 7700 900001",
    city: "London",
    instagramHandle: "@jenna",
    role: "admin",
    joinedAt: "2024-01-01T00:00:00Z",
    notificationsEnabled: true,
    eventsAttended: 42,
    challengesCompleted: 15,
  },
  {
    id: "user-001",
    fullName: "Sofia Martinez",
    username: "sofia_m",
    email: "sofia@example.com",
    password: "password123",
    phone: "+44 7700 900002",
    city: "London",
    instagramHandle: "@sofia_m",
    role: "member",
    joinedAt: "2024-03-15T00:00:00Z",
    notificationsEnabled: true,
    eventsAttended: 8,
    challengesCompleted: 3,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      throw new Error("Invalid email or password");
    }
    const { password: _, ...userData } = found;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const signup = useCallback(async (data: Omit<User, "id" | "joinedAt" | "eventsAttended" | "challengesCompleted"> & { password: string }) => {
    const { password: _, ...rest } = data;
    const newUser: User = {
      ...rest,
      id: `user-${Date.now()}`,
      joinedAt: new Date().toISOString(),
      eventsAttended: 0,
      challengesCompleted: 0,
      role: "member",
    };
    const allUsers = await AsyncStorage.getItem("@connectclub_all_users");
    const users = allUsers ? JSON.parse(allUsers) : [];
    users.push({ ...newUser, password: data.password });
    await AsyncStorage.setItem("@connectclub_all_users", JSON.stringify(users));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
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
