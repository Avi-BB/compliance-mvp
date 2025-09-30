import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authAPI, type User, type LoginRequest, type RegisterRequest } from "../api/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  token: string | null
}

const initialState: AuthState = {
  user: {
      id: '34434',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'App',
      role: "viewer",
      organization: 'ABC',
      createdAt: new Date().toISOString(),
    },
  isAuthenticated: true,
  loading: false,
  error: null,
  token: 'mock-jwt-token-34434',
}

export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials)
    return response
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed")
  }
})

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Registration failed")
    }
  },
)

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const user = await authAPI.getCurrentUser()
    return user
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to get current user")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.token = null
      authAPI.logout()
    },
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer
