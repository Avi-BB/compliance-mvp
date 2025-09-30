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
  CircularProgress,
} from "@mui/material"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }
  }

  return (
    <Card sx={{ width: "100%", maxWidth: 480, mx: "auto" }}>
      <CardHeader
        title={
          <Typography component="h1" variant="h5" fontWeight={700} textAlign="center">
            Sign In
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Enter your credentials to access your account
          </Typography>
        }
      />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <CardContent sx={{ pt: 0, display: "grid", gap: 2 }}>
          {error && (
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          )}

          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            fullWidth
          />

          <TextField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <Box sx={{ textAlign: "right" }}>
            <Button component={Link} href="/forgot-password" size="small">
              Forgot your password?
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, flexDirection: "column", alignItems: "stretch", gap: 1.5 }}>
          <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
            {isLoading ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} thickness={5} /> Signing in...
              </Box>
            ) : (
              "Sign In"
            )}
          </Button>

          <Divider flexItem />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don't have an account? <Button component={Link} href="/register">Sign up</Button>
          </Typography>

          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ bgcolor: "grey.50", p: 1, borderRadius: 1 }}>
            Demo: email: demo@example.com, password: demo123
          </Typography>
        </CardActions>
      </Box>
    </Card>
  )
}