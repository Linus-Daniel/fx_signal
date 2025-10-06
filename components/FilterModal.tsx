// File: src/components/signals/FilterModal.tsx
import React, { useState } from "react";
import { View, Modal, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Text, Button, Card, Chip, SegmentedControl } from "./ui";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SignalFilters) => void;
  currentFilters: SignalFilters;
}

export interface SignalFilters {
  signalType?: "BUY" | "SELL" | "ALL";
  status?: "active" | "closed" | "ALL";
  currencyPairs?: string[];
  timeframe?: "1H" | "4H" | "1D" | "1W" | "ALL";
  confidenceLevel?: "HIGH" | "MEDIUM" | "LOW" | "ALL";
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState<SignalFilters>(currentFilters);

  const currencyPairs = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "USD/CAD",
    "NZD/USD",
    "EUR/GBP",
    "EUR/JPY",
    "GBP/JPY",
    "AUD/JPY",
    "CHF/JPY",
  ];

  const signalTypeOptions = [
    { label: "All", value: "ALL" },
    { label: "Buy", value: "BUY" },
    { label: "Sell", value: "SELL" },
  ];

  const statusOptions = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "active" },
    { label: "Closed", value: "closed" },
  ];

  const confidenceOptions = [
    { label: "All", value: "ALL" },
    { label: "High (80%+)", value: "HIGH" },
    { label: "Medium (60-79%)", value: "MEDIUM" },
    { label: "Low (<60%)", value: "LOW" },
  ];

  const handleCurrencyPairToggle = (pair: string) => {
    const currentPairs = filters.currencyPairs || [];
    const newPairs = currentPairs.includes(pair)
      ? currentPairs.filter((p) => p !== pair)
      : [...currentPairs, pair];

    setFilters({ ...filters, currencyPairs: newPairs });
  };

  const clearAllFilters = () => {
    setFilters({
      signalType: "ALL",
      status: "ALL",
      currencyPairs: [],
      timeframe: "ALL",
      confidenceLevel: "ALL",
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
    },
    container: {
      flex: 1,
      marginTop: SCREEN_HEIGHT * 0.1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    currencyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    footer: {
      flexDirection: "row",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border,
    },
    footerButton: {
      flex: 1,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="h3" weight="semibold">
                Filter Signals
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={onClose}
                leftIcon={
                  <Ionicons name="close" size={20} color={theme.colors.text} />
                }
              >Close</Button>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Signal Type */}
              <View style={styles.section}>
                <Text
                  variant="body"
                  weight="semibold"
                  style={styles.sectionTitle}
                >
                  Signal Type
                </Text>
                <SegmentedControl
                  options={signalTypeOptions}
                  selectedValue={filters.signalType || "ALL"}
                  onValueChange={(value) =>
                    setFilters({ ...filters, signalType: value as any })
                  }
                />
              </View>

              {/* Status */}
              <View style={styles.section}>
                <Text
                  variant="body"
                  weight="semibold"
                  style={styles.sectionTitle}
                >
                  Status
                </Text>
                <SegmentedControl
                  options={statusOptions}
                  selectedValue={filters.status || "ALL"}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value as any })
                  }
                />
              </View>

              {/* Currency Pairs */}
              <View style={styles.section}>
                <Text
                  variant="body"
                  weight="semibold"
                  style={styles.sectionTitle}
                >
                  Currency Pairs
                </Text>
                <View style={styles.currencyGrid}>
                  {currencyPairs.map((pair) => (
                    <Chip
                      key={pair}
                      label={pair}
                      selected={filters.currencyPairs?.includes(pair)}
                      onPress={() => handleCurrencyPairToggle(pair)}
                      variant="outlined"
                    />
                  ))}
                </View>
              </View>

              {/* Confidence Level */}
              <View style={styles.section}>
                <Text
                  variant="body"
                  weight="semibold"
                  style={styles.sectionTitle}
                >
                  Confidence Level
                </Text>
                {confidenceOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.confidenceLevel === option.value
                        ? "primary"
                        : "ghost"
                    }
                    onPress={() =>
                      setFilters({
                        ...filters,
                        confidenceLevel: option.value as any,
                      })
                    }
                    style={{
                      marginBottom: theme.spacing.sm,
                      justifyContent: "flex-start",
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Button
                variant="outline"
                onPress={clearAllFilters}
                style={styles.footerButton}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                onPress={applyFilters}
                style={styles.footerButton}
              >
                Apply Filters
              </Button>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
