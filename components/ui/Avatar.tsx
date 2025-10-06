// File: src/components/ui/Avatar.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  source?: string;
  name?: string;
  showOnlineIndicator?: boolean;
  style?: any;
}

const Avatar: React.FC<AvatarProps> = ({
  size = "md",
  source,
  name,
  showOnlineIndicator = false,
  style,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    const sizeMap = {
      sm: { width: 32, height: 32, fontSize: 14 },
      md: { width: 40, height: 40, fontSize: 16 },
      lg: { width: 56, height: 56, fontSize: 20 },
      xl: { width: 80, height: 80, fontSize: 28 },
    };
    return sizeMap[size];
  };

  const getInitials = (name?: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      position: "relative",
    },
    avatar: {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: sizeStyles.width / 2,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: sizeStyles.width * 0.25,
      height: sizeStyles.width * 0.25,
      borderRadius: (sizeStyles.width * 0.25) / 2,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatar}>
        {source ? (
          <Image source={{ uri: source }} style={styles.image} />
        ) : (
          <Text
            style={{
              fontSize: sizeStyles.fontSize,
              color: theme.colors.surface,
              fontWeight: "600",
            }}
          >
            {getInitials(name)}
          </Text>
        )}
      </View>

      {showOnlineIndicator && <View style={styles.onlineIndicator} />}
    </View>
  );
};

export default Avatar;
