
// File: src/components/common/ConnectionStatus.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, StatusIndicator } from "./ui";
import { socketService } from "../services/socketService";
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from "../context/ThemeContext";

const ConnectionStatus = () => {
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Monitor network connection
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    // Monitor socket connection
    const checkSocket = setInterval(() => {
      setIsSocketConnected(socketService.isConnected());
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(checkSocket);
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !isSocketConnected) {
      // Show connection status
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide after delay when connected
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    }
  }, [isConnected, isSocketConnected, fadeAnim]);

  const getStatus = () => {
    if (!isConnected) {
      return { status: "offline", message: "No internet connection" };
    }
    if (!isSocketConnected) {
      return { status: "pending", message: "Connecting to server..." };
    }
    return { status: "online", message: "Connected" };
  };

  const { status, message } = getStatus();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom:100,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      flexDirection: "row",
      alignItems: "center",
      ...theme.shadows.medium,
      zIndex: 1000,
    },
    message: {
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusIndicator status={status as any} size="sm" showDot />
      <Text variant="caption" style={styles.message}>
        {message}
      </Text>
    </Animated.View>
  );
};

export default ConnectionStatus;
