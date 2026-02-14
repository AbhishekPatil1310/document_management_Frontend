import { useEffect, type ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
      <button
        className="absolute inset-0 -z-10 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />
    </div>
  );
};
