"use client";

import { motion } from "framer-motion";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <motion.div
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-accent-subtle p-4">
                <FaTriangleExclamation className="h-8 w-8 text-accent" />
              </div>
            </div>

            <h2 className="mb-2 text-xl font-semibold text-text-primary">
              Something went wrong
            </h2>

            <p className="mb-6 text-text-secondary">
              We encountered an error while loading this section. Please try
              again.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Error details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="btn btn-primary px-6 py-2"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
