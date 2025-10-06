// ============================================================================
// File: src/components/CopySignalModal.tsx
// Modal for copying signals with settings

import React, { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Text, Button, Card } from "./ui";
import { Signal } from "./SignalCard";
import {
  CopySettings,
  TradingAccount,
  SignalCopyService,
} from "../services/signalCopyService"

interface CopySignalModalProps {
  visible: boolean;
  signal: Signal;
  account: TradingAccount;
  settings: CopySettings;
  onClose: () => void;
  onConfirm: (settings: CopySettings) => void;
}

export const CopySignalModal: React.FC<CopySignalModalProps> = ({
  visible,
  signal,
  account,
  settings: initialSettings,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<CopySettings>(initialSettings);

  const lotSize = SignalCopyService["calculateLotSize"](
    signal,
    account,
    settings
  );
  const pl = SignalCopyService.calculatePotentialPL(
    signal,
    lotSize,
    account.currency
  );

  const handleConfirm = () => {
    onConfirm(settings);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    container: {
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.large,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    content: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    infoCard: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    footer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="h3" weight="bold">
              Copy Signal
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Signal Summary */}
            <Card style={styles.infoCard}>
              <View style={styles.row}>
                <Text variant="body" color="secondary">
                  Currency Pair
                </Text>
                <Text variant="body" weight="semibold">
                  {signal.currencyPair}
                </Text>
              </View>
              <View style={styles.row}>
                <Text variant="body" color="secondary">
                  Direction
                </Text>
                <Text
                  variant="body"
                  weight="semibold"
                  color={signal.signalType === "BUY" ? "success" : "error"}
                >
                  {signal.signalType}
                </Text>
              </View>
              <View style={styles.row}>
                <Text variant="body" color="secondary">
                  Entry Price
                </Text>
                <Text variant="body" weight="semibold">
                  {signal.entryPrice.toFixed(5)}
                </Text>
              </View>
            </Card>

            {/* Calculated Trade Info */}
            <View style={styles.section}>
              <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                Trade Details
              </Text>
              <Card style={styles.infoCard}>
                <View style={styles.row}>
                  <Text variant="body" color="secondary">
                    Lot Size
                  </Text>
                  <Text variant="body" weight="semibold">
                    {lotSize.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text variant="body" color="secondary">
                    Risk Amount
                  </Text>
                  <Text variant="body" weight="semibold" color="error">
                    {account.currency} {pl.potentialLoss.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text variant="body" color="secondary">
                    Potential Profit
                  </Text>
                  <Text variant="body" weight="semibold" color="success">
                    {account.currency} {pl.potentialProfit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text variant="body" color="secondary">
                    Risk/Reward
                  </Text>
                  <Text variant="body" weight="semibold">
                    1:{pl.riskRewardRatio.toFixed(1)}
                  </Text>
                </View>
              </Card>
            </View>

            {/* Risk Warning */}
            <Card
              style={{
                ...styles.infoCard,
                backgroundColor: theme.colors.warning + "20",
                borderWidth: 1,
                borderColor: theme.colors.warning,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons
                  name="warning"
                  size={20}
                  color={theme.colors.warning}
                  style={{ marginRight: theme.spacing.sm }}
                />
                <Text variant="caption" color="secondary" style={{ flex: 1 }}>
                  Trading forex involves risk. Only trade with money you can
                  afford to lose. Past performance is not indicative of future
                  results.
                </Text>
              </View>
            </Card>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Button variant="outline" style={styles.button} onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              style={styles.button}
              onPress={handleConfirm}
            >
              Copy Signal
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
