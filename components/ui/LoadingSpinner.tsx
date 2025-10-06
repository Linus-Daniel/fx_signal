// File: src/components/ui/LoadingSpinner.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";
interface LoadingSpinnerProps {
  size?: "small" | "large";
  message?: string;
  overlay?: boolean;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  message,
  overlay = false,
  color,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    message: {
      marginTop: theme.spacing.md,
    },
  });

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
      {message && (
        <Text
          variant="body"
          color="secondary"
          align="center"
          style={styles.message}
        >
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return <View style={styles.overlay}>{content}</View>;
  }

  return content;
};

export default LoadingSpinner;