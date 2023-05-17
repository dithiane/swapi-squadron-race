import { createTheme } from "@mui/material/styles"
import { WHITE, BLACK, LIGHT_BLUE, BLUE } from "./colors"


export const theme = createTheme({
    palette: {
        primary: {
            light: LIGHT_BLUE,
            main: BLUE,
        },
        background: {
            light: WHITE,
            main: BLACK,
        },
    },
})