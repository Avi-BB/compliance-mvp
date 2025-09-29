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
      return {
        id: "demo-user",
        email: "demo@example.com",
        username: "demouser",
        fullName: "Demo User",
        avatarUrl: "/professional-man-avatar.png",
        isVerified: true,
      }
    }

    throw new Error("Invalid credentials")
  },

  async register(email: string, password: string, username: string, fullName?: string): Promise<AuthUser> {
    // Mock registration - in real app, call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

    return {
      id: `user-${Date.now()}`,
      email,
      username,
      fullName,
      isVerified: false,
    }
  },

  async logout(): Promise<void> {
    // Mock logout
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // Mock get current user - in real app, validate token/session
    const stored = localStorage.getItem("auth-user")
    return stored ? JSON.parse(stored) : null
  },

  async updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    // Mock profile update
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const current = await this.getCurrentUser()
    if (!current) throw new Error("Not authenticated")

    const updated = { ...current, ...updates }
    localStorage.setItem("auth-user", JSON.stringify(updated))
    return updated
  },
}
