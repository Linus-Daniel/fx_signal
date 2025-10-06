// File: src/components/signals/SignalCard.tsx (Simple Responsive Version)
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Button, Badge, StatusIndicator } from "./ui";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface Signal {
  id: string;
  currencyPair: string;
  signalType: "BUY" | "SELL";
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  confidenceLevel: number;
  status: "active" | "closed" | "cancelled";
  createdAt: string;
  expiresAt?: string;
  resultPips?: number;
  analysisSummary: string;
  tags: string[];
  copyCount: number;
  riskReward?: number;
}

interface SignalCardProps {
  signal: Signal;
  onPress: () => void;
  onCopy: () => void;
  onShare?: () => void;
  navigation: any;
}

const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onPress,
  onCopy,
  onShare,
  navigation,
}) => {
  const { theme } = useTheme();

  // Inline responsive calculations
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 768;
  const isTablet = SCREEN_WIDTH >= 768;
  const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

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

  const calculateRiskReward = () => {
    if (!signal.stopLoss || !signal.takeProfit) return null;

    const risk = Math.abs(signal.entryPrice - signal.stopLoss);
    const reward = Math.abs(signal.takeProfit - signal.entryPrice);

    if (risk > 0) {
      return (reward / risk).toFixed(1);
    }
    return null;
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: isSmallScreen ? theme.spacing.md : theme.spacing.lg,
      marginVertical: isSmallScreen ? theme.spacing.sm : theme.spacing.md,
      maxWidth: isTablet ? 600 : undefined,
      alignSelf: isTablet ? "center" : "stretch",
      width: isTablet ? "90%" : undefined,
    },
    cardContent: {
      padding: isSmallScreen ? theme.spacing.sm : theme.spacing.md,
    },
    header: {
      flexDirection: isSmallScreen ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isSmallScreen ? "flex-start" : "center",
      marginBottom: theme.spacing.md,
      gap: isSmallScreen ? theme.spacing.xs : 0,
    },
    currencyInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    currencyPair: {
      fontSize: isSmallScreen ? 18 : isTablet ? 22 : 20,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginTop: isSmallScreen ? theme.spacing.xs : 0,
    },
    pricesRow: {
      flexDirection: "row",
      flexWrap: isSmallScreen ? "wrap" : "nowrap",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
      gap: isSmallScreen ? theme.spacing.sm : 0,
    },
    priceItem: {
      alignItems: "center",
      flex: isSmallScreen ? 0 : 1,
      minWidth: isSmallScreen ? "45%" : undefined,
      marginBottom: isSmallScreen ? theme.spacing.xs : 0,
    },
    priceValue: {
      fontSize: isSmallScreen ? 14 : isTablet ? 18 : 16,
    },
    riskRewardContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.03)",
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
    },
    analysisSection: {
      marginBottom: theme.spacing.md,
    },
    analysisText: {
      lineHeight: isSmallScreen ? 20 : 22,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: isSmallScreen ? theme.spacing.xs : theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    footerRow: {
      flexDirection: isSmallScreen ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isSmallScreen ? "stretch" : "center",
      gap: isSmallScreen ? theme.spacing.md : 0,
    },
    leftFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: isSmallScreen ? theme.spacing.sm : theme.spacing.md,
      flexWrap: "wrap",
      marginBottom: isSmallScreen ? theme.spacing.xs : 0,
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      justifyContent: isSmallScreen ? "space-between" : "flex-end",
      width: isSmallScreen ? "100%" : undefined,
    },
    copyButton: {
      paddingHorizontal: isSmallScreen ? theme.spacing.sm : theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      flex: isSmallScreen ? 1 : undefined,
      minHeight: 44, // Accessibility - minimum touch target
    },
    shareButton: {
      flex: isSmallScreen ? 1 : undefined,
      minHeight: 44,
    },
    resultBadge: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 1,
    },
  });

  const riskReward = calculateRiskReward();
  const maxTagsToShow = isSmallScreen ? 2 : isTablet ? 4 : 3;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`${signal.currencyPair} ${signal.signalType} signal`}
      accessibilityRole="button"
      accessibilityHint="Double tap to view signal details"
    >
      <Card style={styles.container} variant="elevated">
        <View style={styles.cardContent}>
          {/* Result Badge for Closed Signals */}
          {signal.status === "closed" && signal.resultPips !== undefined && (
            <View style={styles.resultBadge}>
              <Badge
                variant={signal.resultPips > 0 ? "success" : "error"}
                size="sm"
              >
                {signal.resultPips > 0 ? "+" : ""}
                {signal.resultPips} pips
              </Badge>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.currencyInfo}>
              <Text variant="h4" weight="bold" style={styles.currencyPair}>
                {signal.currencyPair}
              </Text>
              <Badge
                variant={signal.signalType === "BUY" ? "success" : "error"}
                size="sm"
              >
                {signal.signalType}
              </Badge>
            </View>

            <View style={styles.statusContainer}>
              <StatusIndicator
                status={signal.status === "active" ? "online" : "success"}
                label={signal.status.toUpperCase()}
                size="sm"
              />
            </View>
          </View>

          {/* Price Information - Responsive Grid */}
          <View style={styles.pricesRow}>
            <View style={styles.priceItem}>
              <Text variant="caption" color="secondary">
                Entry
              </Text>
              <Text variant="body" weight="semibold" style={styles.priceValue}>
                {signal.entryPrice.toFixed(5)}
              </Text>
            </View>

            {signal.stopLoss && (
              <View style={styles.priceItem}>
                <Text variant="caption" color="secondary">
                  Stop Loss
                </Text>
                <Text
                  variant="body"
                  weight="semibold"
                  color="error"
                  style={styles.priceValue}
                >
                  {signal.stopLoss.toFixed(5)}
                </Text>
              </View>
            )}

            {signal.takeProfit && (
              <View style={styles.priceItem}>
                <Text variant="caption" color="secondary">
                  Take Profit
                </Text>
                <Text
                  variant="body"
                  weight="semibold"
                  color="success"
                  style={styles.priceValue}
                >
                  {signal.takeProfit.toFixed(5)}
                </Text>
              </View>
            )}

            <View style={styles.priceItem}>
              <Text variant="caption" color="secondary">
                Confidence
              </Text>
              <Text variant="body" weight="semibold" style={styles.priceValue}>
                {signal.confidenceLevel}%
              </Text>
            </View>
          </View>

          {/* Risk/Reward Ratio */}
          {riskReward && (
            <View style={styles.riskRewardContainer}>
              <Text variant="caption" color="secondary">
                Risk/Reward
              </Text>
              <Text variant="body" weight="bold" color="primary">
                1:{riskReward}
              </Text>
            </View>
          )}

          {/* Analysis Summary */}
          <View style={styles.analysisSection}>
            <Text
              variant="body"
              color="secondary"
              numberOfLines={isSmallScreen ? 2 : isTablet ? 4 : 3}
              style={styles.analysisText}
            >
              {signal.analysisSummary}
            </Text>
          </View>

          {/* Tags */}
          {signal.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {signal.tags.slice(0, maxTagsToShow).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text variant="caption" color="tertiary">
                    {tag}
                  </Text>
                </View>
              ))}
              {signal.tags.length > maxTagsToShow && (
                <View style={styles.tag}>
                  <Text variant="caption" color="tertiary">
                    +{signal.tags.length - maxTagsToShow}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footerRow}>
            <View style={styles.leftFooter}>
              <Text variant="caption" color="tertiary">
                {getTimeAgo(signal.createdAt)}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                }}
              >
                <Ionicons
                  name="copy-outline"
                  size={12}
                  color={theme.colors.textTertiary}
                />
                <Text variant="caption" color="tertiary">
                  {signal.copyCount} copied
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              {onShare && !isSmallScreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={onShare}
                  style={styles.shareButton}
                  leftIcon={
                    <Ionicons
                      name="share-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                  }
                >
                  Share
                </Button>
              )}

             

              <Button
                variant={signal.status === "active" ? "primary" : "outline"}
                size="sm"
                style={styles.copyButton}
                onPress={onCopy}
                disabled={signal.status !== "active"}
              >
                <Text variant="caption" weight="semibold" numberOfLines={1}>
                  {signal.status === "active" ? "Copy Signal" : "Closed"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default SignalCard;
