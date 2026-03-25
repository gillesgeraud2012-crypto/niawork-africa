import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "talent" | "artisan" | "entreprise" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string | null;
  skills: string[];
  photoUrl?: string | null;
  points: number;
  level: number;
  badgeCount: number;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "nia_users_db";
const TOKEN_KEY = "nia_token";
const USER_KEY = "nia_user";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateToken() {
  return "local_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

async function getUsers(): Promise<Record<string, { password: string; user: User }>> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveUsers(users: Record<string, { password: string; user: User }>) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Veuillez remplir tous les champs");
    }

    const users = await getUsers();
    const emailKey = email.toLowerCase().trim();
    const record = users[emailKey];

    if (!record) {
      throw new Error("Aucun compte trouvé avec cet email");
    }
    if (record.password !== password) {
      throw new Error("Mot de passe incorrect");
    }

    const newToken = generateToken();
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(record.user)),
    ]);
    setToken(newToken);
    setUser(record.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      if (!name.trim() || !email.trim() || !password.trim()) {
        throw new Error("Veuillez remplir tous les champs");
      }
      if (password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      if (!email.includes("@")) {
        throw new Error("Adresse email invalide");
      }

      const users = await getUsers();
      const emailKey = email.toLowerCase().trim();

      if (users[emailKey]) {
        throw new Error("Un compte existe déjà avec cet email");
      }

      const newUser: User = {
        id: generateId(),
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role,
        bio: null,
        skills: [],
        photoUrl: null,
        points: 50,
        level: 1,
        badgeCount: 0,
        createdAt: new Date().toISOString(),
      };

      users[emailKey] = { password, user: newUser };
      await saveUsers(users);

      const newToken = generateToken();
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
      setToken(newToken);
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
