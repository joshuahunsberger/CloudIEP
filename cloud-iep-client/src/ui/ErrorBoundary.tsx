import { Typography } from "@material-ui/core";
import React from "react";

interface ErrorBoundaryProps {
    logError?: (error: Error, errorInfo: any) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: Readonly<ErrorBoundaryProps>) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }
    componentDidCatch(error: Error, errorInfo: any) {
        this.setState({ ...this.state, error });
        this.setState({ ...this.state, errorInfo })
        this.props.logError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Typography variant="h4">Something went wrong.</Typography>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
