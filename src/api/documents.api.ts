import axios from "axios";
import { apiClient } from "./axios";

export type DocumentItem = {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

export type DocumentsResponse = {
  page: number;
  total: number;
  totalPages: number;
  documents: DocumentItem[];
};

type UploadUrlPayload = {
  file_name: string;
  mime_type: string;
  file_size: number;
};

type ConfirmUploadPayload = {
  storageKey: string;
  file_name: string;
  mime_type: string;
  file_size: number;
};

export const documentsApi = {
  list: async (page: number, limit: number) => {
    const { data } = await apiClient.get<DocumentsResponse>("/documents", {
      params: { page, limit }
    });
    return data;
  },
  generateUploadUrl: async (payload: UploadUrlPayload) => {
    const { data } = await apiClient.post<{ uploadUrl: string; storageKey: string }>(
      "/documents/upload-url",
      payload
    );
    return data;
  },
  uploadToSignedUrl: async (
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    });
  },
  confirmUpload: async (payload: ConfirmUploadPayload) => {
    const { data } = await apiClient.post<DocumentItem>("/documents/confirm", payload);
    return data;
  },
  getDownloadUrl: async (id: string) => {
    const { data } = await apiClient.get<{ downloadUrl: string }>(
      `/documents/${id}/download`
    );
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/documents/${id}`);
    return data;
  }
};
