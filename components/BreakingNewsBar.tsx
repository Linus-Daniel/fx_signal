

// File: src/components/news/BreakingNewsBar.tsx
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Text, Badge } from "./ui";

interface BreakingNewsBarProps {
  breakingNews: Array<{
    id: string;
    title: string;
    impact: "high" | "medium" | "low";
    publishedAt: string;
  }>;
  onPress?: (newsId: string) => void;
}

const BreakingNewsBar: React.FC<BreakingNewsBarProps> = ({
  breakingNews,
  onPress,
}) => {
  const { theme } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (breakingNews.length > 0) {
      pulseAnimation.start();
    }

    return () => pulseAnimation.stop();
  }, [breakingNews.length, pulseAnim]);

  if (breakingNews.length === 0) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.error + "10",
      borderRadius: theme.borderRadius.md,
      margin: theme.spacing.lg,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.error,
    },
    breakingIcon: {
      marginRight: theme.spacing.sm,
    },
    headerText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 12,
    },
    scrollView: {
      paddingVertical: theme.spacing.sm,
    },
    newsItem: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.sm,
      minWidth: 200,
      maxWidth: 300,
    },
    newsTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text,
      lineHeight: 18,
    },
    newsTime: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
  });

  const getTimeAgo = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins}m ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View
          style={[styles.breakingIcon, { transform: [{ scale: pulseAnim }] }]}
        >
          <Ionicons name="flash" size={16} color="white" />
        </Animated.View>
        <Text style={styles.headerText}>BREAKING NEWS</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {breakingNews.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={styles.newsItem}
            onPress={() => onPress?.(news.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.newsTitle} numberOfLines={3}>
              {news.title}
            </Text>
            <Text style={styles.newsTime}>{getTimeAgo(news.publishedAt)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BreakingNewsBar;