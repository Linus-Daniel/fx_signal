// File: src/components/ui/Badge.tsx
import React from "react";
import { View, ViewStyle } from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "md",
  children,
  style,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    const sizeMap = {
      sm: {
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        fontSize: 10,
        minHeight: 16,
      },
      md: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        fontSize: 12,
        minHeight: 20,
      },
      lg: {
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: theme.spacing.xs + 1,
        fontSize: 14,
        minHeight: 24,
      },
    };
    return sizeMap[size];
  };

  const getVariantStyles = () => {
    const variantMap = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.surface,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors.surface,
      },
      success: {
        backgroundColor: theme.colors.success,
        color: theme.colors.surface,
      },
      warning: {
        backgroundColor: theme.colors.warning,
        color: theme.colors.surface,
      },
      error: {
        backgroundColor: theme.colors.error,
        color: theme.colors.surface,
      },
      info: {
        backgroundColor: theme.colors.info,
        color: theme.colors.surface,
      },
    };
    return variantMap[variant];
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: sizeStyles.paddingHorizontal,
    paddingVertical: sizeStyles.paddingVertical,
    minHeight: sizeStyles.minHeight,
    backgroundColor: variantStyles.backgroundColor,
  };

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={{
          fontSize: sizeStyles.fontSize,
          color: variantStyles.color,
          fontWeight: "600",
        }}
      >
        {children}
      </Text>
    </View>
  );
};

export default Badge;
