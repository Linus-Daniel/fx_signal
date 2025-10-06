
// File: src/components/ui/SegmentedControl.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "./Text";
import { useTheme } from "../../context/ThemeContext";

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedValue,
  onValueChange,
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      borderRadius: theme.borderRadius.md,
      padding: 2,
    },
    option: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md - 2,
      alignItems: "center",
      justifyContent: "center",
    },
    selectedOption: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.small,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {options.map((option,index) => {
        const isSelected = option.value === selectedValue;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              variant="caption"
              weight={isSelected ? "semibold" : "medium"}
              color={isSelected ? "primary" : "secondary"}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
