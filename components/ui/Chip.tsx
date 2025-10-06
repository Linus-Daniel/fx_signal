// File: src/components/ui/Chip.tsx
import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "outlined";
  style?: ViewStyle;
}

const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  leftIcon,
  variant = "default",
  style,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    if (variant === "outlined") {
      return {
        backgroundColor: selected ? theme.colors.primary : "transparent",
        borderWidth: 1,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
      };
    }

    return {
      backgroundColor: selected
        ? theme.colors.primary
        : theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      borderWidth: 0,
    };
  };

  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
    minHeight: 32,
    opacity: disabled ? 0.5 : 1,
    ...variantStyles,
  };

  const textColor = selected
    ? variant === "outlined"
      ? theme.colors.surface
      : theme.colors.surface
    : theme.colors.text;

  const iconColor = selected
    ? variant === "outlined"
      ? theme.colors.surface
      : theme.colors.surface
    : theme.colors.textSecondary;

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={14}
          color={iconColor}
          style={{ marginRight: theme.spacing.xs }}
        />
      )}

      <Text
        variant="caption"
        weight="medium"
        style={{ color: textColor, flex: 1 }}
      >
        {label}
      </Text>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={{
            marginLeft: theme.spacing.xs,
            padding: 2,
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={14} color={iconColor} />
        </TouchableOpacity>
      )}
    </Component>
  );
};

export default Chip;
