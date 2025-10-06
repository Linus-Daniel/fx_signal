// File: src/store/api/newsAPI.ts (Updated to use external service)
import { newsAggregatorService } from "../../services/externalNewsService";

interface GetNewsParams {
  page?: number;
  limit?: number;
  category?: string;
  impact?: string;
  currency?: string;
  sentiment?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const newsAPI = {
  getNews: async (params: GetNewsParams = {}) => {
    const news = await newsAggregatorService.getNews({
      category: params.category as any,
      impact: params.impact as any,
      currency: params.currency,
      sentiment: params.sentiment as any,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      limit: params.limit || 20,
    });

    // Simulate API response format
    return {
      data: {
        news,
        total: news.length,
        page: params.page || 1,
        totalPages: Math.ceil(news.length / (params.limit || 20)),
      },
    };
  },

  getNewsById: async (newsId: string) => {
    const allNews = await newsAggregatorService.getNews();
    const news = allNews.find((article) => article.id === newsId);

    return {
      data: { news },
    };
  },

  getBreakingNews: async () => {
    const news = await newsAggregatorService.getBreakingNews();
    return {
      data: news,
    };
  },

  getNewsByCategory: async (category: string) => {
    const news = await newsAggregatorService.getNews({
      category: category as any,
      limit: 50,
    });
    return {
      data: news,
    };
  },

  getNewsByCurrency: async (currency: string) => {
    const news = await newsAggregatorService.getNewsByCurrency(currency);
    return {
      data: news,
    };
  },

  getEconomicCalendar: async (startDate?: string, endDate?: string) => {
    const events = await newsAggregatorService.getEconomicCalendar(
      startDate,
      endDate
    );
    return {
      data: events,
    };
  },

  getNewsStats: async () => {
    const stats = await newsAggregatorService.getNewsStats();
    return {
      data: stats,
    };
  },

  // Keep these for compatibility but they won't do anything
  likeNews: async (newsId: string) => {
    return { data: { message: "News liked" } };
  },

  searchNews: async (query: string) => {
    const allNews = await newsAggregatorService.getNews();
    const filtered = allNews.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase())
    );

    return {
      data: filtered,
    };
  },

  getNewsSources: async () => {
    const sources = newsAggregatorService.getAvailableSources();
    return {
      data: sources,
    };
  },
};
