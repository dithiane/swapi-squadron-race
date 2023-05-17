import { Paper, styled } from "@mui/material"
export const SpacePaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.main,
  width: "100vw",
  height: "100vh",
}))
