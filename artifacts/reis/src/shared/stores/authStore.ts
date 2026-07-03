// ═══════════════════════════════════════════════════════════════════
// Auth Store — Session & user state management
// ═══════════════════════════════════════════════════════════════════
import { create } from "zustand";
import type { User } from "@/shared/types";
import { mockUser } from "@/shared/lib/mockData";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email: string, _password: string) => {
    set({ isLoading: true });
    // Mock login — simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    set({
      user: { ...mockUser, name, email },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
