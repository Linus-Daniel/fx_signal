// COMPLETE REDUX STORE & SLICES FOR REACT NATIVE APP

// File: src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import signalsReducer from "../slices/SignalSlice";
import marketReducer from "../slices/MarketSlice";
import newsReducer from "../slices/NewsSlice";
import userReducer from "../slices/UserSlice";
import analyticsReducer from "../slices/AnalyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signals: signalsReducer,
    market: marketReducer,
    news: newsReducer,
    user: userReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
