// File: src/screens/main/SignalsScreen.tsx (Updated with proper navigation types)
import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  Text,
  Button,
  Input,
  LoadingSpinner,
  EmptyState,
} from "../components/ui";
import SignalCard, { Signal } from "../components/SignalCard";
import FilterModal, { SignalFilters } from "../components/FilterModal";
import { SignalsScreenNavigationProp } from "../navigation/SignalsNavigator";

interface SignalsScreenProps {
  navigation: SignalsScreenNavigationProp;
}

const SignalsScreen: React.FC<SignalsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<SignalFilters>({
    signalType: "ALL",
    status: "ALL",
    currencyPairs: [],
    confidenceLevel: "ALL",
  });

  // Mock data - in production, this would come from API/Redux
  const mockSignals: Signal[] = [
    {
      id: "1",
      currencyPair: "EUR/USD",
      signalType: "BUY",
      entryPrice: 1.0852,
      stopLoss: 1.082,
      takeProfit: 1.092,
      confidenceLevel: 85,
      status: "active",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      analysisSummary:
        "Strong bullish momentum with RSI oversold conditions. ECB dovish stance supports upward movement.",
      tags: ["Technical Analysis", "RSI Oversold", "ECB News"],
      copyCount: 127,
    },
    {
      id: "2",
      currencyPair: "GBP/JPY",
      signalType: "SELL",
      entryPrice: 189.5,
      stopLoss: 190.2,
      takeProfit: 188.0,
      confidenceLevel: 92,
      status: "closed",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      resultPips: 28,
      analysisSummary:
        "Head and shoulders pattern completion with strong resistance at 190. BoJ intervention risk.",
      tags: ["Pattern Trading", "H&S", "Central Bank"],
      copyCount: 89,
    },
    {
      id: "3",
      currencyPair: "USD/JPY",
      signalType: "BUY",
      entryPrice: 149.85,
      stopLoss: 149.2,
      takeProfit: 151.5,
      confidenceLevel: 78,
      status: "active",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      analysisSummary:
        "Break above key resistance level. Fed hawkish comments support dollar strength.",
      tags: ["Breakout", "Fed Policy", "Trend Following"],
      copyCount: 156,
    },
    {
      id: "4",
      currencyPair: "AUD/USD",
      signalType: "SELL",
      entryPrice: 0.6489,
      stopLoss: 0.652,
      takeProfit: 0.642,
      confidenceLevel: 68,
      status: "closed",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      resultPips: -15,
      analysisSummary:
        "Commodity weakness and China concerns weigh on AUD. Risk-off sentiment prevails.",
      tags: ["Commodity Currency", "Risk-off", "China Data"],
      copyCount: 73,
    },
  ];

  useEffect(() => {
    loadSignals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [signals, filters, searchQuery]);

  const loadSignals = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSignals(mockSignals);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate new data
      setSignals([...mockSignals]);
      setRefreshing(false);
    }, 1500);
  };

  const applyFilters = () => {
    let filtered = [...signals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (signal) =>
          signal.currencyPair
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          signal.analysisSummary
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          signal.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Signal type filter
    if (filters.signalType && filters.signalType !== "ALL") {
      filtered = filtered.filter(
        (signal) => signal.signalType === filters.signalType
      );
    }

    // Status filter
    if (filters.status && filters.status !== "ALL") {
      filtered = filtered.filter((signal) => signal.status === filters.status);
    }

    // Currency pairs filter
    if (filters.currencyPairs && filters.currencyPairs.length > 0) {
      filtered = filtered.filter((signal) =>
        filters.currencyPairs!.includes(signal.currencyPair)
      );
    }

    // Confidence level filter
    if (filters.confidenceLevel && filters.confidenceLevel !== "ALL") {
      filtered = filtered.filter((signal) => {
        switch (filters.confidenceLevel) {
          case "HIGH":
            return signal.confidenceLevel >= 80;
          case "MEDIUM":
            return signal.confidenceLevel >= 60 && signal.confidenceLevel < 80;
          case "LOW":
            return signal.confidenceLevel < 60;
          default:
            return true;
        }
      });
    }

    setFilteredSignals(filtered);
  };

  const handleSignalPress = (signal: Signal) => {
    // Navigate to signal details screen with the signal object
    navigation.navigate("SignalDetails", { signal });
  };

  const handleCopySignal = (signal: Signal) => {
    console.log("Copy signal:", signal.id);
    // Implement copy functionality
  };

  const handleShareSignal = (signal: Signal) => {
    console.log("Share signal:", signal.id);
    // Implement share functionality
  };

  const renderSignalItem = ({ item }: { item: Signal }) => (
    <SignalCard
      signal={item}
      onPress={() => handleSignalPress(item)}
      onCopy={() => handleCopySignal(item)}
      onShare={() => handleShareSignal(item)}
      navigation={navigation}
    />
  );

  const activeSignalsCount = filteredSignals.filter(
    (s) => s.status === "active"
  ).length;
  const hasActiveFilters =
    filters.signalType !== "ALL" ||
    filters.status !== "ALL" ||
    (filters.currencyPairs && filters.currencyPairs.length > 0) ||
    filters.confidenceLevel !== "ALL";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    searchRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    listContainer: {
      paddingBottom: 100,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading signals..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          variant="h2"
          weight="bold"
          style={{ marginBottom: theme.spacing.md }}
        >
          Trading Signals
        </Text>

        {/* Search and Filter */}
        <View style={styles.searchRow}>
          <Input
            placeholder="Search signals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search"
            variant="filled"
            style={styles.searchInput}
          />
          <Button
            variant={hasActiveFilters ? "primary" : "outline"}
            size="md"
            onPress={() => setFilterModalVisible(true)}
            leftIcon={
              <Ionicons
                name="filter"
                size={16}
                color={
                  hasActiveFilters ? theme.colors.surface : theme.colors.text
                }
              />
            }
          >
            {""}
          </Button>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="pulse" size={16} color={theme.colors.success} />
            <Text variant="caption" color="secondary">
              {activeSignalsCount} Active
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="list" size={16} color={theme.colors.primary} />
            <Text variant="caption" color="secondary">
              {filteredSignals.length} Total
            </Text>
          </View>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() =>
                setFilters({
                  signalType: "ALL",
                  status: "ALL",
                  currencyPairs: [],
                  confidenceLevel: "ALL",
                })
              }
            >
              <Text variant="caption" color="primary">
                Clear Filters
              </Text>
            </Button>
          )}
        </View>
      </View>

      {/* Signals List */}
      <FlatList
        data={filteredSignals}
        renderItem={renderSignalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="trending-up-outline"
            title="No Signals Found"
            subtitle={
              hasActiveFilters
                ? "Try adjusting your filters to see more signals"
                : "New trading signals will appear here when available"
            }
            actionText={hasActiveFilters ? "Clear Filters" : undefined}
            onActionPress={
              hasActiveFilters
                ? () =>
                    setFilters({
                      signalType: "ALL",
                      status: "ALL",
                      currencyPairs: [],
                      confidenceLevel: "ALL",
                    })
                : undefined
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
};

export default SignalsScreen;
