// File: src/services/newsAggregatorService.ts
import { externalNewsService } from "./externalNewsService";
import { cacheService } from "./cachedService";

interface NewsFilters {
  category?: "economic" | "central-bank" | "politics" | "market" | "analysis";
  impact?: "low" | "medium" | "high";
  currency?: string;
  sentiment?: "positive" | "negative" | "neutral";
  dateFrom?: string;
  dateTo?: string;
  sources?: string[];
  limit?: number;
}

class NewsAggregatorService {
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private lastRefresh = 0;

  async getNews(filters: NewsFilters = {}): Promise<any[]> {
    try {
      // Check if we need to refresh
      const now = Date.now();
      const shouldRefresh = now - this.lastRefresh > this.REFRESH_INTERVAL;

      let allNews = [];

      if (shouldRefresh) {
        // Fetch fresh news from all sources
        allNews = await externalNewsService.fetchAllNews({
          includeNewsAPI: true,
          includeAlphaVantage: true,
          includeFinage: true,
          includeRSS: true,
          maxArticles: 200,
        });

        // Cache the results
        await cacheService.set(
          "aggregated_news",
          allNews,
          this.REFRESH_INTERVAL
        );
        this.lastRefresh = now;
      } else {
        // Use cached results
        const cached = await cacheService.get("aggregated_news");
        allNews = Array.isArray(cached) ? cached : [];
      }

      // Apply filters
      return this.applyFilters(allNews, filters);
    } catch (error) {
      console.error("News aggregator error:", error);

      // Return cached results as fallback
      const cached = await cacheService.get("aggregated_news");
      const newsArray = Array.isArray(cached) ? cached : [];
      return this.applyFilters(newsArray, filters);
    }
  }

  async getBreakingNews(): Promise<any[]> {
    const news = await this.getNews({
      impact: "high",
      limit: 10,
    });

    // Filter for very recent news (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    return news.filter(
      (article) => new Date(article.publishedAt) > twoHoursAgo
    );
  }

  async getNewsByCurrency(
    currency: string,
    limit: number = 20
  ): Promise<any[]> {
    return this.getNews({
      currency,
      limit,
    });
  }

  async getEconomicCalendar(
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    try {
      return await externalNewsService.fetchEconomicCalendar(
        startDate,
        endDate
      );
    } catch (error) {
      console.error("Economic calendar error:", error);
      return [];
    }
  }

  private applyFilters(news: any[], filters: NewsFilters): any[] {
    let filteredNews = [...news];

    // Category filter
    if (filters.category) {
      filteredNews = filteredNews.filter(
        (article) => article.category === filters.category
      );
    }

    // Impact filter
    if (filters.impact) {
      filteredNews = filteredNews.filter(
        (article) => article.impact === filters.impact
      );
    }

    // Currency filter
    if (filters.currency) {
      filteredNews = filteredNews.filter((article) =>
        article.affectedCurrencies.includes(filters.currency)
      );
    }

    // Sentiment filter
    if (filters.sentiment) {
      filteredNews = filteredNews.filter(
        (article) => article.sentiment === filters.sentiment
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredNews = filteredNews.filter(
        (article) => new Date(article.publishedAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredNews = filteredNews.filter(
        (article) => new Date(article.publishedAt) <= toDate
      );
    }

    // Sources filter
    if (filters.sources && filters.sources.length > 0) {
      filteredNews = filteredNews.filter((article) =>
        filters.sources!.includes(article.source)
      );
    }

    // Sort by relevance and date
    filteredNews.sort((a, b) => {
      // First sort by relevance score (if available)
      if (a.relevanceScore && b.relevanceScore) {
        if (a.relevanceScore !== b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
      }

      // Then by date (newest first)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    // Apply limit
    if (filters.limit) {
      filteredNews = filteredNews.slice(0, filters.limit);
    }

    return filteredNews;
  }

  // Get available news sources
  getAvailableSources(): string[] {
    return [
      "NewsAPI",
      "Alpha Vantage",
      "Finage",
      "MarketWatch",
      "Reuters",
      "Forex Factory",
    ];
  }

  // Get news statistics
  async getNewsStats(): Promise<{
    totalArticles: number;
    sourceBreakdown: { [source: string]: number };
    categoryBreakdown: { [category: string]: number };
    impactBreakdown: { [impact: string]: number };
    lastUpdate: string;
  }> {
    const news = await this.getNews();

    const sourceBreakdown: { [source: string]: number } = {};
    const categoryBreakdown: { [category: string]: number } = {};
    const impactBreakdown: { [impact: string]: number } = {};

    news.forEach((article) => {
      sourceBreakdown[article.source] =
        (sourceBreakdown[article.source] || 0) + 1;
      categoryBreakdown[article.category] =
        (categoryBreakdown[article.category] || 0) + 1;
      impactBreakdown[article.impact] =
        (impactBreakdown[article.impact] || 0) + 1;
    });

    return {
      totalArticles: news.length,
      sourceBreakdown,
      categoryBreakdown,
      impactBreakdown,
      lastUpdate: new Date().toISOString(),
    };
  }
}

export const newsAggregatorService = new NewsAggregatorService();
