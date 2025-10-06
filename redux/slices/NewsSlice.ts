// File: src/store/slices/newsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { newsAPI } from "../api";

interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  category: "economic" | "central-bank" | "politics" | "market" | "analysis";
  impact: "low" | "medium" | "high";
  affectedCurrencies: string[];
  imageUrl?: string;
  sourceUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

interface NewsState {
  news: NewsItem[];
  selectedNews: NewsItem | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
  filters: {
    category?: string;
    impact?: string;
    currency?: string;
  };
  lastFetch: number | null;
}

const initialState: NewsState = {
  news: [],
  selectedNews: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  },
  filters: {},
  lastFetch: null,
};

// Async thunks
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (
    params: {
      page?: number;
      limit?: number;
      category?: string;
      impact?: string;
      currency?: string;
      refresh?: boolean;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await newsAPI.getNews(params);
      return {
        ...response.data,
        refresh: params.refresh || false,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (newsId: string, { rejectWithValue }) => {
    try {
      const response = await newsAPI.getNewsById(newsId);
      return response.data.news;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

export const likeNews = createAsyncThunk(
  "news/likeNews",
  async (newsId: string, { rejectWithValue }) => {
    try {
      const response = await newsAPI.likeNews(newsId);
      return { newsId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like news"
      );
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<NewsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearNews: (state) => {
      state.news = [];
      state.pagination.currentPage = 1;
      state.pagination.hasMore = false;
    },
    setSelectedNews: (state, action: PayloadAction<NewsItem | null>) => {
      state.selectedNews = action.payload;
    },
    // Real-time updates
    addNewsRealtime: (state, action: PayloadAction<NewsItem>) => {
      const existingIndex = state.news.findIndex(
        (n) => n._id === action.payload._id
      );
      if (existingIndex === -1) {
        state.news.unshift(action.payload);
      }
    },
    updateNewsRealtime: (
      state,
      action: PayloadAction<Partial<NewsItem> & { _id: string }>
    ) => {
      const newsIndex = state.news.findIndex(
        (n) => n._id === action.payload._id
      );
      if (newsIndex !== -1) {
        state.news[newsIndex] = { ...state.news[newsIndex], ...action.payload };
      }

      if (state.selectedNews && state.selectedNews._id === action.payload._id) {
        state.selectedNews = { ...state.selectedNews, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch news
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload.refresh) {
          state.news = action.payload.news;
        } else {
          state.news.push(...action.payload.news);
        }

        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
          hasMore:
            (action.payload.page || 1) < (action.payload.totalPages || 1),
        };
        state.lastFetch = Date.now();
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch news by ID
    builder
      .addCase(fetchNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNews = action.payload;

        // Update news in array if it exists
        const newsIndex = state.news.findIndex(
          (n) => n._id === action.payload._id
        );
        if (newsIndex !== -1) {
          state.news[newsIndex] = action.payload;
        }
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Like news
    builder.addCase(likeNews.fulfilled, (state, action) => {
      const newsIndex = state.news.findIndex(
        (n) => n._id === action.payload.newsId
      );
      if (newsIndex !== -1) {
        state.news[newsIndex].likes += 1;
      }
    });
  },
});

export const {
  clearError,
  setFilters,
  clearNews,
  setSelectedNews,
  addNewsRealtime,
  updateNewsRealtime,
} = newsSlice.actions;

export default newsSlice.reducer;
