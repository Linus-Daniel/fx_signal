

// File: src/screens/main/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Card,
  Button,
  StatusIndicator,
  PriceDisplay,
  SegmentedControl,
  Badge,
  Avatar,
} from "../components/ui";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HomeScreen = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");

  // Mock data - in real app, this would come from Redux/API
  const mockData = {
    user: {
      name: "John Doe",
      avatar: null,
      accountBalance: 12500.5,
      todayPnL: 245.75,
      todayPnLPercent: 2.1,
    },
    marketStatus: "open",
    totalSignals: 24,
    activeSignals: 8,
    winRate: 78.5,
    todaySignals: 3,
    topPairs: [
      { pair: "EUR/USD", price: 1.0852, change: 0.0012, changePercent: 0.11 },
      { pair: "GBP/USD", price: 1.2634, change: -0.0025, changePercent: -0.2 },
      { pair: "USD/JPY", price: 149.85, change: 0.45, changePercent: 0.3 },
      { pair: "AUD/USD", price: 0.6489, change: 0.0008, changePercent: 0.12 },
    ],
    recentSignals: [
      {
        id: "1",
        pair: "EUR/USD",
        type: "BUY",
        entry: 1.0845,
        status: "active",
        confidence: 85,
        pips: "+12",
        time: "2 hours ago",
      },
      {
        id: "2",
        pair: "GBP/JPY",
        type: "SELL",
        entry: 189.5,
        status: "closed",
        confidence: 92,
        pips: "+28",
        time: "4 hours ago",
      },
    ],
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const timeframeOptions = [
    { label: "1H", value: "1H" },
    { label: "4H", value: "4H" },
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    userName: {
      marginLeft: theme.spacing.sm,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    section: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    balanceCard: {
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    balanceAmount: {
      marginVertical: theme.spacing.sm,
    },
    pnlRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: (SCREEN_WIDTH - theme.spacing.lg * 3) / 2,
      alignItems: "center",
      padding: theme.spacing.md,
    },
    marketPairRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.divider,
    },
    signalCard: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    signalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    signalPair: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    signalDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    signalInfo: {
      flexDirection: "row",
      gap: theme.spacing.lg,
    },
    timeframeContainer: {
      marginVertical: theme.spacing.md,
    },
  });

  const StatCard = ({ icon, label, value, color }: any) => (
    <Card style={styles.statCard} variant="elevated">
      <Ionicons
        name={icon}
        size={24}
        color={color || theme.colors.primary}
        style={{ marginBottom: theme.spacing.sm }}
      />
      <Text variant="caption" color="secondary" align="center">
        {label}
      </Text>
      <Text variant="h4" weight="semibold" align="center">
        {value}
      </Text>
    </Card>
  );

  const MarketPairRow = ({ pair, price, change, changePercent }: any) => (
    <View style={styles.marketPairRow}>
      <Text variant="body" weight="medium">
        {pair}
      </Text>
      <PriceDisplay
        price={price}
        change={change}
        changePercent={changePercent}
        size="sm"
        precision={pair.includes("JPY") ? 3 : 5}
      />
    </View>
  );

  const SignalCard = ({ signal }: any) => (
    <Card style={styles.signalCard}>
      <View style={styles.signalHeader}>
        <View style={styles.signalPair}>
          <Badge
            variant={signal.type === "BUY" ? "success" : "error"}
            size="sm"
          >
            {signal.type}
          </Badge>
          <Text variant="body" weight="semibold">
            {signal.pair}
          </Text>
        </View>
        <StatusIndicator
          status={signal.status === "active" ? "online" : "success"}
          size="sm"
          showDot
        />
      </View>

      <View style={styles.signalDetails}>
        <View style={styles.signalInfo}>
          <View>
            <Text variant="caption" color="secondary">
              Entry
            </Text>
            <Text variant="body" weight="medium">
              {signal.entry}
            </Text>
          </View>
          <View>
            <Text variant="caption" color="secondary">
              Confidence
            </Text>
            <Text variant="body" weight="medium">
              {signal.confidence}%
            </Text>
          </View>
          <View>
            <Text variant="caption" color="secondary">
              P&L
            </Text>
            <Text variant="body" weight="medium" color="success">
              {signal.pips}
            </Text>
          </View>
        </View>
        <Text variant="caption" color="tertiary">
          {signal.time}
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              name={mockData.user.name}
              source={mockData.user.avatar}
              size="md"
              showOnlineIndicator
            />
            <View style={styles.userName}>
              <Text variant="caption" color="secondary">
                Welcome back,
              </Text>
              <Text variant="body" weight="semibold">
                {mockData.user.name}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <StatusIndicator
              status={mockData.marketStatus === "open" ? "online" : "offline"}
              label="Market"
              size="sm"
            />
            <Button variant="ghost" size="sm">
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.text}
              />
            </Button>
          </View>
        </View>

        {/* Account Balance */}
        <View style={styles.section}>
          <Card style={styles.balanceCard} variant="elevated">
            <Text variant="caption" color="secondary">
              Account Balance
            </Text>
            <Text variant="h1" weight="bold" style={styles.balanceAmount}>
              $
              {mockData.user.accountBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
            <View style={styles.pnlRow}>
              <Ionicons
                name={
                  mockData.user.todayPnL >= 0 ? "trending-up" : "trending-down"
                }
                size={16}
                color={
                  mockData.user.todayPnL >= 0
                    ? theme.colors.success
                    : theme.colors.error
                }
              />
              <Text
                variant="body"
                weight="medium"
                style={{
                  color:
                    mockData.user.todayPnL >= 0
                      ? theme.colors.success
                      : theme.colors.error,
                }}
              >
                ${Math.abs(mockData.user.todayPnL).toFixed(2)} (
                {mockData.user.todayPnLPercent}%) Today
              </Text>
            </View>
          </Card>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <StatCard
              icon="trending-up"
              label="Total Signals"
              value={mockData.totalSignals}
              color={theme.colors.primary}
            />
            <StatCard
              icon="pulse"
              label="Active Signals"
              value={mockData.activeSignals}
              color={theme.colors.success}
            />
            <StatCard
              icon="trophy"
              label="Win Rate"
              value={`${mockData.winRate}%`}
              color={theme.colors.warning}
            />
            <StatCard
              icon="today"
              label="Today's Signals"
              value={mockData.todaySignals}
              color={theme.colors.info}
            />
          </View>
        </View>

        {/* Market Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Market Overview
            </Text>
            <Button variant="ghost" size="sm">
              <Text variant="caption" color="primary">
                View All
              </Text>
            </Button>
          </View>

          <Card padding="md">
            <View style={styles.timeframeContainer}>
              <SegmentedControl
                options={timeframeOptions}
                selectedValue={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              />
            </View>

            {mockData.topPairs.map((pair, index) => (
              <MarketPairRow key={index} {...pair} />
            ))}
          </Card>
        </View>

        {/* Recent Signals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Recent Signals
            </Text>
            <Button variant="ghost" size="sm">
              <Text variant="caption" color="primary">
                View All
              </Text>
            </Button>
          </View>

          {mockData.recentSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}

          <Button
            variant="outline"
            fullWidth
            style={{ marginTop: theme.spacing.sm }}
          >
            View All Signals
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
