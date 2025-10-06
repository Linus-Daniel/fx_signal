
// File: src/components/common/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "./ui";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log error to crash reporting service
    // crashlytics().recordError(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Text
              variant="h3"
              weight="bold"
              align="center"
              style={styles.title}
            >
              Oops! Something went wrong
            </Text>

            <Text
              variant="body"
              color="secondary"
              align="center"
              style={styles.message}
            >
              We're sorry for the inconvenience. The app encountered an
              unexpected error.
            </Text>

            {__DEV__ && this.state.error && (
              <Text
                variant="caption"
                color="error"
                align="center"
                style={styles.errorDetails}
              >
                {this.state.error.toString()}
              </Text>
            )}

            <Button
              variant="primary"
              onPress={this.handleReset}
              style={styles.retryButton}
            >
              Try Again
            </Button>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorCard: {
    padding: 32,
    maxWidth: 350,
  },
  title: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: "#fee",
    borderRadius: 8,
  },
  retryButton: {
    width: "100%",
  },
});

export default ErrorBoundary;
