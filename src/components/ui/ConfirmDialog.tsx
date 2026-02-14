import { Modal } from "./Modal";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading,
  onConfirm,
  onCancel,
  danger
}: ConfirmDialogProps) => (
  <Modal isOpen={isOpen} title={title} onClose={onCancel}>
    <p className="text-sm text-slate-600">{description}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelLabel}
      </button>
      <button
        className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
          danger ? "bg-rose-600 hover:bg-rose-700" : "bg-brand-500 hover:bg-brand-700"
        }`}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : confirmLabel}
      </button>
    </div>
  </Modal>
);
