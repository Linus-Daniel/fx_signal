// File: src/components/profile/ProfileHeader.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Avatar, Badge, StatusIndicator } from "./ui";
import { useTheme } from "../context/ThemeContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  subscriptionTier: "free" | "premium" | "professional";
  totalSignalsCopied: number;
  winRate: number;
  totalProfit: number;
  isOnline: boolean;
}

interface ProfileHeaderProps {
  user: UserProfile;
  onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditPress }) => {
  const { theme } = useTheme();

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "professional":
        return "primary";
      case "premium":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "professional":
        return "diamond";
      case "premium":
        return "star";
      default:
        return "person";
    }
  };

  const formatMemberSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    const diffYears = Math.ceil(diffDays / 365);

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffMonths < 12) {
      return `${diffMonths} months`;
    } else {
      return `${diffYears} years`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      margin: theme.spacing.lg,
      padding: theme.spacing.xl,
      alignItems: "center",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.lg,
    },
    editButton: {
      position: "absolute",
      bottom: -4,
      right: -4,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      ...theme.shadows.medium,
    },
    userInfo: {
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    tierBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      paddingTop: theme.spacing.lg,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.divider,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      marginBottom: theme.spacing.xs,
    },
  });

  return (
    <Card style={styles.container} variant="elevated">
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar
          size="xl"
          name={user.name}
          source={user.avatar}
          showOnlineIndicator={user.isOnline}
        />
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="pencil" size={16} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text variant="h3" weight="bold">
            {user.name}
          </Text>
        </View>

        <Text
          variant="body"
          color="secondary"
          style={{ marginBottom: theme.spacing.sm }}
        >
          {user.email}
        </Text>

        <View style={styles.tierBadge}>
          <Badge
            variant={getTierBadgeVariant(user.subscriptionTier) as any}
            size="md"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons
                name={getTierIcon(user.subscriptionTier)}
                size={12}
                color={theme.colors.surface}
              />
              <Text
                style={{
                  color: theme.colors.surface,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {user.subscriptionTier.toUpperCase()}
              </Text>
            </View>
          </Badge>
        </View>

        <View style={styles.statusRow}>
          <StatusIndicator
            status={user.isOnline ? "online" : "offline"}
            size="sm"
          />
          <Text variant="caption" color="tertiary">
            Member for {formatMemberSince(user.memberSince)}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="h4" weight="bold" style={styles.statValue}>
            {user.totalSignalsCopied}
          </Text>
          <Text variant="caption" color="secondary">
            Signals Copied
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            variant="h4"
            weight="bold"
            style={styles.statValue}
            color="success"
          >
            {user.winRate}%
          </Text>
          <Text variant="caption" color="secondary">
            Win Rate
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text
            variant="h4"
            weight="bold"
            style={styles.statValue}
            color="primary"
          >
            ${user.totalProfit.toLocaleString()}
          </Text>
          <Text variant="caption" color="secondary">
            Total Profit
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default ProfileHeader;
