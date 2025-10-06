// File: src/store/api/analyticsAPI.ts
import { apiClient } from "./ApiClient";

export const analyticsAPI = {
  getAIInsights: () => {
    return apiClient.get("/analytics/ai-insights");
  },

  getPerformanceData: (period: "7d" | "30d" | "90d" | "1y" = "30d") => {
    return apiClient.get(`/analytics/performance?period=${period}`);
  },

  getMarketSentiment: () => {
    return apiClient.get("/analytics/sentiment");
  },

  getTechnicalAnalysis: (currencyPair: string) => {
    return apiClient.get(`/analytics/technical/${currencyPair}`);
  },

  getSignalPerformance: (signalId?: string, providerId?: string) => {
    const params = new URLSearchParams();
    if (signalId) params.append("signalId", signalId);
    if (providerId) params.append("providerId", providerId);

    const queryString = params.toString();
    return apiClient.get(
      `/analytics/signal-performance${queryString ? `?${queryString}` : ""}`
    );
  },

  getUserAnalytics: () => {
    return apiClient.get("/analytics/user");
  },

  getPortfolioAnalysis: () => {
    return apiClient.get("/analytics/portfolio");
  },

  getMarketCorrelations: () => {
    return apiClient.get("/analytics/correlations");
  },

  getVolatilityAnalysis: () => {
    return apiClient.get("/analytics/volatility");
  },

  getRiskMetrics: () => {
    return apiClient.get("/analytics/risk-metrics");
  },

  getPatternAnalysis: (currencyPair: string) => {
    return apiClient.get(`/analytics/patterns/${currencyPair}`);
  },
};
