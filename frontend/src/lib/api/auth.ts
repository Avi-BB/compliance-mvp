export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  organization: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "compliance_officer" | "auditor" | "viewer"
  organization: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Mock API functions - in real app these would call actual endpoints
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (credentials.email === "admin@company.com" && credentials.password === "password") {
      const user: User = {
        id: "1",
        email: "admin@company.com",
        firstName: "John",
        lastName: "Smith",
        role: "admin",
        organization: "ACME Corp",
        createdAt: "2023-06-01T00:00:00Z",
      }

      const token = "mock-jwt-token-" + Date.now()

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }

      return { user, token }
    }

    throw new Error("Invalid credentials")
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email already exists (mock check)
    if (userData.email === "admin@company.com") {
      throw new Error("Email already exists")
    }

    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "viewer",
      organization: userData.organization,
      createdAt: new Date().toISOString(),
    }

    const token = "mock-jwt-token-" + Date.now()

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }

    return { user, token }
  },

  logout: async (): Promise<void> => {
    // Remove token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    // Check if token exists
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // In real app, validate token with backend
        return {
          id: "1",
          email: "admin@company.com",
          firstName: "John",
          lastName: "Smith",
          role: "admin",
          organization: "ACME Corp",
          createdAt: "2023-06-01T00:00:00Z",
        }
      }
    }
    return null
  },
}
