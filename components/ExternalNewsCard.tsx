// File: src/components/news/ExternalNewsCard.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Text, Card, Badge } from "./ui";

interface ExternalNewsCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    source: string;
    author?: string;
    category: string;
    impact: "low" | "medium" | "high";
    affectedCurrencies: string[];
    imageUrl?: string;
    publishedAt: string;
    tags: string[];
    sentiment?: "positive" | "negative" | "neutral";
    relevanceScore?: number;
  };
  onPress?: () => void;
}

const ExternalNewsCard: React.FC<ExternalNewsCardProps> = ({
  article,
  onPress,
}) => {
  const { theme } = useTheme();

  const getImpactVariant = () => {
    switch (article.impact) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case "positive":
        return theme.colors.success;
      case "negative":
        return theme.colors.error;
      case "neutral":
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    cardContent: {
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    leftHeader: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    source: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    metaInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    author: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    sentimentDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: theme.spacing.xs,
    },
    contentContainer: {
      flexDirection: "row",
    },
    textContent: {
      flex: 1,
      marginRight: article.imageUrl ? theme.spacing.md : 0,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: theme.spacing.sm,
    },
    summary: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden",
      backgroundColor: theme.colors.surface,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.sm,
    },
    currenciesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      flex: 1,
      gap: theme.spacing.xs,
    },
    currency: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    currencyText: {
      fontSize: 11,
      color: theme.colors.text,
      fontWeight: "600",
    },
    relevanceScore: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    tag: {
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    tagText: {
      fontSize: 10,
      color: theme.colors.primary,
      fontWeight: "500",
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <Text style={styles.source}>{article.source}</Text>
            </View>
            <Badge
              label={`${article.impact.toUpperCase()} IMPACT`}
              variant={getImpactVariant()}
              size="sm"
            />
          </View>

          <View style={styles.metaInfo}>
            {article.author && (
              <Text style={styles.author}>{article.author}</Text>
            )}
            <Text style={styles.time}>{getTimeAgo(article.publishedAt)}</Text>
            {article.sentiment && (
              <View
                style={[
                  styles.sentimentDot,
                  { backgroundColor: getSentimentColor() },
                ]}
              />
            )}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.textContent}>
              <Text style={styles.title} numberOfLines={3}>
                {article.title}
              </Text>
              <Text style={styles.summary} numberOfLines={3}>
                {article.summary}
              </Text>
            </View>

            {article.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: article.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.currenciesContainer}>
              {article.affectedCurrencies.slice(0, 4).map((currency, index) => (
                <View key={index} style={styles.currency}>
                  <Text style={styles.currencyText}>{currency}</Text>
                </View>
              ))}
              {article.affectedCurrencies.length > 4 && (
                <View style={styles.currency}>
                  <Text style={styles.currencyText}>
                    +{article.affectedCurrencies.length - 4}
                  </Text>
                </View>
              )}
            </View>

            {article.relevanceScore && (
              <Text style={styles.relevanceScore}>
                {Math.round(article.relevanceScore * 100)}% relevant
              </Text>
            )}
          </View>

          {article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {article.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default ExternalNewsCard;
