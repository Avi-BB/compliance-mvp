"use client"

import { useState } from "react"
import { Box, Typography, Rating, Avatar, Button, TextField, Card, CardContent, Divider } from "@mui/material"
import { Crown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Rating as RatingType } from "@/lib/types"

interface RatingsListProps {
  ratings: RatingType[]
}

export function RatingsList({ ratings }: RatingsListProps) {
  const [newRating, setNewRating] = useState(0)
  const [newReview, setNewReview] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const handleSubmitReview = () => {
    if (!isAuthenticated || newRating === 0) return

    // In real app, submit to API
    console.log("Submitting review:", { rating: newRating, review: newReview })

    // Reset form
    setNewRating(0)
    setNewReview("")
    setShowReviewForm(false)
  }

  const sortedRatings = [...ratings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Box>
      {/* Add Review Section */}
      {isAuthenticated && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {!showReviewForm ? (
              <Button variant="outlined" onClick={() => setShowReviewForm(true)} fullWidth>
                Write a Review
              </Button>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Rating:
                  </Typography>
                  <Rating value={newRating} onChange={(event, newValue) => setNewRating(newValue || 0)} size="large" />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Share your experience with this prompt pack..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={handleSubmitReview} disabled={newRating === 0}>
                    Submit Review
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowReviewForm(false)
                      setNewRating(0)
                      setNewReview("")
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {sortedRatings.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to review this prompt pack!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sortedRatings.map((rating, index) => (
            <Box key={rating.id}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar src={rating.user?.avatarUrl} sx={{ width: 40, height: 40 }}>
                  {rating.user?.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {rating.user?.fullName || rating.user?.username}
                    </Typography>
                    {rating.user?.isVerified && <Crown size={14} color="#F59E0B" />}
                    <Rating value={rating.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {rating.review && (
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {rating.review}
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < sortedRatings.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
