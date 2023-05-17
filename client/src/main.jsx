import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { StyledEngineProvider } from "@mui/material/styles"
import { ThemeProvider } from "@mui/material/styles"
import { theme } from "./style/theme.js"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
)
