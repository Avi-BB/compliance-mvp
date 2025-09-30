// Mock authentication utilities
// In a real app, this would integrate with your chosen auth provider

export interface AuthUser {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  isVerified: boolean
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock auth functions - replace with real implementation
export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    // Mock login - in real app, call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    if (email === "demo@example.com" && password === "demo123") {
      const user: AuthUser = {
        id: "demo-user",
        email: "demo@example.com",
        username: "demouser",
        fullName: "Demo User",
        avatarUrl: "/professional-man-avatar.png",
        isVerified: true,
      }
      // persist for initialize/getCurrentUser parity
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(user))
      }
      return user
    }

    throw new Error("Invalid credentials")
  },

  async register(email: string, password: string, username: string, fullName?: string): Promise<AuthUser> {
    // Mock registration - in real app, call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    const user: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      username,
      fullName,
      isVerified: false,
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("auth-user", JSON.stringify(user))
    }

    return user
  },

  async logout(): Promise<void> {
    // Mock logout
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-user")
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // Mock get current user - in real app, validate token/session
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth-user") : null
    return stored ? JSON.parse(stored) : null
  },

  async updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    // Mock profile update
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const current = await this.getCurrentUser()
    if (!current) throw new Error("Not authenticated")

    const updated = { ...current, ...updates }
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-user", JSON.stringify(updated))
    }
    return updated
  },
}