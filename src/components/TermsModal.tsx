import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Terms & Conditions</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 text-sm leading-relaxed text-slate-600">
          <p className="mb-4">
            Welcome to Legal Vault. By creating an account, you agree to store your sensitive documents like Aadhar, PAN, and other legal files under our security protocols.
          </p>
          <h4 className="mb-2 font-medium text-slate-800">1. Data Security</h4>
          <p className="mb-4">
            We use end-to-end encryption for your files. However, you are responsible for maintaining the confidentiality of your login credentials.
          </p>
          <h4 className="mb-2 font-medium text-slate-800">2. Usage Policy</h4>
          <p className="mb-4">
            Users must not upload fraudulent or illegal documentation. Misuse of the platform may lead to account suspension.
          </p>
          <p>
            By clicking "Accept and Register", you confirm that you have read and understood our Privacy Policy regarding how we handle your biometric and personal data.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 shadow-md shadow-brand-200"
          >
            Accept and Register
          </button>
        </div>
      </div>
    </div>
  );
}