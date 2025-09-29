import { configureStore } from "@reduxjs/toolkit"
import documentsReducer from "./slices/documentsSlice"
import assessmentsReducer from "./slices/assessmentsSlice"
import findingsReducer from "./slices/findingsSlice"
import authReducer from "./slices/authSlice"
import remediationReducer from "./slices/remediationSlice"

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    assessments: assessmentsReducer,
    findings: findingsReducer,
    auth: authReducer,
    remediation: remediationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
