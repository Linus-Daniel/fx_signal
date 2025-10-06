// File: src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userAPI } from "../api";

interface UserStats {
  signalsCopied: number;
  successfulTrades: number;
  totalProfit: number;
  winRate: number;
  lastActivityAt?: string;
}

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    signals: boolean;
    news: boolean;
  };
  theme: "light" | "dark" | "auto";
  language: string;
}

interface UserState {
  stats: UserStats;
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
  pushToken?: string;
}

const initialState: UserState = {
  stats: {
    signalsCopied: 0,
    successfulTrades: 0,
    totalProfit: 0,
    winRate: 0,
  },
  preferences: {
    notifications: {
      email: true,
      push: true,
      signals: true,
      news: true,
    },
    theme: "auto",
    language: "en",
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user stats"
      );
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  "user/updateUserPreferences",
  async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
    try {
      const response = await userAPI.updatePreferences(preferences);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update preferences"
      );
    }
  }
);

export const updatePushToken = createAsyncThunk(
  "user/updatePushToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await userAPI.updatePushToken(token);
      return { token, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update push token"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStatsRealtime: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    updateLocalPreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setPushToken: (state, action: PayloadAction<string>) => {
      state.pushToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch user stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update push token
    builder.addCase(updatePushToken.fulfilled, (state, action) => {
      state.pushToken = action.payload.token;
    });
  },
});

export const {
  clearError,
  updateStatsRealtime,
  updateLocalPreferences,
  setPushToken,
} = userSlice.actions;

export default userSlice.reducer;
