import { configureStore } from "@reduxjs/toolkit"
import documentsReducer from "./slices/documentsSlice"
import assessmentsReducer from "./slices/assessmentsSlice"
import findingsReducer from "./slices/findingsSlice"
import authReducer from "./slices/authSlice"
import remediationReducer from "./slices/remediationSlice"
import requirementsReducer from "./slices/requirementsSlice"
import controlsReducer from "./slices/controlsSlice"
import obligationsReducer from "./slices/obligationsSlice"
import penaltiesReducer from "./slices/penaltiesSlice"
import timelinesReducer from "./slices/timelinesSlice"
import attestationsReducer from "./slices/attestationsSlice"
import clarificationsReducer from "./slices/clarificationsSlice"
import auditLogsReducer from "./slices/auditLogsSlice"

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    assessments: assessmentsReducer,
    findings: findingsReducer,
    auth: authReducer,
    remediation: remediationReducer,
    requirements: requirementsReducer,
    controls: controlsReducer,
    obligations: obligationsReducer,
    penalties: penaltiesReducer,
    timelines: timelinesReducer,
    attestations: attestationsReducer,
    clarifications: clarificationsReducer,
    auditLogs: auditLogsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch