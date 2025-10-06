// File: src/redux/slices/copiedTradesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  SignalCopyService,
  CopiedTrade,
  TradingAccount,
  CopySettings,
  DEFAULT_COPY_SETTINGS,
} from "../../services/signalCopyService";
import { Signal } from "../../components/SignalCard";

interface CopiedTradesState {
  trades: CopiedTrade[];
  activeTrades: CopiedTrade[];
  closedTrades: CopiedTrade[];
  loading: boolean;
  error: string | null;
  selectedAccount: TradingAccount | null;
  copySettings: CopySettings;
}

const initialState: CopiedTradesState = {
  trades: [],
  activeTrades: [],
  closedTrades: [],
  loading: false,
  error: null,
  selectedAccount: null,
  copySettings: DEFAULT_COPY_SETTINGS,
};

// Async thunk to copy a signal
export const copySignalAsync = createAsyncThunk(
  "copiedTrades/copySignal",
  async (
    {
      signal,
      account,
      settings,
    }: {
      signal: Signal;
      account: TradingAccount;
      settings?: CopySettings;
    },
    { rejectWithValue }
  ) => {
    try {
      const copySettings = settings || DEFAULT_COPY_SETTINGS;
      const trade = await SignalCopyService.copySignal(
        signal,
        account,
        copySettings
      );
      return trade;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to copy signal");
    }
  }
);

// Async thunk to close a trade
export const closeTradeAsync = createAsyncThunk(
  "copiedTrades/closeTrade",
  async (tradeId: string, { rejectWithValue }) => {
    try {
      // In production, this would call broker API to close the position
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 500));
      return tradeId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to close trade");
    }
  }
);

const copiedTradesSlice = createSlice({
  name: "copiedTrades",
  initialState,
  reducers: {
    setSelectedAccount: (
      state,
      action: PayloadAction<TradingAccount | null>
    ) => {
      state.selectedAccount = action.payload;
    },
    updateCopySettings: (
      state,
      action: PayloadAction<Partial<CopySettings>>
    ) => {
      state.copySettings = { ...state.copySettings, ...action.payload };
    },
    updateTradeStatus: (
      state,
      action: PayloadAction<{ tradeId: string; status: CopiedTrade["status"] }>
    ) => {
      const trade = state.trades.find((t) => t.id === action.payload.tradeId);
      if (trade) {
        trade.status = action.payload.status;
        if (action.payload.status === "closed") {
          trade.closeTime = new Date();
        }
      }
      // Update filtered arrays
      state.activeTrades = state.trades.filter((t) => t.status === "open");
      state.closedTrades = state.trades.filter((t) => t.status === "closed");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Copy signal
      .addCase(copySignalAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(copySignalAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trades.push(action.payload);
        if (action.payload.status === "open") {
          state.activeTrades.push(action.payload);
        }
      })
      .addCase(copySignalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Close trade
      .addCase(closeTradeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(closeTradeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const trade = state.trades.find((t) => t.id === action.payload);
        if (trade) {
          trade.status = "closed";
          trade.closeTime = new Date();
        }
        state.activeTrades = state.trades.filter((t) => t.status === "open");
        state.closedTrades = state.trades.filter((t) => t.status === "closed");
      })
      .addCase(closeTradeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedAccount,
  updateCopySettings,
  updateTradeStatus,
  clearError,
} = copiedTradesSlice.actions;

export default copiedTradesSlice.reducer;
