
// File: src/components/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Text from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    const sizeMap = {
      sm: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm + 2,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        minHeight: 52,
      },
    };
    return sizeMap[size];
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: isDisabled 
              ? theme.colors.textTertiary 
              : theme.colors.primary,
          },
          text: {
            color: theme.colors.surface,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isDisabled 
              ? theme.colors.border 
              : theme.colors.secondary,
          },
          text: {
            color: theme.colors.surface,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: isDisabled 
              ? theme.colors.border 
              : theme.colors.primary,
          },
          text: {
            color: isDisabled 
              ? theme.colors.textTertiary 
              : theme.colors.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: isDisabled 
              ? theme.colors.textTertiary 
              : theme.colors.primary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: isDisabled 
              ? theme.colors.textTertiary 
              : theme.colors.error,
          },
          text: {
            color: theme.colors.surface,
          },
        };
      default:
        return {
          container: { backgroundColor: theme.colors.primary },
          text: { color: theme.colors.surface },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    width: fullWidth ? '100%' : undefined,
    ...sizeStyles,
    ...variantStyles.container,
    opacity: (disabled && !loading) ? 0.5 : 1,
  };

  const allowedFontWeights = [
  
   "100", "200", "300", "400",
    "500", "600", "700", "800", "900"
  ];

  const fontWeight =
    allowedFontWeights.includes(theme.typography.button.fontWeight as string)
      ? (theme.typography.button.fontWeight as TextStyle['fontWeight'])
      : undefined;

  const textStyle: TextStyle = {
    ...theme.typography.button,
    fontWeight,
    ...variantStyles.text,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variantStyles.text.color} 
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[textStyle, leftIcon && { marginLeft: theme.spacing.sm }]}>
            {children}
          </Text>
          {rightIcon && (
            <div style={{ marginLeft: theme.spacing.sm }}>
              {rightIcon}
            </div>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;