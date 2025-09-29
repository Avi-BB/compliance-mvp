import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { Providers } from "./providers"
import { theme } from "../lib/theme"
import { Suspense } from "react"
import AppLayout from "../components/layout/AppLayout"

export const metadata: Metadata = {
  title: "Compliance HealthCheck",
  description: "AI-powered compliance assessment platform for regulated enterprises",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<div>Loading...</div>}>
              <Providers>
                <AppLayout>{children}</AppLayout>
              </Providers>
            </Suspense>
          </ThemeProvider>
        </AppRouterCacheProvider>
        <Analytics />
      </body>
    </html>
  )
}
