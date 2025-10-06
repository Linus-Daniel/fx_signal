// REACT NATIVE NEWS INTEGRATION COMPONENTS & HOOKS

// File: src/hooks/useExternalNews.ts
import { useState, useEffect, useCallback } from "react";
import { newsAggregatorService } from "../services/newsAggregator";

interface NewsFilters {
  category?: "economic" | "central-bank" | "politics" | "market" | "analysis";
  impact?: "low" | "medium" | "high";
  currency?: string;
  sentiment?: "positive" | "negative" | "neutral";
  sources?: string[];
  limit?: number;
}

interface UseExternalNewsReturn {
  news: any[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  breakingNews: any[];
  economicEvents: any[];
  newsStats: any;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  filters: NewsFilters;
  setFilters: (filters: NewsFilters) => void;
}

export const useExternalNews = (
  initialFilters: NewsFilters = {}
): UseExternalNewsReturn => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [economicEvents, setEconomicEvents] = useState<any[]>([]);
  const [newsStats, setNewsStats] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<NewsFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNews = useCallback(
    async (isRefresh = false, loadMore = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
          setCurrentPage(1);
        } else if (!loadMore) {
          setLoading(true);
        }

        setError(null);

        const page = loadMore ? currentPage + 1 : 1;
        const limit = 20;

        const newNews = await newsAggregatorService.getNews({
          ...filters,
          limit: limit * page,
        });

        if (loadMore) {
          const startIndex = currentPage * limit;
          const newItems = newNews.slice(startIndex);

          if (newItems.length === 0) {
            setHasMore(false);
          } else {
            setNews((prev) => [...prev, ...newItems]);
            setCurrentPage(page);
          }
        } else {
          setNews(newNews);
          setCurrentPage(1);
          setHasMore(newNews.length >= limit);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, currentPage]
  );

  const fetchBreakingNews = useCallback(async () => {
    try {
      const breaking = await newsAggregatorService.getBreakingNews();
      setBreakingNews(breaking);
    } catch (err) {
      console.error("Error fetching breaking news:", err);
    }
  }, []);

  const fetchEconomicEvents = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const events = await newsAggregatorService.getEconomicCalendar(
        today,
        nextWeek
      );
      setEconomicEvents(events);
    } catch (err) {
      console.error("Error fetching economic events:", err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await newsAggregatorService.getNewsStats();
      setNewsStats(stats);
    } catch (err) {
      console.error("Error fetching news stats:", err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNews(true),
      fetchBreakingNews(),
      fetchEconomicEvents(),
      fetchStats(),
    ]);
  }, [fetchNews, fetchBreakingNews, fetchEconomicEvents, fetchStats]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchNews(false, true);
  }, [hasMore, loading, fetchNews]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (filters !== initialFilters) {
      fetchNews();
    }
  }, [filters, fetchNews]);

  return {
    news,
    loading,
    error,
    refreshing,
    breakingNews,
    economicEvents,
    newsStats,
    refresh,
    loadMore,
    hasMore,
    filters,
    setFilters,
  };
};