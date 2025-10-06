
// File: src/components/ui/Card.tsx
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme()

  const getPaddingValue = () => {
    const paddingMap = {
      none: 0,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    return paddingMap[padding];
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.medium,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.small,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    padding: getPaddingValue(),
    ...getVariantStyle(),
  };

  return (
    
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;