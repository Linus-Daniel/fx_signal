import { create } from 'twrnc';
import { Dimensions } from 'react-native';

// Get device dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device breakpoints for responsive design
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Helper function to determine current breakpoint
export const getCurrentBreakpoint = () => {
  if (screenWidth < breakpoints.sm) return 'xs';
  if (screenWidth < breakpoints.md) return 'sm';
  if (screenWidth < breakpoints.lg) return 'md';
  if (screenWidth < breakpoints.xl) return 'lg';
  return 'xl';
};

// Helper function for responsive values
export const responsive = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth < breakpoints.sm,
  isMedium: screenWidth >= breakpoints.sm && screenWidth < breakpoints.lg,
  isLarge: screenWidth >= breakpoints.lg,
  isTablet: screenWidth >= breakpoints.md,
  currentBreakpoint: getCurrentBreakpoint(),
};

const tw = create(require('../tailwind.config'));

export { tw };