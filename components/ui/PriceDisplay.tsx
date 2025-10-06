
// File: src/components/ui/PriceDisplay.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

interface PriceDisplayProps {
  price: number;
  change?: number;
  changePercent?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  precision?: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  change,
  changePercent,
  currency = "USD",
  size = "md",
  showArrow = true,
  precision = 5,
}) => {
  const { theme } = useTheme();

  const isPositive = change ? change >= 0 : false;
  const changeColor = isPositive ? theme.colors.bullish : theme.colors.bearish;

  const formatPrice = (value: number): string => {
    if (currency === "USD" && value >= 1) {
      return value.toFixed(2);
    }
    return value.toFixed(precision);
  };

  const formatChange = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${formatPrice(Math.abs(value))}`;
  };

  const formatPercent = (value: number): string => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const getSizeStyles = () => {
    const sizeMap = {
      sm: {
        priceSize: "body" as const,
        changeSize: "caption" as const,
        iconSize: 12,
      },
      md: {
        priceSize: "h4" as const,
        changeSize: "body" as const,
        iconSize: 16,
      },
      lg: {
        priceSize: "h2" as const,
        changeSize: "h4" as const,
        iconSize: 20,
      },
    };
    return sizeMap[size];
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      alignItems: "flex-start",
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: change !== undefined ? theme.spacing.xs : 0,
    },
    currency: {
      marginRight: theme.spacing.xs,
    },
    changeRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    changeText: {
      marginLeft: showArrow ? theme.spacing.xs : 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        <Text
          variant="caption"
          color="secondary"
          weight="medium"
          style={styles.currency}
        >
          {currency}
        </Text>
        <Text variant={sizeStyles.priceSize} weight="semibold">
          {formatPrice(price)}
        </Text>
      </View>

      {change !== undefined && (
        <View style={styles.changeRow}>
          {showArrow && (
            <Ionicons
              name={isPositive ? "trending-up" : "trending-down"}
              size={sizeStyles.iconSize}
              color={changeColor}
            />
          )}
          <Text
            variant={sizeStyles.changeSize}
            weight="medium"
            style={[styles.changeText, { color: changeColor }]}
          >
            {formatChange(change)}
            {changePercent !== undefined &&
              ` (${formatPercent(changePercent)})`}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PriceDisplay;
