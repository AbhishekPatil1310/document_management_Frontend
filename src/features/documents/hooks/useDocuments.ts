import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi, type DocumentsResponse } from "../../../api/documents.api";

const PAGE_LIMIT = 10;

export const useDocuments = (page: number) =>
  useQuery({
    queryKey: ["documents", page],
    queryFn: () => documentsApi.list(page, PAGE_LIMIT),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });

type UploadInput = {
  file: File;
  onProgress?: (progress: number) => void;
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, onProgress }: UploadInput) => {
      const signed = await documentsApi.generateUploadUrl({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      });
      await documentsApi.uploadToSignedUrl(signed.uploadUrl, file, onProgress);
      return documentsApi.confirmUpload({
        storageKey: signed.storageKey,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      const previous = queryClient.getQueriesData<DocumentsResponse>({
        queryKey: ["documents"]
      });

      previous.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<DocumentsResponse>(key, {
          ...value,
          documents: value.documents.filter((doc) => doc.id !== id),
          total: Math.max(0, value.total - 1)
        });
      });

      return { previous };
    },
    onError: (_error, _id, context) => {
      context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    }
  });
};

export const useDownloadDocument = () =>
  useMutation({
    mutationFn: (id: string) => documentsApi.getDownloadUrl(id),
    onSuccess: (data) => {
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    }
  });
