// File: src/screens/signals/SignalDetailsScreen.tsx (Updated with proper types)
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  Text,
  Button,
  Card,
  Badge,
  StatusIndicator,
  Chip,
} from "../components/ui";
import TechnicalChart from "../components/charts/TechnicalCart";
import { Signal } from "../components/SignalCard";
import {
  SignalDetailsScreenNavigationProp,
  SignalDetailsScreenRouteProp,
} from "../navigation/SignalsNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SignalDetailsScreenProps {
  route: SignalDetailsScreenRouteProp;
  navigation: SignalDetailsScreenNavigationProp;
}

const SignalDetailsScreen: React.FC<SignalDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { signal } = route.params;
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopySignal = () => {
    if (signal.status !== "active") {
      Alert.alert(
        "Signal Closed",
        "This signal is no longer active for copying."
      );
      return;
    }

    Alert.alert(
      "Copy Signal",
      `Do you want to copy this ${signal.signalType} signal for ${signal.currencyPair}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy Signal",
          style: "default",
          onPress: () => {
            setCopied(true);
            // Here you would implement the actual copy logic
            Alert.alert("Success", "Signal copied to your trading platform!");
          },
        },
      ]
    );
  };

  const handleShareSignal = async () => {
    try {
      await Share.share({
        message: `Check out this ${signal.signalType} signal for ${signal.currencyPair}: Entry at ${signal.entryPrice}, ${signal.confidenceLevel}% confidence. ${signal.analysisSummary}`,
        title: `Forex Signal: ${signal.currencyPair}`,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const calculatePotentialProfit = (): number => {
    if (!signal.takeProfit) return 0;
    const pips = Math.abs(signal.takeProfit - signal.entryPrice) * 10000;
    return pips;
  };

  const calculateRisk = (): number => {
    if (!signal.stopLoss) return 0;
    const pips = Math.abs(signal.entryPrice - signal.stopLoss) * 10000;
    return pips;
  };

  const getRiskRewardRatio = (): string => {
    const profit = calculatePotentialProfit();
    const risk = calculateRisk();
    if (risk > 0) {
      return `1:${(profit / risk).toFixed(1)}`;
    }
    return "N/A";
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const signalTime = new Date(dateString);
    const diffMs = now.getTime() - signalTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    return `${diffMins}m ago`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.xs,
    },
    headerActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    content: {
      paddingBottom: 120,
    },
    section: {
      margin: theme.spacing.lg,
    },
    signalHeader: {
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    currencyPair: {
      marginBottom: theme.spacing.md,
    },
    signalType: {
      marginBottom: theme.spacing.lg,
    },
    entryPriceContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    pricesGrid: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: theme.spacing.lg,
    },
    priceItem: {
      alignItems: "center",
    },
    priceLabel: {
      marginBottom: theme.spacing.xs,
    },
    analysisSection: {
      padding: theme.spacing.lg,
    },
    analysisText: {
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    metricCard: {
      flex: 1,
      minWidth: (SCREEN_WIDTH - theme.spacing.lg * 3) / 2,
      alignItems: "center",
      padding: theme.spacing.md,
    },
    actionButtons: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border,
      ...theme.shadows.medium,
    },
    actionButton: {
      flex: 1,
    },
    resultBadge: {
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text variant="body" weight="semibold">
          Signal Details
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShareSignal}>
            <Ionicons
              name="share-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Signal Overview */}
        <Card style={styles.signalHeader}>
          <Text variant="h1" weight="bold" style={styles.currencyPair}>
            {signal.currencyPair}
          </Text>

          <Badge
            variant={signal.signalType === "BUY" ? "success" : "error"}
            size="lg"
            style={styles.signalType}
          >
            {signal.signalType} SIGNAL
          </Badge>

          <View style={styles.entryPriceContainer}>
            <Text variant="caption" color="secondary">
              Entry Price
            </Text>
            <Text variant="h2" weight="bold">
              {signal.entryPrice.toFixed(5)}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <StatusIndicator
              status={signal.status === "active" ? "online" : "success"}
              label={signal.status.toUpperCase()}
              size="md"
            />
            <Text variant="caption" color="tertiary">
              Created {getTimeAgo(signal.createdAt)}
            </Text>
            <Text variant="caption" color="tertiary">
              {signal.copyCount} copies
            </Text>
          </View>

          {/* Result for closed signals */}
          {signal.status === "closed" && signal.resultPips !== undefined && (
            <View style={styles.resultBadge}>
              <Badge
                variant={signal.resultPips > 0 ? "success" : "error"}
                size="lg"
              >
                {signal.resultPips > 0 ? "+" : ""}
                {signal.resultPips} PIPS
              </Badge>
            </View>
          )}
        </Card>

        {/* Price Levels */}
        <Card style={styles.pricesGrid}>
          <View style={styles.priceItem}>
            <Text variant="caption" color="secondary" style={styles.priceLabel}>
              Entry Price
            </Text>
            <Text variant="body" weight="semibold">
              {signal.entryPrice.toFixed(5)}
            </Text>
          </View>

          {signal.stopLoss && (
            <View style={styles.priceItem}>
              <Text
                variant="caption"
                color="secondary"
                style={styles.priceLabel}
              >
                Stop Loss
              </Text>
              <Text variant="body" weight="semibold" color="error">
                {signal.stopLoss.toFixed(5)}
              </Text>
            </View>
          )}

          {signal.takeProfit && (
            <View style={styles.priceItem}>
              <Text
                variant="caption"
                color="secondary"
                style={styles.priceLabel}
              >
                Take Profit
              </Text>
              <Text variant="body" weight="semibold" color="success">
                {signal.takeProfit.toFixed(5)}
              </Text>
            </View>
          )}
        </Card>

        {/* Technical Chart */}
        <View style={styles.section}>
          <TechnicalChart
            currencyPair={signal.currencyPair}
            entryPrice={signal.entryPrice}
            stopLoss={signal.stopLoss}
            takeProfit={signal.takeProfit}
            signalType={signal.signalType}
          />
        </View>

        {/* Analysis */}
        <Card style={styles.analysisSection}>
          <Text
            variant="h4"
            weight="semibold"
            style={{ marginBottom: theme.spacing.md }}
          >
            Analysis
          </Text>

          <Text variant="body" style={styles.analysisText}>
            {signal.analysisSummary}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {signal.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" />
            ))}
          </View>
        </Card>

        {/* Metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard}>
              <Ionicons
                name="trending-up"
                size={24}
                color={theme.colors.primary}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text variant="caption" color="secondary" align="center">
                Confidence
              </Text>
              <Text variant="h4" weight="semibold" align="center">
                {signal.confidenceLevel}%
              </Text>
            </Card>

            <Card style={styles.metricCard}>
              <Ionicons
                name="calculator"
                size={24}
                color={theme.colors.success}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text variant="caption" color="secondary" align="center">
                Risk/Reward
              </Text>
              <Text variant="h4" weight="semibold" align="center">
                {getRiskRewardRatio()}
              </Text>
            </Card>

            <Card style={styles.metricCard}>
              <MaterialCommunityIcons
                name="target"
                size={24}
                color={theme.colors.warning}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text variant="caption" color="secondary" align="center">
                Potential Profit
              </Text>
              <Text variant="h4" weight="semibold" align="center">
                {calculatePotentialProfit().toFixed(0)} pips
              </Text>
            </Card>

            <Card style={styles.metricCard}>
              <Ionicons
                name="shield"
                size={24}
                color={theme.colors.error}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text variant="caption" color="secondary" align="center">
                Max Risk
              </Text>
              <Text variant="h4" weight="semibold" align="center">
                {calculateRisk().toFixed(0)} pips
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          variant="outline"
          style={styles.actionButton}
          onPress={handleShareSignal}
          leftIcon={
            <Ionicons
              name="share-outline"
              size={16}
              color={theme.colors.text}
            />
          }
        >
          Share
        </Button>

        <Button
          variant={signal.status === "active" ? "primary" : "secondary"}
          style={styles.actionButton}
          onPress={handleCopySignal}
          disabled={signal.status !== "active" || copied}
          leftIcon={
            <Ionicons
              name={copied ? "checkmark" : "copy"}
              size={16}
              color={
                signal.status === "active"
                  ? theme.colors.surface
                  : theme.colors.text
              }
            />
          }
        >
          {copied
            ? "Copied!"
            : signal.status === "active"
            ? "Copy Signal"
            : "Signal Closed"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SignalDetailsScreen;
