import { useRef } from "react";
import { formatBytes } from "../../../utils/format";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

type UploadPanelProps = {
  isUploading: boolean;
  progress: number;
  onFileSelected: (file: File) => void;
};

export const UploadPanel = ({ isUploading, progress, onFileSelected }: UploadPanelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Upload document</h2>
          <p className="text-sm text-slate-600">
            Allowed: PDF, JPG, PNG. Max size: {formatBytes(MAX_FILE_SIZE)}.
          </p>
        </div>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : "Choose File"}
        </button>
      </div>

      <input
        ref={inputRef}
        aria-label="Upload legal document"
        type="file"
        className="hidden"
        accept={ALLOWED_TYPES.join(",")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          onFileSelected(file);
          event.target.value = "";
        }}
      />

      {isUploading ? (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-600">{progress}% uploaded</p>
        </div>
      ) : null}
    </section>
  );
};

export const validateUploadFile = (file: File): string => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "File type not allowed. Use PDF, JPG, or PNG.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File exceeds 10MB limit.";
  }
  return "";
};
