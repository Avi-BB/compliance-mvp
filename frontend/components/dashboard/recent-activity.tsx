"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
} from "@mui/material"
import { Download, Heart, Star, MessageCircle, Eye } from "lucide-react"

interface ActivityItem {
  id: string
  type: "download" | "like" | "rating" | "comment" | "view"
  packTitle: string
  userName?: string
  userAvatar?: string
  timestamp: string
  rating?: number
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Mock activity data - in real app, fetch from API
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        type: "download",
        packTitle: "Ultimate Copywriting Toolkit",
        userName: "john_doe",
        userAvatar: "/professional-man-avatar.png",
        timestamp: "2 hours ago",
      },
      {
        id: "2",
        type: "like",
        packTitle: "Code Documentation Master",
        userName: "sarah_dev",
        timestamp: "4 hours ago",
      },
      {
        id: "3",
        type: "rating",
        packTitle: "Creative Writing Prompts",
        userName: "writer_mike",
        timestamp: "6 hours ago",
        rating: 5,
      },
      {
        id: "4",
        type: "comment",
        packTitle: "Data Analysis Assistant",
        userName: "analyst_jane",
        timestamp: "1 day ago",
      },
      {
        id: "5",
        type: "view",
        packTitle: "Ultimate Copywriting Toolkit",
        timestamp: "2 days ago",
      },
    ]
    setActivities(mockActivities)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "download":
        return <Download size={16} />
      case "like":
        return <Heart size={16} />
      case "rating":
        return <Star size={16} />
      case "comment":
        return <MessageCircle size={16} />
      case "view":
        return <Eye size={16} />
      default:
        return <Eye size={16} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "download":
        return "primary"
      case "like":
        return "error"
      case "rating":
        return "warning"
      case "comment":
        return "info"
      case "view":
        return "default"
      default:
        return "default"
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "download":
        return `${activity.userName} downloaded "${activity.packTitle}"`
      case "like":
        return `${activity.userName} liked "${activity.packTitle}"`
      case "rating":
        return `${activity.userName} rated "${activity.packTitle}" ${activity.rating} stars`
      case "comment":
        return `${activity.userName} commented on "${activity.packTitle}"`
      case "view":
        return `Someone viewed "${activity.packTitle}"`
      default:
        return `Activity on "${activity.packTitle}"`
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List disablePadding>
          {activities.map((activity, index) => (
            <ListItem key={activity.id} divider={index < activities.length - 1} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar
                  src={activity.userAvatar}
                  sx={{ width: 32, height: 32, bgcolor: `${getActivityColor(activity.type)}.light` }}
                >
                  {activity.userName ? activity.userName.charAt(0).toUpperCase() : getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">{getActivityText(activity)}</Typography>
                    <Chip
                      icon={getActivityIcon(activity.type)}
                      label={activity.type}
                      size="small"
                      color={getActivityColor(activity.type) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={activity.timestamp}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
