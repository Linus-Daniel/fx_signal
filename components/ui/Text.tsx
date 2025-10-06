// File: src/components/ui/Text.tsx
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "button";
type TextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor | string;
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  variant = "body",
  color,
  weight,
  align = "left",
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getTextColor = (): string => {
    if (!color) {
      return theme.colors.text;
    }

    switch (color) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.textSecondary;
      case "tertiary":
        return theme.colors.textTertiary;
      case "success":
        return theme.colors.success;
      case "warning":
        return theme.colors.warning;
      case "error":
        return theme.colors.error;
      case "info":
        return theme.colors.info;
      default:
        return color;
    }
  };

  const getFontWeight = (): TextStyle["fontWeight"] => {
    if (weight) {
      const weightMap = {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      };
      return weightMap[weight] as TextStyle["fontWeight"];
    }
    return theme.typography[variant].fontWeight as TextStyle["fontWeight"];
  };

  const textStyle: TextStyle = {
    ...theme.typography[variant],
    color: getTextColor(),
    fontWeight: getFontWeight(),
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
