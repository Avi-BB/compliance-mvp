"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService, type AuthUser, type AuthState } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          //const user = await authService.login(email, password)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email: string, password: string, username: string, fullName?: string) => {
        set({ isLoading: true })
        try {
          const user = await authService.register(email, password, username, fullName)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
          set({ user: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateProfile: async (updates: Partial<AuthUser>) => {
        set({ isLoading: true })
        try {
          const user = await authService.updateProfile(updates)
          set({ user, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      initialize: async () => {
        set({ isLoading: true })
        try {
          const user = await authService.getCurrentUser()
          set({ user, isAuthenticated: !!user, isLoading: false })
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
