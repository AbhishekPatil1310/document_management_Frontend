type QueryErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const QueryErrorState = ({ message, onRetry }: QueryErrorStateProps) => (
  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
    <p className="text-sm text-rose-700">{message}</p>
    <button
      className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);
