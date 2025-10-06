// File: src/screens/main/AnalysisScreen.tsx (Updated with full implementation)
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Button,
  SegmentedControl,
  LoadingSpinner,
  EmptyState,
} from "../components/ui";
import AIInsightsCard from "../components/AIInsight";
import TechnicalChart from "../components/charts/TechnicalCart";
import { useTheme } from "../context/ThemeContext";

const AnalysisScreen = () => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("insights");
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock AI insights data
  const mockInsights = [
    {
      currencyPair: "EUR/USD",
      recommendation: "BUY" as const,
      confidence: 85,
      sentiment: "bullish" as const,
      keyPoints: [
        "Strong bullish momentum detected with RSI showing oversold recovery",
        "ECB dovish stance creating positive sentiment for EUR strength",
        "Technical breakout above key resistance at 1.0820 confirms upward trend",
        "Volume analysis shows increased buying pressure from institutional traders",
      ],
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      patterns: ["Bullish Engulfing", "Golden Cross", "Cup & Handle"],
      supportLevel: 1.078,
      resistanceLevel: 1.092,
    },
    {
      currencyPair: "GBP/USD",
      recommendation: "SELL" as const,
      confidence: 78,
      sentiment: "bearish" as const,
      keyPoints: [
        "Brexit uncertainty continues to weigh on GBP sentiment",
        "BoE hawkish comments offset by weak economic data",
        "Technical indicators show bearish divergence on 4H chart",
      ],
      lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      patterns: ["Head & Shoulders", "Bearish Flag"],
      supportLevel: 1.258,
      resistanceLevel: 1.272,
    },
    {
      currencyPair: "USD/JPY",
      recommendation: "HOLD" as const,
      confidence: 65,
      sentiment: "neutral" as const,
      keyPoints: [
        "Consolidation phase with no clear directional bias",
        "BoJ intervention risk at current levels limits upside",
        "Mixed economic signals from both US and Japan",
      ],
      lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      patterns: ["Symmetrical Triangle", "Sideways Channel"],
      supportLevel: 148.2,
      resistanceLevel: 151.8,
    },
  ];

  const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"];

  const tabOptions = [
    { label: "AI Insights", value: "insights" },
    { label: "Charts", value: "charts" },
    { label: "Patterns", value: "patterns" },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    tabContainer: {
      marginBottom: theme.spacing.lg,
    },
    pairSelector: {
      marginBottom: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    chartSection: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    patternsSection: {
      padding: theme.spacing.lg,
    },
    patternGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    patternCard: {
      flex: 1,
      minWidth: "45%",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      ...theme.shadows.small,
    },
    patternIcon: {
      marginBottom: theme.spacing.sm,
    },
    patternName: {
      marginBottom: theme.spacing.xs,
    },
    refreshButton: {
      marginRight: theme.spacing.sm,
    },
  });

  const renderInsightsContent = () => (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {mockInsights.map((insight, index) => (
        <AIInsightsCard
          key={insight.currencyPair}
          insight={insight}
          onPress={() => console.log("Pressed insight:", insight.currencyPair)}
        />
      ))}
    </ScrollView>
  );

  const renderChartsContent = () => (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.chartSection}>
        <TechnicalChart
          currencyPair={selectedPair}
          entryPrice={selectedPair === "EUR/USD" ? 1.0852 : 1.2634}
        />
      </View>
    </ScrollView>
  );

  const renderPatternsContent = () => {
    const detectedPatterns = [
      {
        name: "Bullish Engulfing",
        confidence: 85,
        pairs: ["EUR/USD", "AUD/USD"],
      },
      { name: "Head & Shoulders", confidence: 78, pairs: ["GBP/USD"] },
      { name: "Double Bottom", confidence: 72, pairs: ["USD/JPY"] },
      { name: "Ascending Triangle", confidence: 69, pairs: ["USD/CAD"] },
    ];

    return (
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.patternsSection}>
          <Text
            variant="h4"
            weight="semibold"
            style={{ marginBottom: theme.spacing.lg }}
          >
            Recently Detected Patterns
          </Text>

          <View style={styles.patternGrid}>
            {detectedPatterns.map((pattern, index) => (
              <View key={index} style={styles.patternCard}>
                <Ionicons
                  name="trending-up"
                  size={32}
                  color={theme.colors.primary}
                  style={styles.patternIcon}
                />
                <Text
                  variant="body"
                  weight="semibold"
                  align="center"
                  style={styles.patternName}
                >
                  {pattern.name}
                </Text>
                <Text variant="caption" color="secondary" align="center">
                  {pattern.confidence}% confidence
                </Text>
                <Text variant="caption" color="tertiary" align="center">
                  {pattern.pairs.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "insights":
        return renderInsightsContent();
      case "charts":
        return renderChartsContent();
      case "patterns":
        return renderPatternsContent();
      default:
        return renderInsightsContent();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Analyzing market data..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.sectionHeader}>
          <Text variant="h2" weight="bold">
            Market Analysis
          </Text>
          <Button
            variant="ghost"
            size="sm"
            style={styles.refreshButton}
            onPress={onRefresh}
            leftIcon={
              <Ionicons name="refresh" size={16} color={theme.colors.text} />
            }
          >refresh</Button>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <SegmentedControl
            options={tabOptions}
            selectedValue={selectedTab}
            onValueChange={setSelectedTab}
          />
        </View>

        {/* Currency Pair Selector (only for charts) */}
        {selectedTab === "charts" && (
          <View style={styles.pairSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
                {currencyPairs.map((pair) => (
                  <Button
                    key={pair}
                    variant={selectedPair === pair ? "primary" : "outline"}
                    size="sm"
                    onPress={() => setSelectedPair(pair)}
                  >
                    {pair}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

export default AnalysisScreen;
