// File: src/store/slices/analyticsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { analyticsAPI } from "../api";

interface AIInsight {
  currencyPair: string;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  sentiment: "bullish" | "bearish" | "neutral";
  keyPoints: string[];
  lastUpdated: string;
  patterns: string[];
  supportLevel?: number;
  resistanceLevel?: number;
}

interface PerformanceData {
  period: string;
  winRate: number;
  totalSignals: number;
  profitLoss: number;
  bestPair: string;
  worstPair: string;
}

interface AnalyticsState {
  aiInsights: AIInsight[];
  performance: PerformanceData[];
  marketSentiment: number; // -100 to 100
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

const initialState: AnalyticsState = {
  aiInsights: [],
  performance: [],
  marketSentiment: 0,
  loading: false,
  error: null,
  lastUpdate: null,
};

// Async thunks
export const fetchAIInsights = createAsyncThunk(
  "analytics/fetchAIInsights",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getAIInsights();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch AI insights"
      );
    }
  }
);

export const fetchPerformanceData = createAsyncThunk(
  "analytics/fetchPerformanceData",
  async (period: "7d" | "30d" | "90d" | "1y" = "30d", { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getPerformanceData(period);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch performance data"
      );
    }
  }
);

export const fetchMarketSentiment = createAsyncThunk(
  "analytics/fetchMarketSentiment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getMarketSentiment();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch market sentiment"
      );
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAIInsightsRealtime: (state, action: PayloadAction<AIInsight[]>) => {
      state.aiInsights = action.payload;
      state.lastUpdate = Date.now();
    },
    updateMarketSentimentRealtime: (state, action: PayloadAction<number>) => {
      state.marketSentiment = action.payload;
      state.lastUpdate = Date.now();
    },
  },
  extraReducers: (builder) => {
    // Fetch AI insights
    builder
      .addCase(fetchAIInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.aiInsights = action.payload;
        state.lastUpdate = Date.now();
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch performance data
    builder.addCase(fetchPerformanceData.fulfilled, (state, action) => {
      state.performance = action.payload;
    });

    // Fetch market sentiment
    builder.addCase(fetchMarketSentiment.fulfilled, (state, action) => {
      state.marketSentiment = action.payload.sentiment;
    });
  },
});

export const {
  clearError,
  updateAIInsightsRealtime,
  updateMarketSentimentRealtime,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
