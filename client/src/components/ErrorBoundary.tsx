import React from 'react';
import Illustration from './common/Illustration';

interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Illustration type="error" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
