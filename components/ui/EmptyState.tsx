
// File: src/components/ui/EmptyState.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import Button from "./Button";
import { useTheme } from "../../context/ThemeContext";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  illustration?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "folder-outline",
  title,
  subtitle,
  actionText,
  onActionPress,
  illustration,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    title: {
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      marginBottom: theme.spacing.xl,
      textAlign: "center",
      maxWidth: 280,
    },
  });

  return (
    <View style={styles.container}>
      {illustration || (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={36} color={theme.colors.textTertiary} />
        </View>
      )}

      <Text variant="h3" weight="semibold" align="center" style={styles.title}>
        {title}
      </Text>

      {subtitle && (
        <Text
          variant="body"
          color="secondary"
          align="center"
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      )}

      {actionText && onActionPress && (
        <Button variant="primary" onPress={onActionPress}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;