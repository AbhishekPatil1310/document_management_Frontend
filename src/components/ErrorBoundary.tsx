import { Component, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-xl rounded-xl border border-rose-200 bg-white p-6 shadow-soft">
          <h1 className="text-lg font-semibold text-slate-900">Unexpected error</h1>
          <p className="mt-2 text-sm text-slate-700">{this.state.message}</p>
          <button
            className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            onClick={() => window.location.reload()}
          >
            Reload app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
