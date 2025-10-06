// File: src/utils/performance.ts
import { InteractionManager, Platform } from "react-native";

export const scheduleTask = (task: () => void, delay = 0) => {
  if (delay > 0) {
    setTimeout(() => {
      InteractionManager.runAfterInteractions(task);
    }, delay);
  } else {
    InteractionManager.runAfterInteractions(task);
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory optimization utilities
export const createMemoizedSelector = <T, R>(
  selector: (input: T) => R
): ((input: T) => R) => {
  let lastInput: T;
  let lastResult: R;

  return (input: T): R => {
    if (input !== lastInput) {
      lastResult = selector(input);
      lastInput = input;
    }
    return lastResult;
  };
};

// Platform-specific optimizations
export const platformOptimization = {
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",

  // iOS specific optimizations
  shouldUseNativeDriver: Platform.OS === "ios",

  // Android specific optimizations
  shouldUseTextScaling: Platform.OS === "android",
};
