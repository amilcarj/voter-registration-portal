"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="rounded-lg border border-brand-secondary bg-brand-quaternary p-6 text-center max-w-md mx-auto my-4">
      <AlertCircle className="mx-auto h-10 w-10 text-brand-tertiary mb-2" />
      <h3 className="text-lg font-semibold text-brand-tertiary">
        Something went wrong
      </h3>
      <p className="mt-1 text-sm text-brand-tertiary">
        {error.message ||
          "An unexpected error occurred while processing your request."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="pill-button inline-flex justify-center mt-4 gap-2 bg-brand-tertiary text-brand-quaternary hover:bg-red-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
