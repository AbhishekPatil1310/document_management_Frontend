import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../../api/auth.api";
import { useAppDispatch } from "../../../app/hooks";
import {
  clearAuthenticated,
  setAuthenticated,
  setBootstrapped
} from "../../../app/authSlice";

export const useAuthBootstrap = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false
  });

  useEffect(() => {
    if (query.isSuccess) {
      dispatch(setAuthenticated({ userId: query.data.userId }));
    }
    if (query.isError) {
      dispatch(clearAuthenticated());
    }
  }, [dispatch, query.data, query.isError, query.isSuccess]);

  useEffect(() => {
    if (query.isFetched) {
      dispatch(setBootstrapped());
    }
  }, [dispatch, query.isFetched]);

  return query;
};
