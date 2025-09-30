import { useAppDispatch, useAppSelector } from "./index"
import { loginUser, registerUser, logout, clearError } from "../slices/authSlice"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth)

  const login = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }))
    if (loginUser.rejected.match(result)) {
      throw new Error(result.error.message || "Login failed")
    }
    return result.payload
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    organization: string
  }) => {
    const result = await dispatch(registerUser(userData))
    if (registerUser.rejected.match(result)) {
      throw new Error(result.error.message || "Registration failed")
    }
    return result.payload
  }

  const signOut = () => {
    dispatch(logout())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: signOut,
    clearError: clearAuthError,
  }
}
