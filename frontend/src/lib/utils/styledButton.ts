import { styled } from "@mui/material/styles"
import { Button } from "@mui/material"

export const PrimaryButton = styled(Button)(({ theme }) => ({
  px: 3,
  py: 1.5,
  borderRadius: 18, // same as 2 spacing units
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  background: "linear-gradient(135deg, rgba(69, 56, 202, 1) 0%, rgba(16, 185, 129, 1) 100%)",
  boxShadow: "0 4px 12px rgba(69, 56, 202, 0.25)",
  "&:hover": {
    background: "linear-gradient(135deg, rgba(59, 46, 172, 1) 0%, rgba(14, 165, 115, 1) 100%)",
    boxShadow: "0 6px 20px rgba(69, 56, 202, 0.35)",
  },
  color: '#fff'
}))

