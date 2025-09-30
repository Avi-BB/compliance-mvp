"use client"

import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material"
import { Plus, Search, BookOpen, TrendingUp, Users, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Create New Pack",
      description: "Start building a new prompt pack",
      icon: Plus,
      href: "/create",
      color: "primary",
    },
    {
      title: "Browse Packs",
      description: "Discover community prompt packs",
      icon: Search,
      href: "/browse",
      color: "secondary",
    },
    {
      title: "My Collections",
      description: "Manage your saved collections",
      icon: BookOpen,
      href: "/collections",
      color: "info",
    },
    {
      title: "Analytics",
      description: "View your pack performance",
      icon: TrendingUp,
      href: "/analytics",
      color: "success",
    },
    {
      title: "Community",
      description: "Connect with other creators",
      icon: Users,
      href: "/community",
      color: "warning",
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: Settings,
      href: "/settings",
      color: "default",
    },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.title}>
              <Button
                component={Link}
                href={action.href}
                variant="outlined"
                fullWidth
                sx={{
                  p: 2,
                  height: "auto",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1, width: "100%" }}>
                  <action.icon size={20} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle2" component="div">
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
