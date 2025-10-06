// File: src/components/charts/TechnicalChart.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../../context/ThemeContext";
import { Text, Card, SegmentedControl, Badge } from "../ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalChartProps {
  currencyPair: string;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  signalType?: "BUY" | "SELL";
}

const TechnicalChart: React.FC<TechnicalChartProps> = ({
  currencyPair,
  entryPrice,
  stopLoss,
  takeProfit,
  signalType,
}) => {
  const { theme } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [showIndicators, setShowIndicators] = useState(true);

  // Mock chart data - in production, this would come from API
  const generateMockData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const basePrice = entryPrice || 1.085;
    const now = Date.now();

    for (let i = 50; i >= 0; i--) {
      const timestamp = now - i * 60 * 60 * 1000; // Hourly data
      const randomChange = (Math.random() - 0.5) * 0.01;
      const price = basePrice + randomChange;

      data.push({
        timestamp,
        open: price,
        high: price + Math.random() * 0.005,
        low: price - Math.random() * 0.005,
        close: price + (Math.random() - 0.5) * 0.003,
        volume: Math.random() * 1000000,
      });
    }
    return data;
  };

  const chartData = generateMockData();
  const prices = chartData.map((d) => d.close);
  const labels = chartData.map((d, index) => {
    if (index % 10 === 0) {
      return new Date(d.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "";
  });

  const timeframeOptions = [
    { label: "1M", value: "1M" },
    { label: "5M", value: "5M" },
    { label: "15M", value: "15M" },
    { label: "1H", value: "1H" },
    { label: "4H", value: "4H" },
    { label: "1D", value: "1D" },
  ];

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 5,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.textSecondary,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForDots: {
      r: "0", // Hide dots for cleaner look
    },
    propsForBackgroundLines: {
      strokeDasharray: "5,5",
      stroke: theme.colors.border,
      strokeWidth: 0.5,
    },
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    timeframeContainer: {
      marginBottom: theme.spacing.lg,
    },
    chartContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    priceOverlay: {
      position: "absolute",
      top: theme.spacing.md,
      left: theme.spacing.md,
      backgroundColor: theme.colors.overlay,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    currentPrice: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    indicatorsContainer: {
      marginTop: theme.spacing.md,
    },
    indicatorsToggle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    indicatorsList: {
      gap: theme.spacing.sm,
    },
    indicatorRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.xs,
    },
  });

  const currentPrice = prices[prices.length - 1];
  const priceChange = currentPrice - prices[prices.length - 2];
  const priceChangePercent = (priceChange / prices[prices.length - 2]) * 100;

  return (
    <Card style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">
          {currencyPair} Chart
        </Text>
        <TouchableOpacity onPress={() => setShowIndicators(!showIndicators)}>
          <Text variant="caption" color="primary">
            {showIndicators ? "Hide" : "Show"} Indicators
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        <SegmentedControl
          options={timeframeOptions}
          selectedValue={selectedTimeframe}
          onValueChange={setSelectedTimeframe}
        />
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: prices,
                color: (opacity = 1) => theme.colors.primary,
                strokeWidth: 2,
              },
            ],
          }}
          width={SCREEN_WIDTH - theme.spacing.lg * 4}
          height={220}
          chartConfig={chartConfig}
          bezier
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          segments={4}
        />

        {/* Price overlay */}
        <View style={styles.priceOverlay}>
          <View style={styles.currentPrice}>
            <Text variant="caption" style={{ color: theme.colors.surface }}>
              Current: {currentPrice.toFixed(5)}
            </Text>
            <Badge variant={priceChange >= 0 ? "success" : "error"} size="sm">
              {priceChange >= 0 ? "+" : ""}
              {priceChangePercent.toFixed(2)}%
            </Badge>
          </View>
        </View>
      </View>

      {/* Technical Indicators */}
      {showIndicators && (
        <View style={styles.indicatorsContainer}>
          <View style={styles.indicatorsToggle}>
            <Text variant="body" weight="semibold">
              Technical Indicators
            </Text>
          </View>

          <View style={styles.indicatorsList}>
            <View style={styles.indicatorRow}>
              <Text variant="body" color="secondary">
                RSI (14)
              </Text>
              <Text variant="body" weight="medium" color="warning">
                65.4 (Neutral)
              </Text>
            </View>

            <View style={styles.indicatorRow}>
              <Text variant="body" color="secondary">
                MACD (12,26,9)
              </Text>
              <Text variant="body" weight="medium" color="success">
                Bullish Cross
              </Text>
            </View>

            <View style={styles.indicatorRow}>
              <Text variant="body" color="secondary">
                MA 20
              </Text>
              <Text variant="body" weight="medium">
                {(currentPrice - 0.0025).toFixed(5)}
              </Text>
            </View>

            <View style={styles.indicatorRow}>
              <Text variant="body" color="secondary">
                MA 50
              </Text>
              <Text variant="body" weight="medium">
                {(currentPrice - 0.0045).toFixed(5)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
};

export default TechnicalChart;
