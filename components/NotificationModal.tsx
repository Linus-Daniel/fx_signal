// File: src/components/common/NotificationPermissionModal.tsx
import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Text, Button, Card } from "./ui";
import { useNotifications } from "../../hooks/useNotifications";

interface NotificationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationPermissionModal: React.FC<
  NotificationPermissionModalProps
> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { requestPermissions, openSettings } = useNotifications();
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    const granted = await requestPermissions();
    setRequesting(false);

    if (granted) {
      onClose();
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      margin: theme.spacing.lg,
      alignItems: "center",
      maxWidth: 320,
    },
    icon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.sm,
    },
    skipButton: {
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.modal}>
          <View style={styles.icon}>
            <Ionicons
              name="notifications"
              size={32}
              color={theme.colors.primary}
            />
          </View>

          <Text style={styles.title}>Stay Updated</Text>

          <Text style={styles.description}>
            Get instant notifications for new trading signals, market alerts,
            and important news that could impact your trades.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Enable Notifications"
              onPress={handleRequestPermission}
              loading={requesting}
            />

            <Button
              title="Open Settings"
              variant="outline"
              onPress={openSettings}
            />

            <Button
              title="Maybe Later"
              variant="ghost"
              onPress={onClose}
              style={styles.skipButton}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

export default NotificationPermissionModal;
