
// File: src/components/profile/SettingsItem.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Badge } from "./ui";
import { useTheme } from "../context/ThemeContext";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  type?: "navigation" | "switch" | "value" | "action";
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchToggle?: (value: boolean) => void;
  disabled?: boolean;
  badge?: string;
  destructive?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  type = "navigation",
  switchValue = false,
  onPress,
  onSwitchToggle,
  disabled = false,
  badge,
  destructive = false,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.divider,
      opacity: disabled ? 0.5 : 1,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: subtitle ? theme.spacing.xs : 0,
    },
    rightContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    chevron: {
      opacity: 0.5,
    },
  });

  const Component = type === "switch" || disabled ? View : TouchableOpacity;

  return (
    <Component style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? theme.colors.error : theme.colors.primary}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            variant="body"
            weight="medium"
            color={destructive ? "error" : undefined}
          >
            {title}
          </Text>
          {badge && (
            <Badge variant="primary" size="sm">
              {badge}
            </Badge>
          )}
        </View>
        {subtitle && (
          <Text variant="caption" color="secondary">
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Content */}
      <View style={styles.rightContent}>
        {type === "switch" && onSwitchToggle && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        )}

        {type === "value" && value && (
          <Text variant="body" color="secondary">
            {value}
          </Text>
        )}

        {(type === "navigation" || type === "action") && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.chevron}
          />
        )}
      </View>
    </Component>
  );
};

export default SettingsItem;
