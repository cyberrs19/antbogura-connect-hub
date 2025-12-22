import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep logs for debugging in production.
    console.error("App crashed:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background text-foreground">
          <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-12">
            <h1 className="text-2xl font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The app failed to load. Please refresh. If this keeps happening,
              share the error details below.
            </p>

            <pre className="mt-6 overflow-auto rounded-md border bg-muted p-4 text-xs leading-relaxed text-foreground">
              {String(this.state.error?.stack || this.state.error?.message)}
            </pre>

            <a
              className="mt-6 w-fit underline text-primary hover:text-primary/90"
              href="#/"
            >
              Go to Home
            </a>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
