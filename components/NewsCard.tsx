// File: src/components/news/NewsCard.tsx
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Badge, Card } from "./ui";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  category: "breaking" | "analysis" | "market-update" | "economic-data";
  impact: "high" | "medium" | "low";
  currencyPairs?: string[];
}

interface NewsCardProps {
  news: NewsItem;
  onPress: () => void;
  variant?: "default" | "compact";
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onPress,
  variant = "default",
}) => {
  const { theme } = useTheme();

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const publishTime = new Date(dateString);
    const diffMs = now.getTime() - publishTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    return `${diffMins}m ago`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breaking":
        return "error";
      case "analysis":
        return "primary";
      case "market-update":
        return "success";
      case "economic-data":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return "flash";
      case "medium":
        return "trending-up";
      case "low":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal:
        variant === "compact" ? theme.spacing.md : theme.spacing.lg,
      marginVertical: theme.spacing.sm,
    },
    content: {
      padding: theme.spacing.md,
    },
    compactContent: {
      padding: theme.spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    headerLeft: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    categoryBadge: {
      marginBottom: theme.spacing.xs,
      alignSelf: "flex-start",
    },
    title: {
      marginBottom: theme.spacing.xs,
      lineHeight: variant === "compact" ? 18 : 22,
    },
    imageContainer: {
      width: variant === "compact" ? 60 : 80,
      height: variant === "compact" ? 45 : 60,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden",
      backgroundColor: theme.colors.border,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    imagePlaceholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    summary: {
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flex: 1,
    },
    sourceInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    impactIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    currencyPairs: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    currencyPair: {
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 1,
      borderRadius: theme.borderRadius.sm,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        style={styles.container}
        variant="elevated"
        padding={variant === "compact" ? "sm" : "md"}
      >
        <View
          style={variant === "compact" ? styles.compactContent : styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Badge
                variant={getCategoryColor(news.category) as any}
                size="sm"
                style={styles.categoryBadge}
              >
                {news.category.replace("-", " ").toUpperCase()}
              </Badge>

              <Text
                variant={variant === "compact" ? "body" : "h4"}
                weight="semibold"
                numberOfLines={variant === "compact" ? 2 : 3}
                style={styles.title}
              >
                {news.title}
              </Text>
            </View>

            {news.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: news.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {!news.imageUrl && variant !== "compact" && (
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons
                    name="newspaper-outline"
                    size={24}
                    color={theme.colors.textTertiary}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Summary */}
          {variant !== "compact" && (
            <Text
              variant="body"
              color="secondary"
              numberOfLines={3}
              style={styles.summary}
            >
              {news.summary}
            </Text>
          )}

          {/* Currency Pairs */}
          {news.currencyPairs && news.currencyPairs.length > 0 && (
            <View style={styles.currencyPairs}>
              {news.currencyPairs.slice(0, 3).map((pair, index) => (
                <View key={index} style={styles.currencyPair}>
                  <Text variant="caption" color="tertiary">
                    {pair}
                  </Text>
                </View>
              ))}
              {news.currencyPairs.length > 3 && (
                <View style={styles.currencyPair}>
                  <Text variant="caption" color="tertiary">
                    +{news.currencyPairs.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={styles.sourceInfo}>
                <Text variant="caption" color="tertiary">
                  {news.source}
                </Text>
                <Text variant="caption" color="tertiary">
                  •
                </Text>
                <Text variant="caption" color="tertiary">
                  {getTimeAgo(news.publishedAt)}
                </Text>
              </View>
            </View>

            <View style={styles.impactIndicator}>
              <Ionicons
                name={getImpactIcon(news.impact)}
                size={12}
                color={
                  news.impact === "high"
                    ? theme.colors.error
                    : news.impact === "medium"
                    ? theme.colors.warning
                    : theme.colors.success
                }
              />
              <Text
                variant="caption"
                style={{
                  color:
                    news.impact === "high"
                      ? theme.colors.error
                      : news.impact === "medium"
                      ? theme.colors.warning
                      : theme.colors.success,
                }}
              >
                {news.impact.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NewsCard;
