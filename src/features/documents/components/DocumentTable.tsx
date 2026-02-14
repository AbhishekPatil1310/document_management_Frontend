import { memo } from "react";
import type { DocumentItem } from "../../../api/documents.api";
import { formatBytes, formatDateTime, truncate } from "../../../utils/format";

type DocumentTableProps = {
  documents: DocumentItem[];
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  pendingDeleteId?: string | null;
};

const DocumentTableComponent = ({
  documents,
  onDownload,
  onDelete,
  pendingDeleteId
}: DocumentTableProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              File
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
              Uploaded
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-700" title={doc.file_name}>
                {truncate(doc.file_name, 65)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {formatBytes(doc.file_size)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {formatDateTime(doc.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    onClick={() => onDownload(doc.id)}
                  >
                    Download
                  </button>
                  <button
                    className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    onClick={() => onDelete(doc.id)}
                    disabled={pendingDeleteId === doc.id}
                  >
                    {pendingDeleteId === doc.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DocumentTable = memo(DocumentTableComponent);
