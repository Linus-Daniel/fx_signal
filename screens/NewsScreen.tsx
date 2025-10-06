// // File: src/screens/main/NewsScreen.tsx (Updated with full implementation)
// import React, { useState, useEffect } from "react";
// import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   Text,
//   Button,
//   Input,
//   SegmentedControl,
//   LoadingSpinner,
//   EmptyState,
//   Chip,
// } from "../components/ui";
// import NewsCard from "../components/NewsCard";
// import { useTheme } from "../context/ThemeContext";

// const NewsScreen = () => {
//   const { theme } = useTheme();
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedImpact, setSelectedImpact] = useState("all");

//   // Mock news data
//   const mockNews = [
//     {
//       id: "1",
//       title: "ECB Signals Potential Rate Cut Amid Inflation Concerns",
//       summary:
//         "European Central Bank officials hint at possible monetary policy easing as eurozone inflation shows signs of cooling, potentially impacting EUR/USD dynamics.",
//       imageUrl: null,
//       source: "Reuters",
//       publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
//       category: "breaking" as const,
//       impact: "high" as const,
//       currencyPairs: ["EUR/USD", "EUR/GBP", "EUR/JPY"],
//     },
//     {
//       id: "2",
//       title: "Fed Officials Maintain Hawkish Stance on Interest Rates",
//       summary:
//         "Federal Reserve members continue to emphasize the need for sustained high interest rates to combat persistent inflationary pressures in the US economy.",
//       imageUrl: null,
//       source: "Bloomberg",
//       publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//       category: "market-update" as const,
//       impact: "high" as const,
//       currencyPairs: ["USD/JPY", "GBP/USD", "AUD/USD"],
//     },
//     {
//       id: "3",
//       title: "UK GDP Growth Exceeds Expectations in Q3",
//       summary:
//         "British economy shows resilience with quarterly growth figures beating forecasts, providing support for sterling amid ongoing political uncertainties.",
//       imageUrl: null,
//       source: "Financial Times",
//       publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
//       category: "economic-data" as const,
//       impact: "medium" as const,
//       currencyPairs: ["GBP/USD", "EUR/GBP", "GBP/JPY"],
//     },
//     {
//       id: "4",
//       title: "Technical Analysis: EUR/USD Tests Key Resistance",
//       summary:
//         "The euro-dollar pair approaches critical technical levels as traders eye potential breakout scenarios amid mixed fundamental signals.",
//       imageUrl: null,
//       source: "TradingView",
//       publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
//       category: "analysis" as const,
//       impact: "low" as const,
//       currencyPairs: ["EUR/USD"],
//     },
//   ];

//   const [news, setNews] = useState(mockNews);
//   const [filteredNews, setFilteredNews] = useState(mockNews);

//   const categoryOptions = [
//     { label: "All", value: "all" },
//     { label: "Breaking", value: "breaking" },
//     { label: "Analysis", value: "analysis" },
//     { label: "Data", value: "economic-data" },
//   ];

//   const impactFilters = ["all", "high", "medium", "low"];

//   useEffect(() => {
//     applyFilters();
//   }, [searchQuery, selectedCategory, selectedImpact]);

//   const applyFilters = () => {
//     let filtered = [...news];

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (item) =>
//           item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.currencyPairs?.some((pair) =>
//             pair.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//       );
//     }

//     // Category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((item) => item.category === selectedCategory);
//     }

//     // Impact filter
//     if (selectedImpact !== "all") {
//       filtered = filtered.filter((item) => item.impact === selectedImpact);
//     }

//     setFilteredNews(filtered);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // Simulate API call
//     setTimeout(() => {
//       setNews([...mockNews]);
//       setRefreshing(false);
//     }, 1500);
//   };

//   const handleNewsPress = (newsItem: any) => {
//     console.log("Pressed news:", newsItem.id);
//     // Navigate to news detail screen
//   };

//   const renderNewsItem = ({ item }: any) => (
//     <NewsCard news={item} onPress={() => handleNewsPress(item)} />
//   );

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//     },
//     header: {
//       padding: theme.spacing.lg,
//       paddingBottom: theme.spacing.md,
//     },
//     searchRow: {
//       flexDirection: "row",
//       gap: theme.spacing.sm,
//       alignItems: "center",
//       marginBottom: theme.spacing.md,
//     },
//     searchInput: {
//       flex: 1,
//     },
//     filtersSection: {
//       marginBottom: theme.spacing.md,
//     },
//     impactFilters: {
//       flexDirection: "row",
//       gap: theme.spacing.sm,
//       marginTop: theme.spacing.sm,
//     },
//     statsRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: theme.spacing.sm,
//     },
//     listContainer: {
//       paddingBottom: 100,
//     },
//   });

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <LoadingSpinner message="Loading latest news..." />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text
//           variant="h2"
//           weight="bold"
//           style={{ marginBottom: theme.spacing.md }}
//         >
//           Market News
//         </Text>

//         {/* Search */}
//         <View style={styles.searchRow}>
//           <Input
//             placeholder="Search news..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             leftIcon="search"
//             variant="filled"
//             style={styles.searchInput}
//           />
//           <Button
//             variant="outline"
//             size="md"
//             leftIcon={
//               <Ionicons name="options" size={16} color={theme.colors.text} />
//             }
//           >{""}</Button>
//         </View>

//         {/* Filters */}
//         <View style={styles.filtersSection}>
//           <SegmentedControl
//             options={categoryOptions}
//             selectedValue={selectedCategory}
//             onValueChange={setSelectedCategory}
//           />

//           <View style={styles.impactFilters}>
//             <Text
//               variant="caption"
//               color="secondary"
//               style={{ marginRight: theme.spacing.sm }}
//             >
//               Impact:
//             </Text>
//             {impactFilters.map((impact) => (
//               <Chip
//                 key={impact}
//                 label={impact.toUpperCase()}
//                 selected={selectedImpact === impact}
//                 onPress={() => setSelectedImpact(impact)}
//                 variant="outlined"
//               />
//             ))}
//           </View>
//         </View>

//         {/* Stats */}
//         <View style={styles.statsRow}>
//           <Text variant="caption" color="secondary">
//             {filteredNews.length} articles
//           </Text>
//           <Button
//             variant="ghost"
//             size="sm"
//             onPress={onRefresh}
//             leftIcon={
//               <Ionicons name="refresh" size={14} color={theme.colors.primary} />
//             }
//           >
//             <Text variant="caption" color="primary">
//               Refresh
//             </Text>
//           </Button>
//         </View>
//       </View>

//       {/* News List */}
//       <FlatList
//         data={filteredNews}
//         renderItem={renderNewsItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={theme.colors.primary}
//           />
//         }
//         ListEmptyComponent={
//           <EmptyState
//             icon="newspaper-outline"
//             title="No News Found"
//             subtitle="Try adjusting your search or filter criteria"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// };

// export default NewsScreen;


// File: src/screens/main/NewsScreen.tsx (Updated to use external APIs)
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  Text,
  Input,
  LoadingSpinner,
  EmptyState,
  Chip,
  SegmentedControl,
} from "../components/ui";
import { useExternalNews } from "../hooks/useExternalNews";
import ExternalNewsCard from "../components/ExternalNewsCard";
import BreakingNewsBar from "../components/BreakingNewsBar";
import EconomicCalendar from "../components/EconomcCalender";

const NewsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0); // 0: News, 1: Calendar

  const {
    news,
    loading,
    refreshing,
    breakingNews,
    economicEvents,
    refresh,
    loadMore,
    hasMore,
    filters,
    setFilters,
  } = useExternalNews();

  const categories = [
    { id: null, label: "All" },
    { id: "economic", label: "Economic" },
    { id: "central-bank", label: "Central Bank" },
    { id: "politics", label: "Politics" },
    { id: "market", label: "Market" },
    { id: "analysis", label: "Analysis" },
  ];

  const handleNewsPress = (article: any) => {
    // Open article in web browser or navigate to details
    console.log("Open news article:", article.id);
  };

  const handleBreakingNewsPress = (newsId: string) => {
    const article = breakingNews.find((item) => item.id === newsId);
    if (article) {
      handleNewsPress(article);
    }
  };

  const filteredNews = news.filter(
    (article) =>
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    tabContainer: {
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      marginBottom: theme.spacing.md,
    },
    categoriesContainer: {
      marginBottom: theme.spacing.lg,
    },
    categoriesScroll: {
      paddingHorizontal: theme.spacing.lg,
    },
    categoryChip: {
      marginRight: theme.spacing.sm,
    },
    listContainer: {
      flex: 1,
    },
    loadingMore: {
      paddingVertical: theme.spacing.lg,
      alignItems: "center",
    },
  });

  const renderNewsItem = ({ item }: { item: any }) => (
    <ExternalNewsCard article={item} onPress={() => handleNewsPress(item)} />
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.loadingMore}>
        <LoadingSpinner size="small" />
      </View>
    );
  };

  if (loading && news.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading latest news..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market News</Text>

        <View style={styles.tabContainer}>
          <SegmentedControl
            options={["News", "Calendar"]}
            selectedIndex={selectedTab}
            onSelectionChange={setSelectedTab}
          />
        </View>

        {selectedTab === 0 && (
          <>
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon="search"
              />
            </View>

            <View style={styles.categoriesContainer}>
              <FlatList
                horizontal
                data={categories}
                renderItem={({ item }) => (
                  <Chip
                    label={item.label}
                    selected={filters.category === item.id}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        category: item.id as any,
                      })
                    }
                    style={styles.categoryChip}
                  />
                )}
                keyExtractor={(item) => item.id || "all"}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              />
            </View>
          </>
        )}
      </View>

      {selectedTab === 0 ? (
        <View style={styles.listContainer}>
          <BreakingNewsBar
            breakingNews={breakingNews}
            onPress={handleBreakingNewsPress}
          />

          <FlatList
            data={filteredNews}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <EmptyState
                icon="newspaper-outline"
                title="No News Found"
                description="Try adjusting your search or filters"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
          />
        </View>
      ) : (
        <EconomicCalendar
          events={economicEvents}
          onEventPress={(event) => console.log("Economic event:", event)}
        />
      )}
    </SafeAreaView>
  );
};

export default NewsScreen;
