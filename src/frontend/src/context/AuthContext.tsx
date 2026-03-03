import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

const TEAM_NAMES = [
  "StrikerX",
  "AceBlast",
  "CricKing",
  "PowerPlay",
  "SixMachine",
  "WicketWizard",
  "SpinMaster",
  "CoverDrive",
];

const HARDCODED_USERS: Record<string, string> = {
  player1: "pass123",
  player2: "pass123",
};

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  teamBaseName: string;
  superCoins: number;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  deductCoins: (amount: number) => void;
  addCoins: (amount: number) => void;
}

const STORAGE_KEY = "cric5_auth";

function loadAuthState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthState;
      return parsed;
    }
  } catch {
    // ignore
  }
  return { isLoggedIn: false, username: "", teamBaseName: "", superCoins: 0 };
}

function saveAuthState(state: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getOrCreateTeamBaseName(username: string): string {
  const storageKey = `cric5_teambase_${username}`;
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const name = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
  localStorage.setItem(storageKey, name);
  return name;
}

function getOrCreateCoins(username: string): number {
  const storageKey = `cric5_coins_${username}`;
  const existing = localStorage.getItem(storageKey);
  if (existing !== null) return Number(existing);
  localStorage.setItem(storageKey, "10");
  return 10;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = loadAuthState();
    // Re-sync coins from per-user storage if logged in
    if (saved.isLoggedIn && saved.username) {
      const coins = getOrCreateCoins(saved.username);
      return { ...saved, superCoins: coins };
    }
    return saved;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const expected = HARDCODED_USERS[username];
    if (!expected || expected !== password) return false;

    const teamBaseName = getOrCreateTeamBaseName(username);
    const superCoins = getOrCreateCoins(username);

    const newState: AuthState = {
      isLoggedIn: true,
      username,
      teamBaseName,
      superCoins,
    };
    setAuthState(newState);
    saveAuthState(newState);
    return true;
  }, []);

  const logout = useCallback(() => {
    const newState: AuthState = {
      isLoggedIn: false,
      username: "",
      teamBaseName: "",
      superCoins: 0,
    };
    setAuthState(newState);
    saveAuthState(newState);
  }, []);

  const deductCoins = useCallback((amount: number) => {
    setAuthState((prev) => {
      const newCoins = Math.max(0, prev.superCoins - amount);
      if (prev.username) {
        localStorage.setItem(`cric5_coins_${prev.username}`, String(newCoins));
      }
      const next = { ...prev, superCoins: newCoins };
      saveAuthState(next);
      return next;
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setAuthState((prev) => {
      const newCoins = prev.superCoins + amount;
      if (prev.username) {
        localStorage.setItem(`cric5_coins_${prev.username}`, String(newCoins));
      }
      const next = { ...prev, superCoins: newCoins };
      saveAuthState(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, deductCoins, addCoins }}
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
