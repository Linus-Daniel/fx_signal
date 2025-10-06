// PHASE 7: ANALYSIS & NEWS SCREENS

// File: src/components/analysis/AIInsightsCard.tsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Badge, Button } from "./ui";
import { useTheme } from "../context/ThemeContext";

interface AIInsight {
  currencyPair: string;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  sentiment: "bullish" | "bearish" | "neutral";
  keyPoints: string[];
  lastUpdated: string;
  patterns: string[];
  supportLevel?: number;
  resistanceLevel?: number;
}

interface AIInsightsCardProps {
  insight: AIInsight;
  onPress?: () => void;
  expanded?: boolean;
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insight,
  onPress,
  expanded = false,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(expanded);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return theme.colors.success;
      case "bearish":
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "trending-up";
      case "bearish":
        return "trending-down";
      default:
        return "remove";
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const updateTime = new Date(dateString);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    return `${diffMins}m ago`;
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    pairInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    sentimentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    recommendationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.divider,
    },
    recommendationInfo: {
      alignItems: "center",
    },
    keyPointsSection: {
      marginBottom: theme.spacing.md,
    },
    keyPoint: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.xs,
    },
    bullet: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
      marginTop: 8,
      marginRight: theme.spacing.sm,
    },
    levelsSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: theme.spacing.md,
    },
    levelItem: {
      alignItems: "center",
    },
    patternsSection: {
      marginBottom: theme.spacing.md,
    },
    patternsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    pattern: {
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    expandButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
  });

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container} variant="elevated">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.pairInfo}>
            <Text variant="h4" weight="bold">
              {insight.currencyPair}
            </Text>
            <View style={styles.sentimentRow}>
              <Ionicons
                name={getSentimentIcon(insight.sentiment)}
                size={16}
                color={getSentimentColor(insight.sentiment)}
              />
              <Text
                variant="caption"
                weight="medium"
                style={{ color: getSentimentColor(insight.sentiment) }}
              >
                {insight.sentiment.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text variant="caption" color="tertiary">
            {getTimeAgo(insight.lastUpdated)}
          </Text>
        </View>

        {/* Recommendation */}
        <View style={styles.recommendationRow}>
          <View style={styles.recommendationInfo}>
            <Text variant="caption" color="secondary">
              AI Recommendation
            </Text>
            <Badge
              variant={
                insight.recommendation === "BUY"
                  ? "success"
                  : insight.recommendation === "SELL"
                  ? "error"
                  : "warning"
              }
              size="lg"
            >
              {insight.recommendation}
            </Badge>
          </View>

          <View style={styles.recommendationInfo}>
            <Text variant="caption" color="secondary">
              Confidence
            </Text>
            <Text variant="h4" weight="bold" color="primary">
              {insight.confidence}%
            </Text>
          </View>
        </View>

        {/* Key Points - Always show first 2 */}
        <View style={styles.keyPointsSection}>
          <Text
            variant="body"
            weight="semibold"
            style={{ marginBottom: theme.spacing.sm }}
          >
            Key Insights
          </Text>
          {insight.keyPoints
            .slice(0, isExpanded ? undefined : 2)
            .map((point, index) => (
              <View key={index} style={styles.keyPoint}>
                <View style={styles.bullet} />
                <Text
                  variant="body"
                  color="secondary"
                  style={{ flex: 1, lineHeight: 20 }}
                >
                  {point}
                </Text>
              </View>
            ))}
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <>
            {/* Support/Resistance Levels */}
            {(insight.supportLevel || insight.resistanceLevel) && (
              <View style={styles.levelsSection}>
                {insight.supportLevel && (
                  <View style={styles.levelItem}>
                    <Text variant="caption" color="secondary">
                      Support
                    </Text>
                    <Text variant="body" weight="semibold" color="success">
                      {insight.supportLevel.toFixed(5)}
                    </Text>
                  </View>
                )}
                {insight.resistanceLevel && (
                  <View style={styles.levelItem}>
                    <Text variant="caption" color="secondary">
                      Resistance
                    </Text>
                    <Text variant="body" weight="semibold" color="error">
                      {insight.resistanceLevel.toFixed(5)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Detected Patterns */}
            {insight.patterns.length > 0 && (
              <View style={styles.patternsSection}>
                <Text
                  variant="body"
                  weight="semibold"
                  style={{ marginBottom: theme.spacing.sm }}
                >
                  Detected Patterns
                </Text>
                <View style={styles.patternsContainer}>
                  {insight.patterns.map((pattern, index) => (
                    <View key={index} style={styles.pattern}>
                      <Text variant="caption" color="tertiary">
                        {pattern}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.expandButton}
          >
            <Text variant="caption" color="primary">
              {isExpanded ? "Show Less" : "Show More"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={12}
              color={theme.colors.primary}
            />
          </Button>

          <Button variant="primary" size="sm">
            View Chart
          </Button>
        </View>
      </Card>
    </Component>
  );
};

export default AIInsightsCard;
