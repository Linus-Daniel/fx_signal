// File: src/store/slices/marketSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { marketAPI } from "../api";

interface MarketData {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

interface MarketSentiment {
  pair: string;
  sentiment: number; // -100 to 100
  lastUpdated: string;
}

interface MarketState {
  marketData: MarketData[];
  marketSentiment: MarketSentiment[];
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
  connectionStatus: "connected" | "connecting" | "disconnected";
}

const initialState: MarketState = {
  marketData: [],
  marketSentiment: [],
  loading: false,
  error: null,
  lastUpdate: null,
  connectionStatus: "disconnected",
};

// Async thunks
export const fetchMarketData = createAsyncThunk(
  "market/fetchMarketData",
  async (
    pairs: string[] = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF"],
    { rejectWithValue }
  ) => {
    try {
      const response = await marketAPI.getMarketData(pairs);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch market data"
      );
    }
  }
);

export const fetchMarketSentiment = createAsyncThunk(
  "market/fetchMarketSentiment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await marketAPI.getMarketSentiment();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch market sentiment"
      );
    }
  }
);

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<"connected" | "connecting" | "disconnected">
    ) => {
      state.connectionStatus = action.payload;
    },
    updateMarketData: (state, action: PayloadAction<MarketData[]>) => {
      action.payload.forEach((newData) => {
        const existingIndex = state.marketData.findIndex(
          (data) => data.pair === newData.pair
        );
        if (existingIndex !== -1) {
          state.marketData[existingIndex] = newData;
        } else {
          state.marketData.push(newData);
        }
      });
      state.lastUpdate = Date.now();
    },
    updateSinglePairData: (state, action: PayloadAction<MarketData>) => {
      const existingIndex = state.marketData.findIndex(
        (data) => data.pair === action.payload.pair
      );
      if (existingIndex !== -1) {
        state.marketData[existingIndex] = action.payload;
      } else {
        state.marketData.push(action.payload);
      }
      state.lastUpdate = Date.now();
    },
    updateMarketSentiment: (
      state,
      action: PayloadAction<MarketSentiment[]>
    ) => {
      state.marketSentiment = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch market data
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
        state.lastUpdate = Date.now();
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch market sentiment
    builder.addCase(fetchMarketSentiment.fulfilled, (state, action) => {
      state.marketSentiment = action.payload;
    });
  },
});

export const {
  clearError,
  setConnectionStatus,
  updateMarketData,
  updateSinglePairData,
  updateMarketSentiment,
} = marketSlice.actions;

export default marketSlice.reducer;
