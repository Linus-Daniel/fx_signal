
// File: src/components/ui/StatusIndicator.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

type StatusType =
  | "online"
  | "offline"
  | "pending"
  | "success"
  | "warning"
  | "error";

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = "md",
  showDot = true,
}) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    const statusMap = {
      online: {
        color: theme.colors.success,
        label: label || "Online",
      },
      offline: {
        color: theme.colors.textTertiary,
        label: label || "Offline",
      },
      pending: {
        color: theme.colors.warning,
        label: label || "Pending",
      },
      success: {
        color: theme.colors.success,
        label: label || "Success",
      },
      warning: {
        color: theme.colors.warning,
        label: label || "Warning",
      },
      error: {
        color: theme.colors.error,
        label: label || "Error",
      },
    };
    return statusMap[status];
  };

  const getSizeStyles = () => {
    const sizeMap = {
      sm: {
        dotSize: 6,
        fontSize: "caption" as const,
      },
      md: {
        dotSize: 8,
        fontSize: "body" as const,
      },
      lg: {
        dotSize: 10,
        fontSize: "h4" as const,
      },
    };
    return sizeMap[size];
  };

  const statusConfig = getStatusConfig();
  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    dot: {
      width: sizeStyles.dotSize,
      height: sizeStyles.dotSize,
      borderRadius: sizeStyles.dotSize / 2,
      backgroundColor: statusConfig.color,
      marginRight: theme.spacing.xs,
    },
    label: {
      color: statusConfig.color,
    },
  });

  return (
    <View style={styles.container}>
      {showDot && <View style={styles.dot} />}
      <Text variant={sizeStyles.fontSize} weight="medium" style={styles.label}>
        {statusConfig.label}
      </Text>
    </View>
  );
};

export default StatusIndicator;