
import axios, { AxiosResponse } from 'axios';
import { cacheService } from './cachedService';

// News API interfaces
interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface AlphaVantageNews {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

interface FinageNews {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  source: string;
  symbols: string[];
}

// Standardized news article interface
interface StandardizedNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  category: 'economic' | 'central-bank' | 'politics' | 'market' | 'analysis';
  impact: 'low' | 'medium' | 'high';
  affectedCurrencies: string[];
  imageUrl?: string;
  sourceUrl: string;
  publishedAt: string;
  tags: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

class ExternalNewsService {
  private readonly NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || 'your-news-api-key';
  private readonly ALPHA_VANTAGE_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_KEY || 'your-alpha-vantage-key';
  private readonly FINAGE_API_KEY = process.env.EXPO_PUBLIC_FINAGE_KEY || 'your-finage-key';
  
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ARTICLES_PER_SOURCE = 50;

  // Currency keywords for classification
  private readonly CURRENCY_KEYWORDS = {
    USD: ['dollar', 'fed', 'federal reserve', 'united states', 'us economy', 'usd'],
    EUR: ['euro', 'ecb', 'european central bank', 'eurozone', 'europe', 'eur'],
    GBP: ['pound', 'sterling', 'bank of england', 'uk', 'britain', 'gbp'],
    JPY: ['yen', 'bank of japan', 'boj', 'japan', 'japanese', 'jpy'],
    AUD: ['australian dollar', 'rba', 'australia', 'aud'],
    CAD: ['canadian dollar', 'bank of canada', 'canada', 'cad'],
    CHF: ['swiss franc', 'switzerland', 'snb', 'chf'],
    CNY: ['yuan', 'renminbi', 'china', 'pboc', 'cny'],
  };

  // Impact keywords for classification
  private readonly IMPACT_KEYWORDS = {
    high: [
      'interest rate', 'central bank', 'inflation', 'gdp', 'employment',
      'crisis', 'recession', 'emergency', 'intervention', 'policy change',
      'breaking', 'urgent', 'major', 'significant'
    ],
    medium: [
      'economic data', 'trade', 'policy', 'meeting', 'forecast',
      'outlook', 'report', 'announcement', 'statement'
    ],
    low: [
      'comment', 'opinion', 'analysis', 'preview', 'review', 'update'
    ]
  };

  // NewsAPI.org integration
  async fetchNewsAPI(
    category: string = 'business',
    query: string = 'forex OR currency OR "foreign exchange"',
    pageSize: number = 20
  ): Promise<StandardizedNews[]> {
    try {
      const cacheKey = `newsapi_${category}_${query}_${pageSize}`;
      const cached = await cacheService.get<StandardizedNews[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response: AxiosResponse<{ articles: NewsAPIArticle[] }> = await axios.get(
        'https://newsapi.org/v2/everything',
        {
          params: {
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize,
            apiKey: this.NEWS_API_KEY,
          },
          timeout: 10000,
        }
      );

      const standardizedNews = response.data.articles
        .filter(article => article.title && article.description && article.url)
        .map(article => this.standardizeNewsAPIArticle(article))
        .filter(article => article !== null) as StandardizedNews[];

      await cacheService.set(cacheKey, standardizedNews, this.CACHE_DURATION);
      return standardizedNews;

    } catch (error) {
      console.error('NewsAPI fetch error:', error);
      return [];
    }
  }

  // Alpha Vantage News integration
  async fetchAlphaVantageNews(
    topics: string = 'forex,currency',
    limit: number = 20
  ): Promise<StandardizedNews[]> {
    try {
      const cacheKey = `alphavantage_${topics}_${limit}`;
      const cached = await cacheService.get<StandardizedNews[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response: AxiosResponse<{ feed: AlphaVantageNews[] }> = await axios.get(
        'https://www.alphavantage.co/query',
        {
          params: {
            function: 'NEWS_SENTIMENT',
            topics,
            limit,
            sort: 'LATEST',
            apikey: this.ALPHA_VANTAGE_KEY,
          },
          timeout: 15000,
        }
      );

      const standardizedNews = response.data.feed
        .map(article => this.standardizeAlphaVantageArticle(article))
        .filter(article => article !== null) as StandardizedNews[];

      await cacheService.set(cacheKey, standardizedNews, this.CACHE_DURATION);
      return standardizedNews;

    } catch (error) {
      console.error('Alpha Vantage fetch error:', error);
      return [];
    }
  }

  // Finage News integration
  async fetchFinageNews(limit: number = 20): Promise<StandardizedNews[]> {
    try {
      const cacheKey = `finage_${limit}`;
      const cached = await cacheService.get<StandardizedNews[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response: AxiosResponse<FinageNews[]> = await axios.get(
        'https://api.finage.co.uk/news/forex',
        {
          params: {
            apikey: this.FINAGE_API_KEY,
            limit,
          },
          timeout: 10000,
        }
      );

      const standardizedNews = response.data
        .map(article => this.standardizeFinageArticle(article))
        .filter(article => article !== null) as StandardizedNews[];

      await cacheService.set(cacheKey, standardizedNews, this.CACHE_DURATION);
      return standardizedNews;

    } catch (error) {
      console.error('Finage fetch error:', error);
      return [];
    }
  }

  // RSS Feed integration (MarketWatch, Reuters, etc.)
  async fetchRSSFeed(feedUrl: string, sourceName: string): Promise<StandardizedNews[]> {
    try {
      const cacheKey = `rss_${sourceName}`;
      const cached = await cacheService.get<StandardizedNews[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Use RSS2JSON service to convert RSS to JSON
      const response = await axios.get(
        'https://api.rss2json.com/v1/api.json',
        {
          params: {
            rss_url: feedUrl,
            api_key: 'your-rss2json-key', // Optional, for higher limits
            count: 20,
          },
          timeout: 10000,
        }
      );

      const standardizedNews = response.data.items
        .map((item: any) => this.standardizeRSSArticle(item, sourceName))
        .filter((article: any) => article !== null) as StandardizedNews[];

      await cacheService.set(cacheKey, standardizedNews, this.CACHE_DURATION);
      return standardizedNews;

    } catch (error) {
      console.error('RSS fetch error:', error);
      return [];
    }
  }

  // Aggregate news from multiple sources
  async fetchAllNews(options: {
    includeNewsAPI?: boolean;
    includeAlphaVantage?: boolean;
    includeFinage?: boolean;
    includeRSS?: boolean;
    maxArticles?: number;
  } = {}): Promise<StandardizedNews[]> {
    const {
      includeNewsAPI = true,
      includeAlphaVantage = true,
      includeFinage = true,
      includeRSS = true,
      maxArticles = 100,
    } = options;

    const newsPromises: Promise<StandardizedNews[]>[] = [];

    // NewsAPI
    if (includeNewsAPI) {
      newsPromises.push(
        this.fetchNewsAPI('business', 'forex OR currency OR "foreign exchange" OR "central bank"', 20)
      );
    }

    // Alpha Vantage
    if (includeAlphaVantage) {
      newsPromises.push(
        this.fetchAlphaVantageNews('forex,currency,economy', 20)
      );
    }

    // Finage
    if (includeFinage) {
      newsPromises.push(
        this.fetchFinageNews(15)
      );
    }

    // RSS Feeds
    if (includeRSS) {
      const rssFeeds = [
        { url: 'https://feeds.marketwatch.com/marketwatch/currencies/', name: 'MarketWatch' },
        { url: 'https://feeds.reuters.com/reuters/businessNews', name: 'Reuters' },
        { url: 'https://www.forexfactory.com/news.xml', name: 'Forex Factory' },
      ];

      rssFeeds.forEach(feed => {
        newsPromises.push(this.fetchRSSFeed(feed.url, feed.name));
      });
    }

    try {
      const newsResults = await Promise.allSettled(newsPromises);
      
      const allNews: StandardizedNews[] = [];
      
      newsResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          allNews.push(...result.value);
        }
      });

      // Remove duplicates based on title similarity
      const uniqueNews = this.removeDuplicates(allNews);
      
      // Sort by published date (newest first)
      uniqueNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      // Limit results
      return uniqueNews.slice(0, maxArticles);

    } catch (error) {
      console.error('Error fetching all news:', error);
      return [];
    }
  }

  // Economic calendar integration
  async fetchEconomicCalendar(
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    id: string;
    title: string;
    description: string;
    country: string;
    currency: string;
    impact: 'low' | 'medium' | 'high';
    actual?: string;
    forecast?: string;
    previous?: string;
    dateTime: string;
  }>> {
    try {
      const cacheKey = `economic_calendar_${startDate}_${endDate}`;
      const cached = await cacheService.get<Array<{
        id: string;
        title: string;
        description: string;
        country: string;
        currency: string;
        impact: 'low' | 'medium' | 'high';
        actual?: string;
        forecast?: string;
        previous?: string;
        dateTime: string;
      }>>(cacheKey);
      
      if (cached && Array.isArray(cached)) {
        return cached;
      }

      // Using Trading Economics API (you'll need to sign up)
      const response = await axios.get(
        'https://api.tradingeconomics.com/calendar',
        {
          params: {
            c: 'your-trading-economics-key',
            f: 'json',
            from: startDate,
            to: endDate,
          },
          timeout: 10000,
        }
      );

      const events = response.data.map((event: any) => ({
        id: `${event.CalendarId}`,
        title: event.Event,
        description: event.Event,
        country: event.Country,
        currency: this.getCurrencyByCountry(event.Country),
        impact: this.getEventImpact(event.Importance),
        actual: event.Actual,
        forecast: event.Forecast,
        previous: event.Previous,
        dateTime: event.Date,
      }));

      await cacheService.set(cacheKey, events, this.CACHE_DURATION);
      return events;

    } catch (error) {
      console.error('Economic calendar fetch error:', error);
      return [];
    }
  }

  // Standardization methods
  private standardizeNewsAPIArticle(article: NewsAPIArticle): StandardizedNews | null {
    if (!article.title || !article.description) return null;

    return {
      id: this.generateId(article.title, article.publishedAt),
      title: article.title,
      summary: article.description,
      content: article.content || article.description,
      source: article.source.name,
      author: article.author || undefined,
      category: this.categorizeArticle(article.title + ' ' + article.description),
      impact: this.getArticleImpact(article.title + ' ' + article.description),
      affectedCurrencies: this.extractCurrencies(article.title + ' ' + article.description),
      imageUrl: article.urlToImage || undefined,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      tags: this.generateTags(article.title + ' ' + article.description),
      sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
    };
  }

  private standardizeAlphaVantageArticle(article: AlphaVantageNews): StandardizedNews | null {
    if (!article.title || !article.summary) return null;

    return {
      id: this.generateId(article.title, article.time_published),
      title: article.title,
      summary: article.summary,
      content: article.summary,
      source: article.source,
      author: article.authors.join(', ') || undefined,
      category: this.categorizeArticle(article.title + ' ' + article.summary),
      impact: this.getArticleImpact(article.title + ' ' + article.summary),
      affectedCurrencies: this.extractCurrenciesFromTickers(article.ticker_sentiment),
      imageUrl: article.banner_image || undefined,
      sourceUrl: article.url,
      publishedAt: this.formatAlphaVantageDate(article.time_published),
      tags: this.generateTagsFromTopics(article.topics),
      sentiment: this.getAlphaVantageSentiment(article.ticker_sentiment),
      relevanceScore: this.calculateRelevanceScore(article.topics),
    };
  }

  private standardizeFinageArticle(article: FinageNews): StandardizedNews | null {
    if (!article.title || !article.description) return null;

    return {
      id: this.generateId(article.title, article.publishedDate),
      title: article.title,
      summary: article.description,
      content: article.description,
      source: article.source,
      category: this.categorizeArticle(article.title + ' ' + article.description),
      impact: this.getArticleImpact(article.title + ' ' + article.description),
      affectedCurrencies: this.extractCurrenciesFromSymbols(article.symbols),
      sourceUrl: article.url,
      publishedAt: article.publishedDate,
      tags: this.generateTags(article.title + ' ' + article.description),
      sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
    };
  }

  private standardizeRSSArticle(item: any, sourceName: string): StandardizedNews | null {
    if (!item.title || !item.description) return null;

    return {
      id: this.generateId(item.title, item.pubDate),
      title: item.title,
      summary: this.stripHtml(item.description),
      content: this.stripHtml(item.description),
      source: sourceName,
      author: item.author || undefined,
      category: this.categorizeArticle(item.title + ' ' + item.description),
      impact: this.getArticleImpact(item.title + ' ' + item.description),
      affectedCurrencies: this.extractCurrencies(item.title + ' ' + item.description),
      imageUrl: item.thumbnail || item.enclosure?.link || undefined,
      sourceUrl: item.link,
      publishedAt: item.pubDate,
      tags: this.generateTags(item.title + ' ' + item.description),
      sentiment: this.analyzeSentiment(item.title + ' ' + item.description),
    };
  }

  // Helper methods
  private generateId(title: string, date: string): string {
    return `${title.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}-${Date.parse(date)}`;
  }

  private categorizeArticle(text: string): 'economic' | 'central-bank' | 'politics' | 'market' | 'analysis' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('central bank') || lowerText.includes('fed') || 
        lowerText.includes('ecb') || lowerText.includes('boj')) {
      return 'central-bank';
    }
    
    if (lowerText.includes('election') || lowerText.includes('government') || 
        lowerText.includes('policy') || lowerText.includes('regulation')) {
      return 'politics';
    }
    
    if (lowerText.includes('gdp') || lowerText.includes('inflation') || 
        lowerText.includes('employment') || lowerText.includes('trade')) {
      return 'economic';
    }
    
    if (lowerText.includes('analysis') || lowerText.includes('outlook') || 
        lowerText.includes('forecast') || lowerText.includes('technical')) {
      return 'analysis';
    }
    
    return 'market';
  }

  private getArticleImpact(text: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();
    
    for (const keyword of this.IMPACT_KEYWORDS.high) {
      if (lowerText.includes(keyword)) {
        return 'high';
      }
    }
    
    for (const keyword of this.IMPACT_KEYWORDS.medium) {
      if (lowerText.includes(keyword)) {
        return 'medium';
      }
    }
    
    return 'low';
  }

  private extractCurrencies(text: string): string[] {
    const lowerText = text.toLowerCase();
    const currencies: string[] = [];
    
    Object.entries(this.CURRENCY_KEYWORDS).forEach(([currency, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        currencies.push(currency);
      }
    });
    
    return [...new Set(currencies)];
  }

  private extractCurrenciesFromTickers(tickers: any[]): string[] {
    const currencies = new Set<string>();
    
    tickers.forEach(ticker => {
      const symbol = ticker.ticker.toUpperCase();
      if (symbol.includes('USD')) currencies.add('USD');
      if (symbol.includes('EUR')) currencies.add('EUR');
      if (symbol.includes('GBP')) currencies.add('GBP');
      if (symbol.includes('JPY')) currencies.add('JPY');
      if (symbol.includes('AUD')) currencies.add('AUD');
      if (symbol.includes('CAD')) currencies.add('CAD');
      if (symbol.includes('CHF')) currencies.add('CHF');
    });
    
    return Array.from(currencies);
  }

  private extractCurrenciesFromSymbols(symbols: string[]): string[] {
    const currencies = new Set<string>();
    
    symbols.forEach(symbol => {
      const upperSymbol = symbol.toUpperCase();
      if (upperSymbol.includes('USD')) currencies.add('USD');
      if (upperSymbol.includes('EUR')) currencies.add('EUR');
      if (upperSymbol.includes('GBP')) currencies.add('GBP');
      if (upperSymbol.includes('JPY')) currencies.add('JPY');
    });
    
    return Array.from(currencies);
  }

  private generateTags(text: string): string[] {
    const lowerText = text.toLowerCase();
    const tags: string[] = [];
    
    // Add currency tags
    this.extractCurrencies(text).forEach(currency => {
      tags.push(currency);
    });
    
    // Add topic tags
    if (lowerText.includes('interest rate')) tags.push('Interest Rates');
    if (lowerText.includes('inflation')) tags.push('Inflation');
    if (lowerText.includes('employment')) tags.push('Employment');
    if (lowerText.includes('gdp')) tags.push('GDP');
    if (lowerText.includes('trade')) tags.push('Trade');
    if (lowerText.includes('brexit')) tags.push('Brexit');
    
    return tags;
  }

  private generateTagsFromTopics(topics: any[]): string[] {
    return topics
      .filter(topic => parseFloat(topic.relevance_score) > 0.5)
      .map(topic => topic.topic)
      .slice(0, 5);
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();
    const positiveWords = ['gain', 'rise', 'up', 'boost', 'strong', 'growth', 'improve'];
    const negativeWords = ['fall', 'drop', 'down', 'decline', 'weak', 'crisis', 'concern'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getAlphaVantageSentiment(tickers: any[]): 'positive' | 'negative' | 'neutral' {
    if (!tickers.length) return 'neutral';
    
    const avgSentiment = tickers.reduce((sum, ticker) => {
      return sum + parseFloat(ticker.ticker_sentiment_score);
    }, 0) / tickers.length;
    
    if (avgSentiment > 0.1) return 'positive';
    if (avgSentiment < -0.1) return 'negative';
    return 'neutral';
  }

  private calculateRelevanceScore(topics: any[]): number {
    if (!topics.length) return 0;
    
    return topics.reduce((sum, topic) => {
      return sum + parseFloat(topic.relevance_score);
    }, 0) / topics.length;
  }

  private formatAlphaVantageDate(dateString: string): string {
    // Convert YYYYMMDDTHHMMSS to ISO string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);
    const second = dateString.substring(13, 15);
    
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  private getCurrencyByCountry(country: string): string {
    const currencyMap: { [key: string]: string } = {
      'United States': 'USD',
      'Eurozone': 'EUR',
      'United Kingdom': 'GBP',
      'Japan': 'JPY',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Switzerland': 'CHF',
      'China': 'CNY',
    };
    
    return currencyMap[country] || 'USD';
  }

  private getEventImpact(importance: string): 'low' | 'medium' | 'high' {
    if (importance === '3') return 'high';
    if (importance === '2') return 'medium';
    return 'low';
  }

  private removeDuplicates(articles: StandardizedNews[]): StandardizedNews[] {
    const seen = new Set<string>();
    const unique: StandardizedNews[] = [];
    
    articles.forEach(article => {
      // Create a normalized title for comparison
      const normalizedTitle = article.title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .substring(0, 50);
      
      if (!seen.has(normalizedTitle)) {
        seen.add(normalizedTitle);
        unique.push(article);
      }
    });
    
    return unique;
  }
}

export const externalNewsService = new ExternalNewsService();
