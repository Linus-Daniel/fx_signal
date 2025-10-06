// File: src/store/api/marketAPI.ts
import { apiClient } from "./ApiClient";

export const marketAPI = {
  getMarketData: (pairs: string[] = []) => {
    const queryParams = pairs.length > 0 ? `?pairs=${pairs.join(",")}` : "";
    return apiClient.get(`/market/data${queryParams}`);
  },

  getMarketSentiment: () => {
    return apiClient.get("/market/sentiment");
  },

  getCurrencyPairData: (pair: string, timeframe: string = "1H") => {
    return apiClient.get(`/market/pair/${pair}?timeframe=${timeframe}`);
  },

  getHistoricalData: (pair: string, period: string = "1M") => {
    return apiClient.get(`/market/historical/${pair}?period=${period}`);
  },

  getEconomicCalendar: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    return apiClient.get(
      `/market/economic-calendar${queryString ? `?${queryString}` : ""}`
    );
  },

  getMarketOverview: () => {
    return apiClient.get("/market/overview");
  },

  getTechnicalIndicators: (pair: string, indicators: string[] = []) => {
    const queryParams =
      indicators.length > 0 ? `?indicators=${indicators.join(",")}` : "";
    return apiClient.get(`/market/technical/${pair}${queryParams}`);
  },
};
