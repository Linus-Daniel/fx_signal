// File: src/store/api/signalAPI.ts
import { apiClient } from "./ApiClient";

interface GetSignalsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  currencyPairs?: string[];
  confidence?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateSignalData {
  currencyPair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  analysis: string;
  tags?: string[];
  expiresAt?: Date;
}

export const signalAPI = {
  getSignals: (params: GetSignalsParams = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return apiClient.get(`/signals?${queryParams.toString()}`);
  },

  getSignalById: (signalId: string) => {
    return apiClient.get(`/signals/${signalId}`);
  },

  createSignal: (signalData: CreateSignalData) => {
    return apiClient.post("/signals", signalData);
  },

  updateSignal: (signalId: string, updates: Partial<CreateSignalData>) => {
    return apiClient.put(`/signals/${signalId}`, updates);
  },

  deleteSignal: (signalId: string) => {
    return apiClient.delete(`/signals/${signalId}`);
  },

  copySignal: (signalId: string) => {
    return apiClient.post(`/signals/${signalId}/copy`);
  },

  likeSignal: (signalId: string) => {
    return apiClient.post(`/signals/${signalId}/like`);
  },

  getSignalAnalytics: (signalId: string) => {
    return apiClient.get(`/signals/${signalId}/analytics`);
  },

  getUserSignals: (userId?: string) => {
    const url = userId ? `/signals/user/${userId}` : "/signals/my-signals";
    return apiClient.get(url);
  },

  getActiveSignals: () => {
    return apiClient.get("/signals?status=ACTIVE");
  },

  searchSignals: (query: string) => {
    return apiClient.get(`/signals/search?q=${encodeURIComponent(query)}`);
  },
};
