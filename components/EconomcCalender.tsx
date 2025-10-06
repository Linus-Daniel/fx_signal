// File: src/components/news/EconomicCalendar.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Text, Card, Badge } from "./ui";

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: "low" | "medium" | "high";
  actual?: string;
  forecast?: string;
  previous?: string;
  dateTime: string;
}

interface EconomicCalendarProps {
  events: EconomicEvent[];
  onEventPress?: (event: EconomicEvent) => void;
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({
  events,
  onEventPress,
}) => {
  const { theme } = useTheme();

  const getImpactVariant = (impact: string) => {
    switch (impact) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const groupEventsByDate = () => {
    const grouped: { [key: string]: EconomicEvent[] } = {};

    events.forEach((event) => {
      const dateKey = formatDate(event.dateTime);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    dateSection: {
      marginBottom: theme.spacing.lg,
    },
    dateHeader: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    eventCard: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    eventContent: {
      padding: theme.spacing.md,
    },
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    eventInfo: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    eventTime: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    countryRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    country: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    currency: {
      backgroundColor: theme.colors.primary + "20",
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    currencyText: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    dataRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm,
    },
    dataItem: {
      alignItems: "center",
    },
    dataLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    dataValue: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });

  const groupedEvents = groupEventsByDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Economic Calendar</Text>
        <Text style={styles.subtitle}>Upcoming market-moving events</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(groupedEvents).map(([date, events]) => (
          <View key={date} style={styles.dateSection}>
            <Text style={styles.dateHeader}>{date}</Text>

            {events.map((event) => (
              <Card key={event.id} style={styles.eventCard}>
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTime}>
                        {formatTime(event.dateTime)}
                      </Text>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.countryRow}>
                        <Text style={styles.country}>{event.country}</Text>
                        <View style={styles.currency}>
                          <Text style={styles.currencyText}>
                            {event.currency}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Badge
                      label={event.impact.toUpperCase()}
                      variant={getImpactVariant(event.impact)}
                      size="sm"
                    />
                  </View>

                  {(event.actual || event.forecast || event.previous) && (
                    <View style={styles.dataRow}>
                      {event.actual && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>ACTUAL</Text>
                          <Text style={styles.dataValue}>{event.actual}</Text>
                        </View>
                      )}
                      {event.forecast && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>FORECAST</Text>
                          <Text style={styles.dataValue}>{event.forecast}</Text>
                        </View>
                      )}
                      {event.previous && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>PREVIOUS</Text>
                          <Text style={styles.dataValue}>{event.previous}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default EconomicCalendar;
