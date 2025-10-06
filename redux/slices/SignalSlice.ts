// File: src/store/slices/signalsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signalAPI } from "../api";

interface Signal {
  _id: string;
  currencyPair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice?: number;
  status: "PENDING" | "ACTIVE" | "CLOSED" | "CANCELLED";
  confidence: number;
  analysis: string;
  technicalAnalysis?: {
    indicators: Array<{
      name: string;
      value: string;
      signal: "bullish" | "bearish" | "neutral";
    }>;
    patterns: string[];
    supportLevel?: number;
    resistanceLevel?: number;
  };
  provider: {
    _id: string;
    name: string;
    verified: boolean;
  };
  pips?: number;
  profitLoss?: number;
  tags: string[];
  views: number;
  copies: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface SignalsState {
  signals: Signal[];
  activeSignals: Signal[];
  userSignals: Signal[];
  selectedSignal: Signal | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
  filters: {
    type?: "BUY" | "SELL" | "ALL";
    status?: "ACTIVE" | "CLOSED" | "PENDING" | "ALL";
    currencyPairs: string[];
    confidence?: "HIGH" | "MEDIUM" | "LOW" | "ALL";
  };
  lastFetch: number | null;
}

const initialState: SignalsState = {
  signals: [],
  activeSignals: [],
  userSignals: [],
  selectedSignal: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
  filters: {
    type: "ALL",
    status: "ALL",
    currencyPairs: [],
    confidence: "ALL",
  },
  lastFetch: null,
};

// Async thunks
export const fetchSignals = createAsyncThunk(
  "signals/fetchSignals",
  async (
    params: {
      page?: number;
      limit?: number;
      type?: string;
      status?: string;
      currencyPairs?: string[];
      confidence?: string;
      refresh?: boolean;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await signalAPI.getSignals(params);
      return {
        ...response.data,
        refresh: params.refresh || false,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch signals"
      );
    }
  }
);

export const fetchSignalById = createAsyncThunk(
  "signals/fetchSignalById",
  async (signalId: string, { rejectWithValue }) => {
    try {
      const response = await signalAPI.getSignalById(signalId);
      return response.data.signal;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch signal"
      );
    }
  }
);

export const copySignal = createAsyncThunk(
  "signals/copySignal",
  async (signalId: string, { rejectWithValue }) => {
    try {
      const response = await signalAPI.copySignal(signalId);
      return { signalId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to copy signal"
      );
    }
  }
);

export const likeSignal = createAsyncThunk(
  "signals/likeSignal",
  async (signalId: string, { rejectWithValue }) => {
    try {
      const response = await signalAPI.likeSignal(signalId);
      return { signalId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like signal"
      );
    }
  }
);

const signalsSlice = createSlice({
  name: "signals",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<SignalsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSignals: (state) => {
      state.signals = [];
      state.pagination.currentPage = 1;
      state.pagination.hasMore = false;
    },
    setSelectedSignal: (state, action: PayloadAction<Signal | null>) => {
      state.selectedSignal = action.payload;
    },
    // Real-time updates
    addSignalRealtime: (state, action: PayloadAction<Signal>) => {
      const existingIndex = state.signals.findIndex(
        (s) => s._id === action.payload._id
      );
      if (existingIndex === -1) {
        state.signals.unshift(action.payload);
        if (action.payload.status === "ACTIVE") {
          state.activeSignals.unshift(action.payload);
        }
      }
    },
    updateSignalRealtime: (
      state,
      action: PayloadAction<Partial<Signal> & { _id: string }>
    ) => {
      const signalId = action.payload._id;

      // Update in main signals array
      const signalIndex = state.signals.findIndex((s) => s._id === signalId);
      if (signalIndex !== -1) {
        state.signals[signalIndex] = {
          ...state.signals[signalIndex],
          ...action.payload,
        };
      }

      // Update in active signals array
      const activeIndex = state.activeSignals.findIndex(
        (s) => s._id === signalId
      );
      if (activeIndex !== -1) {
        if (action.payload.status === "ACTIVE") {
          state.activeSignals[activeIndex] = {
            ...state.activeSignals[activeIndex],
            ...action.payload,
          };
        } else {
          state.activeSignals.splice(activeIndex, 1);
        }
      } else if (action.payload.status === "ACTIVE") {
        const signal = state.signals.find((s) => s._id === signalId);
        if (signal) {
          state.activeSignals.push({ ...signal, ...action.payload });
        }
      }

      // Update selected signal if it matches
      if (state.selectedSignal && state.selectedSignal._id === signalId) {
        state.selectedSignal = { ...state.selectedSignal, ...action.payload };
      }
    },
    removeSignalRealtime: (state, action: PayloadAction<string>) => {
      const signalId = action.payload;
      state.signals = state.signals.filter((s) => s._id !== signalId);
      state.activeSignals = state.activeSignals.filter(
        (s) => s._id !== signalId
      );
      if (state.selectedSignal && state.selectedSignal._id === signalId) {
        state.selectedSignal = null;
      }
    },
    updatePriceRealtime: (
      state,
      action: PayloadAction<{
        currencyPair: string;
        price: number;
        timestamp: number;
      }>
    ) => {
      const { currencyPair, price } = action.payload;

      // Update all signals for this currency pair
      state.signals.forEach((signal) => {
        if (signal.currencyPair === currencyPair) {
          signal.currentPrice = price;
          // Recalculate pips if signal is active
          if (signal.status === "ACTIVE") {
            const priceDiff =
              signal.type === "BUY"
                ? price - signal.entryPrice
                : signal.entryPrice - price;
            signal.pips = Math.round(priceDiff * 10000);
          }
        }
      });

      // Update active signals
      state.activeSignals.forEach((signal) => {
        if (signal.currencyPair === currencyPair) {
          signal.currentPrice = price;
          const priceDiff =
            signal.type === "BUY"
              ? price - signal.entryPrice
              : signal.entryPrice - price;
          signal.pips = Math.round(priceDiff * 10000);
        }
      });

      // Update selected signal
      if (
        state.selectedSignal &&
        state.selectedSignal.currencyPair === currencyPair
      ) {
        state.selectedSignal.currentPrice = price;
        if (state.selectedSignal.status === "ACTIVE") {
          const priceDiff =
            state.selectedSignal.type === "BUY"
              ? price - state.selectedSignal.entryPrice
              : state.selectedSignal.entryPrice - price;
          state.selectedSignal.pips = Math.round(priceDiff * 10000);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch signals
    builder
      .addCase(fetchSignals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload.refresh) {
          state.signals = action.payload.signals;
        } else {
          state.signals.push(...action.payload.signals);
        }

        state.activeSignals = action.payload.signals.filter(
          (s) => s.status === "ACTIVE"
        );
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
          hasMore:
            (action.payload.page || 1) < (action.payload.totalPages || 1),
        };
        state.lastFetch = Date.now();
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch signal by ID
    builder
      .addCase(fetchSignalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSignalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSignal = action.payload;

        // Update signal in arrays if it exists
        const signalIndex = state.signals.findIndex(
          (s) => s._id === action.payload._id
        );
        if (signalIndex !== -1) {
          state.signals[signalIndex] = action.payload;
        }
      })
      .addCase(fetchSignalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Copy signal
    builder.addCase(copySignal.fulfilled, (state, action) => {
      const signalIndex = state.signals.findIndex(
        (s) => s._id === action.payload.signalId
      );
      if (signalIndex !== -1) {
        state.signals[signalIndex].copies += 1;
      }
    });

    // Like signal
    builder.addCase(likeSignal.fulfilled, (state, action) => {
      const signalIndex = state.signals.findIndex(
        (s) => s._id === action.payload.signalId
      );
      if (signalIndex !== -1) {
        state.signals[signalIndex].likes += 1;
      }
    });
  },
});

export const {
  clearError,
  setFilters,
  clearSignals,
  setSelectedSignal,
  addSignalRealtime,
  updateSignalRealtime,
  removeSignalRealtime,
  updatePriceRealtime,
} = signalsSlice.actions;

export default signalsSlice.reducer;
