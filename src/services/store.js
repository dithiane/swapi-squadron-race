import { configureStore } from "@reduxjs/toolkit";

import squadrons from "./squadrons";

export const store = configureStore({
    reducer: {
        squadrons,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})