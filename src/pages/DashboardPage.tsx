import { useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { normalizeApiError } from "../api/errors";
import { useToast } from "../components/ui/ToastProvider";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/LoadingSkeleton";
import { QueryErrorState } from "../components/ui/QueryErrorState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { DocumentTable } from "../features/documents/components/DocumentTable";
import {
  UploadPanel,
  validateUploadFile
} from "../features/documents/components/UploadPanel";
import {
  useDeleteDocument,
  useDocuments,
  useDownloadDocument,
  useUploadDocument
} from "../features/documents/hooks/useDocuments";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const debouncedSearch = useDebounce(search, 280);

  const { pushToast } = useToast();
  const documentsQuery = useDocuments(page);
  const uploadMutation = useUploadDocument();
  const downloadMutation = useDownloadDocument();
  const deleteMutation = useDeleteDocument();

  const filteredDocuments = useMemo(() => {
    const docs = documentsQuery.data?.documents || [];
    if (!debouncedSearch.trim()) return docs;
    const needle = debouncedSearch.trim().toLowerCase();
    return docs.filter((doc) => doc.file_name.toLowerCase().includes(needle));
  }, [debouncedSearch, documentsQuery.data?.documents]);

  const onUpload = async (file: File) => {
    const fileErr = validateUploadFile(file);
    if (fileErr) {
      pushToast(fileErr, "error");
      return;
    }

    setUploadProgress(0);
    try {
      await uploadMutation.mutateAsync({
        file,
        onProgress: (progress) => setUploadProgress(progress)
      });
      pushToast("Document uploaded successfully", "success");
    } catch (err) {
      pushToast(normalizeApiError(err).message, "error");
    } finally {
      setUploadProgress(0);
    }
  };

  const onDownload = async (id: string) => {
    try {
      await downloadMutation.mutateAsync(id);
    } catch (err) {
      pushToast(normalizeApiError(err).message, "error");
    }
  };

  const onDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      pushToast("Document deleted", "success");
      setDeleteTargetId(null);
    } catch (err) {
      pushToast(normalizeApiError(err).message, "error");
    }
  };

  const totalPages = documentsQuery.data?.totalPages || 1;

  return (
    <div className="space-y-4">
      <UploadPanel
        isUploading={uploadMutation.isPending}
        progress={uploadProgress}
        onFileSelected={onUpload}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Documents</h2>
            <p className="text-sm text-slate-600">
              Secure files uploaded via signed S3 URLs.
            </p>
          </div>
          <input
            aria-label="Search documents"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-64"
            placeholder="Search by filename"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {documentsQuery.isPending ? <TableSkeleton rows={6} /> : null}

        {documentsQuery.isError ? (
          <QueryErrorState
            message={normalizeApiError(documentsQuery.error).message}
            onRetry={() => documentsQuery.refetch()}
          />
        ) : null}

        {!documentsQuery.isPending && !documentsQuery.isError ? (
          filteredDocuments.length === 0 ? (
            <EmptyState
              title="No documents found"
              description="Upload your first legal document to start building your secure library."
            />
          ) : (
            <DocumentTable
              documents={filteredDocuments}
              onDownload={onDownload}
              onDelete={(id) => setDeleteTargetId(id)}
              pendingDeleteId={
                deleteMutation.isPending ? (deleteMutation.variables ?? null) : null
              }
            />
          )
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete document"
        description="This permanently removes the file from secure storage. This action cannot be undone."
        confirmLabel="Delete"
        danger
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={onDeleteConfirm}
      />
    </div>
  );
}
