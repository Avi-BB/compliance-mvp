"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()
  const router = useRouter()

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
  ]

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!passwordRequirements.every((req) => req.test(formData.password))) {
      setError("Password does not meet requirements")
      return
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    try {
      await register(formData.email, formData.password, formData.username, formData.fullName)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  return (
    <Card sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      <CardHeader
        title={
          <Typography component="h1" variant="h5" fontWeight={700} textAlign="center">
            Create Account
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Join Compliance HealthCheck
          </Typography>
        }
      />

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            )}

            <TextField
              id="email"
              label="Email *"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isLoading}
              required
              fullWidth
            />

            <TextField
              id="username"
              label="Username *"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              disabled={isLoading}
              required
              fullWidth
            />

            <TextField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              disabled={isLoading}
              fullWidth
            />

            <Box>
              <TextField
                id="password"
                label="Password *"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isLoading}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {formData.password && (
                <Box sx={{ mt: 1 }}>
                  <Stack spacing={0.5}>
                    {passwordRequirements.map((req, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {req.test(formData.password) ? (
                          <Check size={14} color="#10B981" />
                        ) : (
                          <X size={14} color="#EF4444" />
                        )}
                        <Typography variant="caption" color={req.test(formData.password) ? "success.main" : "text.secondary"}>
                          {req.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            <TextField
              id="confirmPassword"
              label="Confirm Password *"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              disabled={isLoading}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <X size={14} color="#EF4444" />
                <Typography variant="caption" color="error">
                  Passwords do not match
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, flexDirection: "column", alignItems: "stretch", gap: 1.5 }}>
          <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
            {isLoading ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} thickness={5} /> Creating account...
              </Box>
            ) : (
              "Create Account"
            )}
          </Button>

          <Divider flexItem />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account? <Button component={Link} href="/login">Sign in</Button>
          </Typography>
        </CardActions>
      </Box>
    </Card>
  )
}